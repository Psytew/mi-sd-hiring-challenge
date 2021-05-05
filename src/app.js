import { convertDate } from "./utils";

function findWeather(zipInput){
    Promise.all([
        fetch('https://se-weather-api.herokuapp.com/api/v1/geo?zip_code=' + zipInput)
    ]).then(function(responses) {
        return Promise.all(responses.map(function(response) {
            return response.json()
        }))
    }).then(function(responses) {
        var lat = responses[0].latitude
        var lon = responses[0].longitude
        name = responses[0].city

        var h1 = document.getElementById('h1')
        h1.innerHTML = "WEATHER FORECAST REPORT FOR " + name.toUpperCase()
        var form =  document.getElementById('form')
        form.remove()
    }).then(function(lat, lon, name){

        Promise.all([
            fetch('https://se-weather-api.herokuapp.com/api/v1/forecast?latitude=' + lat + '&longitude=' + lon + '&date=05/04/2020'),
            fetch('https://se-weather-api.herokuapp.com/api/v1/forecast?latitude=' + lat + '&longitude=' + lon + '&date=05/05/2020'),
            fetch('https://se-weather-api.herokuapp.com/api/v1/forecast?latitude=' + lat + '&longitude=' + lon + '&date=05/06/2020')
        ]).then(function(responses) {
            return Promise.all(responses.map(function(response) {
                return response.json()
            }))
        }).then(function(responses) {
            generateWeather(responses)
        })
    })
}

function generateWeather(responses){
    var forecastFlex = document.getElementById('forecastFlex')
    for (let i = 0; i < responses.length; i++){
        var forecast = document.createElement('div');
        forecast.className = "forecast";

        if (i == 0){
            var headerText = "Today"
        } else if (i == 1){
            var headerText = "Tomorrow"
        } else {
            var twoDays = new Date();
            var dd = twoDays.getDate() + 2;
            var mm = twoDays.getMonth() + 1 ;
            var y = twoDays.getFullYear();
            var headerText = mm + '/'+ dd + '/'+ y;
        }

        var forecastHeader = document.createElement('div');
        forecastHeader.className = "forecastHeader";
        var h2 = document.createElement('h2');
        h2.innerText = headerText
        forecastHeader.appendChild(h2)
        forecast.appendChild(forecastHeader)

        var forecastContent = document.createElement('div');
        forecastContent.className = "forecastContent";
        forecast.appendChild(forecastContent)

        var forecastImageDiv = document.createElement('div');
        var img = document.createElement('img');
        img.src = "/" + responses[i].daily.icon + ".104d9cd4.png"
        forecastImageDiv.appendChild(img)
        forecastContent.appendChild(forecastImageDiv)

        var forecastText = document.createElement('div');
        forecastText.className = "forecastText";
        var p1 = document.createElement('p');
        var p2 = document.createElement('p');
        p1.innerHTML = responses[i].daily.icon.charAt(0).toUpperCase() + responses[i].daily.icon.slice(1)

        forecastText.appendChild(p1)
        forecastContent.appendChild(forecastText)

        forecastFlex.appendChild(forecast)
    }
}

var form = document.getElementById("form");
function handleForm(event) { 
    event.preventDefault(); 

    var zipInput = document.getElementById("zipInput").value
    findWeather(zipInput);
} 
form.addEventListener('submit', handleForm);

// TODO:
// Add in the temperatures
// Look into image weirdness
// Fix part of code that gets date
// Compartmentalize some of the node construction