
$(document).ready(function()
{
	c = "http://developer.cumtd.com/api/v2.2/json/GetStops?key=a6188b7a357a485b866197cab02c09f0"
	function getStops(){
		$.ajax({
	        url: c,
	        dataType: "json",
			data: data,
			async: true,
	        success: function(data) {
	        	console.log(data) 
	        	console.log('dsfds')  	
	        }
		  });
	}
	getStops()
});