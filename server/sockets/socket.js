const { io } = require('../server');
const { Users } = require('../classes/users');
const { createMessage } = require('../utils/utilities');

const users = new Users();

io.on('connection', (client) => {

  client.on('enterChat', function(data, callback){
    console.log(data);

    // if(!data.name){
    // Para validar que el usuario tenga la data
    if(!data.name || !data.room){
      return callback({
        error: true,
        message: 'EL nombre/sala es necesario'
      });
    }

    // Para conectar a un usuario con una sala. join es parte de la sintaxis para unir un usuario a una sala
    client.join(data.room);

    let persons = users.addPersons(client.id, data.name, data.room);

    // client.broadcast.emit('listPersons',  users.getPersons()); Solo se necesita enviar a los miembros de una sala
    client.broadcast.to(data.room).emit('listPersons',  users.getPersonsForRoom(data.room));

    client.broadcast.to(data.room).emit(
      'createMessage',
      createMessage('Admin', `${data.name} se unio el chat`)
    );

    callback(users.getPersonsForRoom(data.room)); //personas conectadas al chat
  })

  client.on('createMessage', (data, callback) => {
    let person = users.getPerson(client.id);

    // let message = createMessage(data.name, data.message);
    let message = createMessage(person.name, data.message);

    // client.broadcast.to()emit('createMessage', message)
    // el broadcast se debe hacer unicamente a las personas que se encuentren en la misma sala
    client.broadcast.to(person.room).emit('createMessage', message); //como no se tiene el objeto sala, se usa persona

    callback(message)
  })

  client.on('disconnect', () => {
    // Asi se resuelve la duplicidad de los usuarios
    let personDelete = users.deletePerson(client.id);

    // client.broadcast.emit('createMessage', { BEFORE
    //   user: 'Admin',
    //   message: `${personDelete.name} abandono el chat`
    // })

    // AFTER v1
    // client.broadcast.emit('createMessage', createMessage('Admin', `${personDelete.name} abandono el chat`))

    // client.broadcast.emit('listPersons',  users.getPersons());
    // AFTER v2
    // Cuando se desconecte un usuario Se le debe enviar una notificacion unicamente a los usuarios que se encuentren
    // en la sala donde se encontraba el usuario borrado
    console.log(personDelete);

    if(personDelete === undefined){
      return;
    }
    else {
      client.broadcast.to(personDelete.room).emit(
        'createMessage',
        createMessage('Admin', `${personDelete.name} abandono el chat`)
      )
    }

    client.broadcast.to(personDelete.room).emit('listPersons',  users.getPersonsForRoom(personDelete.room));
  });

  // Mensaje privado
  client.on('privateMessage', (data) => {
    let person = users.getPerson(client.id);
    // el id del usuario al que se le va a enviar el mensaje privado se tiene que llamar 'para'
    client.broadcast.to(data.para).emit('privateMessage', createMessage(person.name, data.message));
  })
})
