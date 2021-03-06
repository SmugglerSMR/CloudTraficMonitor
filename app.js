process.env.NODE_ENV = process.env.NODE_ENV || 'local';

var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var connect = require('connect');
var bodyParser = require('body-parser');
var logger = require('morgan');
var session = require('express-session');
var cookieParser = require('cookie-parser');

var path = require('path');
// ============= Setup
var config = require('./app/config');
var indx = require('./routes/index');
var readApi = require('./routes/api');
var readSet = require('./routes/set');

// var tf = require('@tensorflow/tfjs');

var port = process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || config.PORT;
var host = process.env.OPENSHIFT_NODEJS_HOST || process.env.HOST || config.HOST;

var favicon = require('serve-favicon');
app.use(favicon(__dirname + '/public/img/favicon.ico'));

var io = require('socket.io')(server);
require('./app/socket').init( io );

server.listen(port);
console.log('Express app listening at http://${host}:${port}/');

// ============= Configuration Using Express 4
app.use(logger('dev')) ;
app.use(cookieParser());
app.use(session({ resave: true,
    saveUninitialized: true,
    secret: 'your secret here' }));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


app.use(express.static(__dirname + '/public'));
// app.use('/tf', express.static(__dirname + '/node_modules/@tensorflow/tfjs/'));

// ============= API Routes
app.get('/', indx.index );
app.get('/webcams/count/:count/', readSet.webcams_count );

app.get('/api/webcams/id/:id/', readApi.webcams_id );
app.get('/api/detect/', readApi.detect );

app.get('/test', function(req, res) {
    res.sendFile(path.join(__dirname + '/routes/test.html'));
});

//app.listen(port, function () {
//    console.log('Express app listening at http://${host}:${port}/');
//});

app.use(function(req, res){
    res.status(404);
    console.log('Not found URL: ',req.url);
    res.send({ error: 'Not found' });
    return;
});

setTimeout( function(){
	require('./app/webcams').init( );
}, 500);	
