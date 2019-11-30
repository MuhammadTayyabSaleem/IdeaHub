const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);


io.on('connection', (socket) => { 
  console.log('a user connected')

  socket.on ('chat Message',(msg)=>{    
    io.emit('data.user1', msg);
  })
 });

server.listen(3001, ()=>{
  console.log('Listening on 3001');
});

//'node index' in terminal to run this