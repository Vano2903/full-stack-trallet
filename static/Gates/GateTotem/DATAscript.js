var displays=[];
//type can be: id, pasp, ticket, visa, green, swab

if (localStorage.getItem("displays") === null) {
    //codice mancante in demo
} else {
    setInterval(() => {
        displays=JSON.parse(localStorage.getItem("displays"));
        setuphomepage();
        updatedisplay();
    }, 1000);
}
/*######## SETUP HOMEPAGE #########*/
setuphomepage();

function setuphomepage(){
    //se ho viaggi in programma
    document.querySelector("#high").innerHTML="";
    displays.forEach(element => {
        let card = document.createElement("div");

        card.innerHTML=element.gate+": "+element.name;
        card.id="g_"+element.gate;
        card.className="card gate";
        card.setAttribute("onclick","selectGate('"+element.gate+"')");
        document.querySelector("#high").appendChild(card);
    });
}