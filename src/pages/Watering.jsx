import { useState } from "react";

function Watering({ wateringSchedule, setWateringSchedule }) {
  const [wateringDay, setWateringDay] = useState("Monday");
  const [wateringTime, setWateringTime] = useState("06:00");
  const [wateringDuration, setWateringDuration] = useState(20);
  const dayOrder = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const today = new Date();
  const currentDayIndex = today.getDay();

  const scheduleWithDate = wateringSchedule.map((watering) => {
    const wateringDayIndex = dayOrder.indexOf(watering.day);

    let daysAway = (wateringDayIndex - currentDayIndex + 7) % 7;

    const [hour, minute] = watering.time.split(":");

    const wateringDate = new Date(today);

    wateringDate.setDate(today.getDate() + daysAway);

    wateringDate.setHours(Number(hour), Number(minute), 0, 0);

    if (wateringDate <= today) {
      wateringDate.setDate(wateringDate.getDate() + 7);
      daysAway += 7;
    }

    return {
      ...watering,
      daysAway,
      wateringDate,
    };
  });

  const sortedSchedule = [...scheduleWithDate].sort(
    (a, b) => a.wateringDate - b.wateringDate,
  );
  const nextWatering = sortedSchedule[0];

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
    const newWatering = {
      id: Date.now(),
      day: wateringDay,
      time: wateringTime,
      duration: wateringDuration,
    };

    setWateringSchedule([...wateringSchedule, newWatering]);
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

            <h3>{nextWatering.day}</h3>

            <p className="watering-time">
              {formatWateringTime(nextWatering.time)}
            </p>
          </div>

          <div className="watering-details">
            <span>💧</span>

            <div>
              <strong>{nextWatering.duration} minutes</strong>
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
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
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
          {sortedSchedule.slice(1).map((watering) => (
            <div className="watering-schedule-row" key={watering.id}>
              <div>
                <strong>{watering.day}</strong>
                <p>{formatWateringTime(watering.time)}</p>
              </div>

              <div className="watering-row-actions">
                <span>{watering.duration} minutes</span>

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
