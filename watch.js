// HERE
// INJECT NEW MESSAGES AS THEY APPEAR INTO HTML


var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

io.on('connection', function (socket) {
  console.log('connection')
  socket.on('red', function (msg) {
    console.log('msg =>', msg);
    io.emit('killsig')
    io.emit('red', msg)
  });
  socket.on('green', function (msg) {
    console.log('msg =>', msg);
    io.emit('killsig')
    io.emit('green', msg)
  });
  socket.on('yellow', function (msg) {
    console.log('msg =>', msg);
    io.emit('killsig')
    io.emit('yellow', msg)
  });
  socket.on('blue', function (msg) {
    console.log('msg =>', msg);
    io.emit('killsig')
    io.emit('blue', msg)
  });
  socket.on('magenta', function (msg) {
    console.log('msg =>', msg);
    io.emit('killsig')
    io.emit('magenta', msg)
  });
  socket.on('cyan', function (msg) {
    console.log('msg =>', msg);
    io.emit('killsig')
    io.emit('cyan', msg)
  });
  socket.on('white', function (msg) {
    console.log('msg =>', msg);
    io.emit('killsig')
    io.emit('white', msg)
  });
})