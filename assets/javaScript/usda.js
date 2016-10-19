var apiKey = "zymuhIywKdNKGc1IbSzm3CeiXnj2GZ9PigrVcLBd";

// Searches USDA API for a list of relevant results to variable searchTerm limited to variable searchLimit
$('#usdaSearchForm').on('submit', function(){
	$('#usdaResults').empty();
	var searchTerm = $('#usdaTerm').val();
	var searchLimit = $('#usdaLimit').val();
	var apiURL = "https://api.nal.usda.gov/ndb/search/?format=json&q=" + searchTerm + "&sort=n&max=" + searchLimit + "&offset=0&api_key=" + apiKey;

	$.ajax({
		url: apiURL,
		method: 'GET'
	})
		.done(function(response){
			var searchList = response.list.item;
			for(var i = 0; i < searchList.length; i++){
				var searchResult = $('<div>');
				searchResult.addClass('searchResult');
				searchResult.attr('id', searchList[i].ndbno);
				searchResult.html(searchList[i].name);
				$('#usdaResults').append(searchResult);
				$(searchResult).on('click', CalSearch);
			}
		});

	return false;
});

// Searches USDA API for caloric value of a specific item generated from previous search
function CalSearch(){
	var div = $(this);
	var DBNum = $(this).attr('id');
	var apiURL = "https://api.nal.usda.gov/ndb/nutrients/?format=json&api_key=" + apiKey + "&nutrients=205&nutrients=204&nutrients=208&nutrients=269&ndbno=" + DBNum;

	$.ajax({
		url: apiURL,
		method: 'GET'
	})
		.done(function(response2){
			$(div).append('<p>Calories per ' + response2.report.foods[0].measure + ': ' + response2.report.foods[0].nutrients[3].value);
			$(div).unbind( "click" );
			$(div).on('click', function(){
				document.getElementById("calories").value = response2.report.foods[0].nutrients[3].value;
			})
		});
}