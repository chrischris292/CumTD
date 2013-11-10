$.ajax({
  dataType: "json",
  url: "https://www.cumtd.com/autocomplete/stops/v1.0/json/search?query=j",
  data: data,
  success: function()
  {
	  console.log(hi)
  }
});