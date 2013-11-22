
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

function getStop(stop){
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
	 console.log(result)
	if(result.stops.length==2)
	{
		toastr.options.timeOut = 300000; //Makes notification stay for 30 seconds. 
		toastr.warning("Multiple stops found<br />Please choose between the following stops: <br /> <button type='button' id='stop0' class='btn btn-primary'>"+result.stops[0].stops_points[0].stop_name + "</button><button type='button' id='stop1' class='btn btn-primary'>" + result.stops[1].stops_points[0].stop_name + "</button>");
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
		toastr.options.timeOut = 300000;
		toastr.info("Please choose between the following options <button type='button' id='north' class='btn btn-success'>North</button><button type='button' id='south' class='btn btn-success'>South</button>");
		//If Response = North
		$("#north").click(function(){
			getStopData(result.stops[0].stop_id, true, marker, result.stops[0].stop_points[0].stop_name);
		})
	}
	return result;	
}

function getStopData(stop_ID, direction, marker,stopName){
	//If direction = true, North, else = South.
	var getStopLink = "http://developer.cumtd.com/api/v2.2/json/getStoptimesbystop?stop_id="+stop_ID+"&key=a6188b7a357a485b866197cab02c09f0";
	 $.ajax({
	        url: getStopLink,
	        dataType: "json",
			data: data,
			async: false,
	        success: function(data) {
	        	result = data;
	    	}
		  });
	 console.log(result)
	 for(i=0; i<10; i++) //Displays the first ten bus departure times. 
	 {	 
	 	arrivalTime = result.stop_times[i].arrival_time;
	 	contentString = "<center>"+stopName+"</center><div><table class='table'> <thead> <tr> <th>Bus</th> <th>Departure Time</th> <th>Arrival Time</th> <th>Direction</th> </tr> </thead> <tbody> <tr> <td>001</td> <td>Rammohan </td> <td>Reddy</td> <td>A+</td> </tr> <tr> <td>002</td> <td>Smita</td> <td>Pallod</td> <td>A</td> </tr> <tr> <td>003</td> <td>Rabindranath</td> <td>Sen</td> <td>A+</td> </tr> </tbody> </table>";
	 	departureTime = result.stop_times[i].departure_time;
	}
	addInfoWindow(marker,contentString)

}
//Google Map helper functions


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
	$('#busStop').keypress(function(event) {
        if (event.keyCode == 13) {
            getStop(this.value);
        }
    });
}
function addInfoWindow(marker, message) {
            var info = message;

            var infoWindow = new google.maps.InfoWindow({
                content: message
            });

            google.maps.event.addListener(marker, 'click', function () {
                infoWindow.open(map, marker);
            });
        }
