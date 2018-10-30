/*!
 * main.js
 * File containing main building functions.
 * All secondary functions were moved to utils.js
 * Overlay constructiing functions stored in Overlay.js  
 * 
 */
// Initializing variables
// // Load the binding

var info = null;
var country = null;
var center = {};
var options = {};

var elemOverlays = [];

var map, geocoder, container;
var image_red, image_green;

// Seting up Map
google.maps.event.addDomListener(window, 'load', init_maps);

geocoder = new google.maps.Geocoder();		

$(document).ready(function(){

	var path = window.location.pathname;

	$('#popup_close').on('click', function(){
		$('#modalfade').hide();
		$('#msgPopup').hide();
	});

});

// ---------------------------------------------- 
// Opens webcam player with WebCam API
// ----------------------------------------------
function open_webcam(id, title) {

	$('#modalfade').show();
	$('#msgPopup').show();

	$('#msgBody').empty().append($('<div class="loading icon-loading"></div>'));
	$('#msgTitle').html('<span class="title-city-text">'+title+'</span></span>');

	var url = '/api/webcams/id/'+id+'/';
	$.getJSON(url, function(rez){
				if (rez.status == 'Error') {
					$('#modalfade').hide();
					$('#msgPopup').hide();
					return;
				}

				var webcams = rez.info.webcams;

				if (webcams && webcams.length>0) {
					var url = webcams[0].player.month.embed;
					$('#msgBody').empty();
					var h = '<iframe src="'+url+'" style="width: 100%; height: 100%"></iframe>';
					$('#msgBody').append($(h));
				}		 		  
	});
}	

// ---------------------------------------------- 
// Initialises map with red and green circle markers
// Perform async series to build all elements on map. 
//    Main caller.
// ----------------------------------------------

function init_maps() {

	if (config) {
		info = JSON.parse(DeCode(config));
	}
	console.log(info);

	image_red = {
		url: '/img/circle_red_20x20.png',
		size:   new google.maps.Size(20, 20),     	
		origin: new google.maps.Point(0, 0),    	
		anchor: new google.maps.Point(10, 10)		
	};
	image_green = {
		url: '/img/circle_green_24x24.png',
		size:   new google.maps.Size(24, 24),     	
		origin: new google.maps.Point(0, 0),    	
		anchor: new google.maps.Point(12, 12)		
	};
	container = document.getElementById('map');		

	async.series([
		// 
		function(callback) {
			geocoder.geocode( { 'address': info.main.lastSearchName}, function(results, status) {		

				if (status == google.maps.GeocoderStatus.OK) {

					var adrs =  results[0].address_components;
					for (var i=0; i<adrs.length; i++) {

						if (i==0) {
							info.main.name = adrs[i].long_name;
						}

						if (adrs[i].types.indexOf('country') != -1) {
							country = adrs[i].long_name;
							break;	
						}
					}

					info.main.lat = results[0].geometry.location.lat();
					info.main.lng = results[0].geometry.location.lng();
					info.main.geometry = results[0].geometry.location;

					console.log(info.main);
					if (country) {						
						callback();
					}	
				}	
			});
		},
		// Setting center of Map uin Australia
		function(callback) { 
		
			geocoder.geocode( { 'address': country}, function(results, status) {		
				console.log(results, status);				
				
				if (status == google.maps.GeocoderStatus.OK) {
					// Set to QUeensland
					center.lat = -23.458819,25;
					center.lng = 150.103615,115;					
					callback();
				}
			});			
		
		},
		// Build city markers with coords
		function(callback) { 

			console.log(center);
		
			options = {
				zoom: 6,	
				center: center,	
				//mapTypeId: google.maps.MapTypeId.TERRAIN		
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};    
			
			map = new google.maps.Map(container, options);

			google.maps.event.addListener(map, 'click', function(event) {
			
				console.log('maps click', event);

				var latitude = event.latLng.lat();
				var longitude = event.latLng.lng();

				for (var i=0; i<elemOverlays.length; i++) {

					var lat1 = elemOverlays[i].coord1.lat();
					var lng1 = elemOverlays[i].coord1.lng();
					var lat2 = elemOverlays[i].coord2.lat();
					var lng2 = elemOverlays[i].coord2.lng();

					var lat_min = Math.min(lat1, lat2);
					var lat_max = Math.max(lat1, lat2);
					var lng_min = Math.min(lng1, lng2);
					var lng_max = Math.max(lng1, lng2);

					//console.log(lat1, latitude, lat2, lng1, longitude, lng2, elemOverlays[i].webcamId);
					//console.log(lat_min, latitude, lat_max, lng_min, longitude, lng_max, elemOverlays[i].webcamId);

					// if (latitude > lat_min && latitude < lat_max && longitude > lng_min && longitude < lng_max) {
					// 	open_webcam(elemOverlays[i].webcamId, elemOverlays[i].webcamTitle);
					// }

				}

			});
			
			setTimeout( function() {
				callback();
			}, 500);	
		},		
		// Create a load
		// Receiving information from server.		
		//function(callback) { 
		//	console.log('Getting detection: ' + info.main.detection);
		//		
		//},
		// Calls Building Map		
		function(callback) { 
	
			build_map(callback);		

		},		
		//        === Мы вначале все нарисуем, а потом запросим информацию о вебкамерах - иначе будет timeout з-за долгого ожидания
		function(callback) { 
			
			load_webcams( callback );
				
		}
	
	]);
}	



