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

    if (name == 'Gold Coast') {
		return {
			displayName: '<B>Gold</B> <B>Coast</B>, Queensland, AU',
			fullName: 'Gold Coast, Queensland, Australia',
			lastSearchName: 'Gold Coast, Queensland, Australia',
			shortName: '<B>Gold</B> <B>Coast</B>, Queensland, AU',
			coordinates: {lat: '-28.016667', long: '153.39999999999998'},
			airport: 'OOL'
		};
    }

    if (name == 'Longreach') {
		return {
			displayName: '<B>Longreach</B>, QLD, Australia <ap>(LRE)</ap>',
			fullName: 'Longreach, QLD, Australia (LRE)',
			lastSearchName: 'Longreach, QLD, Australia (LRE)',
			shortName: '<B>Longreach</B>, QLD, Australia <ap>(LRE)</ap>',
			coordinates: {lat: '-23.4378202', long: '144.27423929999998'},
			airport: 'LRE'
		};
    }
    
    if (name == 'Birdsville') {
		return {
			displayName: '<B>Birdsville</B>, QLD, Australia <ap>(BVI)</ap>',
			fullName: 'Birdsville, QLD, Australia (BVI)',
			lastSearchName: 'Birdsville, QLD, Australia (BVI)',
			shortName: '<B>Birdsville</B>, QLD, Australia <ap>(BVI)</ap>',
			coordinates: {lat: '-25.8930405', long: '139.34544970000002'},
			airport: 'BVI'
		};
    }
    
    if (name == 'Mackay') {
		return {
			displayName: '<B>Mackay</B>, Queensland, AU',
			fullName: 'Mackay (and vicinity), Queensland, Australia',
			lastSearchName: 'Mackay, Queensland, Australia',
			shortName: '<B>Mackay</B>, Queensland, AU',
			coordinates: {lat: '-21.142269', long: '149.186783'},
			airport: 'MKY'
		};
    }
    
    if (name == 'Townsvile') {
		return {
			displayName: 'Townsville, Queensland, AU',
			fullName: 'Townsville (and vicinity), Queensland, Australia',
			lastSearchName: 'Townsville, Queensland, Australia',
			shortName: 'Townsville, Queensland, AU',
			coordinates: {lat: '-19.2589635', long: '146.81694830000004'},
			airport: 'TSV'
		};
    }
    
    if (name == 'Toowoomba') {
		return {
			displayName: '<B>Toowoomba</B>, Queensland, AU',
			fullName: 'Toowoomba (and vicinity), Queensland, Australia',
			lastSearchName: 'Toowoomba, Queensland, Australia',
			shortName: '<B>Toowoomba</B>, Queensland, AU',
			coordinates: {lat: '-27.5598212', long: '151.95066959999997'},
			airport: 'WTB'
		};
    }

    if (name == 'Mount Isa') {
		return {
			displayName: '<B>Mount</B> <B>Isa</B>, QLD, Australia <ap>(<B>ISA</B>)</ap>',
			fullName: 'Mount Isa, QLD, Australia (ISA)',
			lastSearchName: 'Mount Isa, QLD, Australia (ISA)',
			shortName: '<B>Mount</B> <B>Isa</B>, QLD, Australia <ap>(<B>ISA</B>)</ap>',
			coordinates: {lat: '-20.7255748', long: '139.49270849999994'},
			airport: 'ISA'
		};
    }

    if (name == 'Gladstone') {
		return {
			displayName: '<B>Gladstone</B>, Queensland, AU',
			fullName: 'Gladstone (and vicinity), Queensland, Australia',
			lastSearchName: 'Gladstone, Queensland, Australia',
			shortName: '<B>Gladstone</B>, Queensland, AU',
			coordinates: {lat: '-23.8426494', long: '151.24885919999997'},
			airport: 'GLT'
		};
    }

    if (name == 'Cairns') {
		return {
			displayName: '<B>Cairns</B>, QLD, Australia <ap>(CNS-<B>Cairns</B> Intl.)</ap>',
			fullName: 'Cairns, QLD, Australia (CNS-Cairns Intl.)',
			lastSearchName: 'Cairns, QLD, Australia (CNS-Cairns Intl.)',
			shortName: '<B>Cairns</B>, QLD, Australia <ap>(CNS-<B>Cairns</B> Intl.)</ap>',
			coordinates: {lat: '-16.8777626', long: '145.74993519999998'},
			airport: 'CNS'
		};
    }
    

	return {
		displayName: '<B>'+name+'</B>',
		fullName: name+', Australia',
		lastSearchName: 'Australia',
		shortName: '<B>'+name+'</B>, AU',
		coordinates: {lat: '-31.95455', long: '115.85611'},
		airport: ''
	};

}
exports.def_ = def_;