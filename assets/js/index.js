var apiKey = "758d6634aa9f49adb412c47ed584b5ac";
var currentCityContainer = document.querySelector("#current-city")
var form = document.querySelector("#form-control");
var searchCity = document.querySelector("#search-city");
var globalLat = ""
var globalLon = ""
var apiUrl = "";
var uvUrl = "";
var forecastUrl = "";

var getCord = function (searchParam) {
    // utilizing this function to use the eventual "searchInput" to get coordinates based off of search
    var geocoding = "http://api.openweathermap.org/geo/1.0/direct?q=" + searchParam + "&limit=5&appid=" + apiKey;

    var coordinates = fetch(geocoding).then(function (response) {
        if (response.ok) {
            var coordinates = response.json().then(function (data) {
                var lat = data[0].lat;
                var lon = data[0].lon;

                var cordArr = {
                    lattitude: lat,
                    longitude: lon
                }
                return (cordArr);
            })
        }
        return (coordinates);
    });
    return (coordinates);
};
// var coordinates = getCord("vancouver").then(function(data){
//     return(data);
// })

var formSubmit = function (event) {
    event.preventDefault();
    searchInput = searchCity.value.trim();
    getCord(searchInput).then(function (data) {
        console.log(data.lattitude);
        globalLat = data.lattitude;
        globalLon = data.longitude;
        apiUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + globalLat + "&lon=" + globalLon + "&appid=" + apiKey + "&units=imperial";
        displayCurrentWeather();
        uvUrl = "http://api.openweathermap.org/data/2.5/air_pollution?lat=" + globalLat + "&lon=" + globalLon + "&appid=" + apiKey + "&units=imperial";
        forecastUrl = "http://api.openweathermap.org/data/2.5/forecast?lat=" + globalLat + "&lon=" + globalLon + "&appid=" + apiKey + "&units=imperial";
        displayForecast();
    });

}

var displayForecast = function () {
    fetch(forecastUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                console.log(data);
                for (var i = 0; i < data.list.length; i + 5) {

                }
            });
        }
    });
};

var displayCurrentWeather = function () {

    fetch(apiUrl).then(function (response) {

        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);

                var currentCity = document.createElement("div")
                currentCity.setAttribute("id", "current-city-selector")
                currentCityContainer.appendChild(currentCity);

                // date conversion source https://www.coderrocketfuel.com/article/convert-a-unix-timestamp-to-a-date-in-vanilla-javascript
                var unix = data.dt * 1000;
                var currentDate = new Date(unix);
                var humanDate = currentDate.toLocaleDateString()


                var cityName = document.createElement("h3");
                cityName.classList = "fw-bolder"
                cityName.textContent = data.name + " " + humanDate;
                currentCity.appendChild(cityName);

                var iconCode = data.weather[0].icon;
                var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
                var displayIcon = document.createElement("img");
                displayIcon.setAttribute("src", iconUrl);
                currentCity.appendChild(displayIcon);



                var currentTemp = document.createElement("p");
                currentTemp.textContent = "Current Temp: " + data.main.temp;
                currentCity.appendChild(currentTemp);

                var currentHumid = document.createElement("p");
                currentHumid.textContent = "Current Humidity: " + data.main.humidity;
                currentCity.appendChild(currentHumid);

                var currentWS = document.createElement("p");
                currentWS.textContent = "Current Wind Speed: " + data.wind.speed + " MPH";
                currentCity.appendChild(currentWS);

                fetch(uvUrl).then(function (response) {
                    if (response.ok) {
                        response.json().then(function (data) {

                            var currentUV = document.createElement("p");
                            currentUV.textContent = "Current UV: " + data.list[0].main.aqi;
                            currentCity.appendChild(currentUV);
                        })
                    }
                })

            })
        }
    })
}

form.addEventListener('submit', formSubmit);

// api call to convert city to coordinates http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}