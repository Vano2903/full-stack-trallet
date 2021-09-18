/*######## BASE #########*/
function transition(from,to){
    document.querySelector("#"+from).style.opacity=0;
    setTimeout(() => {
        document.querySelector("#"+to).style.display="block";
        document.querySelector("#"+from).style.display="none";
        setTimeout(() => {document.querySelector("#"+to).style.opacity=1;}, 1);
    }, 800);
}
/*######## login #########*/
function loginCheck(email,password){
    if(email.value==""){
        email.classList.add("is-invalid");
        document.querySelector("#emailF").style.display="inherit";
        ok=0;
    }
    if(!email.value.includes("@")){
        email.classList.add("is-invalid");
        document.querySelector("#emailF").style.display="inherit";
        ok=0;
    } else {
        email.classList.remove("is-invalid");
        document.querySelector("#emailF").style.display="none";
        ok=1;
    }
    if(password.value==""){
        password.classList.add("is-invalid");
        document.querySelector("#passF").style.display="inherit";
        ok=0;
    } else {
        password.classList.remove("is-invalid");
        document.querySelector("#passF").style.display="none";
        ok=1;
    }
    return ok;
}
function acceptlogin(){
    transition("login","wallet");
}
function rejectlogin(){
    
}
/*######## login #########*/