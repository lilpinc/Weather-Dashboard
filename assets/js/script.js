// variables
let searchInput = document.getElementById("citysearch");
let searchBar = document.getElementById("searchbar");
let chosenCityEl = document.getElementById("chosencity");
let day1El = document.getElementById("day1");
let nameEl = document.getElementById("city-name");
let currentPicEl = document.getElementById("current-pic");
let currentTempEl = document.getElementById("temperature");
let currentHumidityEl = document.getElementById("humidity");
let currentWindEl = document.getElementById("wind-speed");
let currentUVEl = document.getElementById("UV-index");
let cityListEl = document.getElementById("citylist");
let cardBody = document.querySelector(".card-body");
let futureForecast = document.getElementById("futureforecast");
let box1 = document.getElementById("box1");
let box2 = document.getElementById("box2");
let box3 = document.getElementById("box3");
let box4 = document.getElementById("box4");
let box5 = document.getElementById("box5");
let cityHistoryList = document.getElementById("citylist");
let forecastEls = document.querySelectorAll(".forecast");
let searchHistory = JSON.parse(localStorage.getItem("search")) || [];




// functions
// when i type in the city and hit the search bar, a function runs that reads the input
// need to connect the city name into the parameter into the requestUrl.

function findCityInfo(city) {

    let requestUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&limit=1&appid=5d828cbc2b8b39c9e4ee82e61523bb81';
    // fetch request gets the weather back of the city 
    fetch(requestUrl)
        .then(function (response) {
            if (response.ok) {
                console.log(response);
                response.json()
                .then(function (data) {
                    console.log(data);
                    displayInfo(data);
                });
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            alert('Unable to connect');
        });
};

let displayInfo = function(info){
    if (info.length === 0){
        chosenCityEl.textContent = "No weather information found";
    } else {
        cardBody.setAttribute("style", "display:block");
        futureForecast.setAttribute("style", "display:block");
        let date = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
        let currentDate = month + '/' + day + '/' + year;
        nameEl.innerHTML = info.name + ' - \n'  + currentDate;
        let iconURL = 'https://openweathermap.org/img/wn/' + info.weather[0].icon +'@2x.png';
        currentPicEl.src = iconURL;
        let tempEl = ((info.main.temp-273.15) * 9/5 + 32);
        currentTempEl.innerHTML ="Temperature: " + tempEl.toFixed(2) + "ºF";
        let humidityEl = 
        currentHumidityEl.innerHTML = "Humidity: " + info.main.humidity + "%";
        currentWindEl.innerHTML = "Wind: " + info.wind.speed + " MPH";
    };

};

function findFutureInfo(city){

let forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&limit=1&appid=5d828cbc2b8b39c9e4ee82e61523bb81';

fetch(forecastUrl)
.then(function (response) {
    if (response.ok) {
        console.log(response);
        response.json()
        .then(function (data) {
            console.log(data);
            displayFutureInfo(data);
        });
    } else {
        alert('Error: ' + response.statusText);
    }
})
.catch(function (error) {
    alert('Unable to connect');
});
};

let displayFutureInfo = function(info){
    if (info.length === 0){
        chosenCityEl.textContent = "No weather information found";
    } else {        
        
       box1.setAttribute("style", "display: block; border-radius:5px; color: black; font-size:13px;");
       box2.setAttribute("style", "display: block; border-radius:5px; color: black; font-size:13px;");
       box3.setAttribute("style", "display: block; border-radius:5px; color: black; font-size:13px;");
       box4.setAttribute("style", "display: block; border-radius:5px; color: black; font-size:13px;");
       box5.setAttribute("style", "display: block; border-radius:5px; color: black; font-size:13px;");

        for (i = 0; i < forecastEls.length; i++) {
            forecastEls[i].innerHTML = " ";
            let forecastIndex = i * 8 + 4;
            let forecastDate = new Date(info.list[forecastIndex].dt * 1000);
            let forecastDay = forecastDate.getDate();
            let forecastMonth = forecastDate.getMonth() + 1;
            let forecastYear = forecastDate.getFullYear();
            let forecastDateEl = document.createElement("p");
            let forecastTempEl = document.createElement("p");
            let forecastWindEl = document.createElement("p");
            let forecastHumidityEl = document.createElement("p");
            let forecastIcon = document.createElement("img");
            let forecastIconURL = 'https://openweathermap.org/img/wn/' + info.list[forecastIndex].weather[0].icon +'@2x.png';
            forecastIcon.src = forecastIconURL;
            let forecastTempCalc  = ((info.list[forecastIndex].main.temp-273.15) * 9/5 + 32);
            forecastDateEl.setAttribute("style", "font-size: 17px;")
            forecastDateEl.innerHTML = forecastMonth + "/" + forecastDay + "/" + forecastYear;
            forecastTempEl.innerHTML = "Temp: " + forecastTempCalc.toFixed(2) + "ºF";
            forecastWindEl= "Wind: " + info.list[forecastIndex].wind.speed + " MPH  ";
            forecastHumidityEl = "Humidity: " + info.list[forecastIndex].main.humidity + "%";
            forecastEls[i].append(forecastDateEl);
            forecastEls[i].append(forecastIcon);
            forecastEls[i].append(forecastTempEl);
            forecastEls[i].append(forecastWindEl);
            forecastEls[i].append(forecastHumidityEl);


        };
    };
};

// when it reads the input a request is sent for the data via an api, which brings back the data
// when the data response is met, the data is collected and displayed
// the day of and 5 days will be displayed
// the data is collected and saved in local storage, a button is created in the search history space
// when clicked it targets the old data and gets it from local storage


// special functions
searchBar.addEventListener("click", function(){

    let cityEl = searchInput.value.trim();
    findCityInfo(cityEl);
    findFutureInfo(cityEl);
    searchHistory.push(cityEl);
    localStorage.setItem("search", JSON.stringify(searchHistory));
    getSearchHistory();

});

function getSearchHistory(){
    cityHistoryList.innerHTML = "";
    for ( let i = 0; i < searchHistory.length; i++){
    let cityList = document.createElement("button");
    cityList.classList.add('btn');
    cityList.setAttribute("style", "border: 1px solid #4d53eb; background-color:#b09cdb; color:white; padding:5px; margin-top: 10px; width:260px;")
    cityList.setAttribute("value", searchHistory[i]);
    cityList.innerHTML = searchHistory[i];
    cityHistoryList.append(cityList);

    cityList.addEventListener("click", function () {
        findCityInfo(cityList.value);
        findFutureInfo(cityList.value);
    });
}};




// event listener button for search bar
// event listener target for the search history locations




// business