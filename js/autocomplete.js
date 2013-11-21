
//dead

			  

var temp = [];
var data = "";

var markers = [];
var iterator = 0;
$(document).ready(function()
	{
	google.maps.event.addDomListener(window, 'load', initialize);

//Typeahead Support
	$('#busStop').typeahead([
	{
		name: 'results',
		valueKey: 'n',
		remote: 'http://www.cumtd.com/autocomplete/stops/v1.0/json/search?query=%QUERY',
		template: '<p><strong>{{n}}</strong></p>',
		engine: Hogan
	}
	]);
	$("#help").click(function()
	{
			introJs().start();
	})

});			

/*
PUT IN DOCUMENT.READY
var berlin = new google.maps.LatLng(52.520816, 13.410186); Starter 
 google.maps.event.addDomListener(window, 'load', initialize);
   drop(); Drops Markers
*/
var champaign = new google.maps.LatLng(40.106831, -88.227425);
var busStopMarkers = [
  new google.maps.LatLng(40.106831, -88.227425),
];

var markers = [];
var iterator = 0;
var map;

function initialize() {

  var mapOptions = {
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    center: champaign
  };
  map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);
  //drop();
  var theData = getAllStops(map);
  stops = theData.responseJSON.stops;
		       	for(i=0;i<stops.length;i++)
		       	{
		       	theStop = stops[i];
		       	console.log(theStop)
				var marker = new google.maps.Marker(
				{
					position: new google.maps.LatLng (theStop.stop_points[0].stop_lat, theStop.stop_points[0].stop_lon),
					map: map,
					title: 'penis everywhere',
				});
		        }
  var marker = new google.maps.Marker(
	{
		position: new google.maps.LatLng (40.106831, -88.227625),
		map: map,
		title: 'penis everywhere',
	});

}

//Functions
function drop() {
  for (var i = 0; i < busStopMarkers.length; i++) {
    setTimeout(function() {
		markers.push(new google.maps.Marker({
		position: busStopMarkers[iterator],
		map: map,
		draggable: false,
		title: "penis",
		content: "big dicks",
		animation: google.maps.Animation.DROP
	}));
	iterator++;
    }, i * 200);
  }
}


//REST OF CRAP

var temp = [];

function getAllStops(map){
c = "http://developer.cumtd.com/api/v2.2/json/GetStops?key=a6188b7a357a485b866197cab02c09f0"
	result = $.ajax({
	        url: c,
	        dataType: "json",
			data: data,
			async: false,
	        success: function(data) {
		       	return data;
	    	}
		  });
	return result;
}
	


