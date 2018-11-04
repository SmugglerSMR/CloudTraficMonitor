var async = require('async');

var tf = require("@tensorflow/tfjs");
require('@tensorflow/tfjs-node');

global.fetch = require('node-fetch')
var mobilenet = require('@tensorflow-models/mobilenet')
var { createCanvas, Image } = require('canvas')

var util = tf.util;
var tensor2d = tf.tensor2d

var Config = require('./app/config');
var Storage = require('./app/storage');


//run(process.argv[2]); 

run(); 

//run ('https://webcams.qldtraffic.qld.gov.au/Metropolitan/Archerfield_Ipswich_Mwy_sth.jpg');


function run( ) {

	console.log('================CHILD PROCESS DETECT================');


    var list_successfull = [];


    Storage.get_state( 1, function(items){


        async.eachSeries(items, function(item, next) {

                        detectImage(item, function(input){

                            if (input) {                                

                                detect_prediction(input, function(predictions){

                                    if (predictions) {

                                        item.count = predictions[2].className.length;

                                        process.send({ error: false, count: item.count, webcamId: item.webcamId });

                                        save_predictions( item.id, predictions, function(){        })

                                        list_successfull.push(item.id);

                                        next();
                                    }
                                    else {
                                        save_error( item.id, function(){        });                                            
                                        console.log('=========TIMEOUT============')                                        
                                        next();
                                    }    

                                }); 
                                                               
                            }
                            else {
                                next();                                
                            }

                        });


                    },  function(err) {

                        console.log('---finish--detect--');

                        clearTimeout( run_timeout );

                        process.exit(0);

                    });

        var tt = 100000 * items.length;

        var run_timeout = setTimeout( function(){

            console.log(list_successfull);

            for (var i=0; i<items.length; i++) {

                if ( list_successfull.indexOf( items[i].id) == -1 ) {

                    process.send({ error: true, message: 'timeout', id: items[i].id });

                }

            }

            process.exit(1);

        }, tt); 



    });   

	
};

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
function detectImage(item, callback) {

    var canvas = createCanvas(299, 299);  
    var ctx = canvas.getContext('2d');    
    var img = new Image();    
    img.onload = () => {
            ctx.drawImage(img, 0, 0); 
            var input = tf.fromPixels(canvas);
            delete img;
            delete ctx,
            delete canvas;
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
    var model = await mobilenet.load();     

    // model.classify(input).then(predictions => {
    //     console.log("Size of prediction "+predictions[2].className.length);
    //     callback(predictions);
    // });
    for(var i = 0; i < 100; i++) {
        model.classify(input).then(predictions => {
            //console.log("Size of prediction "+predictions[2].className.length);
        }).catch( (reason) => {
            console.log('Handle rejected promise ('+reason+') here.');
        });    
    }    
    model.classify(input).then(predictions => {
        console.log("Size of prediction "+predictions[2].className.length);
        callback(predictions);
    }).catch( (reason) => {
        console.log('Handle rejected promise ('+reason+') here.');
        callback(null);
    });


}
