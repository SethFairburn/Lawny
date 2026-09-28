function NextUp({ wateringSchedule, applications, setActivePage }) {
  const dayOrder = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];

  const getNextWateringDate = (watering) => {
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

    return wateringDate;
  };

  const nextWatering = wateringSchedule
    .map((watering) => ({
      ...watering,
      nextDate: getNextWateringDate(watering),
    }))
    .sort((a, b) => a.nextDate - b.nextDate)[0];

  const nextApplication = applications
    .filter((application) => application.status === "UPCOMING")
    .sort(
      (a, b) =>
        new Date(`${a.scheduledDate}T00:00:00`) -
        new Date(`${b.scheduledDate}T00:00:00`),
    )[0];

  const formatWateringTime = (time) => {
    const [hour, minute] = time.split(":");

    const date = new Date();
    date.setHours(Number(hour), Number(minute));

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatApplicationDate = (dateString) => {
    const date = new Date(`${dateString}T00:00:00`);

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <section className="next-up">
      <div className="section-heading">
        <div>
          <p className="eyebrow">SCHEDULE</p>
          <h3>Next Up</h3>
        </div>
      </div>
      <div className="task-grid">
        {/* WATERING */}
        <article
          className="task-card watering-task-card"
          onClick={() => setActivePage("watering")}
        >
          <div className="task-icon task-icon-water">💧</div>

          <div className="task-card-content">
            <p className="eyebrow">NEXT WATERING</p>

            {nextWatering ? (
              <>
                <h4>
                  {nextWatering.nextDate.toLocaleDateString("en-US", {
                    weekday: "long",
                  })}
                </h4>

                <p className="task-summary">
                  {formatWateringTime(nextWatering.time)}
                  <span>•</span>
                  {nextWatering.minutes} minutes
                </p>
              </>
            ) : (
              <>
                <h4>No watering scheduled</h4>
                <p className="task-summary">
                  Nothing currently on the schedule.
                </p>
              </>
            )}
          </div>

          <span className="task-link">View watering →</span>
        </article>

        {/* APPLICATION */}
        <article
          className="task-card application-task-card"
          onClick={() => setActivePage("applications")}
        >
          <div className="task-icon task-icon-application">🌱</div>

          <div className="task-card-content">
            <p className="eyebrow">NEXT APPLICATION</p>

            {nextApplication ? (
              <>
                <h4>{nextApplication.product.category}</h4>

                <p className="task-product">{nextApplication.product.name}</p>

                <p className="task-summary">
                  {formatApplicationDate(nextApplication.scheduledDate)}
                  <span>•</span>
                  {nextApplication.rate}
                </p>
              </>
            ) : (
              <>
                <h4>No application scheduled</h4>
                <p className="task-summary">
                  Nothing currently on the schedule.
                </p>
              </>
            )}
          </div>

          <span className="task-link">View applications →</span>
        </article>
      </div>
    </section>
  );
}

export default NextUp;
