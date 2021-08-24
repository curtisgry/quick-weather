import './style.css';
import img from './img/arrow.png';

// API KEY : c7cab282d977e30f86632bb2f76f9eb7

// icon link http://openweathermap.org/img/w/10d.png

let zip;

const inputs = document.querySelectorAll('input');

const zipEntered = [];

const cityName = document.querySelector('.city-name');
const startText = document.querySelector('.start-text');
const weatherInfo = document.querySelector('.weather-info');

const baseEndpoint = `https://api.openweathermap.org/data/2.5/`;

function handleError() {
        startText.textContent = 'Uh oh! Nothing was found :(';
}

async function getData() {
        const res = await fetch(
                `${baseEndpoint}weather?zip=${zip},us&units=imperial&appid=c7cab282d977e30f86632bb2f76f9eb7`
        );
        const data = await res.json();
        return data;
}

async function getZipData() {
        const res = await fetch(`http://api.zippopotam.us/us/${zip}`);
        const data = await res.json();
        return data;
}

async function updateWeather(dataWeather, dataCity) {
        const cityData = await dataCity;
        const weatherData = await dataWeather;
        const stateInfo = cityData.places ? cityData.places[0] : null;
        if (weatherData && stateInfo) {
                startText.textContent = '';
                renderResult(stateInfo, weatherData);
        } else {
                handleError();
        }
}

function renderResult(state, weather) {
        cityName.textContent = `${state['place name']}, ${state['state abbreviation']}`;

        const { deg } = weather.wind;

        weatherInfo.innerHTML = `
                <div class="current">
                        <h3>Currently</h3>
                        <span class="temp">${Math.floor(weather.main.temp)}°</span>
                        <span>
                        ${weather.weather[0].main}
                        <img class="icon" src="http://openweathermap.org/img/w/${weather.weather[0].icon}.png">
                        </span>
                        <span>
                        Wind: ${Math.floor(weather.wind.speed)} - MPH 
                        <img style="transform:rotate(${deg + 90}deg)" class="wind-icon" src="${img}"/>
                        </span>
                </div>
                
        `;
        cityName.classList.add('fade-rise');
        const transition1 = cityName;
        transition1.addEventListener('transitionend', () => {
                weatherInfo.classList.add('fade-rise');
        });
}

function handleZipInput(input) {
        cityName.classList.remove('fade-rise');
        weatherInfo.classList.remove('fade-rise');
        weatherInfo.innerHTML = '';
        if (input.value.length == input.maxLength) {
                zipEntered.push(input.value);
                if (input.nextElementSibling) {
                        input.nextElementSibling.focus();
                } else {
                        zip = zipEntered.join('');
                        const dataWeather = getData();
                        const dataCity = getZipData();
                        updateWeather(dataWeather, dataCity);
                        document.activeElement.blur();
                }
        } else if (input.previousElementSibling) {
                cityName.textContent = 'Enter your zip code to see the current weather.';
                zipEntered.length = 0;
                inputs.forEach((item) => {
                        item.value = '';
                        if (item.id == 'start') {
                                item.focus();
                        }
                });
        }
}

inputs.forEach((input) => {
        input.addEventListener('input', () => {
                handleZipInput(input);
        });
        input.addEventListener('keyup', function (e) {
                if (e.key === 'Backspace') {
                        if (this.previousElementSibling) {
                                zipEntered.pop();
                                if (this.previousElementSibling.value) {
                                        this.previousElementSibling.value = '';
                                }
                                this.previousElementSibling.focus();
                        }
                }
        });
});
