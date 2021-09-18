/*######## BASE #########*/
function transition(from, to) {
    document.querySelector("#" + from).style.opacity = 0;
    setTimeout(() => {
        document.querySelector("#" + to).style.display = "block";
        document.querySelector("#" + from).style.display = "none";
        setTimeout(() => { document.querySelector("#" + to).style.opacity = 1; }, 1);
    }, 800);
}
/*######## login #########*/
function loginCheck(email, password) {
    var emailok;var passok;

    if (email.value == "") {
        email.classList.add("is-invalid");
        document.querySelector("#emailF").style.display = "inherit";
        emailok = 0;
    }
    if (!email.value.includes("@")) {
        email.classList.add("is-invalid");
        document.querySelector("#emailF").style.display = "inherit";
        emailok = 0;
    } else {
        email.classList.remove("is-invalid");
        document.querySelector("#emailF").style.display = "none";
        emailok = 1;
    }
    if (password.value == "") {
        password.classList.add("is-invalid");
        document.querySelector("#passF").style.display = "inherit";
        passok = 0;
    } else {
        password.classList.remove("is-invalid");
        document.querySelector("#passF").style.display = "none";
        passok = 1;
    }
    if (emailok && passok) {
        document.querySelector("#login > form > button").disabled=true;
        return true;
    } else return false;

}
function acceptlogin() {
    transition("login", "wallet");
}
function rejectlogin() {
    console.log("rifiutato")
}
/*######## signup #########*/
function checksignup1(email,pass,pass1,newemail) {
    var emailok; var passok;

    if (email.value == "") {
        email.classList.add("is-invalid");
        document.querySelector("#emailF1").style.display = "inherit";
        emailok = 0;
    }
    if (!email.value.includes("@")) {
        email.classList.add("is-invalid");
        document.querySelector("#emailF1").style.display = "inherit";
        emailok = 0;
    } else if(!newemail){
        email.classList.add("is-invalid");
        document.querySelector("#emailF2").style.display = "inherit";
        emailok = 0;
    } else {
        email.classList.remove("is-invalid");
        document.querySelector("#emailF1").style.display = "none";
        emailok = 1;
    }
    if (pass.value != pass1.value) {
        pass.classList.add("is-invalid");
        pass1.classList.add("is-invalid");
        document.querySelector("#passF2").style.display = "inherit";
        passok = 0;
    } else {
        pass.classList.remove("is-invalid");
        pass1.classList.remove("is-invalid");
        document.querySelector("#passF2").style.display = "none";
        passok = 1;
    }
    if (pass.value == "") {
        pass.classList.add("is-invalid");
        document.querySelector("#passF1").style.display = "inherit";
        passok = 0;
    } else {
        pass.classList.remove("is-invalid");
        document.querySelector("#passF1").style.display = "none";
        if(passok) passok = 1; else passok=0;
    }
    if (emailok && passok && newemail) {
        document.querySelector("#signup1 > button").disabled=true;
        return true;
    } else return false;
}
function checksignup2(birthdate){
    //aggiungere il controllo data
    return true;
}