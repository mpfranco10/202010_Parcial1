let socket_io = require("socket.io");
var io = socket_io();
var socketApi = {};


socketApi.io = io;

ejemplos = [];

boton = false;



io.on('connection', function (socket) {

    io.sockets.emit('messages', ejemplos);
    io.sockets.emit("boton", boton);
    io.sockets.emit('lista', ejemplos);

    socket.on("new-message" , data => {
        ejemplos.push(data);
        socketApi.sendNotification(ejemplos);
        io.sockets.emit('lista', ejemplos);
    })

    socket.on("listar" , () => {
        socketApi.sendList();
    })

    //Cambiar el estado del botón y avisar a todos el estado del botón
    socket.on("new-boton" , data => {
        boton = data;
        socketApi.sendNotificationBoton(boton)
    })

    
});

socketApi.sendNotificationBoton = data => {
   
    io.sockets.emit('boton', data);
    
}

socketApi.sendList = () => {
   
    io.sockets.emit('lista', ejemplos);
    
}

socketApi.sendNotification = data => {
   
    io.sockets.emit('messages', data);
    
}

module.exports = socketApi;
