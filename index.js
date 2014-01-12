var express = require('express'),
	app = express(),
	http = require('http'),
	server = http.createServer(app),
	io = require('socket.io').listen(server);

app.use(express.static(__dirname + '/public_html')); // Serve static contents
server.listen(8080);

// Bind Socket.io
io.sockets.on('connection', function(socket){
	socket.on('client drawing', function(data){
		socket.broadcast.emit('peer drawing', data);
	});
});