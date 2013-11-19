
//dead

			  

var temp = [];
var data = "";

var markers = [];
var iterator = 0;
$(document).ready(function()
{
$("#help").click(function(){introJs().start();})
 var champaign = new google.maps.LatLng(40.106831, -88.227425);
 google.maps.event.addDomListener(window, 'load', initialize);
 drop();
 $('#busStop').typeahead([
  {
    name: 'results',
    valueKey: 'n',
    remote: 'http://www.cumtd.com/autocomplete/stops/v1.0/json/search?query=%QUERY',
    template: '<p><strong>{{n}}</strong></p>',
    engine: Hogan
  }
]);

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
	iterator++;
    }, i * 200);
  }
}


//REST OF CRAP

var temp = [];

	function getAllStops(){
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


function createMarker (vehicle, map) {
  var marker = new RichMarker({
      position: new google.maps.LatLng(vehicle.lat, vehicle.lon),
      map: map,
      title: vehicle.trip.shape_id,
      content: '<span id="routeIcon" style="background-color: #' + vehicle.route[0].route_color + '; color: #' + vehicle.route[0].route_text_color + '; border-color: #' + vehicle.route[0].route_color + ';"' +  '>' + vehicle.route[0].route_short_name  + vehicle.trip.direction + '</span>'
  });

  var contentString = '<h1>' + vehicle.trip.route_id + " - " + vehicle.trip.direction + '</h1>';

  google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(map,marker);
      infowindow.setContent(contentString)
  });


  infowindow = new google.maps.InfoWindow({
    content: contentString
  });
  
  return marker;
}


	
