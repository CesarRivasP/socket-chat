var socket = io();

socket.on('connect', function(){
  console.log('Conectado al servidor');
})


socket.on('disconnect', function(){
  console.log('Se perdio la conexion con el servidor');
})
