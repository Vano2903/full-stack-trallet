/*######## LOGIN #########*/
function login() {
    let ok=1;

    let password=document.querySelector("#floatingPassword");
    let email=document.querySelector("#floatingEmail");

    ok=loginCheck(email,password);

    if(ok){
        serverLogin(email,password);
        console.log("Richiesta inviata al server");
        
        document.querySelector("#login > form > button").disabled=true;
    }
}
function serverLogin(email,password){
    
}

var user;
document.readyState=function () {
        var localsUser = localStorage.getItem("user")
        if (localsUser !== null) {
            user = JSON.parse(localsUser)
            checkLogin("def")
        }
    };

acceptlogin();
/**
 * display the loading animation and send the user datas to the login api and check if the response is correct
 * @param {string} code if "def" is set as code the function wont get the data from the textboxes to check the login, 
 * if undefined will get the dats from the textboxes, otherwise will split the code as user informations
 */
async function checkLogin(code) {
    user = getLoginData()
    const res = await fetch('/users/login', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });
    const contentType = res.headers.get("Content-Type");
    const resp = await res.text();
    document.getElementById("loader-wrapper").style.display = "none";
    checkResponse(contentType, resp);
}
/**
 * this function will check the response of the login api
 * @param {string} cont content of the fetch (if is a "text/html" the login is succesful and will store the user in localstorage)
 * @param {string} resp response of the api
 */
function checkResponse(cont, resp) {
    if (!cont.includes("text/html")) {
        //errore
        const respJson = JSON.parse(resp);
        console.error(respJson.message);

        rejectlogin();
    } else {
        //ok
        console.log(resp);
        localStorage.setItem("user", JSON.stringify(user));

        acceptlogin();
    }
}