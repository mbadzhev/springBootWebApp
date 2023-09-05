async function deletePerson(personId) {
  try {
    const url = `http://localhost:8080/api/people/${personId}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`This is an HTTP error with status ${response.status}`);
    }
    console.log("Address entry deleted successfully");
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

export default deletePerson;
