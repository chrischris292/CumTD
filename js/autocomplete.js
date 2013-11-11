


			  $("#busStop").keyup(function () {
			      var value = $(this).val();
			      var c = "http://www.cumtd.com/autocomplete/stops/v1.0/json/search?query=f" + value
			                 $.ajax({
			                     url: c,
			                     dataType: "jsonp",
			                     success: function(f) {
			      				   console.log(f)
			                     }
			                 })
			    }).keyup();
			  