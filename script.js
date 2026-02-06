const searchBtn = document.getElementById('search-btn');
const cityInput = document.getElementById('city-input');
const searchError = document.getElementById('search-error');
const weatherContainer = document.getElementById('weather-container');
const loading = document.getElementById('loading');
const welcomeMsg = document.getElementById('welcome-msg');
const forecastGrid = document.getElementById('forecast-grid');
const suggestionsList = document.getElementById('suggestions-list');
const districtsGrid = document.getElementById('districts-grid');

// Tamil Nadu Districts Data
const tnDistricts = [
    { name: 'Ariyalur', lat: 11.1401, lon: 79.0786 },
    { name: 'Chengalpattu', lat: 12.6918, lon: 79.9766 },
    { name: 'Chennai', lat: 13.0827, lon: 80.2707 },
    { name: 'Coimbatore', lat: 11.0168, lon: 76.9558 },
    { name: 'Cuddalore', lat: 11.7480, lon: 79.7714 },
    { name: 'Dharmapuri', lat: 12.1211, lon: 78.1582 },
    { name: 'Dindigul', lat: 10.3673, lon: 77.9803 },
    { name: 'Erode', lat: 11.3410, lon: 77.7172 },
    { name: 'Kallakurichi', lat: 11.7621, lon: 78.9644 },
    { name: 'Kancheepuram', lat: 12.8185, lon: 79.6947 },
    { name: 'Kanyakumari', lat: 8.0883, lon: 77.5385 },
    { name: 'Karur', lat: 10.9601, lon: 78.0766 },
    { name: 'Krishnagiri', lat: 12.5186, lon: 78.2137 },
    { name: 'Madurai', lat: 9.9252, lon: 78.1198 },
    { name: 'Mayiladuthurai', lat: 11.1075, lon: 79.6524 },
    { name: 'Nagapattinam', lat: 10.7672, lon: 79.8450 },
    { name: 'Namakkal', lat: 11.2189, lon: 78.1675 },
    { name: 'Nilgiris', lat: 11.4102, lon: 76.6950 },
    { name: 'Perambalur', lat: 11.2358, lon: 78.8810 },
    { name: 'Pudukkottai', lat: 10.3797, lon: 78.8208 },
    { name: 'Ramanathapuram', lat: 9.3639, lon: 78.8395 },
    { name: 'Ranipet', lat: 12.9273, lon: 79.3330 },
    { name: 'Salem', lat: 11.6643, lon: 78.1460 },
    { name: 'Sivaganga', lat: 9.8433, lon: 78.4809 },
    { name: 'Tenkasi', lat: 8.9594, lon: 77.3129 },
    { name: 'Thanjavur', lat: 10.7870, lon: 79.1378 },
    { name: 'Theni', lat: 10.0104, lon: 77.4768 },
    { name: 'Thoothukudi', lat: 8.7642, lon: 78.1348 },
    { name: 'Tiruchirappalli', lat: 10.7905, lon: 78.7047 },
    { name: 'Tirunelveli', lat: 8.7139, lon: 77.7567 },
    { name: 'Tirupathur', lat: 12.4965, lon: 78.5686 },
    { name: 'Tiruppur', lat: 11.1085, lon: 77.3411 },
    { name: 'Tiruvallur', lat: 13.1432, lon: 79.9120 },
    { name: 'Tiruvannamalai', lat: 12.2253, lon: 79.0747 },
    { name: 'Tiruvarur', lat: 10.7661, lon: 79.6378 },
    { name: 'Vellore', lat: 12.9165, lon: 79.1325 },
    { name: 'Viluppuram', lat: 11.9401, lon: 79.4861 },
    { name: 'Virudhunagar', lat: 9.5680, lon: 77.9624 }
];

// API URLs (Open-Meteo)
const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

