//server-side
// location: C:\Users\j\Documents\A_mySTUDY\spa\chat_sochet
// 

var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	users = {} ;


var port = 9000;
server.listen(port); 
console.log('Listening on port', port);

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
		if(data in users){ //check if the same nickname is already taken
			callback(false);

		}else{
			callback(true);
			socket.nickname = data; //each user has individual socket
			
			users[socket.nickname] = socket;
			//userIdList.push(socket.nickname);
			
			updateNicknames();
		}
	});





	function updateNicknames(){
		io.sockets.emit('usernames', Object.keys(users) );
	}
	



	socket.on('send message', function(data){
		var date = new Date();

		var trimmedMsg = data.trim();


		// when the first 3 characters are '/p ' forwardslash-w-and-space,
		// treat the message as PRIVATE
		if(data.substring(0,3) === '/p '){ //private message
			trimmedMsg = trimmedMsg.substring(3);
			
			var privateMsgTo = trimmedMsg.substr(0, trimmedMsg.indexOf(' ')); //take recepient
			trimmedMsg = trimmedMsg.substr(trimmedMsg.indexOf(' ')+1);
			console.log('this is private msg to: ' + privateMsgTo);


			if(privateMsgTo in users){
				io.sockets.emit('private message', {msg: trimmedMsg,
												 userid: socket.nickname,
												 recepient: privateMsgTo,
												 recepientInRoom: true,
												 current_hour: date.getHours(),
												 current_min: date.getMinutes()
												});  //send including me
			}else{
				io.sockets.emit('private message', {msg: trimmedMsg,
												 userid: socket.nickname,
												 recepient: privateMsgTo,
												 recepientInRoom: false,
												 current_hour: date.getHours(),
												 current_min: date.getMinutes()
												});  //send including me
			}





		}else{ //public message
			console.log('this is public msg'); 
			io.sockets.emit('new message', {msg: data,
											 userid: socket.nickname,
											 current_hour: date.getHours(),
											 current_min: date.getMinutes()
											});  //send including me

		}

/*
		io.sockets.emit('new message', {msg: data,
										 userid: socket.nickname,
										 current_hour: date.getHours(),
										 current_min: date.getMinutes()
										});  //send including me


*/
		// socket.broadcast.emit('new message', data); //send except me
	});




	//when the user exit the chatting
	socket.on('disconnect', function(data){
		if(!socket.nickname) return;
		delete users[socket.nickname];
		//userIdList.splice(userIdList.indexOf(socket.nickname), 1);
		updateNicknames();
	});


});