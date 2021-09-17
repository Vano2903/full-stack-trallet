package main

import (
	"context"
	"errors"
	"fmt"
	"reflect"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	clientUser     *mongo.Client
	ctxUser        context.Context
	collectionUser *mongo.Collection
)

type User struct {
	ID             primitive.ObjectID `bson:"_id, omitempty" json:"-"`
	Name           string             `bson:"name, omitempty" json:"name, omitempty"`
	LastName       string             `bson:"lastName, omitempty" json:"lastName, omitempty"`
	Email          string             `bson:"email, omitempty" json:"email, omitempty"`
	Password       string             `bson:"password, omitempty" json:"password, omitempty"`
	ProfilePicture string             `bson:"profilePicture, omitempty" json:"profilePicture, omitempty"`
	IsVaccinated   bool               `bson:"isVaccinated, omitempty" json:"isVaccinated, omitempty"`
	BornDate       primitive.DateTime `bson:"bornDate, omitempty" json:"bornDate, omitempty"`
	Documents      []Document         `bson:"documents, omitempty" json:"documents, omitempty"`
	// Travels        []Travel           `bson:"travels, omitempty" json:"travels, omitempty"`
}

//check if all the structure is empty
func (x User) IsStructureEmpty() bool {
	return reflect.DeepEqual(x, User{})
}

type Document struct {
	Title        string             `bson:"title, omitempty" json:"title, omitempty"`
	Type         string             `bson:"type, omitempty" json:"type, omitempty"`
	IsExpired    bool               `bson:"isExpired, omitempty" json:"isExpired, omitempty"`
	CreationDate primitive.DateTime `bson:"creationDate, omitempty" json:"creationDate, omitempty"`
	ExpiringDate primitive.DateTime `bson:"expiringDate, omitempty" json:"expiringDate, omitempty"`
}

// type Travel struct {
// 	Date primitive.DateTime `bson:"date, omitempty" json:"date, omitempty"`
// 	From string             `bson:"from, omitempty" json:"from, omitempty"`
// 	To   string             `bson:"to, omitempty" json:"to, omitempty"`
// }

//will connect to database on user's collectionn
func ConnectToDatabaseUsers() error {
	ctxUser, _ := context.WithTimeout(context.TODO(), 10*time.Second)

	//try to connect
	clientOptions := options.Client().ApplyURI(conf.Uri)
	clientUser, err := mongo.Connect(ctxUser, clientOptions)
	if err != nil {
		return err
	}

	//check if connection is established
	err = clientUser.Ping(context.TODO(), nil)
	if err != nil {
		return err
	}

	//assign to the global variable "collection" the users' collection
	collectionUser = clientUser.Database("Full-Stack").Collection("users")
	return nil
}

//check if user exist in database and will return empty struct if not found, on the other hand will return the User informations
func GetUser(email, password string) (User, error) {
	//search in database
	cur, err := collectionUser.Find(ctxUser, bson.M{"email": email, "password": password})
	if err != nil {
		return User{}, err
	}
	defer cur.Close(ctxUser)
	var userFound []User

	//convert cur in []User
	if err = cur.All(context.TODO(), &userFound); err != nil {
		return User{}, err
	}

	//check if user exist
	if len(userFound) != 0 {
		if userFound[0].Email == email && userFound[0].Password == password {
			return userFound[0], nil
		}
		return User{}, errors.New("incorrect credentials")
	} else {
		return User{}, errors.New("no user found")
	}
}

//will add the user to database, return the id if succeded adding the user
func AddUser(name, lastName, email, password, pfp string, bornDate primitive.DateTime) (string, error) {
	//check if strings are empty and authlvl between 0 and 2
	if name == "" && lastName == "" && email == "" && password == "" {
		return "", errors.New("uncorrect/uncomplete credentials to create the user")
	}
	//check if not already registered
	found, err := GetUser(email, password)

	if !found.IsStructureEmpty() {
		return "", errors.New("user already exist")
	}
	pfpUrl := "https://avatars.dicebear.com/api/identicon/" + name + lastName + ".svg"
	//adding user to database
	// toInsert := User{user, pass, authlvl}

	type User struct {
		ID             primitive.ObjectID `bson:"_id, omitempty" json:"-"`
		Name           string             `bson:"name, omitempty" json:"name, omitempty"`
		LastName       string             `bson:"lastName, omitempty" json:"lastName, omitempty"`
		Email          string             `bson:"email, omitempty" json:"email, omitempty"`
		Password       string             `bson:"password, omitempty" json:"password, omitempty"`
		ProfilePicture string             `bson:"profilePicture, omitempty" json:"profilePicture, omitempty"`
		IsVaccinated   bool               `bson:"isVaccinated, omitempty" json:"isVaccinated, omitempty"`
		BornDate       primitive.DateTime `bson:"bornDate, omitempty" json:"bornDate, omitempty"`
		Documents      []Document         `bson:"documents, omitempty" json:"documents, omitempty"`
		// Travels        []Travel           `bson:"travels, omitempty" json:"travels, omitempty"`
	}

	toInsert := struct {
		Name           string             `bson:"name, omitempty" json:"name, omitempty"`
		LastName       string             `bson:"lastName, omitempty" json:"lastName, omitempty"`
		Email          string             `bson:"email, omitempty" json:"email, omitempty"`
		Password       string             `bson:"password, omitempty" json:"password, omitempty"`
		ProfilePicture string             `bson:"profilePicture, omitempty" json:"profilePicture, omitempty"`
		IsVaccinated   bool               `bson:"isVaccinated, omitempty" json:"isVaccinated, omitempty"`
		BornDate       primitive.DateTime `bson:"bornDate, omitempty" json:"bornDate, omitempty"`
	}{
		name,
		lastName,
		email,
		password,
		pfpUrl,
		false,
		bornDate,
	}

	result, err := collectionUser.InsertOne(ctxUser, toInsert)
	if err != nil {
		return "", err
	}
	InsertedID := CleanMongoId(fmt.Sprintf("%v", result.InsertedID))
	return InsertedID, nil
}

//update an existing user given an update of tipe bson.M
func UpdateUser(email, pass string, update bson.M) error {
	_, err := GetUser(email, pass)
	if err != nil {
		return err
	}
	_, err = collectionUser.UpdateOne(
		ctxUser,
		bson.M{"email": email, "password": pass},
		bson.D{
			{"$set", update},
		},
	)
	if err != nil {
		return err
	}
	return nil
}

//delete a user from the database
func DeleteUser(email, pass string) error {
	_, err := collectionUser.DeleteOne(ctxUser, bson.M{"email": email, "password": pass})
	if err != nil {
		return err
	}
	return nil
}
