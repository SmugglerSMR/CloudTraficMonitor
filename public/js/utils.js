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


