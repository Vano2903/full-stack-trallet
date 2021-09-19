/*######## BASE #########*/

/*######## add document #########*/
function docrefresh(){
    //a
}

function adddoctoggle(){
    document.querySelector("#adddoc").classList.toggle("open");
    if(document.querySelector("#adddoc").classList.contains("open"))
        document.querySelector("#adddoc>h1").innerHTML="-";
    else
        document.querySelector("#adddoc>h1").innerHTML="+";
}
function adddoc(type){
    //type can be: id, pasp, ticket, visa, green, swab
    console.log("aggiungi "+type);
}

function selectGate(gate){
    div.classList.toggle("requested");
}
