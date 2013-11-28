
//dead
//http://developer.cumtd.com/api/v2.2/json/GetDeparturesByStop?stop_ID=1STARY&key=a6188b7a357a485b866197cab02c09f0
			  

var temp = [];
var data = "";

var markers = [];
var iterator = 0;
var html;
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
// Global functions to show/hide on ajax requests
parseLogIn();
parseSignOut();
passwordValidation();
})
//Functions
function getAllStops(map){
c = "http://developer.cumtd.com/api/v2.2/json/GetStops?key=a6188b7a357a485b866197cab02c09f0"
	result = $.ajax({
	        url: c,
	        dataType: "jsonp",
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
	        dataType: "jsonp",
			data: data,
			async: true,
	        success: function(data) {
	        	result = data;
	if(result.stops.length==2)
	{
		toastr.warning("Multiple stops found<br />Please choose between the following stops: <br /> <button type='button' id='stop0' class='btn btn-primary'>"+result.stops[0].stops_points[0].stop_name + "</button><button type='button' id='stop1' class='btn btn-primary'>" + result.stops[1].stops_points[0].stop_name + "</button>");
	}
	if(result.stops.length>2)
	{
		toastr.error("Too many stops found. Please provide further details.","ERROR")
	}
	else if(result.stops.length==1)
	{
		var marker = new google.maps.Marker(
				{
					position: new google.maps.LatLng (result.stops[0].stop_points[0].stop_lat, result.stops[0].stop_points[0].stop_lon),
					map: map,
					animation: google.maps.Animation.DROP,
					title: result.stops[0].stop_points[0].stop_name,
				});
			getDeparturesByStop(result.stops[0].stop_id, marker, result.stops[0].stop_points[0].stop_name);
	}
	return result;	
	    	}
		  });
	
}
function getDeparturesByStop(stop_ID,marker,stopName)
{
//If direction = true, North, else = South.
	var rowData = "";
	var getStopLink = "http://developer.cumtd.com/api/v2.2/json/getDeparturesByStop?stop_id="+stop_ID+"&key=a6188b7a357a485b866197cab02c09f0";
	 $.ajax({
	        url: getStopLink,
	        dataType: "jsonp",
			data: data,
			async: true,
	        success: function(data) {
	        	result = data;
	        	console.log(result)
	        	contentString = "<center><bold>"+stopName+"<bold></center><div><table class='table'> <thead> <tr> <th>Bus</th> <th>Arrival Time</th> <th>Direction</th> </tr> </thead> <tbody> ";
	        	if(result.departures.length>0)
	        	{
					{
					for(i=0; i<result.departures.length; i++) //Displays the first ten bus departure times. 
						{	
							arrivalTime = result.departures[i].expected_mins + " minutes";
							//requires form <tr> <td> crap</td></tr> for each row.
							routeID = result.departures[i].headsign;
							name = result.departures[i].route.route_id;
							vehicle_id=result.departures[i].vehicle_id;
							rowData = rowData + "<tr><td><a href = '#' onclick = getVehicle(" + vehicle_id + ")>" + name + "</a></td><td>" + arrivalTime + "</td><td>" + name + "</td></tr>";
						}
					contentString = contentString + rowData + "</tbody> </table>";
					addInfoWindow(marker,contentString)
					}
				}
				else if(result.departures.length==0)
				{
					contentString = contentString +  "<tr><td>No Stops Found.</td></tr>";
					addInfoWindow(marker,contentString);
				}
			}
			});	
	
}
function getVehicle(vehicle_id)
{
	counter = 0;
	var getStopLink = "http://developer.cumtd.com/api/v2.2/json/getVehicle?vehicle_id="+vehicle_id+"&key=a6188b7a357a485b866197cab02c09f0";
	$.ajax({
		url: getStopLink,
        dataType: "jsonp",
		data: data,
		async: true,
		error: function(){
			toastr.error( "CUMTD API Can Not Find Bus","Error"); //jsonp does not allow this error to occur
		},
        success: function(data) {
        console.log(data)
    if(typeof data.vehicles=="undefined"){
    	        toastr.error("CUMTD API Can Not Find Bus","Error")
    }
    else{
	console.log(data)
	result = data;
		var marker = new google.maps.Marker(
		{
			position: new google.maps.LatLng (result.vehicles[0].location.lat, result.vehicles[0].location.lon),
			map: map,
			animation: google.maps.Animation.BOUNCE,
			title: result.vehicles[0].trip.route_id,
		});
		contentString=result.vehicles[0].trip.route_id + "<br />"
		addInfoWindow(marker,contentString);
	
	setInterval(function() 
	{
		counter ++;
			$.ajax({
			url: getStopLink,
		    dataType: "jsonp",
			data: data,
			async: true,
		    success: function(data) {
		    result = data;
   			position = new google.maps.LatLng(result.vehicles[0].location.lat, result.vehicles[0].location.lon);
    		marker.setPosition(position);
			console.log(position)
    		console.log("updating");
    		}
    	});
  	},30000);
        }
         
	}
});
	 
}
//THIS FUNCTION GETS TOO MUCH DATA MAKES MAPS SLOW.
function getStopData(stop_ID, marker,stopName){
	//If direction = true, North, else = South.
	var rowData = "";
	var getStopLink = "http://developer.cumtd.com/api/v2.2/json/getStoptimesbystop?stop_id="+stop_ID+"&key=a6188b7a357a485b866197cab02c09f0";
	 $.ajax({
	        url: getStopLink,
	        dataType: "jsonp",
			data: data,
			async: true,
	        success: function(data) {
	        	result = data;
	        	 contentString = "<center><bold>"+stopName+"<bold></center><div><table class='table'> <thead> <tr> <th>Bus</th> <th>Arrival Time</th> <th>Departure Time</th> <th>Direction</th> </tr> </thead> <tbody> ";
	 for(i=0; i<10; i++) //Displays the first ten bus departure times. 
	 {	
	 	arrivalTime = result.stop_times[i].arrival_time;
	 	//requires form <tr> <td> crap</td></tr> for each row.
	 	departureTime = result.stop_times[i].departure_time;
	 	routeID = result.stop_times[i].trip.route_id + result.stop_times[i].trip.trip_headsign;
	 	direction = result.stop_times[i].trip.direction;
	 	rowData = rowData + "<tr><td>"+routeID+"</td><td>" + arrivalTime + "</td><td>" + departureTime + "</td><td>" + direction + "</td></tr>";
	}
	contentString = contentString + rowData + "</tbody> </table>";
	addInfoWindow(marker,contentString)
	    	}
		  });	
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

//Function Parse
function parseLogIn()
{
$("#logIn").click(function(){
	Parse.initialize("FnzgxncEoaVmkZV56MfgSVZQJJhvrh6JEDTaGx90", "EjbLnBd8aK42IGcSk9idUyNhEdy3RYC0jrAOKxFj");
	var SignIn = Parse.Object.extend("SignInAttempt");
	var signin = new SignIn();
	signin.save({userName: $("#inputEmail").val(), password:$("#inputPassword").val()}, {
  	success: function() {
  	$('#myModal').modal('hide');
    toastr.success("Logged In");
    html = $("#loginlink").clone();
    $('#login').html("<a href= '#' id = 'signoutlink'><i class= 'fa fa-sign-out'></i> Sign Out</a>");
    parseSignOut();
    },
    error: function(error) {
    	toastr.error("Log In Failed Please Retry")
    }
	});
	})
}
function parseSignOut(){
	$('#signoutlink').click(function(){
			$('#login').html(html)
			toastr.success("Signed Out");
	})
}
function parseRegister(){
	Parse.initialize("FnzgxncEoaVmkZV56MfgSVZQJJhvrh6JEDTaGx90", "EjbLnBd8aK42IGcSk9idUyNhEdy3RYC0jrAOKxFj");
	var Register = Parse.Object.extend("Register");
	var register = new Register();
	register.save({userName: $("#registerUser").val(), password:$("#verifyRegisterPassword").val()}, {
	success: function(){
		toastr.success("Successfully Registered", "Welcome " + $('#registerUser').val())
	},
	error: function(error){
		toastr.error("Account Already Exists. Please Retry.");
	}
});

}

//Password Validation Functions
function passwordValidation(){
	counter=0;
	$('#registerIn').click(function(){
		if($('#verifyRegisterPassword').val()==$('#registerPassword').val()&& $('#registerUser').val()!=""){
			parseRegister();
			$('#registration').modal('hide');
			$('#verifyRegisterPassword').val("")
			$('#registerPassword').val("")
			setTimeout(function(){$('#registerUser').val("")},3000);

		}
		else{
			if($('#registerUser').val()==""&&counter==0){
					toastr.error("Username Does Not Exist")
					}
					if($('#verifyRegisterPassword').val()==$('#registerPassword').val())
					{
					toastr.success("Passwords Match")
					$('#registerIn').prop('disabled', false);
					}
					else
					{
					toastr.error("Passwords Do Not Match")
					$('#registerIn').prop('disabled', true);
					}
					counter++;
					$('#verifyRegisterPassword').keyup(function(){
					if($('#registerUser').val()==""){
					toastr.error("Username Does Not Exist")
					}
					if($('#verifyRegisterPassword').val()==$('#registerPassword').val())
					{
					toastr.success("Passwords Match")
					$('#registerIn').prop('disabled', false);
					}
				})
		}

	})

		

	
}
