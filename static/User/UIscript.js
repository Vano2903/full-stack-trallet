/*######## BASE #########*/
screen.orientation.lock('portrait');
//not to mess up while scanning a code

//demo start page
// transition("signup", "documents");

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
    $("#signup").css('display', 'none');
    $("#login").css('display', 'none');
    $("#profile > p").text(user.name)
    $("#profile > img").attr("src", user.profilePicture)
    $("#profile2 > p").text(user.name)
    $("#profile2 > img").attr("src", user.profilePicture)

    genDocuments(user.documents)
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
    localStorage.removeItem("rememberMe");
    localStorage.removeItem("user")
    location.reload();
};

/*######## add document #########*/
let lastPressed;

$("#inputFile").css('display', 'none');

function genDocuments(array) {
    let high = document.querySelector("#documents > #high")
    high.innerHTML = ""
    array.forEach(doc => {
        let div = document.createElement("div")
        div.setAttribute("id", doc.id)
        div.setAttribute("class", "doc")
        let p = document.createElement("p")
        p.innerHTML = doc.type
        let img = document.createElement("img")
        img.setAttribute("src", doc.url)
        div.appendChild(p)
        div.appendChild(img)
        high.appendChild(div)
    });
}

async function docrefresh() {
    const res = await fetch('/document/get/all', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });

    const documents = await res.json();
    genDocuments(documents)
}

function adddoctoggle() {
    document.querySelector("#adddoc").classList.toggle("open");
    if (document.querySelector("#adddoc").classList.contains("open"))
        document.querySelector("#adddoc>h1").innerHTML = "-";
    else
        document.querySelector("#adddoc>h1").innerHTML = "+";
}

function adddoc(type) {
    lastPressed = type;
    $("#inputFile").trigger('click');
}

$("#inputFile").on('change', async function () {
    await uploadInfo(lastPressed)
    docrefresh()
});