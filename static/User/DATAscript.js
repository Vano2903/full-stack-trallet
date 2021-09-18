var user;

/*######## LOGIN #########*/
function login() {
    let password = document.querySelector("#floatingPassword");
    let email = document.querySelector("#floatingEmail");

    if (loginCheck(email, password)) {
        checkLogin();
        console.log("Richiesta inviata al server");
    }
};

function getLoginData() {
    var email = document.getElementById("floatingEmail").value;
    var psw = document.getElementById("floatingPassword").value;
    return { email: email, password: psw }
}

async function checkLogin(code) {
    // document.getElementById("loader-wrapper").style.display = "block";
    if (code != "def") {
        if (code == undefined) {
            user = getLoginData()
        } else {
            var ele = code.split(";");
            user = { email: ele[0], password: ele[1] };
        }
    }
    const res = await fetch('/users/login', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });
    const resp = await res.json();
    // document.getElementById("loader-wrapper").style.display = "none";
    if (resp.accepted) {
        if (document.getElementById('rememberMe').checked) {
            localStorage.setItem("user", JSON.stringify(user))
            localStorage.setItem("rememberMe", true)
        } else {
            localStorage.setItem("rememberMe", false)
        }
        acceptlogin();
    } else {
        rejectlogin()
    }
}
/*######## LOGUP ########*/
function presignup(){
    var email=document.querySelector("#floatingEmail1");
    var pass=document.querySelector("#floatingPassword1");
    var pass1=document.querySelector("#floatingPassword2");
    
    if(checksignup1(email,pass,pass1,checkemail())){
        transition("signup1","signup2");
    }
}
function signup(){
    var name=document.querySelector("#floatingName").value;
    var surname=document.querySelector("#floatingLastname").value;
    var email=document.querySelector("#floatingEmail1").value;
    var password=document.querySelector("#floatingPassword1").value;
    var ismale=document.querySelector("#ismale").checked;
    var isvacc=document.querySelector("#isvacc").checked;
    var birthdate=document.querySelector("#floatingDate").value;
    
    if(checksignup2(birthdate)){
        sendsignup(name,surname,email,password,ismale,isvacc,birthdate);
        transition("signup","wallet");
    }
}

function checkemail(){
    //richiesta xml, vero se l'email è nuova, falso se l'email è già utilizzata
    return true;
}

function sendsignup(name,surname,email,password,ismale,isvaccinated,birthdate){
    //post xml dei dati signup
    console.log("inviato")
}