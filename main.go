package main

import (
	"io/ioutil"
	"log"
	"os"
	"time"

	"github.com/go-yaml/yaml"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type config struct {
	Uri string `yaml:"mongo_uri"` //atlas mongodb uri
}

var conf config

//init all the connection to the database and get the api key and db uri
func init() {
	uri := os.Getenv("mongo_uri")
	if uri == "" {
		dat, err := ioutil.ReadFile("config.yaml")
		err = yaml.Unmarshal([]byte(dat), &conf)
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

func main() {
	// log.Fatal(http.ListenAndServe("8080", nil))
	bornDate, err := time.Parse(time.RFC3339, "2002-10-01T00:00:00Z")
	if err != nil {
		log.Fatal(err)
	}

	log.Println(AddUser("davide", "vanoncini", "davidevanoncini2003@gmail.com", "vanella", "", primitive.NewDateTimeFromTime(bornDate)))
}
