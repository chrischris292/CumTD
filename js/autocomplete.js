
//dead
//http://developer.cumtd.com/api/v2.2/json/GetDeparturesByStop?stop_ID=1STARY&key=a6188b7a357a485b866197cab02c09f0
			  

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
    var theData = getAllStops(map);
	console.log(theData)
  //drop();
  /* Puts all stops down.
  var theData = getAllStops(map);
  stops = theData.responseJSON.stops;
		       	for(i=0;i<stops.length;i++)
		       	{
		       	theStop = stops[i];
				var marker = new google.maps.Marker(
				{
					position: new google.maps.LatLng (theStop.stop_points[0].stop_lat, theStop.stop_points[0].stop_lon),
					map: map,
					animation: google.maps.Animation.DROP,
					title: 'test',
				});
		        }
		        */
	$('#busStop').keypress(function(event) {
        if (event.keyCode == 13) {
        	console.log(this.value);
            getStopData(this.val());
        }
    });
}

//Functions
function getAllStops(map){
c = "http://developer.cumtd.com/api/v2.2/json/GetStops?key=a6188b7a357a485b866197cab02c09f0"
	result = $.ajax({
	        url: c,
	        dataType: "json",
			data: data,
			async: true,
	        success: function(data) {
		       	return data;
		       	console.log(data)

	    	}
		  });
	return result;
}

function getStopData(){
		var marker = new google.maps.Marker(
				{
					position: new google.maps.LatLng (40.106831, -88.227425),
					map: map,
					animation: google.maps.Animation.DROP,
					title: 'test',
				});
}


