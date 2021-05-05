// import { convertDate } from "./utils";

//Does the API requests
let findWeather = async (zipInput) => {

    var lat = ""
    var lon = ""

    //input: zip code, output: latitude, longitude, city
    await fetch('https://se-weather-api.herokuapp.com/api/v1/geo?zip_code=' + zipInput)
    .then(res => { return res.json(); })
    .then((data) => {

        lat = data.latitude
        lon = data.longitude
        var city = data.city

        changeHeader(city)

    })

    //input: latitude, longitude, date, output: weather information
    await fetch('https://se-weather-api.herokuapp.com/api/v1/forecast?latitude=' + lat + '&longitude=' + lon + '&date=' + formattedDate)
    .then(res => { return res.json(); })
    .then((responses) => {

        generateWeather(responses.daily.data)

    })
}

//Generates DOM nodes for forecast boxes
let generateWeather = (responses) => {
    var forecastFlex = document.getElementById('forecastFlex')
    for (let i = 0; i < 3; i++){

        //creates the main node
        var forecast = document.createElement('div');
        forecast.className = "forecast";

        var headerText = createHeaderText(i)

        //Top part of forecast box
        var forecastHeader = document.createElement('div');
        forecastHeader.className = "forecastHeader";
        var h2 = document.createElement('h2');
        h2.innerText = headerText
        forecastHeader.appendChild(h2)
        forecast.appendChild(forecastHeader)

        //main content of forecast box
        var forecastContent = document.createElement('div');
        forecastContent.className = "forecastContent";
        forecast.appendChild(forecastContent)

        //left half of forecast box
        var forecastImageDiv = document.createElement('div');
        var img = document.createElement('img');
        img.src = "/" + responses[i].icon + generateImageExtra(responses[i].icon) + ".png"
        forecastImageDiv.appendChild(img)
        forecastContent.appendChild(forecastImageDiv)

        //adding the weather
        var forecastText = document.createElement('div');
        forecastText.className = "forecastText";
        var p1 = document.createElement('p');
        p1.innerHTML = responses[i].icon.charAt(0).toUpperCase() + responses[i].icon.slice(1)
        forecastText.appendChild(p1)

        //adding the high and low
        var p2 = document.createElement('p');
        var span1 = document.createElement('span')
        var span2 = document.createElement('span')
        var span3 = document.createElement('span')
        span1.innerHTML = Math.round(responses[i].temperatureHigh) + "°"
        span2.innerHTML = " / "
        span3.innerHTML = Math.round(responses[i].temperatureLow) + "°"
        p2.appendChild(span1)
        p2.appendChild(span2)
        p2.appendChild(span3)
        forecastText.appendChild(p2)
        
        forecastContent.appendChild(forecastText)

        //appends the forecast box to page
        forecastFlex.appendChild(forecast)
    }
}

//generates dates
let formattedDate = (addDays) => {
    var displayDate = new Date();
    displayDate.setDate(displayDate.getDate() + addDays)

    var formattedDate = String(displayDate.getMonth() + 1) + '/' + String(displayDate.getDate()) + '/' + String(displayDate.getFullYear())
    return formattedDate
}

//swaps out the h1
let changeHeader = (city) => {
    var h1 = document.getElementById('h1')
    h1.innerHTML = "WEATHER FORECAST REPORT FOR " + city.toUpperCase()
    var form =  document.getElementById('form')
    form.remove()
}

//creates the header text for each forecast
let createHeaderText = (i) => {
    if (i == 0){
        return "Today"
    } else if (i == 1){
        return "Tomorrow"
    } else {
        return formattedDate(i)
    }
}

//this part I don't fully understand; I need to add an extra bit to the images to get them to display properly on my device
//I'm not sure if this is an error with my environment or something else entirely.
let generateImageExtra = (i) => {
    if (i == "sunny"){
        return '.104d9cd4'
    } else if (i == "cloudy"){
        return '.d8afbff7'
    } else if (i == 'rain'){
        return '.536e76f6'
    } else if (i == 'sj0w'){
        return '.af099d52'
    } else {
        return ''
    }
}

//listener that makes the form change the page
var form = document.getElementById("form");
var handleForm = (event) => { 
    event.preventDefault(); 

    var zipInput = document.getElementById("zipInput").value
    findWeather(zipInput);
}
form.addEventListener('submit', handleForm);