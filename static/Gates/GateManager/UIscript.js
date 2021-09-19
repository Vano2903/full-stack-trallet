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

function updateRequirements(div,type){
    let activating=0;
    div.classList.toggle("requested");

    if(div.classList.contains("requested")) activating=1;

    displays.forEach((element,i) => {
        if(element.gate==div.id){
            console.log("A");
            switch (type) {
                case 'id': displays[i].id=activating; break;
                case 'pasp': displays[i].pasp=activating; break;
                case 'ticket': displays[i].ticket=activating; break;
                case 'visa': displays[i].visa=activating; break;
                case 'green': displays[i].green=activating; break;
                case 'swab': displays[i].swab=activating; break;
            }
        }
    });
    //update
    console.log(displays);
    localStorage.setItem("displays", JSON.stringify(displays));
}