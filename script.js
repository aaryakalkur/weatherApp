const apiKey = "04500b90bd7b3ddbdedb0cf1488d8a8c"; // Replace with your OpenWeather API key
const unit = "metric"; // 'metric' for Celsius, 'imperial' for Fahrenheit
const cityInput = document.getElementById("city-input");
const darkModeToggle = document.getElementById("dark-mode-toggle");

// Toggle Dark Mode
darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

// Fetch current weather
function fetchWeather() {
  const city = cityInput.value.trim();
  if (!city) {
    alert("Please enter a city name!");
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${apiKey}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.cod !== 200) throw new Error(data.message);
      displayWeather(data);
      fetchAQI(data.coord.lat, data.coord.lon);
      fetchHourlyForecast(data.coord.lat, data.coord.lon);
      fetchWeatherAlerts(data.coord.lat, data.coord.lon);
    })
    .catch(err => alert("Error: " + err.message));
}

// Display current weather
function displayWeather(data) {
  document.getElementById("city-name").textContent = data.name;
  document.getElementById("temperature").textContent = `Temperature: ${data.main.temp}°C`;
  document.getElementById("description").textContent = `Description: ${data.weather[0].description}`;
  document.getElementById("weather-icon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
  document.getElementById("weather-icon").alt = data.weather[0].description;
  document.getElementById("sunrise").textContent = `Sunrise: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}`;
  document.getElementById("sunset").textContent = `Sunset: ${new Date(data.sys.sunset * 1000).toLocaleTimeString()}`;
  document.getElementById("wind").textContent = `Wind: ${data.wind.speed} km/h`;
  document.getElementById("humidity").textContent = `Humidity: ${data.main.humidity}%`;
  document.getElementById("uv-index").textContent = `UV Index: ${data.uvi}`;
  document.getElementById("aqi").textContent = `AQI: ${getAQILevel(data.list[0].main.aqi)}`;
}

  

// Fetch AQI (Air Quality Index)
function fetchAQI(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const aqiLevel = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];
      document.getElementById("aqi").textContent = `AQI: ${aqiLevel[data.list[0].main.aqi - 1]}`;
    })
    .catch(err => console.error("Error fetching AQI:", err));
}

function getAQILevel(aqi) {
  if (aqi <= 50) {
    return 'Good';
  } else if (aqi <= 100) {
    return 'Fair';
  } else if (aqi <= 150) {
    return 'Moderate';
  } else if (aqi <= 200) {
    return 'Poor';
  } else {
    return 'Very Poor';
  }
}

// Fetch weather by location
function fetchByLocation() {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser!");
    return;
  }

  navigator.geolocation.getCurrentPosition(position => {
    const { latitude, longitude } = position.coords;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${unit}&appid=${apiKey}`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        displayWeather(data);
        fetchAQI(latitude, longitude);
        fetchHourlyForecast(latitude, longitude);
        fetchHistoricalWeather(latitude, longitude);
      })
      .catch(err => console.error("Error fetching location weather:", err));
  });
}

// Event Listeners
document.getElementById("search-btn").addEventListener("click", fetchWeather);
document.getElementById("location-btn").addEventListener("click", fetchByLocation);