// ---------------------------------------------- 
// Perform map building with series of async requests
//    Marker/ City/ Webcam
// ----------------------------------------------
function build_map( callback ) {
	async.series([
		function(cb) { 
			info.main.marker =  new google.maps.Marker({
				position: info.main.geometry,
				map: map,
				icon: image_red,
			});	

			cb();  
		},
		function(cb) {
			show_cities( function(){
				cb();
			});

		},
		function(cb) { 
			
			callback();  
		}	
	]);

}	

// ---------------------------------------------- 
// Placing webcam windows around marker.
//    top / bottom/ left / right
// ----------------------------------------------
function set_map_webcams(coordinates, webcams, ps) {

	console.log('set_map_webcams', coordinates, webcams, ps);

	if (webcams && webcams.length>0) {
	
		var point1 = latLng2Point(coordinates, map);
		
		if (ps == 'right') {
			point1.x = point1.x+15;
		}
		else if (ps == 'left') {
			point1.x = point1.x-80;
		}
		else if (ps == 'bottom') {
			point1.y = point1.y+15;
		}
		else if (ps == 'top') {
			point1.y = point1.y-62;
		}

		var coord1 = point2LatLng(point1, map);
		
		point1.x = point1.x+64;
		point1.y = point1.y+48;

		var coord2 = point2LatLng(point1, map);

		var bounds = new google.maps.LatLngBounds( coord1, coord2 );

		var srcImage = webcams[0].image.current.thumbnail;

		var overlay = new USGSOverlay(bounds, srcImage, map);

		elemOverlays.push({
							webcamId: webcams[0].id,
							webcamTitle: webcams[0].title,
							webcamLocation: webcams[0].location,
							coord1: coord1,
							coord2: coord2
						});

		return overlay;
	} else  {
		return null;
	}	
}	

function load_webcams( callback ) {
	console.log('load_webcams');
	var url = '/api/detect/';
	$.getJSON(url, function(rez){
				if (rez.status == 'Ok') {
					var webcams = rez.webcams;
					for (var i=0; i<webcams.length; i++) {
						var g = new google.maps.LatLng(webcams[i].geometry[1], 
								webcams[i].geometry[0]);
						set_map_count(g, webcams[i].count);	
					}
				}
		console.log(rez);
	});
	callback();
}

// ---------------------
function set_map_count(coordinates, count) {
	//console.log('set_map_count', coordinates, count);
	var point1 = latLng2Point(coordinates, map);		
	point1.x = point1.x+15;
	var coord1 = point2LatLng(point1, map);

	point1.x = point1.x+30;
	point1.y = point1.y+20;

	var coord2 = point2LatLng(point1, map);
	var bounds = new google.maps.LatLngBounds( coord1, coord2 );

	var text = null;
	if ( count ) {
		if (count == -1) {
			text = '?';
		}
		else {
			text = count.toString();
		}
	}
	var overlay = new USGSOverlay(bounds, null, map, text);
}	
