var apiKey = "6d2d489f3e64f0d79673620f7c2f524a";
var currentCityContainer = document.querySelector("#current-city")
var form = document.querySelector("#form-control");
var fiveDay = document.querySelector("#five-day");
var searchCity = document.querySelector("#search-city");
var globalLat = ""
var globalLon = ""
var apiUrl = "";
var uvUrl = "";
var forecastUrl = "";
var searchHistory = document.querySelector("#search-history");
let localHist = [];
let storedHist = JSON.parse(localStorage.getItem('history'));

var getCord = function (searchParam) {
    // utilizing this function to use the eventual "searchInput" to get coordinates based off of search
    var geocoding = "https://api.openweathermap.org/geo/1.0/direct?q=" + searchParam + "&limit=5&appid=" + apiKey;

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
 
        // assigning lattitude and longitutde
        globalLat = data.lattitude;
        globalLon = data.longitude;

        // pushing lattitude and longitutde to the localHistarray
        localHist.push(globalLat , globalLon);
        console.log(localHist);
        // setting items to local storage
        window.localStorage.setItem("history", JSON.stringify(localHist));
        // fetching api information
        apiUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + globalLat + "&lon=" + globalLon + "&appid=" + apiKey + "&units=imperial";
        displayCurrentWeather();
        uvUrl = "https://api.openweathermap.org/data/2.5/air_pollution?lat=" + globalLat + "&lon=" + globalLon + "&appid=" + apiKey + "&units=imperial";
        forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + globalLat + "&lon=" + globalLon + "&appid=" + apiKey + "&units=imperial";
        displayForecast();
        searchCity.value = "";
        console.log(JSON.parse(window.localStorage.getItem("history")));
    });

}

var searchHistoryFun = function (event) {
    event.preventDefault();
    var historyButton = document.querySelector("#last-city-button");
    searchInput = historyButton.textContent;
    getCord(searchInput).then(function (data) {
        globalLat = data.lattitude;
        globalLon = data.longitude;
        localHist.push(globalLat , globalLon);
        console.log(localHist);

        window.localStorage.setItem("history", JSON.stringify(localHist));
        apiUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + globalLat + "&lon=" + globalLon + "&appid=" + apiKey + "&units=imperial";
        displayCurrentWeatherHistory();
        uvUrl = "https://api.openweathermap.org/data/2.5/air_pollution?lat=" + globalLat + "&lon=" + globalLon + "&appid=" + apiKey + "&units=imperial";
        forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + globalLat + "&lon=" + globalLon + "&appid=" + apiKey + "&units=imperial";
        displayForecast();
        
    });

}

var forecastContainer = document.createElement("div");
forecastContainer.id = ("forecast-container")
forecastContainer.classList = ("row")

var displayForecast = function () {
    fetch(forecastUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                // console.log(data);
                for (var i = 0; i < data.list.length; i = i + 8) {
                    // console.log(data.list[i].main.temp);


                    fiveDay.appendChild(forecastContainer);

                    var forecastCard = document.createElement("div");
                    forecastCard.classList = ("card col")

                    var unix = data.list[i].dt * 1000;
                    var currentDate = new Date(unix);
                    var humanDate = currentDate.toLocaleDateString();

                    var iconCode = data.list[i].weather[0].icon;
                    var iconUrl = "https://openweathermap.org/img/w/" + iconCode + ".png";
                    var displayIcon = document.createElement("img");
                    displayIcon.setAttribute("src", iconUrl);
                    displayIcon.classList = ("img-size")
                    forecastCard.appendChild(displayIcon);

                    var humanDateForecast = document.createElement("h5");
                    humanDateForecast.classList = ("");
                    humanDateForecast.textContent = humanDate;
                    forecastCard.appendChild(humanDateForecast);
                    
                    var forecastTemp = document.createElement("p");
                    forecastTemp.textContent = "Temp: " + data.list[i].main.temp;

                    var forecastHumid = document.createElement("p");
                    forecastHumid.textContent = "Humidity: " + data.list[i].main.humidity;

                    var forecastWS = document.createElement("p");
                    forecastWS.textContent = "Wind Speed: " + data.list[i].wind.speed;

                    forecastCard.appendChild(forecastTemp);
                    forecastCard.appendChild(forecastHumid);
                    forecastCard.appendChild(forecastWS);

                    forecastContainer.appendChild(forecastCard);

                }
            })

        }
    });
};



var displayCurrentWeather = function () {

    fetch(apiUrl).then(function (response) {

        if (response.ok) {
            response.json().then(function (data) {
                // console.log(data);

                var currentCity = document.createElement("div")
                currentCity.setAttribute("id", "current-city-selector")
                currentCityContainer.appendChild(currentCity);

                // date conversion source https://www.coderrocketfuel.com/article/convert-a-unix-timestamp-to-a-date-in-vanilla-javascript
                var unix = data.dt * 1000;
                var currentDate = new Date(unix);
                var humanDate = currentDate.toLocaleDateString()

                var historyButton = document.createElement("button");
                historyButton.classList = ("btn");
                historyButton.textContent = data.name;
                historyButton.setAttribute("id", "last-city-button");
                searchHistory.appendChild(historyButton);

                var cityName = document.createElement("h3");
                cityName.classList = "fw-bolder"
                cityName.textContent = data.name + " " + humanDate;
                currentCity.appendChild(cityName);

                var iconCode = data.weather[0].icon;
                var iconUrl = "https://openweathermap.org/img/w/" + iconCode + ".png";
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

var displayCurrentWeatherHistory = function () {

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
                var iconUrl = "https://openweathermap.org/img/w/" + iconCode + ".png";
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
};

form.addEventListener('submit', formSubmit);
searchHistory.addEventListener('click', searchHistoryFun);



// api call to convert city to coordinates http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}