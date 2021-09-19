var user;
//micro database a fini di DEMO
var displays = [{ 'gate': 'A1', 'name': 'Roma Fiumicino', 'id': 1, 'pasp': 0, 'tiket': 1, 'visa': 0, 'green': 1, 'swab': 1 },
{ 'gate': 'A5', 'name': 'Catania', 'id': 1, 'pasp': 0, 'tiket': 1, 'visa': 0, 'green': 1, 'swab': 0 },
{ 'gate': 'A2', 'name': 'London City', 'id': 1, 'pasp': 1, 'tiket': 1, 'visa': 0, 'green': 1, 'swab': 1 },
{ 'gate': 'A10', 'name': 'San Francisco', 'id': 1, 'pasp': 1, 'tiket': 1, 'visa': 1, 'green': 0, 'swab': 0 },
{ 'gate': 'A15', 'name': 'Berlino', 'id': 1, 'pasp': 0, 'tiket': 1, 'visa': 0, 'green': 1, 'swab': 0 },
{ 'gate': 'A22', 'name': 'Camberra', 'id': 0, 'pasp': 1, 'tiket': 1, 'visa': 1, 'green': 0, 'swab': 1 },
{ 'gate': 'B1', 'name': 'Tokyo', 'id': 1, 'pasp': 1, 'tiket': 1, 'visa': 0, 'green': 1, 'swab': 1 },
{ 'gate': 'A8', 'name': 'Parigi Bouvais', 'id': 1, 'pasp': 0, 'tiket': 1, 'visa': 0, 'green': 1, 'swab': 0 }];

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
    console.log(resp)
    // document.getElementById("loader-wrapper").style.display = "none";
    if (resp.accepted) {
        if (document.getElementById('rememberMe').checked) {
            localStorage.setItem("user", JSON.stringify(user))
            localStorage.setItem("rememberMe", true)
        } else {
            localStorage.setItem("rememberMe", false)
        }
        user = resp.user;
        acceptlogin();
        console.log("accepted")
    } else {
        rejectlogin()
        console.log("rejected")
    }
}
/*######## SIGNUP ########*/
function presignup() {
    var email = document.querySelector("#floatingEmail1");
    var pass = document.querySelector("#floatingPassword1");
    var pass1 = document.querySelector("#floatingPassword2");

    if (checksignup1(email, pass, pass1, checkemail())) {
        transition("signup1", "signup2");
    }
}

function calculateAge(birthday) { // birthday is a date
    var ageDifMs = Date.now() - birthday;
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    var age = Math.abs(ageDate.getUTCFullYear() - 1970);
    return age >= 18
}

async function signup() {
    var name = document.querySelector("#floatingName").value;
    var surname = document.querySelector("#floatingLastname").value;
    var email = document.querySelector("#floatingEmail1").value;
    var password = document.querySelector("#floatingPassword1").value;
    // var isMinor = document.querySelector("#isMinor").checked;
    var isvacc = document.querySelector("#isvacc").checked;
    var birthdate = document.querySelector("#floatingDate").value;

    let dates = birthdate.split("-")

    if (checksignup2(birthdate)) {
        await sendsignup(name, surname, email, password, calculateAge(new Date(dates[2], dates[1], dates[0])), isvacc, birthdate);
        transition("signup", "wallet");
    }
}

function checkemail() {
    //richiesta xml, vero se l'email è nuova, falso se l'email è già utilizzata
    return true;
}

async function sendsignup(name, surname, email, password, isMinor, isvaccinated, birthdate) {
    let body = { name: name, lastName: surname, email: email, password: password, isMinor: isMinor, isVaccinated: isvaccinated, bornDate: birthdate }
    const res = await fetch('/users/singup', {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    const resp = await res.json();
    console.log(resp)
}
/*######## SETUP HOMEPAGE #########*/
setuphomepage();

async function setuphomepage() {
    //se ho viaggi in programma
    let travel = await gettravel();
    if (travel != "") {
        //se mancano dei documenti
        if (docsmissing()) {
            document.querySelector("#c_check").style.display = "block";
        } else {
            document.querySelector("#c_travel").style.display = "block";
        }
    } else { //se non ho viaggi in programma
        document.querySelector("#c_newtravel").style.display = "block";
    }
}

/*######## UPLOAD DOCUMENTS #########*/

async function uploadFile() {
    const formData = new FormData();
    let file = document.getElementById("inputFile").files[0]
    formData.append("document", file);
    const response = await fetch("/upload/file", {
        method: 'POST',
        body: formData
    });
    let resp = await response.json();
    console.log(resp)
    return {
        id: resp.fileID, name: file.name
    }
}

async function uploadInfo(type) {
    let fileData = await uploadFile()
    console.log(fileData)
    let body = {
        user: user,
        documentInfo: {
            id: fileData.id,
            title: fileData.name,
            type: type
        }
    }
    console.log(body)

    const response = await fetch("/upload/info/" + fileData.id, {
        method: 'POST',
        body: JSON.stringify(body)
    });
    let resp = await response.json();
    console.log(resp)
}

/*######## TRAVEL #########*/

async function newtravel() {
    let travel = document.querySelector("#travelDestination").value; // 
    const response = await fetch("/travel/update", {
        method: 'POST',
        body: JSON.stringify(user)
    });
    const resp = await response.json();
    user.travelTo = travel;
    console.log(resp);
}

async function gettravel() {
    const response = await fetch("/travel/get", {
        method: 'POST',
        body: JSON.stringify(user)
    });
    const resp = await response.json();
    console.log(resp)
    return resp.travel
}

function docsmissing() {
    /*
    let req;
    displays.forEach(element => {
        let travel = await gettravel();
        if(element.name==travel){
            req=element;
        }
    });
    let missing=1;

    
    user.documents

    if(req.id )*/
    return true;
}