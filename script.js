"use strict";

const apiKey = "3a3765148f30f98e04cbcb9b7bcc555d"; //openweather api
const curLocationBtn = document.querySelector(".location-btn");
const img = document.querySelector(".img");
const country = document.querySelector(".city-name");
const speed = document.querySelector(".speed");
const speedDeg = document.querySelector(".speed-degree");
const temp = document.querySelector(".temp");
const weather = document.querySelector(".weather");
const cloudVal = document.querySelector(".cloud-value");
const search = document.querySelector(".search-bar");
const searchBtn = document.querySelector(".search-btn");
const card = document.querySelector(".card");

curLocationBtn.addEventListener("click", function () {
  navigator.geolocation.getCurrentPosition((pos) => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    getWeather(lat, lng);
  }, errorFunction);
});

const getWeather = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}`
    );
    if (!response.ok)
      throw new Error(`${response.statusText} (${response.status})`);

    const data = await response.json();
    weatherDetails(data);
  } catch (err) {
    if (err.message.includes("Failed to fetch"))
      errorFunction("Network error. Please check your internet connection.");
    else errorFunction(err);
  }
};

searchBtn.addEventListener("click", async function () {
  const country = search.value;
  try {
    const response2 = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${country}&limit=5&appid=${apiKey}`
    );
    if (!response2.ok)
      throw new Error(`${response2.statusText} (${response2.status})`);

    const data = await response2.json();
    if (data.length === 0) throw new Error("City can't be found");
    getWeather(data[0].lat, data[0].lon);
  } catch (err) {
    if (err.message.includes("Failed to fetch"))
      errorFunction("Network error. Please check your internet connection.");
    else errorFunction(err);
  } finally {
    search.value = "";
  }
});

const errorFunction = function (err) {
  country.textContent = `${err}`;
  img.src = "images/error.png";
  console.error(err);
  speed.textContent = "";
  speedDeg.textContent = "";
  temp.textContent = "";
  weather.textContent = "";
  cloudVal.textContent = "";
  card.style.background = "linear-gradient(135deg, #f08186, #d41847";
};

const weatherDetails = function (data) {
  country.textContent = `${data.name} ,${data.sys.country}`;
  img.src = `images/${data.weather[0].main}.png`;
  speed.textContent = `${data.wind.speed}`;
  speedDeg.textContent = `${data.wind.deg}`;
  temp.textContent = `${data.main.temp}`;
  weather.textContent = `${data.weather[0].description}`;
  cloudVal.textContent = `${data.clouds.all}%`;
  card.style.background = "linear-gradient(135deg, #00feba, #5b548a)";
};
