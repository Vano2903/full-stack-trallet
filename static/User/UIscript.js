/*######## BASE #########*/
screen.orientation.lock('portrait');
//not to mess up while scanning a code

//demo start page
transition("signup", "documents");

function transition(from, to) {
    document.querySelector("#" + from).style.opacity = 0;
    setTimeout(() => {
        document.querySelector("#" + from).style.display = "none";
        document.querySelector("#" + to).style.opacity = 0;
        document.querySelector("#" + to).style.display = "block";
    }, 600);
    setTimeout(() => {
        document.querySelector("#" + to).style.opacity = 1;
    }, 700);
}
/*######## login #########*/
function loginCheck(email, password) {
    var emailok; var passok;

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
        document.querySelector("#login > form > button").disabled = true;
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
function checksignup1(email, pass, pass1, newemail) {
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
    } else if (!newemail) {
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
        if (passok) passok = 1; else passok = 0;
    }
    if (emailok && passok && newemail) {
        document.querySelector("#signup1 > button").disabled = true;
        return true;
    } else return false;
}
function checksignup2(birthdate) {
    //aggiungere il controllo data
    return true;
}
/*######## logout #########*/
function logoutconfirm(x) {
    if (x) {
        document.querySelector("#logoutconfirm").style.display = "flex";
        console.log("vedi");
    } else {
        document.querySelector("#logoutconfirm").style.display = "none";
        console.log("nasc");
    }
};
function logout() {
    //logout
    //cancello i dati
    location.reload();
};

/*######## add document #########*/
let lastPressed;

$("#inputFile").css('display', 'none');

function docrefresh() {
    //a
}

function adddoctoggle() {
    document.querySelector("#adddoc").classList.toggle("open");
    if (document.querySelector("#adddoc").classList.contains("open"))
        document.querySelector("#adddoc>h1").innerHTML = "-";
    else
        document.querySelector("#adddoc>h1").innerHTML = "+";
}
function adddoc(type) {
    //type can be: id, pasp, ticket, visa, green, swab
    // console.log("aggiungi " + type);
    lastPressed = type;
    $("#inputFile").trigger('click');

}

$("#inputFile").on('change', function () {
    uploadInfo(lastPressed)
});