// ----------------------------------------------
var socket = null;

var socket_id = false;

$(document).ready( function() {

	var host = document.location.host;
	var p = host.split(':');
	var host_socket = 'ws://'+p[0]+':3000';	

	socket = io(host_socket);
	
    // ------------
	socket.on('connect', function () {

		console.log('SOCKET connection:', socket.connected );
		// --------------------- обработчик данных с сервера
		socket.on('message', function (msg) {

			console.log(msg);
			if (msg.event == 'detect') {

				var g = new google.maps.LatLng(msg.webcam.geometry[1], msg.webcam.geometry[0]);

				set_map_count(msg.webcam);	

			}	
		});

		// ------------
		socket.on('disconnect', function () {

			console.log('socket-disconnect');
			
			//socket.emit('userSplit', user);
			//socket.json.send({ 'action': 'disconnect', 'user': user });
		});
		
	});
	

	// ------------
	socket.json.send({ 'action': 'register', 'user': 'new user' });
	
});
// -----------------------------------------------------------------------------

window.onbeforeunload=function () {  

	socket.disconnect();
	
};

 

// -----------------------------------------------------------------------------
/*
socket.send(TEXT) — «базовое» событие, отправка сообщения TEXT
socket.json.send({}) — отправка сообщения в формате JSON
socket.broadcast.send — отправка сообщения всем клиентам, кроме текущего
socket.emit(EVENT, JSON) — отправка пользовательского события EVENT с данными JSON (например — socket.emit('whereami', {'location': loc})), может использоваться для переписывания стандартных событий 'connected', 'message' и 'disconnect'.
socket.on(EVENT, CALLBACK) — вызов функции CALLBACK при возникновении события EVENT (например — socket.on('whereami', function(loc){ console.log('I\'m in ' + loc + '!'); }))
*/