/*######## BASE #########*/
var gateinfo=[];
var gate=0;
function displaytoggle(){
    document.querySelector("#display").classList.toggle("show");
}

function selectGate(gatein){
    gate=gatein;
    updatedisplay();
    displaytoggle();
}

function updatedisplay(){
    displays.forEach(element => {
        if(element.gate==gate)
            gateinfo=element;
    });
    if(gate!=0){
        document.querySelector("#doccontainer").innerHTML="";
        let container = document.querySelector("#doccontainer");

        if(gateinfo.id) {addrequirement('id',container);}
        if(gateinfo.pasp) {addrequirement('pasp',container);}
        if(gateinfo.ticket) {addrequirement('ticket',container);}
        if(gateinfo.visa) {addrequirement('visa',container);}
        if(gateinfo.green) {addrequirement('green',container);}
        if(gateinfo.swab) {addrequirement('swab',container);}
    }
}
//type can be: id, pasp, ticket, visa, green, swab
function addrequirement(type, container){
    let requirement = document.createElement("div");
    switch (type) {
        case 'id':
            requirement.innerHTML="Carta d'identità";
            requirement.classList.add("id");
            document.querySelector("#doccontainer").className="id";
            break;
        case 'pasp':
            requirement.innerHTML="Passaporto";
            requirement.classList.add("pasp");
            document.querySelector("#doccontainer").className="pasp";
            break;
        case 'ticket':
            requirement.innerHTML="Biglietto d'imbarco";
            requirement.classList.add("ticket");
            document.querySelector("#doccontainer").className="ticket";
            break;
        case 'visa':
            requirement.innerHTML="Visto d'ingresso";
            requirement.classList.add("visa");
            document.querySelector("#doccontainer").className="visa";
            break;
        case 'green':
            requirement.innerHTML="Green Pass";
            requirement.classList.add("green");
            document.querySelector("#doccontainer").className="green";
            break;
        case 'swab':
            requirement.innerHTML="Certificato di negatività al tampone";
            requirement.classList.add("swab");
            document.querySelector("#doccontainer").className="swab";
            break;
    }
    container.appendChild(requirement);
}