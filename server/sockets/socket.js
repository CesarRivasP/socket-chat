const { io } = require('../server');
const { Users } = require('../classes/users');
const users = new Users();

const { createMessage } = require('../utils/utilities');

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

    client.broadcast.emit('listPersons',  users.getPersons());

    callback(persons); //personas conectadas al chat
  })

  client.on('createMessage', (data) => {
    let person = users.getPerson(client.id);

    // let message = createMessage(data.name, data.message);
    let message = createMessage(person.name, data.message);

    client.broadcast.emit('createMessage', message)
  })

  client.on('disconnect', () => {
    // Asi se resuelve la duplicidad de los usuarios
    let personDelete = users.deletePerson(client.id);

    // client.broadcast.emit('createMessage', { BEFORE
    //   user: 'Admin',
    //   message: `${personDelete.name} abandono el chat`
    // })

    // AFTER
    client.broadcast.emit('createMessage', createMessage('Admin', `${personDelete.name} abandono el chat`))

    client.broadcast.emit('listPersons',  users.getPersons());
  });

  // Mensaje privado
  client.on('privateMessage', (data) => {
    let person = users.getPerson(client.id);
    // el id del usuario al que se le va a enviar el mensaje privado se tiene que llamar 'para'
    client.broadcast.to(data.para).emit('privateMessage', createMessage(person.name, data.message));
  })
})
