const { io } = require('../server');
const { Users } = require('../classes/users');
const users = new Users();

const { createMessage } = require('../utils/utilities');

io.on('connection', (client) => {

  client.on('enterChat', function(data, callback){
    console.log(data);

    if(!data.name){
      return callback({
        error: true,
        message: 'EL nombre es necesario'
      });
    }

    let persons = users.addPersons(client.id, data.name);

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
  })
})
