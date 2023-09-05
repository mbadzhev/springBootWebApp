import React, { useState, useEffect } from "react";
import "./Popup.css";

function Popup({ show, onClose, personData }) {
  const [isOpen, setIsOpen] = useState(show);

  useEffect(() => {
    setIsOpen(show);
  }, [show]);

  function closePopup() {
    setIsOpen(false);
    onClose();
  }
  function handleUpdatePerson() {
    onUpdatePerson({ ...person, fullName, pin });
  }

  return isOpen ? (
    <div className="popup-overlay">
      <div className="popup">
        <button className="close-button" onClick={closePopup}>
          Close
        </button>
        <div>
          <h2>Edit Person</h2>
          <label>
            Full Name:
            <input
              type="text"
              value={personData.person.fullName}
              // onChange={(e) => setFullName(e.target.value)}
            />
          </label>
          <br />
          <label>
            PIN:
            <input
              type="text"
              value={personData.person.pin}
              // onChange={(e) => setPin(e.target.value)}
            />
          </label>
          <br />
          {/* <button onClick={handleUpdatePerson}>Update Person</button> */}
        </div>
      </div>
    </div>
  ) : null;
}

export default Popup;
