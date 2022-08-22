var apiKey = "758d6634aa9f49adb412c47ed584b5ac";
var currentCityContainer = document.querySelector("#current-city")
var form = document.querySelector("#form-control");
var searchCity = document.querySelector("#search-city");

var formSubmit = function (event) {
    event.preventDefault();

    searchInput = searchCity.value.trim();
    console.log(searchInput);

    var geocoding = "http://api.openweathermap.org/geo/1.0/direct?q=" + searchInput + "&limit=5&appid=" + apiKey;

    fetch(geocoding).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                var lat = data[0].lat;
                var lon = data[0].lon;

                var apiUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=imperial";
                

                var getUrlData = function () {

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

                                var uvUrl = "http://api.openweathermap.org/data/2.5/air_pollution?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=imperial";

                                var getUVData = function () {
                                    fetch(uvUrl).then(function (response) {
                                        if (response.ok) {
                                            response.json().then(function (data) {
                                                console.log(data.list[0].main.aqi);
                
                                                var currentUV = document.createElement("p");
                                                currentUV.textContent = "Current UV: " + data.list[0].main.aqi;
                                                currentCity.appendChild(currentUV);
                                            })
                                        }
                                    })
                                };
                                getUVData();
                            })
                        };
                    });
                };

                // UV data

                getUrlData();

                currentCityContainer.remove(currentCity);
            })
        }
    })
}



form.addEventListener('submit', formSubmit);

// api call to convert city to coordinates http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}