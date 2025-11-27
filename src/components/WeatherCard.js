import React from "react";

function WeatherCard({ data }) {

  if (!data) return null;

  const { name, sys, main, weather, wind } = data;
  const currentInfo = weather ? weather[0] : null;

  const weatherIcon = currentInfo
    ? `http://openweathermap.org/img/wn/${currentInfo.icon}@2x.png`
    : "";

     /*
    This section will show layout for the weather card.
    It shows city name, main weather condition, the big
    temperature display, weather icon with its description.
    Underneath that, it will show the smaller details like humidity,
    wind speed, and air pressure depending on what the API returned.
    */
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
