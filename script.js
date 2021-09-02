let searchBtn = document.querySelector("button");
let cityName = document.querySelector("input");
let currentCity = document.querySelector(".currentCity");
let forcast = document.querySelector(".forcast");
let savedCities = document.querySelector(".savedCities");
let lastSearched;

function appendCurrent(data) {
    currentCity.textContent = "";
    let date = moment.unix(data.dt).format("MM/DD/YYYY");
    let name = data.name;
    let wind = data.wind.speed;
    let temp = data.main.temp;
    let humid = data.main.humidity;
    //dom elements
    let titleEl = document.createElement("h4");        
    let tempEl = document.createElement("p");
    let windEl = document.createElement("p");
    let humidEl = document.createElement("p");
    //insert data
    titleEl.innerHTML = name + " " + date;
    tempEl.innerHTML = "Temp: " + temp;
    windEl.innerHTML = "Wind: " + wind;
    humidEl.innerHTML = "Humid: " + humid;
    //append data
    currentCity.append(titleEl, tempEl, windEl, humidEl);
}

function appendForcast(data) {
    forcast.textContent="";
    //console.log("forcast: ", data);
    //forcast cards
    let day1El = document.createElement("div");
    let day2El = document.createElement("div");
    let day3El = document.createElement("div");
    let day4El = document.createElement("div");
    let day5El = document.createElement("div");
    forcast.append(day1El);
    forcast.append(day2El);
    forcast.append(day3El);
    forcast.append(day4El);
    forcast.append(day5El);
    
    for (day = 0; day < 5; day++) {
        let date = moment.unix(data.daily[day].dt).format("MM/DD/YYYY");
        let temp = data.daily[day].temp.day;
        let wind = data.daily[day].wind_speed;
        let humid = data.daily[day].humidity;
        //dom elements    
        let titleEl = document.createElement("h5");
        let tempEl = document.createElement("p");
        let windEl = document.createElement("p");
        let humidEl = document.createElement("p");
        //insert data
        titleEl.innerHTML = date;
        tempEl.innerHTML = "Temp: " + temp;
        windEl.innerHTML = "Wind: " + wind;
        humidEl.innerHTML = "Humid: " + humid;
        
        forcast.children[day].append(titleEl, tempEl, windEl, humidEl);
    }

}

function getCurrentWeather(city) {
    let getWeatherapi = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=9e1bc7bce1d4ccfb02896abb14828f80`;

    fetch(getWeatherapi)
        .then(response => {
            return response.json();
        })
        .then(data => {
            //console.log("current: ", data);
            appendCurrent(data);
        })
}
function getForcast(lat, lon) {
    let getForcastapi = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&units=imperial&appid=9e1bc7bce1d4ccfb02896abb14828f80`;

    fetch(getForcastapi)
        .then(response => {
            return response.json();
        })
        .then(data => {
            appendForcast(data);
        })
}
function getCoordinates(data) {
    console.log(data);
    let lat = data[0].lat;
    let lon = data[0].lon;
    //console.log(lat, lon);
    getForcast(lat, lon);
}

function getForcastData(city) {
    let getWeatherapi = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=9e1bc7bce1d4ccfb02896abb14828f80`;

    fetch(getWeatherapi)
        .then(response => {
            return response.json();
        })
        .then(data => {
            getCoordinates(data);
        })
}
function appendCities(){
    savedCities.textContent="";
    let arrayOfValues = Object.values(localStorage);
    let arrayOfKeys = Object.keys(localStorage);
    console.log(arrayOfValues, arrayOfKeys);
    let cityEl;
    for (i=0; i<arrayOfValues.length; i++){
        if(arrayOfKeys[i] == "last searched"){
            return
        }
        else {
            //console.log(arrayOfValues[i]);
            cityEl = document.createElement("button");
            cityEl.textContent = arrayOfValues[i];
            savedCities.append(cityEl);
        };
    }
}
function saveCity(city){
    localStorage.setItem(`${city}`, `${city}`);
}
searchBtn.addEventListener("click", function () {
    getCurrentWeather(cityName.value);
    getForcastData(cityName.value);
    lastSearched = cityName.value;
    localStorage.setItem("last searched", lastSearched);
    saveCity(cityName.value);
    appendCities()
});
//event listener for saved cities
savedCities.addEventListener("click", function (event) {
    console.log(event.target.textContent);
    getCurrentWeather(event.target.textContent);
    getForcastData(event.target.textContent);
    lastSearched = event.target.textContent;
    localStorage.setItem("last searched", lastSearched);
});
//append saved cities
getForcastData(localStorage.getItem("last searched"));
getCurrentWeather(localStorage.getItem("last searched"));
appendCities();