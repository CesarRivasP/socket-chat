const { io } = require('../server');

io.on('connection', (client) => {
  console.log('Usuario conectado');

  client.emit('sendMessage', {
    user: 'Admin',
    message: 'Welcome to the app'
  });

  client.on('disconnect', () => {
    console.log('Usuario desconectado');
  })
})
