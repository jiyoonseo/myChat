//server-side
// location: C:\Users\j\Documents\A_mySTUDY\spa\chat_sochet
// 

var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	userIdList = [] ;


server.listen(2323); //port 2323 to listen

app.get('/', function(req, res){
	//res.sendFile(__dirname + '/index.html'); //tester 
	res.sendFile(__dirname + '/spa-ui.html');
});

//include static css directory...
app.use("/css", express.static(__dirname + '/css')); 
app.use("/js", express.static(__dirname + '/js')); 
app.use("/bootstrap", express.static(__dirname + '/bootstrap')); 
app.use("/img", express.static(__dirname + '/img')); 

//receive server-side
io.sockets.on('connection', function(socket){
	
	socket.on('new user', function(data, callback){
		if(userIdList.indexOf(data) != -1){ //check if the same nickname is already taken
			callback(false);

		}else{
			callback(true);
			socket.nickname = data; //each user has individual socket
			userIdList.push(socket.nickname);
			
			updateNicknames();
		}
	});

	function updateNicknames(){
		io.sockets.emit('usernames', userIdList);
	}
	
	socket.on('send message', function(data){
		var date = new Date();
		io.sockets.emit('new message', {msg: data,
										 userid: socket.nickname,
										 current_hour: date.getHours(),
										 current_min: date.getMinutes()
										});  //send including me
		// socket.broadcast.emit('new message', data); //send except me
	});

	//when the user exit the chatting
	socket.on('disconnect', function(data){
		if(!socket.nickname) return;
		userIdList.splice(userIdList.indexOf(socket.nickname), 1);
		updateNicknames();
	});
});