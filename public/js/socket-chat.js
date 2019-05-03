var socket = io();
var params = new URLSearchParams(window.location.search);

if(!params.has('name')){
  window.location = 'index.html'; //redireccion
  throw new Error('El nombre es necesario');
}

var user = {
  name: params.get('name')
};

socket.on('connect', function(){
  console.log('Conectado al servidor');

  socket.emit('enterChat', user, function(response){
    console.log('Usuarios conectado ', response);
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
});

// escuchar cambios en los usuarios
// Cuando un usuario entra o sale del chat
socket.on('listPersons', function(data){
  console.log('Personas: ', data);
});
