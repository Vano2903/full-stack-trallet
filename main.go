package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"

	"github.com/go-yaml/yaml"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/segmentio/ksuid"
	"go.mongodb.org/mongo-driver/bson"
)

var conf config

type config struct {
	Uri  string `yaml:"mongo_uri"` //atlas mongodb uri
	Hash string `yaml:"hash"`      //catbox user hash
}

//init all the connection to the database and get the api key and db uri
func init() {
	uri := os.Getenv("mongo_uri")
	hash := os.Getenv("hash")
	if uri == "" || hash == "" {
		dat, _ := ioutil.ReadFile("config.yaml")
		err := yaml.Unmarshal([]byte(dat), &conf)
		if err != nil {
			log.Fatalf("error: %v", err)
		}
	} else {
		conf.Uri = uri
		conf.Hash = hash
	}

	if err := ConnectToDatabaseUsers(); err != nil {
		log.Fatal(err)
	}
}

type PostInfo struct {
	User     User     `json:"user, omitempty"`
	Document Document `json:"documentInfo, omitempty"`
}

type File struct {
	Url string `json:"url, omitempty"`
	ID  string `json:"id, omitempty"`
}

var files []File

func LoginPageHandler(w http.ResponseWriter, r *http.Request) {
	home, err := os.ReadFile("pages/User/User.html")
	if err != nil {
		UnavailablePage(w)
		return
	}
	w.Write(home)
}

//handler of the login (post), check if the user sent is a valid user and if it is will return the correct user page
func LoginHandler(w http.ResponseWriter, r *http.Request) {
	var post User

	//read post body
	_ = json.NewDecoder(r.Body).Decode(&post)

	//check if user is correct
	user, err := GetUser(post.Email, post.Password)

	//return response
	w.Header().Set("Content-Type", "application/json")
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(fmt.Sprintf(`{"accepted":false, "code": 401, "msg": %q}`, err.Error())))
		return
	}

	w.WriteHeader(http.StatusAccepted)
	userJson, _ := json.Marshal(user)
	w.Write([]byte(fmt.Sprintf(`{"accepted":true, "code": 202, "user": %s}`, userJson)))
	log.Println(user.Email, "just logged in")
}

func CheckMailHandler(w http.ResponseWriter, r *http.Request) {
	r.ParseForm()
	for k, v := range r.Form {
		switch k {
		case "email":
			if len(v) != 0 {
				PrintErr(w, "must query only one email at the time")
			}
			found, err := ExistUser(v[0])
			if err != nil {
				PrintInternalErr(w, err.Error())
			}
			w.Header().Set("Content-Type", "application/json")
			w.Write([]byte(fmt.Sprintf(`{"found": %t}`, found)))
		}
	}
}

func GetDocumentHandler(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	var userPost User
	_ = json.NewDecoder(r.Body).Decode(&userPost)

	user, err := GetUser(userPost.Email, userPost.Password)
	if err != nil {
		PrintErr(w, err.Error())
		return
	}
	if id == "all" {
		documentsJson, _ := json.Marshal(user.Documents)
		w.Write(documentsJson)
		return
	}
	for _, doc := range user.Documents {
		if doc.Id == id {
			documentsJson, _ := json.Marshal(user.Documents)
			w.Write(documentsJson)
			return
		}
	}
	PrintErr(w, fmt.Sprintf(`{"error": "no document was found with id: %s"}`, id))
}

//handler that let user register to the database
func AddUserHandler(w http.ResponseWriter, r *http.Request) {
	var post User

	_ = json.NewDecoder(r.Body).Decode(&post)

	code, err := AddUser(post.Name, post.LastName, post.Email, post.Password, "", post.BornDate)

	if err != nil {
		PrintErr(w, err.Error())
		return
	}

	w.WriteHeader(http.StatusCreated)
	w.Write([]byte(`{"status": 201, "msg": "user successfully created"}`))
	log.Println(fmt.Sprintf("new user created: %s", code))
}

func UploadFileHandler(w http.ResponseWriter, r *http.Request) {
	r.ParseMultipartForm(10 << 20)
	file, handler, err := r.FormFile("document")

	if err != nil {
		fmt.Println("Error Retrieving the File")
		fmt.Println(err)
		return
	}

	defer file.Close()
	fmt.Printf("Uploading File: %+v\n", handler.Filename)
	// fmt.Printf("File Size: %+v\n", handler.Size)
	// fmt.Printf("MIME Header: %+v\n", handler.Header)
	buf := bytes.NewBuffer(nil)
	if _, err := io.Copy(buf, file); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	if _, err := io.Copy(buf, file); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	url, err := UploadFile(buf.Bytes(), handler.Filename)
	if err != nil {
		PrintInternalErr(w, err.Error())
		return
	}
	id := ksuid.New()
	w.WriteHeader(http.StatusAccepted)
	w.Write([]byte(fmt.Sprintf(`{"code": 202, "fileID": "%s"}`, id.String())))

	files = append(files, File{url, id.String()})
}

