let socket = io.connect("http://localhost:3000", { "forceNew": true });

let nitactual = 0
let nombre = 0
let valor = 0
estado = false
esperando = false
listaOfertas = []

socket.on("messages", data => {
    render(data);
});

socket.on("lista", data => {
    listaOfertas = data;
});

socket.on("boton", data => {
    estado = data;
    document.getElementById("butofertar").disabled = estado;
});

function deactivateButton() {

    setTimeout(()=>{ 
        if(!estado){
            document.getElementById("butofertar").disabled = false;
        }
        console.log("terminan 30");
     }, 30000);
  }

function render(data) {
    let html = data.map((e, i) => {
        return (`
        <div>`+renderIndiv(e)+`
        </div>
        `);
    }).join(" ");

    document.getElementById("messages").innerHTML = html;
}

function renderIndiv(e){
    if(e.gano == false){
        return( `<p>${e.razonsocial}  [Oferta no aceptada]</p>`);
    }
    else{
        return( `<p>${e.razonsocial}  <strong>[Oferta aceptada. Valor: $${e.valor} ] </strong> </p>`);
    }
    
}

function registrarse() {

    nitactual = document.getElementById("nit").value;
    nombre = document.getElementById("razonsocial").value
    
    console.log("Guardando nuevo participante");

    document.getElementById("nit").value = "";
    document.getElementById("razonsocial").value = "";

    var form = document.getElementById("inscri");
    var elements = form.elements;
    for (var i = 0, len = elements.length; i < len; ++i) {
        elements[i].readOnly = true;
    }

    document.getElementById("butreg").disabled = true;

    console.log(estado);
    if(!estado){

        document.getElementById("estadoregistro").innerHTML = "Registro exitoso. Nit:" + nitactual +" ,razón social:" + nombre;
        document.getElementById("butofertar").disabled = false;
    }
    else{
        document.getElementById("estadoregistro").innerHTML = "No se pudo registrar porque la licitación ya tiene un ganador"; 
    }
    

    return false;
}


function addMessage() {
    let problic = (Math.floor(Math.random() * 80) + 30) / 100;
    let probganar = (Math.floor(Math.random() * 80) + 30) / 100;

    
    let vala = 0;
    let val = 150000000 + vala;

    socket.emit("listar"); //buscamos la lista
    if(listaOfertas.length>0){
        var result = listaOfertas.map(function(e) {
            return e.valor;
          })
        let maximo = Math.max(...result);
        console.log(maximo);
        
        vala = (Math.floor(Math.random() * 10000000) + 5000000);
        val = maximo + vala;
    }

    let gano = false
    if (probganar > problic) {
        gano = true
        socket.emit("new-boton",gano); //avisamos que esta persona ganó
    }
    else if(probganar <= problic){
        document.getElementById("butofertar").disabled = true;
        deactivateButton();
    }
   
    console.log(gano);

    let message = {
        nit: nitactual,
        razonsocial: nombre,
        valor: val,
        gano: gano
    };

    console.log("Emitting new offer");
    socket.emit("new-message", message);

    document.getElementById("valoroferta").innerHTML = "Usted hizo una oferta por: $"+val;
    

    return false;
}
