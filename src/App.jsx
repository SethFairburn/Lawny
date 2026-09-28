import { useEffect, useState } from "react";

import "./App.css";
import WeatherCard from "./components/WeatherCard";
import NextUp from "./components/NextUp";
import Navigation from "./components/Navigation";
import Watering from "./pages/Watering";
import Applications from "./pages/Applications";
import Products from "./pages/Products";
import Equipment from "./pages/Equipment";

function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [applications, setApplications] = useState([]);
  const [wateringSchedule, setWateringSchedule] = useState([]);
  const [products, setProducts] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [lawns, setLawns] = useState([]);
  const [weather, setWeather] = useState(null);
  const primaryLawn = lawns[0];

  useEffect(() => {
    fetch("http://localhost:8080/api/watering")
      .then((response) => response.json())
      .then((data) => setWateringSchedule(data));

    fetch("http://localhost:8080/api/applications")
      .then((response) => response.json())
      .then((data) => setApplications(data));

    fetch("http://localhost:8080/api/products")
      .then((response) => response.json())
      .then((data) => setProducts(data));

    fetch("http://localhost:8080/api/lawns")
      .then((response) => response.json())
      .then((data) => setLawns(data));

    fetch("http://localhost:8080/api/equipment")
      .then((response) => response.json())
      .then((data) => setEquipment(data));

    fetch("http://localhost:8080/api/weather")
      .then((response) => response.json())
      .then((data) => setWeather(data));
  }, []);

  const goToPage = (page) => {
    setActivePage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const formatTime = (time) => {
    const [hour, minute] = time.split(":");

    const date = new Date();
    date.setHours(Number(hour), Number(minute));

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const week = weather
    ? weather.dailyForecast.map((forecast) => {
        const date = new Date(`${forecast.date}T00:00:00`);

        const fullDayName = date
          .toLocaleDateString("en-US", {
            weekday: "long",
          })
          .toUpperCase();

        const watering = wateringSchedule.find(
          (watering) => watering.day === fullDayName,
        );

        return {
          date: forecast.date,
          day: date.toLocaleDateString("en-US", {
            weekday: "short",
          }),
          icon: forecast.icon,
          condition: forecast.condition,
          rainChance: forecast.rainChance,
          watering,
        };
      })
    : [];

  return (
    <div className="app">
      <div className="app-header">
        <header className="topbar">
          <div>
            <h1 className="lawny-logo" onClick={() => goToPage("dashboard")}>
              Lawny
            </h1>
            <p>Your lawn, organized.</p>
          </div>

          <div className="location">Austin, TX</div>
        </header>
        <Navigation activePage={activePage} setActivePage={goToPage} />
      </div>
      {activePage === "dashboard" && (
        <main className="dashboard">
          <section className="welcome">
            <p className="eyebrow">YOUR LAWN</p>
            <h2>Good afternoon, Seth.</h2>
            <p>Here’s what your lawn needs next.</p>
          </section>
          <section className="lawn-card">
            <div>
              <p className="lawn-type">
                {primaryLawn ? primaryLawn.grassType.toUpperCase() : "NO LAWN"}
              </p>

              <h3>{primaryLawn ? primaryLawn.name : "Add your lawn"}</h3>

              {primaryLawn && (
                <p>{primaryLawn.squareFeet.toLocaleString()} sq ft</p>
              )}
            </div>

            <div className="lawn-status">
              <span className="status-dot"></span>
              Looking good
            </div>
          </section>
          <NextUp
            wateringSchedule={wateringSchedule}
            applications={applications}
            setActivePage={setActivePage}
          />
          <section className="dashboard-bottom">
            <div className="week-card">
              <p className="eyebrow">CALENDAR</p>
              <h3>This Week</h3>
              <div className="week-list">
                {week.map((item) => (
                  <div className="week-row" key={item.date}>
                    <strong>{item.day}</strong>

                    <div className="week-watering">
                      {item.watering && (
                        <>
                          <span>💧</span>
                          <span>{formatTime(item.watering.time)}</span>
                        </>
                      )}
                    </div>

                    <div className="week-weather">
                      <span className="week-weather-icon">{item.icon}</span>
                      <span className="week-condition">{item.condition}</span>
                      <span className="week-rain">{item.rainChance}% rain</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <WeatherCard
              temperature={
                weather ? `${Math.round(weather.currentTemperature)}°` : "--°"
              }
              condition={weather ? weather.currentCondition : "Loading..."}
              note="Rain expected tomorrow. You may be able to skip your next watering."
            />
          </section>
        </main>
      )}
      {activePage === "watering" && (
        <Watering
          wateringSchedule={wateringSchedule}
          setWateringSchedule={setWateringSchedule}
        />
      )}
      {activePage === "applications" && (
        <Applications
          applications={applications}
          setApplications={setApplications}
          products={products}
          setActivePage={setActivePage}
        />
      )}
      {activePage === "products" && (
        <Products products={products} setProducts={setProducts} />
      )}
      {activePage === "equipment" && (
        <Equipment equipment={equipment} setEquipment={setEquipment} />
      )}
    </div>
  );
}

export default App;
