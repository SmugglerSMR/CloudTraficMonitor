process.env.NODE_ENV = process.env.NODE_ENV || 'local';

var querystring = require('querystring');
var cookieSessions = require('cookie-sessions');
var request = require('request');

var fs = require('fs');

var config = require('./app/config');
var async = require( 'async' );

var Expedia = require( './app/expedia' );

var Webcams = require( './app/webcams' );

console.log('-------test------------');


Expedia.typeahead( 'brisabane', function(rez){  console.log(rez);  });

Webcams.get({  //nearby:  '-27.45,153.10,15',
                country: 'AU',
                show:    'webcams:image,location'

              }, function(rez){
                  console.log(rez);
              });

Webcams.get({   webcamId:  '1216143079',
                show:    'webcams:player,location'

              }, function(rez){
                Webcams.show(rez);
              });