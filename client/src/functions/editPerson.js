async function editPerson(personData, personId) {
  try {
    const url = `http://localhost:8080/api/people/${personId}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(personData),
    });
    if (!response.ok) {
      throw new Error(
        `This is an HTTP error: The status is ${response.status}`
      );
    }
    return response;
  } catch (error) {
    throw new Error(
      `There is a problem fetching the requested data - ${error}`
    );
  }
}

export default editPerson;
