var apiKey = "d596dcda0001626291d86d131535b576";
var apiUrl = "https://api.openweathermap.org/data/2.5/weather?lat=35&lon=139&appid=" + apiKey;


var getUrlData = function() {

    fetch(apiUrl).then(function(response){
        response.json().then(function(data) {
            console.log(data);
        });
    });
};

// api call to convert city to coordinates http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
getUrlData();