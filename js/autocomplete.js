
//dead
/*
			  

var data = 0;
$(document).ready(function()
{
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
	  			      				   console.log(data)
	  			                     }
								 });
					
	  			      
					
			     });
			 });
*/
    
$('input.twitter-search').typeahead([
  {
    name: 'accounts',
    prefetch: 'https://twitter.com/network.json',
    remote: "http://www.cumtd.com/autocomplete/stops/v1.0/json/search?query="
  },
  ]);
