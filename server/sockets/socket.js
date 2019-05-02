const { io } = require('../server');
const { Users } = require('../classes/users');
const users = new Users();


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

    callback(persons) //personas conectadas al chat
  })
})
