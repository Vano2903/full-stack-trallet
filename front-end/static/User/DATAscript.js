var user;

document.readyState = function () {
    var check = localStorage.getItem("rememberMe");
    if (check) {
        var localsUser = localStorage.getItem("user")
        if (localsUser !== null) {
            user = JSON.parse(localsUser)
            checkLogin("def")
        }
    }
};

/*######## LOGIN #########*/
function login() {
    let ok = 1;

    let password = document.querySelector("#floatingPassword");
    let email = document.querySelector("#floatingEmail");

    ok = loginCheck(email, password);

    if (ok) {
        checkLogin();
        console.log("Richiesta inviata al server");

        document.querySelector("#login > form > button").disabled = true;
    }
}

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
            localStorage.setItem("user", user)
            localStorage.setItem("rememberMe", true)
        } else {
            localStorage.setItem("rememberMe", false)
        }
        acceptlogin();
    } else {
        rejectlogin()
    }
}
