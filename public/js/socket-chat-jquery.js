// Este archivo se va a encargar de todas las funciones que nos van a permitir
// renderizar y modificar el html
var socket = io();

var params = new URLSearchParams(window.location.search);
var name = params.get('name');
var room = params.get('room');
// referencias de jquery
var divUsuarios = $('#divUsuarios');  //Para obtener un id en jquery
var sendForm = $('#sendForm');  //Para obtener un id en jquery
var txtMessage = $('#txtMessage');
var divChatbox = $('#divChatbox');


// funciones para renderizar usuarios
function renderUsers(persons){ // [{},{}] -> se espera un array
  console.log(persons);
  // Parte del html que se quiere generar de forma automatica

  var html = '';
  //asi se crea un string que tiene todo el html que se va a utilizar
  html += '<li>';
  html += ' <a href="javascript:void(0)" class="active"> Chat de <span>' + params.get('room') + '</span></a>';
  html += '</li>';


  for(var i = 0; i < persons.length; i++){
    html += '<li>';
    // Para saber cual es el id de un usuario data-id=""
    html += ' <a data-id="'+ persons[i].id+'" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>' + persons[i].name + '<small class="text-success">online</small></span></a>';
    html += '</li>';
  }

  divUsuarios.html(html); //El html va a ser igual al html que se implemento aqui
}


function renderMessages(message){
  var html = '';
  html += '<li class="animated fadeIn">'
  html += '  <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
  html += '  <div class="chat-content">';
  html += '    <h5>' + message.name + '</h5>';
  html += '    <div class="box bg-light-info">' + message.message + '</div>';
  html += '  </div>';
  html += '  <div class="chat-time">10:56 am</div>';
  html += '</li>';

  divChatbox.append(html);
}

// Los atributos personalizados empiezan con la palabra data, por convencion. como data-id
// Listeners
divUsuarios.on('click', 'a', function(){
  var id = $(this).data('id')  //si fuera data-car se pondria data('car')

  if(id){
    console.log(id);
  }
})

sendForm.on('submit', function(e){
  e.preventDefault();
  console.log(txtMessage.val());

  if(txtMessage.val().trim().length === 0){ //trim quita los espacio al inicio y al final
    return;
  }

  socket.emit('createMessage',
  {
    name: name,
    message: txtMessage.val()
  },
   function(message){
     // console.log(message);
     txtMessage.val('').focus();
     renderMessages(message)
  })
})
