import { useState } from "react";

function Equipment({ equipment, setEquipment }) {
  const [equipmentName, setEquipmentName] = useState("");
  const [equipmentType, setEquipmentType] = useState("Mower");
  const [equipmentDetails, setEquipmentDetails] = useState("");

  const addEquipment = () => {
    const newEquipment = {
      id: Date.now(),
      name: equipmentName,
      type: equipmentType,
      details: equipmentDetails,
    };

    setEquipment([...equipment, newEquipment]);

    setEquipmentName("");
    setEquipmentType("Mower");
    setEquipmentDetails("");
  };

  const removeEquipment = (equipmentId) => {
    const updatedEquipment = equipment.filter(
      (item) => item.id !== equipmentId
    );

    setEquipment(updatedEquipment);
  };

  return (
    <main className="dashboard">
      <section className="welcome">
        <p className="eyebrow">TOOLS & EQUIPMENT</p>
        <h2>Equipment</h2>
        <p>Keep track of the tools and equipment you use to care for your lawn.</p>
      </section>

      <section className="equipment-form">
        <div className="section-heading">
          <div>
            <p className="eyebrow">ADD EQUIPMENT</p>
            <h3>Add to Equipment</h3>
          </div>
        </div>

        <div className="equipment-form-fields">
          <input
            type="text"
            placeholder="Equipment name"
            value={equipmentName}
            onChange={(event) => setEquipmentName(event.target.value)}
          />

          <select
            value={equipmentType}
            onChange={(event) => setEquipmentType(event.target.value)}
          >
            <option value="Mower">Mower</option>
            <option value="Trimmer">Trimmer</option>
            <option value="Edger">Edger</option>
            <option value="Spreader">Spreader</option>
            <option value="Sprayer">Sprayer</option>
            <option value="Irrigation">Irrigation</option>
            <option value="Hand Tool">Hand Tool</option>
            <option value="Other">Other</option>
          </select>

          <input
            type="text"
            placeholder="Model / details"
            value={equipmentDetails}
            onChange={(event) => setEquipmentDetails(event.target.value)}
          />

          <button onClick={addEquipment}>
            + Add Equipment
          </button>
        </div>
      </section>

      <section className="equipment-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">YOUR GEAR</p>
            <h3>Your Equipment</h3>
          </div>
        </div>

        <div className="equipment-grid">
          {equipment.map((item) => (
            <article className="equipment-card" key={item.id}>
              <div className="equipment-icon">🛠️</div>

              <div className="equipment-card-content">
                <h4>{item.name}</h4>
                <p>{item.type}</p>
                <span>{item.details}</span>
              </div>

              <button
                className="equipment-remove"
                onClick={() => removeEquipment(item.id)}
              >
                Remove
              </button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Equipment;