var displays=[{'gate':'A1','name':'Roma Fiumicino','id':1,'pasp':0,'tiket':1,'visa':0,'green':1,'swab':1}];
//type can be: id, pasp, ticket, visa, green, swab

//per la demo resetto al default
localStorage.setItem("displays", JSON.stringify(displays));

/*######## SETUP HOMEPAGE #########*/
setuphomepage();

function setuphomepage(){
    //se ho viaggi in programma
    displays.forEach(element => {
        let card = document.createElement("div"),
            h1 = document.createElement("h1"),
            id = document.createElement("h2"),
            pasp = document.createElement("h2"),
            ticket = document.createElement("h2"),
            visa = document.createElement("h2"),
            green = document.createElement("h2"),
            swab = document.createElement("h2");

        card.id="g_"+element.gate;
        card.className="card gate";

        h1.innerHTML=element.gate+": "+element.name;

        id.innerHTML="ID Card";
        if(element.id) id.className="requested";
        id.setAttribute("onclick","updateRequirements(this,'id')");
        pasp.innerHTML="Pasport";
        if(element.pasp) pasp.className="requested";
        pasp.setAttribute("onclick","updateRequirements(this,'pasp')");
        ticket.innerHTML="Boarding tiket";
        if(element.ticket) ticket.className="requested";
        ticket.setAttribute("onclick","updateRequirements(this,'ticket')");
        visa.innerHTML="Visa";
        if(element.visa) visa.className="requested";
        visa.setAttribute("onclick","updateRequirements(this,'visa')");
        green.innerHTML="Green Pass";
        if(element.green) green.className="requested";
        green.setAttribute("onclick","updateRequirements(this,'green')");
        swab.innerHTML="Swab";
        if(element.swab) swab.className="requested";
        swab.setAttribute("onclick","updateRequirements(this,'swab')");
        
        card.appendChild(h1);
        card.appendChild(id);
        card.appendChild(pasp);
        card.appendChild(ticket);
        card.appendChild(visa);
        card.appendChild(green);
        card.appendChild(swab);
        document.querySelector("#high").appendChild(card);
    });
}