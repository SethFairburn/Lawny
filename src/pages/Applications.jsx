import { useEffect, useState } from "react";

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
  const [errorMessage, setErrorMessage] = useState("");

  const loadApplications = () => {
    fetch("http://localhost:8080/api/applications")
      .then((response) => response.json())
      .then((data) => {
        setApplications(data);
      })
      .catch((error) => {
        console.error("Error loading applications:", error);
      });
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const matchingProducts = products.filter(
    (product) => product.category === applicationType,
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingApplications = applications
    .filter((application) => {
      const applicationDate = new Date(`${application.scheduledDate}T00:00:00`);
      return applicationDate >= today;
    })
    .sort(
      (a, b) =>
        new Date(`${a.scheduledDate}T00:00:00`) -
        new Date(`${b.scheduledDate}T00:00:00`),
    );

  const nextApplication = upcomingApplications[0];

  const addApplication = () => {
    setErrorMessage("");

    fetch("http://localhost:8080/api/applications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId: Number(applicationProduct),
        scheduledDate: applicationDate,
        rate: applicationRate,
        appliedDate: null,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            const message =
              errorData.rate ||
              errorData.productId ||
              errorData.scheduledDate ||
              errorData.error ||
              "Something went wrong";

            throw new Error(message);
          });
        }

        return response.json();
      })
      .then(() => {
        setApplicationType("Fertilizer");
        setApplicationProduct("");
        setApplicationDate("");
        setApplicationRate("");

        loadApplications();
      })
      .catch((error) => {
        setErrorMessage(error.message);
      });
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
            <h3>{nextApplication.product.category}</h3>
            <p>{nextApplication.product.name}</p>
          </div>

          <div className="application-details">
            <span>{formatApplicationDate(nextApplication.scheduledDate)}</span>
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
          <label className="application-field">
            <span>Type</span>

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
              <option value="Other">Other</option>
            </select>
          </label>

          <label className="application-field">
            <span>Product</span>

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
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}

              <option value="add-new">+ Add new product</option>
            </select>
          </label>

          <label className="application-field">
            <span>Date</span>

            <input
              type="date"
              value={applicationDate}
              onChange={(event) => setApplicationDate(event.target.value)}
            />
          </label>

          <label className="application-field">
            <span>Rate</span>

            <input
              type="text"
              placeholder="Example: 5 lbs / 1,000 sq ft"
              value={applicationRate}
              onChange={(event) => setApplicationRate(event.target.value)}
            />
          </label>

          <button onClick={addApplication}>+ Add</button>
        </div>
        {errorMessage && <p className="error-message">⚠ {errorMessage}</p>}
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
                <strong>{application.product.category}</strong>
                <p>{application.product.name}</p>
              </div>

              <div className="application-details">
                <span>{formatApplicationDate(application.scheduledDate)}</span>
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
