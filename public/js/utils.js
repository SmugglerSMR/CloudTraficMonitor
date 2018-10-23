//   Standard formating functions
// ----------------------------------------------
function _time(d) {
	var h = d.getHours();
	var m = d.getMinutes();
	return (h<10 ? '0'+h.toString() : h.toString()) + ':' + (m<10 ? '0'+m.toString() : m.toString());
}	
// ----------------------------------------------
function _duration(d) {
	var h = parseInt(d / 60);
	var m = d % 60;
	return (h>0 ? h.toString()+'h' : '') + (m>0 ? m.toString()+'m' : '');
}	
// ----------------------------------------------
function _airlines(fs, airlines) {
	for (var j=0; j<airlines.length; j++) {
		if (airlines[j].fs == fs) return airlines[j].name;
	}
	return fs;
}	
// ----------------------------------------------
function _equipments(iata, equipments) {
	for (var j=0; j<equipments.length; j++) {
		if (equipments[j].iata == iata) return equipments[j].name;
	}
	return iata;
}	
// ----------------------------------------------
function  DeCode( date ){
    return unescape(date);
}


//   Drawing functions / manipulate with coords
// ----------------------------------------------
function pixelOffsetToLatLng(offsetx,offsety) {
	var latlng = map.getCenter();
	var scale = Math.pow(2, map.getZoom());
	var nw = new google.maps.LatLng(
		map.getBounds().getNorthEast().lat(),
		map.getBounds().getSouthWest().lng()
	);
  
	var worldCoordinateCenter = map.getProjection().fromLatLngToPoint(latlng);
	var pixelOffset = new google.maps.Point((offsetx/scale) || 0,(offsety/scale) ||0);
  
	var worldCoordinateNewCenter = new google.maps.Point(
		worldCoordinateCenter.x - pixelOffset.x,
		worldCoordinateCenter.y + pixelOffset.y
	);
  
	var latLngPosition = map.getProjection().fromPointToLatLng(worldCoordinateNewCenter);
  
	return latLngPosition;
}
// ---------------------------------------------- 
function latLng2Point(latLng, map) {
	var topRight = map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast());
	var bottomLeft = map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest());
	var scale = Math.pow(2, map.getZoom());
	var worldPoint = map.getProjection().fromLatLngToPoint(latLng);
	return new google.maps.Point((worldPoint.x - bottomLeft.x) * scale, (worldPoint.y - topRight.y) * scale);
}  
// ---------------------------------------------- 
function point2LatLng(point, map) {
	var topRight = map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast());
	var bottomLeft = map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest());
	var scale = Math.pow(2, map.getZoom());
	var worldPoint = new google.maps.Point(point.x / scale + bottomLeft.x, point.y / scale + topRight.y);
	return map.getProjection().fromPointToLatLng(worldPoint);
}      


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

			// if (city.webcams && city.webcams.length>0) {

			// 	city.overlay = set_map_webcams(new google.maps.LatLng(city.lat, city.lng), city.webcams, city.ps);	

			// }	

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