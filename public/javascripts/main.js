let socket = io.connect("http://localhost:3000", { "forceNew": true });

let nitactual = 0
let nombre = 0
let valor = 0
estado = false

socket.on("messages", data => {
    render(data);
});

socket.on("boton", data => {
    estado = data;
});

function render(data) {
    let html = data.map((e, i) => {
        return (`
        <div>
            <strong>${e.razonsocial}</strong>
            <em>${e.gano}</em>
        </div>
        `);
    }).join(" ");

    document.getElementById("messages").innerHTML = html;
}

    


function registrarse() {
    console.log("hola")

    nitactual = document.getElementById("nit").value;
    nombre = document.getElementById("razonsocial").value
    console.log(nitactual)
    console.log("Guardando nuevo participante");

    document.getElementById("nit").value = "";
    document.getElementById("razonsocial").value = "";

    var form = document.getElementById("inscri");
    var elements = form.elements;
    for (var i = 0, len = elements.length; i < len; ++i) {
        elements[i].readOnly = true;
    }

    document.getElementById("butreg").disabled = true;
    document.getElementById("butofertar").disabled = estado;

    return false;
}


function addMessage() {
    let problic = (Math.floor(Math.random() * 80) + 30) / 100;
    let probganar = (Math.floor(Math.random() * 80) + 30) / 100;

    let gano = false
    if (probganar > problic) {
        gano = true
    }
    let vala = (Math.floor(Math.random() * 10000000) + 5000000);

    console.log(gano);

    let val = 150000000 + vala;

    let message = {
        nit: nitactual,
        razonsocial: nombre,
        valor: val,
        gano: gano
    };
    console.log("Emitting new offer");
    socket.emit("new-message", message);
    socket.emit("new-boton", gano);

    return false;
}
