import { useNavigate } from "react-router-dom";

// Functions
import deletePerson from "../functions/deletePerson";

function PeopleTable({ personData, handleViewDetails, triggerRefetch }) {
  const navigate = useNavigate();

  function handleViewDetails(id) {
    navigate(`/person/${id}`);
  }

  async function handleDelete(id, name) {
    try {
      const shouldDelete = window.confirm(
        `Are you sure you want to delete "${name}" entry?`
      );

      if (shouldDelete) {
        const response = await deletePerson(id);
        console.log("Person deleted:", response);
        console.log("trigger refetch");
        triggerRefetch();
      }
    } catch (error) {
      console.error("Error deleting person:", error);
    }
  }

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Full Name</th>
          <th>PIN</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {personData.map((person) => (
          <tr key={person.id}>
            <td>{person.id}</td>
            <td>{person.fullName}</td>
            <td>{person.pin || "N/A"}</td>
            <td>
              <button onClick={() => handleViewDetails(person.id)}>
                View Details
              </button>
              <button onClick={() => handleDelete(person.id, person.fullName)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default PeopleTable;
