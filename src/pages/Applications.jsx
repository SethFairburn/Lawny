import { useState } from "react";

function Applications({
  applications,
  setApplications,
  products,
  setActivePage,
}) {
  const [applicationType, setApplicationType] = useState("Fertilizer");
  const [applicationProduct, setApplicationProduct] = useState("");
  const [applicationDate, setApplicationDate] = useState("");
  const [applicationRate, setApplicationRate] = useState("");
  const matchingProducts = products.filter(
    (product) => product.type === applicationType,
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingApplications = applications
    .filter((application) => {
      const applicationDate = new Date(`${application.date}T00:00:00`);
      return applicationDate >= today;
    })
    .sort(
      (a, b) => new Date(`${a.date}T00:00:00`) - new Date(`${b.date}T00:00:00`),
    );

  const nextApplication = upcomingApplications[0];

  const addApplication = () => {
    const newApplication = {
      id: Date.now(),
      type: applicationType,
      product: applicationProduct,
      date: applicationDate,
      rate: applicationRate,
    };
    setApplications([...applications, newApplication]);
    setApplicationType("Fertilizer");
    setApplicationProduct("");
    setApplicationDate("");
    setApplicationRate("");
  };

  const removeApplication = (applicationId) => {
    const updatedApplications = applications.filter(
      (application) => application.id !== applicationId,
    );

    setApplications(updatedApplications);
  };

  const formatApplicationDate = (dateString) => {
    const date = new Date(`${dateString}T00:00:00`);

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <main className="dashboard">
      <section className="welcome">
        <p className="eyebrow">LAWN CARE</p>
        <h2>Applications</h2>
        <p>
          Plan and track fertilizer, treatments, and other lawn applications.
        </p>
      </section>
      {nextApplication ? (
        <section className="next-application-card">
          <div>
            <p className="eyebrow">NEXT APPLICATION</p>
            <h3>{nextApplication.type}</h3>
            <p>{nextApplication.product}</p>
          </div>

          <div className="application-details">
            <span>{formatApplicationDate(nextApplication.date)}</span>
            <span>{nextApplication.rate}</span>

            <button onClick={() => removeApplication(nextApplication.id)}>
              Remove
            </button>
          </div>
        </section>
      ) : (
        <section className="next-application-card">
          <div>
            <p className="eyebrow">NEXT APPLICATION</p>
            <h3>No application scheduled</h3>
            <p>Add an application below.</p>
          </div>
        </section>
      )}
      <section className="application-form">
        <div className="section-heading">
          <div>
            <p className="eyebrow">ADD APPLICATION</p>
            <h3>Schedule an Application</h3>
          </div>
        </div>

        <div className="application-form-fields">
          <select
            value={applicationType}
            onChange={(event) => {
              setApplicationType(event.target.value);
              setApplicationProduct("");
            }}
          >
            <option value="Fertilizer">Fertilizer</option>
            <option value="Pre-Emergent">Pre-Emergent</option>
            <option value="Post-Emergent">Post-Emergent</option>
            <option value="Fungicide">Fungicide</option>
            <option value="Insecticide">Insecticide</option>
            <option value="Soil Amendment">Soil Amendment</option>
          </select>
          <select
            value={applicationProduct}
            onChange={(event) => {
              const selectedValue = event.target.value;

              if (selectedValue === "add-new") {
                setActivePage("products");
                return;
              }

              setApplicationProduct(selectedValue);
            }}
          >
            <option value="">Select product</option>

            {matchingProducts.map((product) => (
              <option key={product.id} value={product.name}>
                {product.name}
              </option>
            ))}

            <option value="add-new">+ Add new product</option>
          </select>

          <input
            type="date"
            value={applicationDate}
            onChange={(event) => setApplicationDate(event.target.value)}
          />

          <input
            type="text"
            placeholder="Rate / Amount"
            value={applicationRate}
            onChange={(event) => setApplicationRate(event.target.value)}
          />

          <button onClick={addApplication}>+ Add Application</button>
        </div>
      </section>
      <section className="applications-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">SCHEDULE</p>
            <h3>Upcoming Applications</h3>
          </div>
        </div>

        <div className="applications-list">
          {upcomingApplications.slice(1).map((application) => (
            <div className="application-row" key={application.id}>
              <div>
                <strong>{application.type}</strong>
                <p>{application.product}</p>
              </div>

              <div className="application-details">
                <span>{formatApplicationDate(application.date)}</span>
                <span>{application.rate}</span>

                <button onClick={() => removeApplication(application.id)}>
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

export default Applications;
