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
    var emailok=0;
    var passok=0;

    if(email.value==""){
        email.classList.add("is-invalid");
        document.querySelector("#emailF").style.display="inherit";
        emailok=0;
    }
    if(!email.value.includes("@")){
        email.classList.add("is-invalid");
        document.querySelector("#emailF").style.display="inherit";
        emailok=0;
    } else {
        email.classList.remove("is-invalid");
        document.querySelector("#emailF").style.display="none";
        emailok=1;
    }
    if(password.value==""){
        password.classList.add("is-invalid");
        document.querySelector("#passF").style.display="inherit";
        passok=0;
    } else {
        password.classList.remove("is-invalid");
        document.querySelector("#passF").style.display="none";
        passok=1;
    }
    if(emailok&&passok){
        return true;
    }else return false;
}
function acceptlogin(){
    transition("login","wallet");
}
function rejectlogin(){
    
}
/*######## login #########*/