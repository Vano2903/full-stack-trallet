/*######## BASE #########*/
var gateinfo=[0];

function displaytoggle(){
    document.querySelector("#display").classList.toggle("show");
}

function selectGate(gate){
    displays.forEach(element => {
        if(element.gate==gate)
            gateinfo=element;
    });
    console.log(gateinfo);
    updatedisplay();
    displaytoggle();
}
displaytoggle();

function updatedisplay(){
    if(gateinfo!=0){
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
            break;
        case 'pasp':
            requirement.innerHTML="Passaporto";
            break;
        case 'ticket':
            requirement.innerHTML="Biglietto d'imbarco";
            break;
        case 'visa':
            requirement.innerHTML="Visto d'ingresso";
            break;
        case 'green':
            requirement.innerHTML="Green Pass";
            break;
        case 'swab':
            requirement.innerHTML="Certificato di negatività al tampone";
            break;
    }
    container.appendChild(requirement);
}