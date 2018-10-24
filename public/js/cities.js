//   Cities manipulation functions
// ---------------------------------------------- 
function show_city( city, callback ) {

	console.log(city);

	async.series([
		function(cb) {
	
			geocoder.geocode( { 'address': city.lastSearchName}, function(results, status) {		

				if (status == google.maps.GeocoderStatus.OK) {

					var adrs =  results[0].address_components;
					city.name = adrs[0].long_name;

					city.lat = results[0].geometry.location.lat();
					city.lng = results[0].geometry.location.lng();
					city.geometry = results[0].geometry.location;

					cb();
				}	
			});

		},
			
		function(cb) { 

			city.marker =  new google.maps.Marker({
				position: city.geometry,
				map: map,
				icon: image_red,
			});	

			city.marker.addListener('click', function() {
				//open_city(city.airport);
			});

			cb();	
		},
			
		// function(cb) { 

		// 	var path = [	new google.maps.LatLng( info.main.lat, info.main.lng ), 
		// 					new google.maps.LatLng( city.lat, city.lng )
		// 				];

		// 	city.route = new google.maps.Polyline({
		// 			path: path, 
		// 			geodesic: true, 
		// 			map: map 
		// 		});				

		// 	cb();	
		// },
				
		function() { 

			if (city.webcams && city.webcams.length>0) {

				city.overlay = set_map_webcams(new google.maps.LatLng(city.lat, city.lng), city.webcams, city.ps);	

			}	

			callback();
		}
	]);
}

// ---------------------------------------------- 
function show_cities( callback ) {

	for (var j=0; j<info.cities.length; j++) {
		info.cities[j].ind = j;
	}

	async.eachSeries(info.cities, show_city, callback);
		
}

// ---------------------------------------------- 
function change_main_city() {

	$('#modalfade').show();
	$('#msgPopup').show();

	$('#msgTitle').html('<span class="title-city-text">Change Main City</span></span>');

	var bl = $('<div class="change-city-list"></div>');
	$('#msgBody').empty().append(bl);
	
	var inp = $('<div class="change-city-item"><input type="radio" checked id="city_"'+info.main.name+'"" name="main-city" value="'+info.main.name+'"><label for="city_"'+info.main.name+'">'+info.main.name+'</label></div>');
	bl.append(inp);

	for (var j=0; j<info.cities.length; j++) {

		inp = $('<div class="change-city-item"><input type="radio" id="city_"'+info.cities[j].name+' name="main-city" value="'+info.cities[j].name+'"><label for="city_"'+info.main.name+'">'+info.cities[j].name+'</label></div>');
		bl.append(inp);
	}

	bl.append( $('<div class="change-city-button"><button id="submit-button" class="submit-button">Submit</button></div>') );

	bl.find('#submit-button').bind('click', function(){

		set_main_city( bl.find('input:checked').val() );

	});

}  

// ---------------------------------------------- 
function set_main_city(val) {

	$('#modalfade').hide();
	$('#msgPopup').hide();

	info.main.marker.setMap(null);
	var j = 0;
	for (j=0; j<info.cities.length; j++) {
		info.cities[j].marker.setMap(null);
		info.cities[j].route.setMap(null);
	}	

	console.log('set_main_city', val);

	var m = info.main;

	for (j=0; j<info.cities.length; j++) {
		if (info.cities[j].name === val ) {
			info.main = info.cities[j];
			info.cities[j] = m;
		}
	}	

	console.log(info);

	build_map();

}	