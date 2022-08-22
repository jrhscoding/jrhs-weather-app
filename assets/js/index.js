var apiKey = "";
var currentCityContainer = document.querySelector("#current-city")
var form = document.querySelector("#form-control");
var searchCity = document.querySelector("#search-city");
var apiUrl = "https://api.openweathermap.org/data/2.5/weather?lat=35&lon=139&appid=" + apiKey + "&units=imperial";
var uvUrl = "http://api.openweathermap.org/data/2.5/air_pollution?lat=35&lon=139&appid=" + apiKey + "&units=imperial";

var formSubmit = function(event) {
    event.preventDefault();

    var geoUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + searchInput + "&appid=" + apiKey + "&units=imperial";

    var getGeoUrl = function () {
        fetch(geoUrl).then(function(response) {
            if (response.ok) {
                response.json().then(function(data) {
                    console.log(data);
                })
            }
        })
    }

    getGeoUrl();

    var searchInput = searchCity.value.trim();
    if (searchInput) {
        // execute function to change city name to coordinates

        
    }

}

var getUrlData = function() {

    fetch(apiUrl).then(function (response) {

        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);

                // date conversion source https://www.coderrocketfuel.com/article/convert-a-unix-timestamp-to-a-date-in-vanilla-javascript
                var unix = data.dt * 1000;
                var currentDate = new Date(unix);
                var humanDate = currentDate.toLocaleDateString()


                var cityName = document.createElement("h3");
                cityName.classList = "fw-bolder"
                cityName.textContent = data.name + " " + humanDate;
                currentCityContainer.appendChild(cityName);

                var currentTemp = document.createElement("p");
                currentTemp.textContent = "Current Temp: " + data.main.temp;
                currentCityContainer.appendChild(currentTemp);

                var currentHumid = document.createElement("p");
                currentHumid.textContent = "Current Humidity: " + data.main.humidity;
                currentCityContainer.appendChild(currentHumid);

                var currentWS = document.createElement("p");
                currentWS.textContent = "Current Wind Speed: " + data.wind.speed + " MPH";
                currentCityContainer.appendChild(currentWS);               
            })
        };
    });
};

// UV data
var getUVData = function() {
    fetch(uvUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                console.log(data.list[0].main.aqi);

                var currentUV = document.createElement("p");
                currentUV.textContent = "Current UV: " + data.list[0].main.aqi;
                currentCityContainer.appendChild(currentUV);
            })
        }
    })
};

form.addEventListener('submit', formSubmit);

// api call to convert city to coordinates http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
getUrlData();
getUVData();