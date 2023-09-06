async function fetchPersonById(personId) {
  try {
    const url = `/api/people/${personId}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`This is an HTTP error with status ${response.status}`);
    }
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    throw new Error(error);
  }
}

export default fetchPersonById;
