import './App.css';
import { Search, MapPin, Wind, User, Star } from 'react-feather';
import getWeather from './api/api'; // Ensure this path is correct
import { useState, useEffect } from 'react';
import dateFormat from 'dateformat';

import sunnyIcon from './icons/sunnyicon.jpg'; // Adjust the path if necessary
import rainyIcon from './icons/rainy.png';
import cloudyIcon from './icons/cloudy.png';
import defaultIcon from './icons/default.png'; // Default icon for unspecified conditions

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [loadingMessage, setLoadingMessage] = useState(""); // State for loading message
  const [showFavoritesText, setShowFavoritesText] = useState(false); // State to control visibility of "Add to Favorites" text

  // Load favorites from local storage on component mount
  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(savedFavorites);
  }, []);

  // Function to map weather descriptions to custom icons
  const getCustomWeatherIcon = (description) => {
    switch (description) {
      case 'clear sky':
        return sunnyIcon; // Custom sunny icon
      case 'few clouds':
      case 'scattered clouds':
      case 'broken clouds':
        return cloudyIcon; // Custom cloudy icon
      case 'rain':
      case 'light rain':
      case 'moderate rain':
        return rainyIcon; // Custom rainy icon
      default:
        return defaultIcon; // Use a default icon for conditions not specified
    }
  };

  const getWeatherbyCity = async () => {
    try {
      const weatherData = await getWeather(city);
      setWeather(weatherData);
      setCity("");
      setShowFavoritesText(false); // Reset text visibility when searching for a new city
    } catch (error) {
      console.error(error);
      alert("Error fetching weather data for the specified city.");
    }
  };

  const getWeatherByLocation = async () => {
    setLoadingMessage("Fetching current location weather..."); // Show loading message
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const weatherData = await getWeather(null, latitude, longitude); // Pass null for city
          setWeather(weatherData);
          setLoadingMessage(""); // Clear loading message
          setShowFavoritesText(false); // Reset text visibility when searching for a new city
        } catch (error) {
          console.error(error);
          alert("Error fetching weather data for your location.");
          setLoadingMessage(""); // Clear loading message
        }
      }, (error) => {
        console.error("Error getting location: ", error);
        alert("Unable to retrieve your location. Please try again.");
        setLoadingMessage(""); // Clear loading message
      });
    } else {
      alert("Geolocation is not supported by this browser.");
      setLoadingMessage(""); // Clear loading message
    }
  };

  const toggleFavorite = (cityName) => {
    if (favorites.includes(cityName)) {
      const updatedFavorites = favorites.filter(fav => fav !== cityName);
      setFavorites(updatedFavorites);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    } else {
      const updatedFavorites = [...favorites, cityName];
      setFavorites(updatedFavorites);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    }
    setShowFavoritesText(!showFavoritesText); // Toggle visibility of text
  };

  const renderDate = () => {
    let now = new Date();
    return dateFormat(now, "dddd, mmmm dS, h:MM TT");
  };

  return (
    <div className="app">
      <h1>Weather App</h1>
      <div className="input-wrapper">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder='Enter City Name'
        />
        <button onClick={getWeatherbyCity}>
          <Search />
        </button>
        <button onClick={getWeatherByLocation}>
          <User /> {/* Icon for current location */}
        </button>
      </div>

      {loadingMessage && (
        <div className="loading-message">
          <p>{loadingMessage}</p>
        </div>
      )}

      {weather && weather.weather && (
        <div className="content">
          <div className="location d-flex">
            <MapPin />
            <h2>
              {weather.name} <span>({weather.sys.country})</span>
              <div className="favorite-container" onClick={() => toggleFavorite(weather.name)}>
                <Star 
                  color={favorites.includes(weather.name) ? 'gold' : 'gray'} 
                  size={24} // Adjust the size of the star icon
                />
                {/* Show "Add to Favorites" or "Remove from Favorites" based on city status */}
                <span className="favorites-text">
                  {favorites.includes(weather.name) ? "Remove from Favorites" : "Add to Favorites"}
                </span>
              </div>
            </h2>
          </div>
          <p className="datetext">{renderDate()}</p>

          <div className="weatherdesc d-flex flex-c">
            <img 
              src={getCustomWeatherIcon(weather.weather[0].description)} 
              alt={weather.weather[0].description} 
              className="weather-icon" // Apply the CSS class
            />
            <h3>{weather.weather[0].description}</h3>
          </div>

          <div className="tempstats d-flex flex-c">
            <h1>{weather.main.temp} <span>&deg;C</span></h1>
            <h3>Feels Like {weather.main.feels_like} <span>&deg;C</span></h3>
          </div>

          <div className="windstats d-flex">
            <Wind />
            <h3>Wind is {weather.wind.speed} Knots</h3>
          </div>
        </div>
      )}

      {!weather.weather && <div className="content">
        <h4>No Data found!</h4>
      </div>}

      {/* Favorites List */}
      <div className="favorites">
        <h2>Favorite Cities</h2>
        <ul>
          {favorites.map((favCity) => (
            <li key={favCity}>{favCity}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
