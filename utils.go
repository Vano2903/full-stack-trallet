package main

import (
	"fmt"
	"strings"
)

//given a mongodb id as string will return just the id
func CleanMongoId(mongoId string) string {
	id := fmt.Sprintf("%v", mongoId)
	id = strings.Replace(id, "ObjectID(\"", "", -1)
	id = strings.Replace(id, "\")", "", -1)
	return id
}
