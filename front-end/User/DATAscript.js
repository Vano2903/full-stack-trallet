

function login() {
    let ok=1;

    let password=document.querySelector("#floatingPassword");
    let email=document.querySelector("#floatingEmail");

    if(document.querySelector("#floatingEmail").value==""){
        document.querySelector("#floatingEmail").value="";
        document.querySelector("#floatingEmail").classList.add("is-invalid");
        document.querySelector("#emailF").style.display="inherit";
        ok=0;
    }
    if(document.querySelector("#floatingEmail").value.includes){
        document.querySelector("#floatingEmail").value="";
        document.querySelector("#floatingEmail").classList.add("is-invalid");
        document.querySelector("#emailF").style.display="inherit";
        ok=0;
    }
    if(document.querySelector("#floatingPassword").value==""){
        document.querySelector("#floatingPassword").value="";
        document.querySelector("#floatingPassword").classList.add("is-invalid");
        document.querySelector("#passF").style.display="inherit";
        ok=0;
    }

    if(ok){
        console.log("Richiesta inviata al server");
        document.querySelector("#login > form > button").disabled=true;
    }
}