import { useState, useEffect } from "react";

// Components
import Loading from "../components/Loading";
import Error from "../components/Error";
import Button from "../components/Button";
import AddRecordPopup from "../components/AddRecordPopup";
import PeopleTable from "../components/PeopleTable";

// Functions
import fetchPeople from "../functions/fetchPeople";

function Dashboard() {
  const [personData, setPersonData] = useState(null);
  const [updateRequired, setUpdateRequired] = useState(false);

  const [filterText, setFilterText] = useState("");
  const [filteredData, setFilteredData] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
    setFilteredData(personData);
  }, [updateRequired]);

  useEffect(() => {
    if (personData) {
      const filteredResult = personData.filter((item) =>
        item.fullName.toLowerCase().includes(filterText.toLowerCase())
      );
      setFilteredData(filteredResult);
    }
  }, [personData, filterText]);

  async function fetchData() {
    try {
      setLoading(true);
      const response = await fetchPeople();
      setPersonData(response);
      setError(null);
    } catch (error) {
      setError(error.message);
      setPersonData(null);
    } finally {
      setLoading(false);
    }
  }

  function handleFilterChange(event) {
    const searchText = event.target.value;
    setFilterText(searchText);
  }

  const handleViewDetails = (user) => {
    setSelectedUser(user);
  };

  const openPopup = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  function handleRefetch() {
    setUpdateRequired((updateRequired) => !updateRequired);
  }

  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <Error error={error} />;
  }

  return (
    <div className="App">
      <h1>User Data</h1>
      <input
        type="text"
        placeholder="Search by name"
        value={filterText}
        onChange={handleFilterChange}
      />
      <Button text={"Add record"} type={"utility"} handleAction={openPopup} />
      <AddRecordPopup
        show={showPopup}
        onClose={closePopup}
        personData={personData}
        refetch={handleRefetch}
      ></AddRecordPopup>
      {filteredData && (
        <PeopleTable
          personData={filteredData}
          handleViewDetails={handleViewDetails}
          triggerRefetch={handleRefetch}
        />
      )}
    </div>
  );
}
export default Dashboard;
