var async = require('async');
var config = require('../app/config');

var Webcams = require( '../app/webcams' );

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
exports.detect = function (req, res) {

    var webcams = null;

    Webcams.get( function(rez) {
        
        webcams = rez && rez ? rez : null;

        res.json({status: 'Ok', webcams: webcams});

    }); 
};
	
// ================================================================
