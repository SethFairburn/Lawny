import { useEffect, useState } from "react";

function Watering({ wateringSchedule, setWateringSchedule }) {
  const [wateringDay, setWateringDay] = useState("MONDAY");
  const [wateringTime, setWateringTime] = useState("06:00");
  const [wateringDuration, setWateringDuration] = useState(20);

  const loadWateringSchedule = () => {
    fetch("http://localhost:8080/api/watering")
      .then((response) => response.json())
      .then((data) => {
        setWateringSchedule(data);
      })
      .catch((error) => {
        console.error("Error loading watering schedule:", error);
      });
  };

  useEffect(() => {
    loadWateringSchedule();
  }, []);

  const nextWatering = wateringSchedule[0];

  const formatDay = (day) => {
    return day.charAt(0) + day.slice(1).toLowerCase();
  };

  const formatWateringTime = (time) => {
    const [hour, minute] = time.split(":");

    const date = new Date();
    date.setHours(Number(hour), Number(minute));

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const addWatering = () => {
    fetch("http://localhost:8080/api/watering", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        day: wateringDay,
        time: wateringTime,
        minutes: wateringDuration,
      }),
    })
      .then((response) => response.json())
      .then(() => {
        loadWateringSchedule();
      })
      .catch((error) => {
        console.error("Error adding watering:", error);
      });
  };

  const removeWatering = (wateringId) => {
    const updatedSchedule = wateringSchedule.filter(
      (watering) => watering.id !== wateringId,
    );

    setWateringSchedule(updatedSchedule);
  };

  return (
    <main className="dashboard">
      <section className="welcome">
        <p className="eyebrow">IRRIGATION</p>
        <h2>Watering</h2>
        <p>Manage your lawn's watering schedule.</p>
      </section>
      {nextWatering ? (
        <section className="next-watering-card">
          <div>
            <p className="eyebrow">NEXT WATERING</p>

            <h3>{formatDay(nextWatering.day)}</h3>

            <p className="watering-time">
              {formatWateringTime(nextWatering.time)}
            </p>
          </div>

          <div className="watering-details">
            <span>💧</span>

            <div>
              <strong>{nextWatering.minutes} minutes</strong>
              <p>Scheduled</p>
            </div>

            <button
              className="next-watering-remove"
              onClick={() => removeWatering(nextWatering.id)}
            >
              Remove
            </button>
          </div>
        </section>
      ) : (
        <section className="next-watering-card">
          <div>
            <p className="eyebrow">NEXT WATERING</p>
            <h3>No watering scheduled</h3>
            <p className="watering-time">Add a watering day below.</p>
          </div>
        </section>
      )}
      <section className="watering-schedule">
        <div className="section-heading">
          <div>
            <p className="eyebrow">WEEKLY SCHEDULE</p>
            <h3>Watering Days</h3>
          </div>
          <div className="watering-controls">
            <label className="watering-field">
              <span>Day</span>

              <select
                value={wateringDay}
                onChange={(event) => setWateringDay(event.target.value)}
              >
                <option value="MONDAY">Monday</option>
                <option value="TUESDAY">Tuesday</option>
                <option value="WEDNESDAY">Wednesday</option>
                <option value="THURSDAY">Thursday</option>
                <option value="FRIDAY">Friday</option>
                <option value="SATURDAY">Saturday</option>
                <option value="SUNDAY">Sunday</option>
              </select>
            </label>

            <label className="watering-field">
              <span>Time</span>

              <input
                type="time"
                value={wateringTime}
                onChange={(event) => setWateringTime(event.target.value)}
              />
            </label>

            <label className="watering-field">
              <span>Duration (mins)</span>

              <input
                type="number"
                min="1"
                value={wateringDuration}
                onChange={(event) =>
                  setWateringDuration(Number(event.target.value))
                }
              />
            </label>

            <button onClick={addWatering}>+ Add</button>
          </div>
        </div>

        <div className="watering-schedule-list">
          {wateringSchedule.slice(1).map((watering) => (
            <div className="watering-schedule-row" key={watering.id}>
              <div>
                <strong>{formatDay(watering.day)}</strong>
                <p>{formatWateringTime(watering.time)}</p>
              </div>

              <div className="watering-row-actions">
                <span>{watering.minutes} minutes</span>

                <button onClick={() => removeWatering(watering.id)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Watering;
