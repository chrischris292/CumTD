
//dead

			  

var temp = [];
var data = "";

var markers = [];
var iterator = 0;
$(document).ready(function()
{
 var champaign = new google.maps.LatLng(40.106831, -88.227425);
 google.maps.event.addDomListener(window, 'load', initialize);
 drop();
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
  new google.maps.LatLng(40.104831, -88.227425),
  new google.maps.LatLng(40.106331, -88.227425),
  new google.maps.LatLng(40.106831, -88.227425)
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
}

function drop() {
  for (var i = 0; i < busStopMarkers.length; i++) {
    setTimeout(function() {
		markers.push(new google.maps.Marker({
		position: busStopMarkers[iterator],
		map: map,
		draggable: false,
		title: "penis",
		animation: google.maps.Animation.DROP
	}));
	console.log(iterator)
	console.log('i' + i)
	iterator++;
    }, i * 200);
  }
}



//REST OF CRAP

var temp = [];

	function getStops(){
	c = "http://developer.cumtd.com/api/v2.2/json/GetStops?key=a6188b7a357a485b866197cab02c09f0"
		$.ajax({
	        url: c,
	        dataType: "json",
			data: data,
			async: true,
	        success: function(data) {
			return data;
	        }
		  });
	}
	function autoCompleteStopsHelperFunction(data)
	{
		for(i=0;i<data.length;i++)
		{
		temp[i] = data[i].n;
		}

	}

	function autoCompleteStops()
	{
		$("#busStop").keyup(function()
		{
			var value = $("#busStop").val();
			console.log(value)
			var c = "http://www.cumtd.com/autocomplete/stops/v1.0/json/search?query=" + value
		     $.ajax
		     ({
			     url: c,
			     dataType: "json",
				 data: data,
				 async: true,
			     success: function(data) {
			     autoCompleteStopsHelperFunction(data);
			     }
			 });
		 });
	}
