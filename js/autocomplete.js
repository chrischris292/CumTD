//dead
//http://developer.cumtd.com/api/v2.2/json/GetDeparturesByStop?stop_ID=1STARY&key=a6188b7a357a485b866197cab02c09f0
var temp = [];
var data = "";
var markers = [];
var iterator = 0;
var html;
var stopHistory = [];
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
	$('#originStop').typeahead([
	{
		name: 'results',
		valueKey: 'n',
		remote: 'http://www.cumtd.com/autocomplete/stops/v1.0/json/search?query=%QUERY',
		template: '<p><strong>{{n}}</strong></p>',
		engine: Hogan
	}
	]);
	$('#destinationStop').typeahead([
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
getCurrentDate();
htmlRunner()
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
	        console.log(result)
			if(result.status.code!=500)
			{
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
				position: new google.maps.LatLng(result.stops[0].stop_points[0].stop_lat, result.stops[0].stop_points[0].stop_lon),
				map: map,
				animation: google.maps.Animation.DROP,
				title: result.stops[0].stop_points[0].stop_name,
				});
				getDeparturesByStop(result.stops[0].stop_id, marker, result.stops[0].stop_points[0].stop_name);
				stopHistory.push(result.stops[0].stop_id)
				}
				else
					toastr.warning("WTF")
			}
			else{
				toastr.error(result.status.msg)
			}
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
function getPlannedTripsByStops(origin_stop_ID,destination_stop_id,marker,date,time)
{
//If direction = true, North, else = South.
	var getStopLink = "http://developer.cumtd.com/api/v2.2/json/getPlannedTripsByStops?origin_stop_id="+origin_stop_ID+"&destination_stop_id="+ destination_stop_id+ "&date=" + date + "&time="  + time + "&key=a6188b7a357a485b866197cab02c09f0";
	 $.ajax({
	        url: getStopLink,
	        dataType: "jsonp",
			data: data,
			async: true,
	        success: function(data) {
	        	result = data;
	        	if(result.status.msg=="ok"&&result.itineraries[0].legs[0].type!="Walk")
	        	{
	        		console.log(result);
	        		for(i=0;i<result.itineraries[0].legs.length;i++)
	        		{
	        		for(x=0;x<result.itineraries[0].legs[i].services.length;x++)
	        		{
	        		var shapeID = result.itineraries[0].legs[i].services[x].trip.shape_id;
	        		var beginStopID = result.itineraries[0].legs[i].services[x].begin.stop_id;
	        		var EndStopID = result.itineraries[0].legs[i].services[x].end.stop_id;
	        		getShapesBetweenStops(beginStopID,EndStopID,shapeID);
	        		}
	        		}
	        	}
	        	else if(result.itineraries[0].legs[0].type=="Walk")
	        	{
	        		toastr.success("CUMTD API told me to tell you you need to walk. Have Fun")
	        	}
	        	else toastr.error(result.status.msg)
			}
			});	
	 //Function lies within function because to draw on map requires seperate AJAX call. 
	 function getShapesBetweenStops(origin_stop_ID,destination_stop_id,trip_shape_id)
	 {
	 	var lineLocations = [];
	 	var getStopLink = "http://developer.cumtd.com/api/v2.2/json/GetShapeBetweenStops?begin_stop_id="+origin_stop_ID+"&end_stop_id="+ destination_stop_id+ "&shape_id=" + trip_shape_id + "&key=a6188b7a357a485b866197cab02c09f0";
	 	 $.ajax({
	        url: getStopLink,
	        dataType: "jsonp",
			data: data,
			async: true,
			success: function(data){
				console.log("SUCCESS BITCH");
				for(i=0;i<data.shapes.length;i++)
				{
					var location = new google.maps.LatLng(data.shapes[i].shape_pt_lat,data.shapes[i].shape_pt_lon)
					lineLocations.push(location)
					var drawDaLineBaby = new google.maps.Polyline({
					path: lineLocations,
					geodesic: true,
					strokeColor: '#FF0000',
					strokeOpacity: 1.0,
					strokeWeight: 2
					});
					drawDaLineBaby.setMap(map);
				}
			}
	 });
	 }
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
    if(typeof data.vehicles=="undefined"){
    	        toastr.error("CUMTD API Can Not Find Bus","Error")
    }
    else{
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
    		}
    	});
  	},30000);
        }
         
	}
});
	 
}
//THIS FUNCTION GETS TOO MUCH DATA MAKES MAPS SLOW. 
//THIS FUNCTION HAS BEEN REPLACED BY GET DEPARTURES BY STOP FOR SPEED.
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

//HTML Helper Functions
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

function getCurrentDate(){
	var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!

var yyyy = today.getFullYear();
if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} today = mm+'/'+dd+'/'+yyyy;
$("#date").val(today);
}
function htmlRunner(){
		$('.dropdown-menu').bind('click', function (e) { e.stopPropagation() }) //Makes Dropdown Not Go Away When Clicked

	$("#closeDropDown").click(function(){
		$('.dropdown-toggle').dropdown('toggle')
	})
	$('#date').datepicker();
	$('#time').timepicker();
	$("#submitDropDown").click(function(){
		$('.dropdown-toggle').dropdown('toggle')
		getStop($("#originStop").val());
		getStop($("#destinationStop").val());
		setTimeout(function(){
				originStopId = stopHistory[stopHistory.length-2];
				DestinationStopId = stopHistory[stopHistory.length-1];
				getPlannedTripsByStops(originStopId,DestinationStopId,1,"12/6/2013","13:53")
		},1200)

	})
	//Starts Get Stop When Enter is pressed
	$('#busStop').keypress(function(event) {
        if (event.keyCode == 13) {
            getStop(this.value);
        }
    });
}
