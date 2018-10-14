var request = require('request');

// --------------------------------------------------------------------
exports.typeahead = function(city, callback) {      
	var opts = { 	uri:     'https://suggest.expedia.com/api/v4/typeahead/'+city,					method: 	'GET',
					json: true,
					headers: {
								'Content-Type':   'application/json;charset=UTF-8',
						}
		};

    request( opts, function (error, response, body){

		if (error) console.log('ERROR exports.typeahead:', error);
        try {
			// From a time then response used as a string.
			var info = body !== typeof body ? body : JSON.parse(body.substring(1, body.length-1));
            if (info.rc == 'OK') {
                callback(info.sr);
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

// Some cities predefined originally. In order to safe from Expedia error.
function def_(name) {

    if (name == 'brisbane') {
		return {
			displayName: '<B>Brisbane</B>, Queensland, AU',
			fullName: 'Brisbane (and vicinity), Queensland, Australia',
			lastSearchName: 'Brisbane, Queensland, Australia',
			shortName: '<B>Brisbane</B>, Queensland, AU',
			coordinates: {lat: '-27.458819',  long: '153.103613'},
			airport: 'BNE'
		};
    }

    if (name == 'sydney') {
		return {
			displayName: '<B>Sydney</B>, New South Wales, AU',
			fullName: 'Sydney (and vicinity), New South Wales, Australia',
			lastSearchName: 'Sydney, New South Wales, Australia',
			shortName: '<B>Sydney</B>, New South Wales, AU',
			coordinates: {lat:  '-33.86757', long: '151.20844'},
			airport: 'SYD'
		};
    }

    if (name == 'canberra') {
		return {
			displayName: '<B>Canberra</B>, Australian Capital Territory, AU',
			fullName: 'Canberra (and vicinity), Australian Capital Territory, Australia',
			lastSearchName: 'Canberra, Australian Capital Territory, Australia',
			shortName: '<B>Canberra</B>, Australian Capital Territory, AU',
			coordinates: {lat: '-35.280912', long: '149.12766'},
			airport: 'CBR'
		};
    }

    if (name == 'darwin') {
		return {
			displayName: '<B>Darwin</B>, Northern Territory, AU',
			fullName: 'Darwin (and vicinity), Northern Territory, Australia',
			lastSearchName: 'Darwin, Northern Territory, Australia',
			shortName: '<B>Darwin</B>, Northern Territory, AU',
			coordinates: {lat: '-12.46388',  long: '130.84242'},
			airport: 'DRW'
		};
    }

    if (name == 'perth') {
		return {
			displayName: '<B>Perth</B>, Western Australia, AU',
			fullName: 'Perth (and vicinity), Western Australia, Australia',
			lastSearchName: 'Perth, Western Australia, Australia',
			shortName: '<B>Perth</B>, Western Australia, AU',
			coordinates: {lat: '-31.95455', long: '115.85611'},
			airport: 'PER'
		};
    }
}