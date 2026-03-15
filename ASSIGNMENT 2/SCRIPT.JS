const API_KEY = 'YOUR_OPENWEATHER_API_KEY'; 
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherDisplay = document.getElementById('weatherDisplay');
const historyList = document.getElementById('historyList');
const consoleOutput = document.getElementById('consoleOutput');


function logToUI(message) {
    const p = document.createElement('p');
    p.textContent = `> ${message}`;
    consoleOutput.appendChild(p);
    console.log(message);
}


window.onload = () => {
    const history = JSON.parse(localStorage.getItem('weatherHistory')) || [];
    renderHistory(history);
};

async function fetchWeather(city) {
   
    consoleOutput.innerHTML = '';
    
   
    logToUI("Sync Start"); // 1

    setTimeout(() => {
        logToUI("setTimeout (Macrotask)"); // 4
    }, 0);

    logToUI("(ASYNC) START fetching..."); // 2

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        
        
        if (!response.ok) {
            throw new Error("City not found");
        }

        const data = await response.json();
        
        
        Promise.resolve().then(() => logToUI("Promise.then (Microtask)")); // 3

        displayWeather(data);
        saveToHistory(city);
        logToUI(`(ASYNC) Data received for ${city}`); // 5

    } catch (error) {
        weatherDisplay.innerHTML = `<p class="error">${error.message}</p>`;
        logToUI(`Error: ${error.message}`);
    }

    logToUI("Sync End");
}

function displayWeather(data) {
    weatherDisplay.innerHTML = `
        <h4>${data.name}, ${data.sys.country}</h4>
        <p>Temp: ${data.main.temp}°C</p>
        <p>Weather: ${data.weather[0].main}</p>
        <p>Humidity: ${data.main.humidity}%</p>
        <p>Wind: ${data.wind.speed} m/s</p>
    `;
}


function saveToHistory(city) {
    let history = JSON.parse(localStorage.getItem('weatherHistory')) || [];
    if (!history.includes(city)) {
        history.push(city);
        localStorage.setItem('weatherHistory', JSON.stringify(history));
        renderHistory(history);
    }
}

function renderHistory(history) {
    historyList.innerHTML = '';
    history.forEach(city => {
        const li = document.createElement('li');
        li.textContent = city;
        li.onclick = () => fetchWeather(city);
        historyList.appendChild(li);
    });
}

searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) fetchWeather(city);
});