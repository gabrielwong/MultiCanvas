var app = require('http').createServer(handler),
	io = require('socket.io').listen(app),
	static = require('node-static'),
	fileServer = new static.Server('./');

app.listen(8080);

function handler(request, response){
	console.log("Request received");
	request.addListener('end', function(){
		console.log("Serving static file");
		fileServer.serve(request, response);
	});
	request.resume();
}