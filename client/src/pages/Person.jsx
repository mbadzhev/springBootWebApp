import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// Components
import Loading from "../components/Loading";
import Error from "../components/Error";
import EditRecordPopup from "../components/EditRecordPopup";

// Functions
import fetchPersonById from "../functions/fetchPersonById";

function Person() {
  const { personId } = useParams();
  const [personData, setPersonData] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (personId) {
      getPersonData(personId);
    }
  }, [personId]);

  async function getPersonData(personId) {
    try {
      setLoading(true);
      const data = await fetchPersonById(personId);
      setPersonData(data);
      setError(null);
    } catch (error) {
      setError(error.message);
      setPersonData(null);
    } finally {
      setLoading(false);
    }
  }

  const openPopup = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };
  
  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <Error error={error} />;
  }
  
  return (
    <>
      {personData && (
        <>
        <button onClick={openPopup}>Edit Record</button>
          <div>
            <h1>Personal Information</h1>
            <p>ID: {personData.person.id}</p>
            <p>Full Name: {personData.person.fullName}</p>
            <p>PIN: {personData.person.pin || "N/A"}</p>

            <h2>Emails</h2>
            {personData.emails.map((email) => (
              <li key={email.id}>
                <p>Email Type: {email.emailType}</p>
                <p>Email: {email.email}</p>
              </li>
            ))}

            <h2>Addresses</h2>
            {personData.addresses.map((address) => (
              <li key={address.id}>
                <p>Address Type: {address.addressType}</p>
                <p>Address: {address.address}</p>
              </li>
            ))}
          </div>
            <EditRecordPopup
              show={showPopup}
              onClose={closePopup}
              personData={personData}
            >
            </EditRecordPopup>
        </>
      )}
    </>
  );
}
export default Person;
