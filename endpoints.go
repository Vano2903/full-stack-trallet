package main

type endpoints string

const (
	root endpoints = "/"

	//*statics
	statics endpoints = "/static/" //endpoint for the statics document (js, css, html, images)

	//*users endpoints
	usersLogin        endpoints = "/users/login"          //endpoint to check the login informations
	checkEmail        endpoints = "/users/check"          //check if a email is already registered
	addUser           endpoints = "/users/singup"         //as get will return the signup page, as post will read the user's info and if valid add the user to the db
	userCustomization endpoints = "/users/customization/" //endpoint for letting the user customise his account

	//*document and upload endpoints
	fileupload  endpoints = "/upload/file"
	infoUpload  endpoints = "/upload/info/{kuid}"
	getDocument endpoints = "/document/get/{id}"

	//*travel endpoints
	updateTravel endpoints = "/travel/update"
	getTravel    endpoints = "/travel/get"
)

//convert endpoint to string
func (e endpoints) String() string {
	return string(e)
}
