
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
   // var theData = getAllStops(map);
	//console.log(theData)
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
            getStopData(this.value);
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
	    	}
		  });
	return result;
}

function getStopData(stop){
	var result;
c = "http://developer.cumtd.com/api/v2.2/json/GetStopsbysearch?query="+stop+"&key=a6188b7a357a485b866197cab02c09f0"
	 $.ajax({
	        url: c,
	        dataType: "json",
			data: data,
			async: false,
	        success: function(data) {
	        	result = data;
	    	}
		  });
	if(result.stops.length==2)
	{
		toastr.options.timeOut = 300000; //Makes notification stay for 30 seconds. 
		toastr.warning("Multiple stops found<br />Please choose between the following stops: <br /> <button type='button' id='0' class='btn btn-primary'>"+result.stops[0].stops_points[0].stop_name + "</button><button type='button' id='1' class='btn btn-primary'>" + result.stops[1].stops_points[0].stop_name + "</button>");
	}
	if(result.stops.length>2)
	{
		toastr.options.timeOut = 300000; //Makes notification stay for 30 seconds. 
		toastr.error("ERROR",  "Too many stops found. Please provide further details.")
	}
	else if(result.stops.length==1)
	{
		console.log(result.stops[0].stop_points[0].stop_lat)
		var marker = new google.maps.Marker(
				{
					position: new google.maps.LatLng (result.stops[0].stop_points[0].stop_lat, result.stops[0].stop_points[0].stop_lon),
					map: map,
					animation: google.maps.Animation.DROP,
					title: result.stops[0].stop_points[0].stop_name,
				});
	}
	return result;	
}


