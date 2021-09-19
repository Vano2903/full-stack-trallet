package main

import (
	"fmt"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Document struct {
	Id    int    `bson:"id, omitempty" json:"id, omitempty"`
	Title string `bson:"title, omitempty" json:"title, omitempty"`
	Url   string `bson:"url, omitempty" json:"url, omitempty"`
	Type  string `bson:"type, omitempty" json:"type, omitempty"`
	// IsExpired    bool               `bson:"isExpired, omitempty" json:"isExpired, omitempty"`
	// CreationDate primitive.DateTime `bson:"creationDate, omitempty" json:"creationDate, omitempty"`
	ExpiringDate primitive.DateTime `bson:"expiringDate, omitempty" json:"expiringDate, omitempty"`
}

func GetDocument(email, password string, id int) (Document, error) {
	user, err := GetUser(email, password)
	if err != nil {
		return Document{}, err
	}

	for _, doc := range user.Documents {
		if doc.Id == id {
			return doc, nil
		}
	}
	return Document{}, fmt.Errorf("no document found with id: %d", id)
}

func AddDocument(email, password string) {

}

func UpdateDocument(email, password string) {

}

func DeletePassword(email, password string) {

}
