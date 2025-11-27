import React from "react";

// show the next 5 days (emoji + temp + short label)

function ForecastStrip({ days }) {
  const getEmojiForCondition = (mainText) => {

    // pick a  emoji based on the main weather type
    if (!mainText) return "🌤️";
    const t = mainText.toLowerCase();

    if (t.includes("clear")) return "☀️";
    if (t.includes("cloud")) return "☁️";
    if (t.includes("rain")) return "🌧️";
    if (t.includes("snow")) return "❄️";
    if (t.includes("storm") || t.includes("thunder")) return "⛈️";
    if (t.includes("drizzle")) return "🌦️";

    return "🌤️";
  };

    // turn the date key into something short like "Mon", "Tue", etc.
  const formatDayLabel = (dateKey) => {
    const d = new Date(dateKey);
    return d.toLocaleDateString(undefined, { weekday: "short" }); 
  };

  return (
    <div className="forecast-wrapper">
      <h3 className="forecast-title">Next 5 days</h3>
      <div className="forecast-row">
        {days.map((day) => (
          <div key={day.dateKey} className="forecast-item">
            <div className="forecast-day">{formatDayLabel(day.dateKey)}</div>

            <div className="forecast-emoji">
              {getEmojiForCondition(day.weather?.main)}
            </div>

            <div className="forecast-temp">
              {Math.round(day.maxTemp)}°C
            </div>

            <div className="forecast-desc">{day.weather?.main}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ForecastStrip;
