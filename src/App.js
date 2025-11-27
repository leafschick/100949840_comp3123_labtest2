import React, { useState, useEffect } from "react";
import "./App.css";
import WeatherCard from "./components/WeatherCard";
import ForecastStrip from "./components/ForecastStrip";

// my personal API key for OpenWeatherMap
const API_KEY = "39e1613133dedd8456ebdb97c55edbf9";

  // main app state – holding the city, weather info, forecast, alerts, and the live clock

function App() {
  const [city, setCity] = useState("Toronto");
  const [weatherData, setWeatherData] = useState(null);
  const [forecastInfo, setForecastInfo] = useState([]); // 5-day forecast
  const [isLoading, setIsLoading] = useState(false);
  const [weatherAlert, setWeatherAlert] = useState("");
  const [alertMessage, setAlertMessage] = useState("");


  const [currentTime, setCurrentTime] = useState(new Date());

  // update the time every second for the live clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);


  // update the city as the user types
  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  // handles when someone picks a city from the dropdown list
  const handlePresetCityChange = (event) => {
    const pickedCity = event.target.value;
    if (!pickedCity) return;
    setCity(pickedCity);
  };

  const buildFiveDayForecast = (list) => {
    const byDate = {};

    list.forEach((entry) => {
      const dateKey = entry.dt_txt.split(" ")[0]; // "YEAR-MONTH-DATE"
      const tempMax = entry.main.temp_max;
      const mainWeather = entry.weather[0];

      if (!byDate[dateKey]) {
        byDate[dateKey] = {
          dateKey,
          maxTemp: tempMax,
          weather: mainWeather,
        };
      } else if (tempMax > byDate[dateKey].maxTemp) {
        byDate[dateKey].maxTemp = tempMax;
        byDate[dateKey].weather = mainWeather;
      }
    });

    // only keep the first 5 days
    return Object.values(byDate).slice(0, 5);
  };

    // quick check for any strong or extreme weather based on the current condition
    const checkWeatherAlert = (condition) => {
    if (!condition) {
      setWeatherAlert("No major weather alert.");
      return;
    }

    const main = condition.main?.toLowerCase() || "";
    const desc = condition.description?.toLowerCase() || "";

    // list of severe weather keywords
    const severeList = [
      "storm",
      "thunder",
      "hurricane",
      "tornado",
      "blizzard",
      "snowstorm",
      "heavy snow",
      "freezing rain",
      "flood",
      "extreme",
      "hail"
    ];

    // check if any severe keyword matches
    const isSevere = severeList.some((word) => main.includes(word) || desc.includes(word));

    if (isSevere) {
      setWeatherAlert(`⚠ Weather Alert: ${condition.main} - ${condition.description}`);
    } else {
      setWeatherAlert("No major weather alert.");
    }
  };


  // call the weather API when the form is submitted
  const handleWeatherSubmit = async (event) => {
    event.preventDefault();

    if (!city.trim()) {
      return;
    }

    setIsLoading(true);
    setAlertMessage("");
    setWeatherData(null);
    setForecastInfo([]); 

    try {
      // current weather
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          city
        )}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error(
          "We couldn't find that city. Maybe check the spelling?"
        );
      }

        const jsonData = await response.json();
        setWeatherData(jsonData);      
        checkWeatherAlert(jsonData.weather[0]);

      // 5-day / 3-hour forecast
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
          city
        )}&appid=${API_KEY}&units=metric`
      );

      if (forecastRes.ok) {
        const forecastJson = await forecastRes.json();
        const days = buildFiveDayForecast(forecastJson.list);
        setForecastInfo(days);
      }
    } catch (err) {
      setAlertMessage(err.message || "Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // clock, greeting, search, alerts, main weather card and forecast
  return (
    <div className="app">
      <div className="app-container">
        <div className="top-row">
        <div className="app-name">Weather Buddy</div>

        <div className="clock-box">
          <span className="clock-label">Local time</span>
          <span className="clock-value">
            {currentTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </span>
        </div>
      </div>
        <p className="greeting-text">
        {new Date().getHours() < 12
        ? "Good morning!"
        : new Date().getHours() < 18
        ? "Good afternoon!"
        : "Good evening!"}
        </p>

        <h1 className="title">Simple Weather Check</h1>
        <p className="subtitle">
          Type in the city name to see the current weather.
        </p>

        <div className={`alert-strip ${weatherAlert.includes("⚠") ? "alert-danger" : "alert-safe"}`}>
          {weatherAlert}
        </div>

        <form className="search-form" onSubmit={handleWeatherSubmit}>
          <input
            type="text"
            value={city}
            onChange={handleCityChange}
            placeholder="Enter any city (ex: Toronto, Dubai, Tokyo)"
            className="city-input"
          />
          <button type="submit" className="search-btn">
            Search
          </button>
        </form>

        {/* dropdown for preset GTA cities */}
        <div className="city-select-row">
          <label className="select-label" htmlFor="preset-city">
            Or choose a nearby city:
          </label>
          <select
            id="preset-city"
            className="city-dropdown"
            onChange={handlePresetCityChange}
            defaultValue=""
          >
            <option value="" disabled>
              Select a city…
            </option>
            <option value="Toronto">Toronto</option>
            <option value="Pickering">Pickering</option>
            <option value="Ajax">Ajax</option>
            <option value="Mississauga">Mississauga</option>
            <option value="Oshawa">Oshawa</option>
            <option value="Peterborough">Peterborough</option>
            <option value="Milton">Milton</option>
            <option value="Brampton">Brampton</option>
            <option value="Oakville">Oakville</option>
          </select>
        </div>

        {isLoading && (
          <p className="status">Please wait, getting the weather...</p>
        )}
        {alertMessage && <p className="alert-box">{alertMessage}</p>}

        {!isLoading && !alertMessage && weatherData && (
          <>
            <WeatherCard data={weatherData} />

            {forecastInfo.length > 0 && <ForecastStrip days={forecastInfo} />}
          </>
        )}

        {!isLoading && !alertMessage && !weatherData && (
          <p className="status">
            No weather info yet. Type a city above or pick one from the list.
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
