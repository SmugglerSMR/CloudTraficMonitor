var request = require('request');

var Config = require('./config');

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

    var url = 'https://api.qldtraffic.qld.gov.au/v1/webcams?apikey='+Config.WEBCAMS.appKey;

    var opts = {  url:      url,
                  method:   'GET',
                  json:     true,
              };

    var info = [];          
	
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
                        };

                        info.push(x);

                    }
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