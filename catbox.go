package main

import (
	"bytes"
	"io"
	"mime/multipart"
	"net/http"
)

var CatBoxUri string = "https://catbox.moe/user/api.php"

func UploadFile(data []byte, nameFile string) (uri string, err error) {
	//Write multipart-data
	body := new(bytes.Buffer)
	writer := multipart.NewWriter(body)
	writer.WriteField("reqtype", "fileupload")
	// writer.WriteField("userhash", conf.Hash)

	part, err := writer.CreateFormFile("fileToUpload", nameFile)
	if err != nil {
		return "", err
	}
	part.Write(data)
	err = writer.Close()
	if err != nil {
		return "", err
	}

	//Make request
	req, err := http.NewRequest("POST", CatBoxUri, body)
	if err != nil {
		return "", err
	}
	//Set headers request
	req.Header.Set("Content-Type", writer.FormDataContentType())

	//Do request
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	//read response
	content, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	return string(content), nil
}
