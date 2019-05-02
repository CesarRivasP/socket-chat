const { io } = require('../server');

io.on('connection', (client) => {
  console.log('Usuario conectado');
  // console.log(client);
  // Cada usuario que se conecte al app tiene su respectivo id unico
  client.emit('sendMessage', {
    user: 'Admin',
    message: 'Welcome to the app'
  });

  client.on('disconnect', () => {
    console.log('Usuario desconectado');
  })
})
