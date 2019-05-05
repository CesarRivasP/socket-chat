var socket = io();
var params = new URLSearchParams(window.location.search);

// if(!params.has('name')){
// Hay que verificar si viene el nombre o la sala como parametro
if(!params.has('name') || !params.has('room')){
  window.location = 'index.html'; //redireccion si no viene ninguno de los dos parametros
  throw new Error('El nombre y sala son necesarios');
}

var user = {
  name: params.get('name'),
  room: params.get('room')
};

socket.on('connect', function(){
  console.log('Conectado al servidor');

  socket.emit('enterChat', user, function(response){
    // console.log('Usuarios conectado ', response);
    renderUsers(response); //asi se pasa cada usuario que se va pasando
  })
});

socket.on('disconnect', function(){
  console.log('Se perdio la conexion con el servidor');
});

// Enviar un mensaje desde un cliente a todos los demas usuarios
// socket.emit('sendMessage', {
//     user: 'Cesar',
//     message: 'Hello world'
//   },
//   function(response){
//     console.log('Respuesta: ' +  response);
// });

socket.on('createMessage', function(message){
  console.log('Server: ', message);
  renderMessages(message)
});

// escuchar cambios en los usuarios
// Cuando un usuario entra o sale del chat
socket.on('listPersons', function(persons){
  // console.log('Personas: ', persons);
  renderUsers(persons); //asi se pasa cada usuario que se va pasando
});

// Mensajes privados
socket.on('privateMessage', function(message){
  console.log('Mensaje privado', message);
})
