var async = require('async');
var config = require('../app/config');

var Webcams = require( '../app/webcams' );

var tf = require("@tensorflow/tfjs");
require('@tensorflow/tfjs-node');
global.fetch = require('node-fetch')
var mobilenet = require('@tensorflow-models/mobilenet')
var { createCanvas, Image } = require('canvas')

var util = tf.util;
var tensor2d = tf.tensor2d

// ================================================================
exports.webcams_id = function (req, res) {

	var webcamsId = req.params.id;

	console.log(webcamsId);

	Webcams.get({   
		webcamId:  webcamsId,
		show:    'webcams:player,location'
	}, function(rez){
			if (rez) {
				res.json({status: 'Ok', info: rez});
			}
			else {
				res.json({status: 'Error'});
			}
		});

};
	
// ================================================================
// ================================================================
exports.detect = function (req, res) {

	var webcams = null;

	Webcams.get( function(rez) {
		
		webcams = rez && rez ? rez : null;

		_detect_all( webcams, function(){


			res.json({status: 'Ok', webcams: webcams});

		});	
				
	});
};

	
// ================================================================

// ------------------------
function _detect_all( webcams, callback) {

	webcams.length = 3;

	console.log('----start---')


	for (var i=0; i<webcams.length; i++)  {
		detect(webcams[i].image_url);
	}
	console.log('----finish---')

	callback(true);
}


// Determine number of people
// 	Tensorflow requires usage of Canvas, and Canvas require node -v 8.12 for
//	stable work. MAKE SURE WE FIX IT BEFORE RUNNING
async function detect(imageUrl) { 

	console.log('Performing prediction: ', imageUrl);

	var model = await mobilenet.load();		
	const canvas = createCanvas(299, 299);	
	const ctx = canvas.getContext('2d');	
	const img = new Image();	
	img.src = imageUrl;
	return new Promise(function(resolve, reject) {
		// Load the model.		
		img.onload = () => {
			ctx.drawImage(img, 0, 0);		
			var input = tf.fromPixels(canvas);
			//predictions = model.classify(input);		
			model.classify(input).then(predictions => {
				console.log("Size of prediction "+predictions[2].className.length);
				// for (var i=0; i<predictions.length; i++)
				// 	console.log(predictions[i].className.length);
				resolve(predictions);
				//resolve(predictions[2].className.length);
				// console.log('Predictions: ');
				// console.log(predictions);
				// return predictions;
			});
		};	
	})
}