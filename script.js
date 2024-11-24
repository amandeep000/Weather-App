"use strict";

const cityInput = document.querySelector("#city-input");
const searchBtn = document.querySelector(".search-btn");
const apiKey = "1f2fab42372f52cebce995fe8e6b573c";

const countryTxt = document.querySelector(".country-txt");
const tempTxt = document.querySelector(".temp-txt");
const conditonsTxt = document.querySelector(".condition-txt");
const windSpeed = document.querySelector(".wind-value-txt");
const humidityTxt = document.querySelector(".humidity-value-txt");
const dateTxt = document.querySelector(".date-txt");
const weatherImage = document.querySelector(".weather-summary-img");
const notFound = document.querySelector(".not-found");
const weatherInfoSec = document.querySelector(".weather-info");
const searchCity = document.querySelector(".search-city-section");
const forecastItemContainer = document.querySelector(
  ".forecast-items-container"
);

searchBtn.addEventListener("click", () => {
  if (cityInput.value.trim() != "") {
    updateWeatherInfo(cityInput.value);
    cityInput.value = "";
    cityInput.blur();
  }
});

cityInput.addEventListener("keydown", (e) => {
  if (e.key == "Enter" && cityInput.value.trim()) {
    updateWeatherInfo(cityInput.value);
    cityInput.value = "";
    cityInput.blur();
  }
});

// function to get dates

function getCurrentDate() {
  const currentDate = new Date();
  const options = {
    weekday: "short",
    day: "2-digit",
    month: "short",
  };
  return currentDate.toLocaleString("en-GB", options);
}

function getWeatherIcon(id) {
  if (id <= 232) return "thunderstorm.svg";
  if (id <= 321) return "drizzle.svg";
  if (id <= 531) return "rain.svg";
  if (id <= 622) return "snow.svg";
  if (id <= 781) return "atmosphere.svg";
  if (id <= 800) return "clear.svg";
  if (id <= 804) return "clouds.svg";
}

async function getFetchData(endpoint, city) {
  const apiurl = `https://api.openweathermap.org/data/2.5/${endpoint}?q=${city}&appid=${apiKey}&units=metric`;
  const response = await fetch(apiurl);
  return response.json();
}

async function updateWeatherInfo(city) {
  const weatherData = await getFetchData("weather", city);
  if (weatherData.cod != 200) {
    showDisplaySection(notFound);
    return;
  }
  const {
    name: country,
    main: { temp, humidity },
    wind: { speed },
    weather: [{ id, main }],
  } = weatherData;
  countryTxt.textContent = country;
  tempTxt.textContent = Math.trunc(temp) + "°C";
  windSpeed.textContent = Math.trunc(speed * 3.6) + " Km/h";
  conditonsTxt.textContent = main;
  humidityTxt.textContent = humidity + "%";
  dateTxt.textContent = getCurrentDate();

  weatherImage.src = `./assets/weather/${getWeatherIcon(id)}`;

  await updateForcastInfo(city);
  showDisplaySection(weatherInfoSec);
}

// function to show not found or show all weather info
function showDisplaySection(section) {
  [weatherInfoSec, notFound, searchCity].forEach((sec) => {
    return (sec.style.display = "none");
  });
  section.style.display = "block";
}

// function to update the 5day forecast cards

async function updateForcastInfo(city) {
  const forecastData = await getFetchData("forecast", city);
  const timeTaken = "12:00:00";
  const todayDate = new Date().toISOString().split("T")[0];

  forecastItemContainer.innerHTML = "";
  forecastData.list.forEach((forecastweather) => {
    if (
      forecastweather.dt_txt.includes(timeTaken) &&
      !forecastweather.dt_txt.includes(todayDate)
    ) {
      updateForecastItem(forecastweather);
    }
  });
}

function updateForecastItem(weatherData) {
  console.log(weatherData);
  const {
    dt_txt: date,
    weather: [{ id }],
    main: { temp },
  } = weatherData;

  const dateTaken = new Date(date);
  const dateOption = {
    day: "2-digit",
    month: "short",
  };
  const dateResult = dateTaken.toLocaleString("en-US", dateOption);

  const foreCastItem = `<div class="forecast-item">
            <h5 class="forecast-item-date regular-text">${dateResult}</h5>
            <img
              class="forecast-item-img"
              src="/assets/weather/${getWeatherIcon(id)}"
              alt="weather image"
            />
            <h4>${Math.trunc(temp)}°C</h4>
          </div>`;

  forecastItemContainer.insertAdjacentHTML("beforeend", foreCastItem);
}
