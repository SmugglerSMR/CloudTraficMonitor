var async = require('async');
var request = require('request');

var Config = require('./config');
var sckt = require('./socket');

var tf = require("@tensorflow/tfjs");
require('@tensorflow/tfjs-node');
global.fetch = require('node-fetch')
var mobilenet = require('@tensorflow-models/mobilenet')
var { createCanvas, Image } = require('canvas')

var util = tf.util;
var tensor2d = tf.tensor2d


var webcams = null;
var count_webcams = 3;

// --------------------------------------------------------------------
//  Reading performed from API of https://qldtraffic.qld.gov.au/index.html
//
exports.init = function() {
    console.log('-- init webcams --');
    _run();
    // -------------------
    function _run() {
        read(function(){
                setTimeout( function(){
                    _run();
                }, 60000);    
        });
    }
}    

function read(callback) {
    console.log('-- read webcams --');
    load(function(error){
        sckt.send({ 'event': 'webcams', 'webcams': webcams });
        if (count_webcams < webcams.length) webcams.length = count_webcams;
        console.log('---start--', webcams.length);
        async.each(webcams, function(w, next) {
                        readImage(w.image_url).then( input => {
                                detect_prediction(input, function(predictions){

                                    w.count = predictions[2].className.length;
                                    //w.count = count_webcams;
                                    sckt.send({ 'event': 'detect', 'webcam': w });
                                    next();
                                });
                        });
                        //w.count = 3;
                        //sckt.send({ 'action': 'detect', 'webcam': w });
                        //next();

                    },  function(err) {

                        console.log('---finish--');
                        sckt.send({ 'event': 'finish', 'webcams': webcams });
                        callback();
                    });
    });
}    

// --------------------------------------------------------------------
//  Считаем камеры
function load(callback) {

    var url = 'https://api.qldtraffic.qld.gov.au/v1/webcams?apikey='+Config.WEBCAMS.appKey;

    var opts = {  url:      url,
                  method:   'GET',
                  json:     true,
              };

    webcams = [];          
    
    request( opts, function (error, response, body){        
        try {
            if (!error) {
                var features = body.features;
                for (var i=0; i<features.length; i++) {
                    if (features[i].type == 'Feature') {
                        var x = {  geometry:    features[i].geometry.coordinates, 
                                   id:          features[i].properties.id, 
                                   url:         features[i].properties.url, 
                                   description: features[i].properties.description, 
                                   district:    features[i].properties.district, 
                                   direction:   features[i].properties.direction, 
                                   locality:    features[i].properties.locality, 
                                   postcode:    features[i].properties.postcode, 
                                   image_url:   features[i].properties.image_url, 
                                   count:       -1
                        };
                        webcams.push(x);
                    }
                }
                callback(false);
            }
            else {
                callback(true);
            }
        }
        catch(ex) {
            callback(true);
        }
    });
}    
exports.load = load;



// --------------------------------------------------------------------
//  Reading performed from API of https://qldtraffic.qld.gov.au/index.html
//
exports.geojson = function(callback) {

    var opts = {  url:      'https://data.qldtraffic.qld.gov.au/events_v2.geojson',
                  method:   'GET',
                  json:     true,
              };
    var info = [];          
    
    request( opts, function (error, response, body){        
        try {
            if (!error) {
                var features = body.features;
                for (var i=0; i<features.length; i++) {
                    info.push({ id:             features[i].properties.id,
                                description:    features[i].properties.description, 
                                geometry:       features[i].geometry.coordinates,
                              });
                }
                callback(info);
            }
            else {
                callback(null);
            }
        }
        catch(ex) {
            callback(null);
        }
    });
}    

// --------------------------------------------------------------------
exports.get = function(callback) {
    console.log('-- get --');
    if (webcams) {
        callback(webcams);
    }
    else {
        load(function(error){

            callback(webcams);   

        });   
    }
};

// --------------------------------------------------------------------
exports.show = function(rez) {

    console.log('\nwebcams.show');
    if (rez) {
        console.log('offset:', rez.offset);
        console.log('limit:', rez.limit);
        console.log('total:', rez.total);

        if (rez.webcams) {
            for (var i=0; i<rez.webcams.length; i++) {
                console.log(rez.webcams[i]);
            }
        }
    }
    else {
        console.log(rez);
    } 
};  

// --------------------------------------------------------------------
exports.set_count = function(newValue) {

    console.log('-- set_count --', newValue);

    var oldValue = count_webcams;

    count_webcams = newValue;

    return oldValue;
};



// ================================================================

// ---------------------
function readImage(url) {

    console.log('--', url);
    const canvas = createCanvas(299, 299);  
    const ctx = canvas.getContext('2d');    
    const img = new Image();    
    img.src = url;
    return new Promise(function(resolve, reject) {
        // Load the model.      
        img.onload = () => {
            ctx.drawImage(img, 0, 0);       
            var input = tf.fromPixels(canvas);
            resolve(input);
        };  
    })

}

// ---------------------
async function detect_prediction(input, callback) {     

    console.log('Performing prediction: ');
    var model = await mobilenet.load();     

    model.classify(input).then(predictions => {
        console.log("Size of prediction "+predictions[2].className.length);
        callback(predictions);
    });

}
