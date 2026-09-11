import { useState } from "react";
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
  const [applications, setApplications] = useState([
    {
      id: 1,
      type: "Fertilizer",
      product: "Lesco 15-5-10",
      date: "2026-09-18",
      rate: "5 lbs / 1,000 sq ft",
    },
    {
      id: 2,
      type: "Pre-Emergent",
      product: "Prodiamine",
      date: "2026-10-01",
      rate: "Label rate",
    },
  ]);
  const [wateringSchedule, setWateringSchedule] = useState([
    {
      id: 1,
      day: "Monday",
      time: "06:00",
      duration: 20,
    },
    {
      id: 2,
      day: "Thursday",
      time: "06:00",
      duration: 20,
    },
    {
      id: 3,
      day: "Saturday",
      time: "07:00",
      duration: 15,
    },
  ]);
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Lesco 15-5-10",
      type: "Fertilizer",
      size: "40 lb bag",
      icon: "🌱",
    },
    {
      id: 2,
      name: "Prodiamine",
      type: "Pre-Emergent",
      size: "5 lb container",
      icon: "🧴",
    },
  ]);
  const [equipment, setEquipment] = useState([
    {
      id: 1,
      name: "Push Mower",
      type: "Mower",
      details: "21-inch mower",
    },
    {
      id: 2,
      name: "Broadcast Spreader",
      type: "Spreader",
      details: "Granular applications",
    },
  ]);

  const week = [
    { day: "Mon", task: "Water" },
    { day: "Tue", task: "—" },
    { day: "Wed", task: "—" },
    { day: "Thu", task: "Water" },
    { day: "Fri", task: "—" },
    { day: "Sat", task: "Mow" },
    { day: "Sun", task: "—" },
  ];

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <h1>Lawny</h1>
          <p>Your lawn, organized.</p>
        </div>

        <div className="location">Austin, TX</div>
      </header>
      <Navigation activePage={activePage} setActivePage={setActivePage} />
      {activePage === "dashboard" && (
        <main className="dashboard">
          <section className="welcome">
            <p className="eyebrow">YOUR LAWN</p>
            <h2>Good afternoon, Seth.</h2>
            <p>Here’s what your lawn needs next.</p>
          </section>
          <section className="lawn-card">
            <div>
              <p className="lawn-type">BERMUDA</p>
              <h3>Backyard Lawn</h3>
              <p>1,000 sq ft</p>
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
                  <div className="week-row" key={item.day}>
                    <strong>{item.day}</strong>
                    <span>{item.task}</span>
                  </div>
                ))}
              </div>
            </div>
            <WeatherCard
              temperature="94°"
              condition="Sunny"
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
