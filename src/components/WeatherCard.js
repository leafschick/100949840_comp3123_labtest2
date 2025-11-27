import React from "react";

// shows the main weather info for the selected city
function WeatherCard({ data }) {

    // if there's no data yet, don't show anything
  
    if (!data) return null;

  // pulling out the main parts of the API response
  const { name, sys, main, weather, wind } = data;
  const currentInfo = weather ? weather[0] : null;

  // weather icon from openweather (if available)
  const weatherIcon = currentInfo
    ? `http://openweathermap.org/img/wn/${currentInfo.icon}@2x.png`
    : "";

  
  return (
    <div className="weather-wrapper">
      <div className="report-header">
        <h2 className="city-title">
          {name}, {sys?.country}
        </h2>
        {currentInfo && (
          <span className="condition-text">{currentInfo.main}</span>
        )}
      </div>

      <div className="top-section">
        <div className="temp-area">
          <span className="current-temp">
            {Math.round(main.temp)}°C
          </span>
          <span className="feels-like">
            feels like {Math.round(main.feels_like)}°C
          </span>
        </div>

        {weatherIcon && (
          <div className="icon-box">
            <img src={weatherIcon} alt={currentInfo.description} />
            <span className="condition-desc">
              {currentInfo.description}
            </span>
          </div>
        )}
      </div>

      <div className="extra-details">
        <div>
          <span className="label">Humidity:</span> {main.humidity}%
        </div>
        <div>
          <span className="label">Wind Speed:</span> {wind.speed} m/s
        </div>
        <div>
          <span className="label">Air Pressure:</span> {main.pressure} hPa
        </div>
      </div>
    </div>
  );
}

export default WeatherCard;
