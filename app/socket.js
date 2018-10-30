var async = require( 'async' );

var Config = require('./config');

var self = this;

var IO = null;
var clients = [];

exports.init = function ( io ) {
	console.log('--init socket--');
	IO = io;

	io.sockets.on('connection', function (socket) {		
		var ID = (socket.id).toString();
		var time = (new Date).toLocaleTimeString();
		console.log('----------socket connection--------->', ID, time);
		clients.push(socket);

		// Посылаем клиенту сообщение о том, что он успешно подключился и его имя
		socket.json.send({ 'event': 'connected', 'name': ID, 'time': time });

		// Посылаем всем остальным пользователям, что подключился новый клиент и его имя
		socket.broadcast.json.send({ 'event': 'userJoined', 'name': ID, 'time': time });

		// при отключении клиента - уведомляем остальных
		socket.on('disconnect', function () {
			if ( remove_clients(ID) ) {
				var time = (new Date).toLocaleTimeString();
				io.sockets.json.send({ 'event': 'userSplit', 'name': ID, 'time': time });
				console.log('----------socket disconnection--------->', ID, time);
			}
		});

		// Навешиваем обработчик на входящее сообщение
		socket.on('message', function (msg) {
			var time = (new Date).toLocaleTimeString();
			console.log('-----------socket------->', msg.action);

			// Сообщение о регистрации
			if (msg.action == 'register') {
				register(socket, msg);
			}
		});
	});


};	

function remove_clients(ID) {
    for (var k in clients) {
        if (clients[k].id == ID) {
            clients.splice(k, 1);
            return true;
        }
    }
	return false;
}


// =============================================================================
//  отправить socket - для разных ситуаций
//	data - сообщение
//
exports.send = function (params) {
	//console.log('\n ------------------------------------------------------\n SOCKET send \n',params);

	for (var k in clients) {
		var time = (new Date).toLocaleTimeString();
		params.time = time;
			
		console.log('send-->',clients[k].id); 

		clients[k].json.send(params);
	}
};


// ==============================================================
function register(socket, msg) {

    var ID = (socket.id).toString();
    var time = (new Date).toLocaleTimeString();

    socket.json.send({ 'event': 'register', 'name': ID, 'text': msg, 'time': time });
}

