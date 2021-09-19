package main

type endpoints string

const (
	root endpoints = "/"

	//*statics
	statics endpoints = "/static/" //endpoint for the statics document (js, css, html, images)

	//*users endpoint
	usersLogin        endpoints = "/users/login"          //endpoint to check the login informations
	checkEmail        endpoints = "/users/check"          //check if a email is already registered
	addUser           endpoints = "/users/singup"         //as get will return the signup page, as post will read the user's info and if valid add the user to the db
	userCustomization endpoints = "/users/customization/" //endpoint for letting the user customise his account

	//*upload endpoint
	fileupload endpoints = "/upload/file"
	infoUpload endpoints = "/upload/info/{kuid}"
)

//convert endpoint to string
func (e endpoints) String() string {
	return string(e)
}