// Mapping WMO Weather Codes to FontAwesome Icons and descriptions
const weatherCodes = {
    0: { icon: 'fa-sun', desc: 'Clear sky' },
    1: { icon: 'fa-cloud-sun', desc: 'Mainly clear' },
    2: { icon: 'fa-cloud-sun', desc: 'Partly cloudy' },
    3: { icon: 'fa-cloud', desc: 'Overcast' },
    45: { icon: 'fa-smog', desc: 'Fog' },
    48: { icon: 'fa-smog', desc: 'Depositing rime fog' },
    51: { icon: 'fa-cloud-rain', desc: 'Light drizzle' },
    53: { icon: 'fa-cloud-rain', desc: 'Moderate drizzle' },
    55: { icon: 'fa-cloud-showers-heavy', desc: 'Dense drizzle' },
    61: { icon: 'fa-cloud-rain', desc: 'Slight rain' },
    63: { icon: 'fa-cloud-rain', desc: 'Moderate rain' },
    65: { icon: 'fa-cloud-showers-heavy', desc: 'Heavy rain' },
    71: { icon: 'fa-snowflake', desc: 'Slight snow' },
    73: { icon: 'fa-snowflake', desc: 'Moderate snow' },
    75: { icon: 'fa-snowflake', desc: 'Heavy snow' },
    80: { icon: 'fa-cloud-showers-heavy', desc: 'Slight rain showers' },
    81: { icon: 'fa-cloud-showers-heavy', desc: 'Moderate showers' },
    82: { icon: 'fa-cloud-showers-heavy', desc: 'Violent showers' },
    95: { icon: 'fa-bolt', desc: 'Thunderstorm' },
    96: { icon: 'fa-bolt', desc: 'Thunderstorm with hail' },
    99: { icon: 'fa-bolt', desc: 'Thunderstorm with heavy hail' }
};

// Event Listeners
// Event Listeners
searchBtn.addEventListener('click', () => handleSearch(cityInput.value.trim()));
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch(cityInput.value.trim());
});

// Search Suggestions
let debounceTimer;
cityInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    clearTimeout(debounceTimer);

    if (query.length < 3) {
        suggestionsList.classList.add('hidden');
        return;
    }

    debounceTimer = setTimeout(() => fetchSuggestions(query), 300);
});

// Close suggestions when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-section')) {
        suggestionsList.classList.add('hidden');
    }
});

// Initial Load
window.addEventListener('load', () => {
    handleSearch('Chengalpattu');
    loadDistricts();
});

async function handleSearch(queryCity) {
    const city = queryCity || cityInput.value.trim();
    if (!city) return;

    showLoading();

    try {
        const locationData = await getCoordinates(city);
        if (!locationData) {
            showError(`City "${city}" not found.`);
            return;
        }

        await fetchAndDisplayWeather(locationData.latitude, locationData.longitude, locationData.name, locationData.country_code);

    } catch (error) {
        console.error(error);
        showError('Something went wrong. Please try again.');
    }
}

async function fetchAndDisplayWeather(lat, lon, name, country) {
    try {
        const weatherData = await getWeatherData(lat, lon);
        updateUI(weatherData, { name, country_code: country || '' });
        showWeather();
    } catch (error) {
        throw error;
    }
}

async function getCoordinates(city) {
    const url = `${GEOCODING_API}?name=${city}&count=1&language=en&format=json`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.results || data.results.length === 0) return null;

    return data.results[0]; // { id, name, latitude, longitude, country, ... }
}

async function getWeatherData(lat, lon) {
    // requesting current weather and daily forecast (7 days)
    // added: apparent_temperature, visibility (current)
    // added: sunrise, sunset, precipitation_probability_max (daily)
    const url = `${WEATHER_API}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,surface_pressure,wind_speed_10m,apparent_temperature,visibility&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max&timezone=auto`;
    const response = await fetch(url);
    return await response.json();
}

