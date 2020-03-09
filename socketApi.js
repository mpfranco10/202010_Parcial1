let socket_io = require("socket.io");
var io = socket_io();
var socketApi = {};


socketApi.io = io;

ejemplos = [{nit: 1, razonsocial: "hola2", valor: 124, gano: false}];

boton = false;



io.on('connection', function (socket) {

    io.sockets.emit('messages', ejemplos);
    io.sockets.emit("boton", boton);

    //esto seria lo del timer, que no termine
    socket.on('reset', function (data) {
        countdown = 1000;
        io.sockets.emit('timer', { countdown: countdown });
      });


    socket.on("new-message" , data => {
        ejemplos.push(data);
        socketApi.sendNotification(ejemplos)
    })

    //compartir el estado del boton
    socket.on("new-boton" , data => {
        boton = data;
        socketApi.sendNotificationBoton(boton)
    })

    
});

socketApi.sendNotificationBoton = data => {
   
    io.sockets.emit('boton', data);
    
}

socketApi.sendNotification = data => {
   
    io.sockets.emit('messages', data);
    
}

var countdown = 30;
setInterval(function() {
  countdown--;
  io.sockets.emit('timer', { countdown: countdown });
}, 30);

module.exports = socketApi;
