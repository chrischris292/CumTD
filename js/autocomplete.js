
//dead

			  

var data = 0;
var temp = [];
$(document).ready(function()
{
	
	var typeAheadSource  = $('#busStop').typeahead({                                   
  						name: 'arabic',
  						remote: temp                                                                     
			     });
			    $("#busStop").keyup(function()
				{
					var value = $("#busStop").val();
					console.log(value)
						var c = "http://www.cumtd.com/autocomplete/stops/v1.0/json/search?query=" + value
	  			                 $.ajax({
	  			                     url: c,
	  			                     dataType: "json",
									 data: data,
									 async: true,
	  			                     success: function(data) {
	  			                     	console.log(data.length)
	  			                     	for(i=0;i<data.length;i++)
	  			                     		{
	  			                     		temp[i] = data[i].n;
	  			                 	 		}
	  			                     	}
	  			                	 });
				 });
	
			    
 });
