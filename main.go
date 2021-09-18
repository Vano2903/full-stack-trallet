package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"

	"github.com/go-yaml/yaml"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson"
)

type config struct {
	Uri string `yaml:"mongo_uri"` //atlas mongodb uri
}

var conf config

//init all the connection to the database and get the api key and db uri
func init() {
	uri := os.Getenv("mongo_uri")
	if uri == "" {
		dat, _ := ioutil.ReadFile("config.yaml")
		err := yaml.Unmarshal([]byte(dat), &conf)
		if err != nil {
			log.Fatalf("error: %v", err)
		}
	} else {
		conf.Uri = uri
	}
	if err := ConnectToDatabaseUsers(); err != nil {
		log.Fatal(err)
	}
}

type Post struct {
	Email    string `json:"email, omitempty"`    //email of the user
	Password string `json:"password, omitempty"` //password of the user
}

func LoginPageHandler(w http.ResponseWriter, r *http.Request) {
	home, err := os.ReadFile("front-end/User/login.html")
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
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte(`{"code": 401, "msg": "User Unauthorized"}`))
		return
	}

	w.WriteHeader(http.StatusAccepted)
	page, err := os.ReadFile("pages/User/mainPage.html")
	if err != nil {
		UnavailablePage(w)
		return
	}
	w.Write(page)
	log.Println(user.Email, " just logged in")
}

func AddUserHandler(w http.ResponseWriter, r *http.Request) {
	var post User

	//read post body
	_ = json.NewDecoder(r.Body).Decode(&post)

	code, err := AddUser(post.Name, post.LastName, post.Email, post.Password, "", post.BornDate)

	if err != nil {
		PrintErr(w, err.Error())
		return
	}

	w.WriteHeader(http.StatusCreated)
	w.Write([]byte(`{"status": 201, "msg": "user successfully created"}`))
	log.Println(fmt.Sprintf("new user logged in %s", code))
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

	//user login area
	r.HandleFunc(usersLogin.String(), LoginPageHandler).Methods("GET", "OPTIONS")
	r.HandleFunc(usersLogin.String(), LoginHandler).Methods("POST", "OPTIONS")

	//user customization area
	// r.HandleFunc(userCustomization.String(), UserCustomizationHandler).Methods("POST", "OPTIONS")

	headersOk := handlers.AllowedHeaders([]string{"X-Requested-With"})
	originsOk := handlers.AllowedOrigins([]string{"*"})
	methodsOk := handlers.AllowedMethods([]string{"GET", "POST"})
	log.Println("starting on", ":"+port)
	log.Fatal(http.ListenAndServe(":"+port, handlers.CORS(originsOk, headersOk, methodsOk)(r)))
}
