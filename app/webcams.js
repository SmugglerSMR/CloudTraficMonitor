var async = require('async');
var request = require('request');

var Config = require('./config');
var sckt = require('./socket');

var tf = require("@tensorflow/tfjs");
require('@tensorflow/tfjs-node');
global.fetch = require('node-fetch');
var mobilenet = require('@tensorflow-models/mobilenet');
var { createCanvas, Image } = require('canvas');

var util = tf.util;
var tensor2d = tf.tensor2d

var Storage = require('./storage');

var webcams = null;
var count_webcams = 2;

// --------------------------------------------------------------------
//  Reading performed from API of https://qldtraffic.qld.gov.au/index.html
//
exports.init = function() {

    console.log('-- init webcams --');

    _run();

    // -------------------
    function _run() {

        read(function(){

            detect( function(){

                setTimeout( function(){
                    _run();
                }, 10000);    

            })

        });

    }
    
}    

function detect(callback) {

    console.log('-- detect webcams --');

    Storage.get_state( 1, function(items){

        async.eachSeries(items, function(item, next) {

                        detectImage(item, function(input){

                            if (input) {                                

//                                 detect_prediction(input, function(predictions){

//                                     if (predictions) {

//                                         item.count = predictions[2].className.length;
//                                         //w.count = ++j;
//                                         for (var i=0; i<webcams.length; i++) {
//                                             if (webcams[i].id == item.webcamId) {
//                                                 webcams[i].count = item.count;
//                                                 sckt.send({ 'event': 'detect', 'webcam': webcams[i] });            
//                                                 break;
//                                             }
//                                         }

//                                         save_predictions( item.id, predictions, function(){        })

//                                         next();
//                                     }
//                                     else {
//                                         save_error( item.id, function(){        })                                            
// console.log('=========TIMEOUT============')                                        
//                                         next();
//                                     }    

//                                 }); 
                            item.count = 1;
                            next();
                                                               
                            }
                            else {
                                next();                                
                            }

                        });


                    },  function(err) {

                        console.log('---finish--load--');

                        callback();


                    });

    });
    
}


function read(callback) {

    console.log('-- read webcams --', webcams ? webcams.length : '-');

    load(function(error){


        var k = count_webcams < webcams.length ? count_webcams : webcams.length;
        console.log('---start--', k);

        var ww = [];
        for (var i=0; i<k; i++)  ww.push(webcams[i]);
        sckt.send({ 'event': 'webcams', 'webcams': ww });

        var j = 0;

        async.each(ww, function(w, next) {

                        readImage(w.image_url).then( data => {

                            if (data) {                                

                                save_image( w.id, w.image_url, data, function(){

                                    next();

                                })

/*                                detect_prediction(input, function(predictions){
                                    w.count = predictions[2].className.length;
                                    //w.count = ++j;

                                    sckt.send({ 'event': 'detect', 'webcam': w });    
                                    next();

                                }); */
                                                               
                            }
                            else {
                                next();                                
                            }

                        });

                    },  function(err) {

                        console.log('---finish--load--');

                        callback();

                        //sckt.send({ 'event': 'read-', 'webcams': ww });

                    });

    });


}    

// --------------------------------------------------------------------
function save_image(webcamId, url, data, callback) {

    Storage.add( { webcamId:  webcamId,
                   imageUrl:  url,
                   data:      data   
                 }, callback);

}

// --------------------------------------------------------------------
function save_predictions(id, predictions, callback) {

    Storage.update( { id:        id,
                      result:    predictions,
                     }, callback);

}

// --------------------------------------------------------------------
function save_error(id, callback) {

    Storage.set_error( id, callback);

}


// --------------------------------------------------------------------
//  Считаем камеры
function load(callback) {

    console.log('-- load webcams -- api.qldtraffic.qld.gov.au --');

    var url = 'https://api.qldtraffic.qld.gov.au/v1/webcams?apikey='+Config.WEBCAMS.appKey;

    var opts = {  url:      url,
                  method:   'GET',
                  json:     true,
              };

    webcams = [];          
    
    request( opts, function (error, response, body){        
        try {
            console.log('-- load webcams -- ', error);
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
        var k = count_webcams < webcams.length ? count_webcams : webcams.length;
        var ww = [];
        for (var i=0; i<k; i++)  ww.push(webcams[i]);
        callback(ww);
    }
    else {
        load(function(error){
            var k = count_webcams < webcams.length ? count_webcams : webcams.length;
            var ww = [];
            for (var i=0; i<k; i++)  ww.push(webcams[i]);
            callback(ww);
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
// --------------------------------------------------------------------
exports.get_count = function() {

    return count_webcams;
};



// ================================================================

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
            var data = canvas.toDataURL("image/png");
            resolve(data);
        };  
        img.onerror = () => {
            console.error('-----ERROR readImage------')
            resolve(null)
        };  
    })

}

// --------------------------------------------------------------------
function detectImage(item, callback) {

    const canvas = createCanvas(299, 299);  
    const ctx = canvas.getContext('2d');    
    const img = new Image();    
    img.onload = () => {
            ctx.drawImage(img, 0, 0); 
            var input = tf.fromPixels(canvas);
            callback(input);
    };  
    img.onerror = () => {
            console.error('-----ERROR readImage------')
            callback(null)
    };
    img.src = item.data;

}

// ---------------------
async function detect_prediction(input, callback) {     

    console.log('Performing prediction: ');
    model = await mobilenet.load();     

    // model.classify(input).then(predictions => {
    //     console.log("Size of prediction "+predictions[2].className.length);
    //     callback(predictions);
    // });


    model.classify(input).then(predictions => {
        console.log("Size of prediction "+predictions[2].className.length);
        callback(predictions);
    }).catch( (reason) => {
        console.log('Handle rejected promise ('+reason+') here.');
        callback(null);
    });


}
