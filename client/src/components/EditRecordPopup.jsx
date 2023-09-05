import React, { useState, useEffect } from "react";
import "./Popup.css";

// DTOs
import UpdateDataDto from "../dtos/UpdateDto";
import AddressDto from "../dtos/AddressDto";
import EmailDto from "../dtos/EmailDto";
import PersonDto from "../dtos/PersonDto";

// Functions
import editPerson from "../functions/editPerson";

function EditRecordPopup({ show, onClose, personData }) {
  const [isOpen, setIsOpen] = useState(show);
  const [formData, setFormData] = useState({
    person: { ...personData.person },
    emails: [...personData.emails],
    addresses: [...personData.addresses],
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e, index, field, type) => {
    const updatedData = { ...formData };
    if (type === "email") {
      updatedData.emails[index][field] = e.target.value;
    } else if (type === "address") {
      updatedData.addresses[index][field] = e.target.value;
    } else {
      updatedData.person[field] = e.target.value;
    }
    setFormData(updatedData);
  };

  const addField = (type) => {
    const updatedData = { ...formData };
    if (type === "email") {
      updatedData.emails.push(new EmailDto("", ""));
    } else if (type === "address") {
      updatedData.addresses.push(new AddressDto("", ""));
    }
    setFormData(updatedData);
  };

  const removeField = (index, type) => {
    const updatedData = { ...formData };
    if (type === "email") {
      updatedData.emails.splice(index, 1);
    } else if (type === "address") {
      updatedData.addresses.splice(index, 1);
    }
    setFormData(updatedData);
  };

  const handleSubmit = async () => {
    try {
      // Create an instance of UpdateDataDTO with the form data
      const updateData = new UpdateDataDto(
        formData.person,
        formData.emails,
        formData.addresses
      );

      console.log("Person edited:", updateData);
      // Call the createPerson function with the updateData
      const response = await editPerson(updateData, updateData.person.id);

      console.log("Person edited:", response);
      // Display success message and close the popup
      setSuccessMessage("Person created successfully!");
      setErrorMessage(""); // Clear any previous error message
      closePopup();
      // Handle success and navigate to another page or display a success message.
    } catch (error) {
      console.error("Error editing person:", error);
      // Handle the error, display an error message, or perform any necessary actions.
      // Display error message
      setErrorMessage("Error creating person. Please try again.");
      setSuccessMessage(""); // Clear any previous success message
    }
  };

  useEffect(() => {
    setIsOpen(show);
    // Clear success and error messages when opening/closing the popup
    setSuccessMessage("");
    setErrorMessage("");
  }, [show]);

  function closePopup() {
    setIsOpen(false);
    onClose();
  }

  return isOpen ? (
    <div className="popup-overlay">
      <div className="popup">
        <button className="close-button" onClick={closePopup}>
          Close
        </button>
        <h2>Create Record</h2>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <label>
          Full Name:
          <input
            type="text"
            value={formData.person.fullName}
            onChange={(e) => handleChange(e, null, "fullName")}
          />
        </label>
        <br />
        <label>
          PIN:
          <input
            type="text"
            value={formData.person.pin}
            onChange={(e) => handleChange(e, null, "pin")}
          />
        </label>
        <br />
        <h3>Emails</h3>
        {formData.emails.map((email, index) => (
          <div key={index}>
            <label>
              Email Type:
              <input
                type="text"
                value={email.emailType}
                onChange={(e) => handleChange(e, index, "emailType", "email")}
              />
            </label>
            <label>
              Email:
              <input
                type="text"
                value={email.email}
                onChange={(e) => handleChange(e, index, "email", "email")}
              />
            </label>
            <button onClick={() => removeField(index, "email")}>
              Remove Email
            </button>
          </div>
        ))}
        <button onClick={() => addField("email")}>Add Email</button>
        <br />
        <h3>Addresses</h3>
        {formData.addresses.map((address, index) => (
          <div key={index}>
            <label>
              Address Type:
              <input
                type="text"
                value={address.addressType}
                onChange={(e) =>
                  handleChange(e, index, "addressType", "address")
                }
              />
            </label>
            <label>
              Address:
              <input
                type="text"
                value={address.address}
                onChange={(e) => handleChange(e, index, "address", "address")}
              />
            </label>
            <button onClick={() => removeField(index, "address")}>
              Remove Address
            </button>
          </div>
        ))}
        <button onClick={() => addField("address")}>Add Address</button>
        <br />
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  ) : null;
}

export default EditRecordPopup;
