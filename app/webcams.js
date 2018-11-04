var async = require('async');
var request = require('request');

const childProcess = require('child_process');

var Config = require('./config');
var sckt = require('./socket');

var Storage = require('./storage');

var webcams = null;
var count_webcams = 4;

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
                }, 80000);    

            })

        });

    }
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

                        readImage(w.image_url, function( data ){

                            if (data) {                                

                                save_image( w.id, w.image_url, data, next );

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

// --------------------------------------------------------------------
function save_image(webcamId, url, data, callback) {

    Storage.add( { webcamId:  webcamId,
                   imageUrl:  url,
                   data:      data   
                 }, callback);

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

// --------------------------------------------------------------------
function save_error(id, callback) {

    Storage.set_error( id, callback);

}

// ================================================================

function readImage(url, callback) {

    console.log('--', url);

    var request = require('request').defaults({ encoding: null });

    request.get(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            data = "data:" + response.headers["content-type"] + ";base64," + new Buffer(body).toString('base64');
            callback(data);
        }
        else {
            callback(null);
        }
    });

}


function detect(callback) {

    var child = childProcess.fork('child.js');

    child.on('message', function(d) {
        console.log(d);

        if (d.error) {

            if (d.message == 'timeout') {
                save_error( d.id, function(){    console.log('-->set timeout', d.id);     }) 
            }

            return;    
        }

        for (var i=0; i<webcams.length; i++) {
            if (webcams[i].id == d.webcamId) {
                webcams[i].count = d.count;
                sckt.send({ 'event': 'detect', 'webcam': webcams[i] });            
                break;
            }
        }

    });

    child.on('exit', function (code, signal) {
        console.log(`EXIT: with code ${code} and signal ${signal}`);
        callback(code);
    });    

    child.on('error', (error) => {
        console.log(error);
    });

}