function updateUI(weather, location) {
    // 1. Update Current Weather
    const current = weather.current;

    document.getElementById('city-name').textContent = `${location.name}, ${location.country_code}`;
    document.getElementById('current-date').textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    document.getElementById('current-temp').textContent = Math.round(current.temperature_2m);
    document.getElementById('wind-speed').textContent = `${current.wind_speed_10m} km/h`;
    document.getElementById('humidity').textContent = `${current.relative_humidity_2m}%`;
    document.getElementById('pressure').textContent = `${current.surface_pressure} hPa`;

    // New fields
    document.getElementById('feels-like').textContent = `${Math.round(current.apparent_temperature)}°`;

    // Visibility is in meters, convert to km
    const visKm = current.visibility ? (current.visibility / 1000).toFixed(1) : '--';
    document.getElementById('visibility').textContent = `${visKm} km`;

    // Daily stats (using the first day, which is today)
    const today = weather.daily;
    const precipProb = today.precipitation_probability_max ? today.precipitation_probability_max[0] : 0;
    document.getElementById('precipitation').textContent = `${precipProb}%`;

    const sunrise = today.sunrise[0] ? new Date(today.sunrise[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--';
    const sunset = today.sunset[0] ? new Date(today.sunset[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--';

    document.getElementById('sunrise').textContent = sunrise;
    document.getElementById('sunset').textContent = sunset;

    const code = current.weather_code;
    const weatherInfo = weatherCodes[code] || { icon: 'fa-question', desc: 'Unknown' };

    document.getElementById('weather-desc').textContent = weatherInfo.desc;
    document.getElementById('weather-icon').className = `weather-icon fa-solid ${weatherInfo.icon}`;

    // 2. Update Forecast
    forecastGrid.innerHTML = '';

    const daily = weather.daily;
    const dates = daily.time;
    const maxTemps = daily.temperature_2m_max;
    const minTemps = daily.temperature_2m_min;
    const codes = daily.weather_code;

    // We skip index 0 because that's today
    for (let i = 1; i < dates.length; i++) {
        const dateObj = new Date(dates[i]);
        const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
        const dayCode = codes[i];
        const dayInfo = weatherCodes[dayCode] || { icon: 'fa-question', desc: 'Unknown' };

        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
            <div class="forecast-day">${dayName}</div>
            <i class="forecast-icon fa-solid ${dayInfo.icon}"></i>
            <div class="forecast-temp">${Math.round(maxTemps[i])}°</div>
            <div class="forecast-range">${Math.round(minTemps[i])}°</div>
        `;
        forecastGrid.appendChild(card);
    }
}

// UI State Helpers
function showLoading() {
    searchError.classList.add('hidden');
    welcomeMsg.classList.add('hidden');
    weatherContainer.classList.add('hidden');
    loading.classList.remove('hidden');
}

function showWeather() {
    loading.classList.add('hidden');
    weatherContainer.classList.remove('hidden');
}

function showError(msg) {
    loading.classList.add('hidden');
    searchError.textContent = msg;
    searchError.classList.remove('hidden');
}

// Search Suggestions Logic
async function fetchSuggestions(query) {
    const url = `${GEOCODING_API}?name=${query}&count=5&language=en&format=json`;
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.results) {
            showSuggestions(data.results);
        } else {
            suggestionsList.classList.add('hidden');
        }
    } catch (error) {
        console.error('Error fetching suggestions:', error);
    }
}

function showSuggestions(results) {
    suggestionsList.innerHTML = '';
    results.forEach(city => {
        const li = document.createElement('li');
        li.className = 'suggestion-item';
        li.innerHTML = `${city.name} <span class="country-code">${city.country || ''}</span>`;
        li.addEventListener('click', () => {
            cityInput.value = city.name;
            suggestionsList.classList.add('hidden');
            handleSearch(city.name);
        });
        suggestionsList.appendChild(li);
    });
    suggestionsList.classList.remove('hidden');
}

// TN Districts Logic
async function loadDistricts() {
    districtsGrid.innerHTML = ''; // Clear existing

    // Fetch weather for all districts
    for (const district of tnDistricts) {
        const weather = await getSimpleWeather(district.lat, district.lon);
        renderDistrictCard(district, weather);
    }
}

async function getSimpleWeather(lat, lon) {
    // Only fetch current temp and code for the cards
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`;
    const response = await fetch(url);
    const data = await response.json();
    return data.current;
}

function renderDistrictCard(district, weather) {
    const code = weather.weather_code;
    const weatherInfo = weatherCodes[code] || { icon: 'fa-question', desc: 'Unknown' };

    const card = document.createElement('div');
    card.className = 'district-card';
    card.innerHTML = `
        <div class="district-name">${district.name}</div>
        <div class="district-temp">${Math.round(weather.temperature_2m)}°C</div>
        <div class="district-condition">
            <i class="fa-solid ${weatherInfo.icon}"></i>
            <span>${weatherInfo.desc}</span>
        </div>
    `;

    // Make card clickable to load full weather
    card.addEventListener('click', () => {
        cityInput.value = district.name;
        showLoading();
        // Use known coordinates directly, skip geocoding
        fetchAndDisplayWeather(district.lat, district.lon, district.name, 'IN')
            .catch(err => {
                console.error(err);
                showError('Failed to load district weather.');
            });

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    districtsGrid.appendChild(card);
}
