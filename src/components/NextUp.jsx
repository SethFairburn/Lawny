import { useState } from "react";

function NextUp({ wateringSchedule, applications, setActivePage }) {
  const dayOrder = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const [showAddMenu, setShowAddMenu] = useState(false);

  // Convert watering schedules into dashboard items
  const wateringItems = wateringSchedule.map((watering) => {
    const now = new Date();

    const wateringDayIndex = dayOrder.indexOf(watering.day);
    const currentDayIndex = now.getDay();

    let daysAway = (wateringDayIndex - currentDayIndex + 7) % 7;

    const [hour, minute] = watering.time.split(":");

    const wateringDate = new Date(now);

    wateringDate.setDate(now.getDate() + daysAway);
    wateringDate.setHours(Number(hour), Number(minute), 0, 0);

    if (wateringDate <= now) {
      wateringDate.setDate(wateringDate.getDate() + 7);
    }

    const formattedTime = wateringDate.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });

    return {
      id: `watering-${watering.id}`,
      icon: "💧",
      title: "Water Lawn",
      date: wateringDate,
      dateLabel: wateringDate.toLocaleDateString("en-US", {
        weekday: "long",
      }),
      detail: `${formattedTime} • ${watering.duration} minutes`,
    };
  });
  // Convert applications into dashboard items
  const applicationItems = applications
    .map((application) => {
      const applicationDate = new Date(`${application.date}T00:00:00`);

      return {
        id: `application-${application.id}`,
        icon: "🌱",
        title: application.type,
        date: applicationDate,
        dateLabel: applicationDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        detail: `${application.product} • ${application.rate}`,
      };
    })
    .filter((application) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return application.date >= today;
    });

  const upcomingItems = [...wateringItems, ...applicationItems].sort(
    (a, b) => a.date - b.date,
  );

  return (
    <section className="next-up">
      <div className="section-heading">
        <div>
          <p className="eyebrow">SCHEDULE</p>
          <h3>Next Up</h3>
        </div>

        <button onClick={() => setShowAddMenu(!showAddMenu)}>+ Add</button>
      </div>
      {showAddMenu && (
        <div className="add-launcher">
          <button
            onClick={() => {
              setActivePage("watering");
              setShowAddMenu(false);
            }}
          >
            <span>💧</span>

            <div>
              <strong>Watering</strong>
              <p>Schedule irrigation</p>
            </div>
          </button>

          <button
            onClick={() => {
              setActivePage("applications");
              setShowAddMenu(false);
            }}
          >
            <span>🌱</span>

            <div>
              <strong>Application</strong>
              <p>Schedule fertilizer or treatment</p>
            </div>
          </button>

          <button disabled>
            <span>✂️</span>

            <div>
              <strong>Misc Task</strong>
              <p>Coming later</p>
            </div>
          </button>
        </div>
      )}

      {upcomingItems.length > 0 ? (
        <div className="task-grid">
          {upcomingItems.slice(0, 3).map((item) => (
            <article className="task-card" key={item.id}>
              <div className="task-icon">{item.icon}</div>

              <h4>{item.title}</h4>
              <p>{item.dateLabel}</p>
              <span>{item.detail}</span>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">🌱</div>
          <h4>You're all caught up.</h4>
          <p>No watering or applications are currently scheduled.</p>
        </div>
      )}
    </section>
  );
}

export default NextUp;
