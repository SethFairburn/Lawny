function WeatherCard({ temperature, condition, note }) {
  return (
    <div className="weather-card">
      <p className="eyebrow">WEATHER</p>
      <h3>Today</h3>

      <div className="weather-main">
        <span className="weather-icon">☀️</span>

        <div>
          <div className="temperature">{temperature}</div>
          <p>{condition}</p>
        </div>
      </div>

      <div className="weather-note">
        {note}
      </div>
    </div>
  );
}

export default WeatherCard;