func UploadInformationsHandler(w http.ResponseWriter, r *http.Request) {
	kuid := mux.Vars(r)["kuid"]
	for i, file := range files {
		if file.ID == kuid {
			var postData PostInfo
			_ = json.NewDecoder(r.Body).Decode(&postData)

			user, err := GetUser(postData.User.Email, postData.User.Password)
			if err != nil {
				PrintErr(w, err.Error())
				return
			}

			fmt.Println(file)
			postData.Document.Url = file.Url
			postData.Document.Id = file.ID
			user.Documents = append(user.Documents, postData.Document)

			update := bson.M{"documents": user.Documents}
			err = UpdateUser(postData.User.Email, postData.User.Password, update)
			if err != nil {
				PrintInternalErr(w, err.Error())
				return
			}
			files = append(files[:i], files[i+1:]...)
			w.WriteHeader(http.StatusAccepted)
			w.Write([]byte(`{"status": 202, "msg": "document added successfully"}`))
			log.Println("file uploaded successfully")
			return
		}
	}
	PrintErr(w, `{"error":"invalid KUID"}`)
}

//will check if the url has "password" or "pfp" in it and will use a post to check the user
//if password, the user will be updated with a new password, if it's pfp it will be a new pfp url
func UserCustomizationHandler(w http.ResponseWriter, r *http.Request) {
	var post User
	_ = json.NewDecoder(r.Body).Decode(&post)

	r.ParseForm()
	for k, v := range r.Form {
		switch k {
		case "password":
			if len(v) != 1 {
				PrintErr(w, "can not pass more than 1 password or none, nothing has been changed")
				return
			}
			update := bson.M{"password": v[0]}
			err := UpdateUser(post.Email, post.Password, update)
			if err != nil {
				PrintErr(w, err.Error())
				return
			}
			w.WriteHeader(http.StatusOK)
			w.Header().Set("Content-Type", "application/json")
			w.Write([]byte(`{"msg": "the password has been updated"}`))
		case "pfp":
			if len(v) != 1 {
				PrintErr(w, "can not pass more than 1 profile picture's url or none, nothing has been changed")
				return
			}
			update := bson.M{"pfp_url": v[0]}
			err := UpdateUser(post.Email, post.Password, update)
			if err != nil {
				PrintErr(w, err.Error())
				return
			}
			w.WriteHeader(http.StatusOK)
			w.Header().Set("Content-Type", "application/json")
			w.Write([]byte(`{"msg": "the profile picture has been updated"}`))
		}
	}
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	//router
	r := mux.NewRouter()
	//statics
	r.PathPrefix(statics.String()).Handler(http.StripPrefix(statics.String(), http.FileServer(http.Dir("static/"))))

	//root
	r.HandleFunc(root.String(), LoginPageHandler).Methods("GET", "OPTIONS")

	//user area
	r.HandleFunc(usersLogin.String(), LoginHandler).Methods("POST", "OPTIONS")
	r.HandleFunc(addUser.String(), AddUserHandler).Methods("POST", "OPTIONS")
	r.HandleFunc(checkEmail.String(), CheckMailHandler).Methods("GET", "OPTIONS")

	//socument section
	r.HandleFunc(fileupload.String(), UploadFileHandler).Methods("POST", "OPTIONS")
	r.HandleFunc(infoUpload.String(), UploadInformationsHandler).Methods("POST", "OPTIONS")
	r.HandleFunc(getDocument.String(), GetDocumentHandler).Methods("GET", "OPTIONS")

	//user customization area
	// r.HandleFunc(userCustomization.String(), UserCustomizationHandler).Methods("POST", "OPTIONS")

	headersOk := handlers.AllowedHeaders([]string{"X-Requested-With"})
	originsOk := handlers.AllowedOrigins([]string{"*"})
	methodsOk := handlers.AllowedMethods([]string{"GET", "POST"})

	log.Println("starting on", ":"+port)
	log.Fatal(http.ListenAndServe(":"+port, handlers.CORS(originsOk, headersOk, methodsOk)(r)))
}
