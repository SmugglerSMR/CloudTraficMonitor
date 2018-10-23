// import * as tf from '@tensorflow/tfjs';
// import * as tf_node from '@tensorflow/tfjs-node';


var URL = require('url');
var async = require('async');
var config = require('../app/config');

var Expedia = require( '../app/expedia' );
var Webcams = require( '../app/webcams' );

var MAIN_CITY = { 'name': 'brisbane', ps: 'right' };

var CITY = [ 	{ name: 'Mackay',   ps: 'right' },
				// { name: 'Townsvile', ps: 'bottom' },	
				// { name: 'Mackay',   ps: 'top' },
				// { name: 'Toowoomba',   ps: 'bottom' },
				// { name: 'Gold Coast',   ps: 'right' },
				// { name: 'Longreach',   ps: 'bottom' },
				// { name: 'Mount Isa',   ps: 'bottom' },
				// { name: 'Gladstone',   ps: 'right' },
				// { name: 'Cairns',   ps: 'top' },
				{ name: 'Birdsville',   ps: 'bottom' }
			];  

var tf = require("@tensorflow/tfjs");
require('@tensorflow/tfjs-node');
var util = tf.util;
var tensor2d = tf.tensor2d

exports.index = function (req, res) {

	var info = {  	main: {},
					cities: []	
				};

	var queryData = URL.parse(req.url, true).query;
	var showId = queryData.showId ? queryData.showId : null;
	init();
	return;
	async.series( [

		function( chainCallback ){								

			info.main['name'] = MAIN_CITY.name;
			info.main['ps'] = MAIN_CITY.ps;

			Expedia.typeahead( MAIN_CITY.name, function(rez){  

						if (rez) {
							for (var i=0; i<rez.length; i++) {
								if (rez[i].type == 'MULTICITY') {
									info.main['displayName'] = rez[i].regionNames['displayName'];
									info.main['fullName'] = rez[i].regionNames['fullName'];
									info.main['lastSearchName'] = rez[i].regionNames['lastSearchName'];
									info.main['shortName'] = rez[i].regionNames['displayName'];	
									info.main['coordinates'] = rez[i].coordinates;
									info.main['airport'] = rez[i].hierarchyInfo.airport.airportCode;
									break;
								}
								else if (rez[i].type == 'AIRPORT') {
									info.main['displayName'] = rez[i].regionNames['displayName'];
									info.main['fullName'] = rez[i].regionNames['fullName'];
									info.main['lastSearchName'] = rez[i].regionNames['lastSearchName'];
									info.main['shortName'] = rez[i].regionNames['displayName'];	
									info.main['coordinates'] = rez[i].coordinates;
									info.main['airport'] = rez[i].hierarchyInfo.airport.airportCode;
								}
							}
							chainCallback();
						}	
						else {
							var x = Expedia.def_(MAIN_CITY.name);
							info.main['displayName'] = x['displayName'];
							info.main['fullName'] = x['fullName'];
							info.main['lastSearchName'] = x['lastSearchName'];
							info.main['shortName'] = x['displayName'];	
							info.main['coordinates'] = x.coordinates;
							info.main['airport'] = x.airport;
						}

			});
        },
        // Main webCams 
		function( chainCallback ){								

			info.main['nearby'] = info.main.coordinates.lat+','+info.main.coordinates.long+',15';

			Webcams.get({  	nearby:  info.main['nearby'],
							show:    'webcams:image,location',
							limit:   3
						}, function(rez){
							info.main['webcams'] = rez && 
											rez.webcams ? rez.webcams : null;
							chainCallback();
						});

        },
        // Cities - name
		function( chainCallback ){								
            // Make check for MAIN_CITy
			async.each(CITY, function(city, next) {
				get_city(city, function(data){
					info.cities.push( data );
					next();
				});
			},  function(err) {
				chainCallback();
			});

		},
		function( chainCallback ){

			res.render('home', {
						title: 				'CAB API',
						config: 			escape(JSON.stringify(info)),
						maps_key:           config['GOOGLE_MAPS_KEY']
			});

		}
	]);
};

async function init() { 
	
	// Load the model.
	console.log('Performing prediction: ');
	const mobilenet = await tf.loadModel(
		'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json');

		
	//const model = await mobilenet.load();
	var img = 'https://webcams.qldtraffic.qld.gov.au/Metropolitan/Archerfield_Ipswich_Mwy_sth.jpg'
	// Classify the image.
	const predictions = await mobilenet.classify(img);

	console.log('Predictions: ');
	console.log(predictions);
		
}

function get_city(city, callback) {

	var data = {};

	async.series( [
        // Main for city name
		function( chainCallback ){								

			data['name'] = city.name;
			data['ps'] = city.ps;

			Expedia.typeahead( city.name, function(rez){  

				if (rez) {
					for (var i=0; i<rez.length; i++) {
						if (rez[i].type == 'MULTICITY') {
							data['displayName'] = rez[i].regionNames['displayName'];
							data['fullName'] = rez[i].regionNames['fullName'];
							data['lastSearchName'] = rez[i].regionNames['lastSearchName'];
							data['shortName'] = rez[i].regionNames['displayName'];	
							data['coordinates'] = rez[i].coordinates;
							data['airport'] = rez[i].hierarchyInfo.airport.airportCode;
							break;
						}
						else if (rez[i].type == 'AIRPORT') {
							data['displayName'] = rez[i].regionNames['displayName'];
							data['fullName'] = rez[i].regionNames['fullName'];
							data['lastSearchName'] = rez[i].regionNames['lastSearchName'];
							data['shortName'] = rez[i].regionNames['displayName'];	
							data['coordinates'] = rez[i].coordinates;
							data['airport'] = rez[i].hierarchyInfo.airport.airportCode;
						}
					}
				} else {
					var x = Expedia.def_(city.name);
					data['displayName'] = x['displayName'];
					data['fullName'] = x['fullName'];
					data['lastSearchName'] = x['lastSearchName'];
					data['shortName'] = x['displayName'];	
					data['coordinates'] = x.coordinates;
					data['airport'] = x.airport;
				}	

				chainCallback();
			});
        },
        // Main for WebCams 
		function( chainCallback ){								

			data['nearby'] = data.coordinates.lat+','+data.coordinates.long+',15';

			Webcams.get({	nearby:  data['nearby'],
							show:    'webcams:image,location'
						}, function(rez){
							data['webcams'] = rez && rez.webcams ? rez.webcams : null;
							chainCallback();
						});
        },        
		function( chainCallback ){								
			callback(data);
		}
	]);

}