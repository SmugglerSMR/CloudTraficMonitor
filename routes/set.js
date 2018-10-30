var async = require('async');
var config = require('../app/config');

var Webcams = require( '../app/webcams' );

// ================================================================
exports.webcams_count = function (req, res) {

	var webcamsCount = req.params.count;

	var x =	Webcams.set_count( webcamsCount ); 

	res.send('Set count detect webcams: '+webcamsCount.toString()+'<br>old value: '+x.toString());

};
	
	
// ================================================================
