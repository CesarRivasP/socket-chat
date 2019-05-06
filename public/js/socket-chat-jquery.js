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


function renderMessages(message, me){ //me, significa si yo lo envio u otras personas klo envian
  var html = '';
  var date = new Date(message.date);
  var hour = date.getHours() + ':' + date.getMinutes();

  var adminClass = 'info';

  if(message.name === 'Admin'){
    adminClass = 'danger';
  }

  if(me){
    // Si soy yo el que envia el mensaje, se mostrara esto
    html += '<li class="reverse">';
    html += '  <div class="chat-content">';
    html += '    <h5>' + message.name + '</h5>';
    html += '    <div class="box bg-light-inverse">' + message.message + '</div>';
    html += '  </div>';
    html += '  <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
    html += '  <div class="chat-time">' + hour + '</div>';
    html += '</li>';
  }
  else {
    // Si es otro el que envia el mensaje, se mostrara esto
    html += '<li class="animated fadeIn">'
    if(message.name !== 'Admin'){
      html += '  <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
    }

    html += '  <div class="chat-content">';
    html += '    <h5>' + message.name + '</h5>';
    html += '    <div class="box bg-light-' + adminClass + '">' + message.message + '</div>';
    html += '  </div>';
    html += '  <div class="chat-time">' + hour + '</div>';
    html += '</li>';
  }


  divChatbox.append(html);
}

function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
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
     // Aqui se indica true para indicar que cuando se envia el mensaje con el formulario, soy yo
     renderMessages(message, true);
     // Hay que llamar esta funcion aqui para que acomode la vista una vez se haya enviado el mensaje
     scrollBottom();
  })
})
