async function editPerson(personData, personId) {
  try {
    const url = `/api/people/${personId}`;
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(personData),
    });
    if (!response.ok) {
      let errorMessage = "An error occurred while processing the request.";

      // Check if the response content type is plain text.
      if (response.headers.get("content-type")?.includes("text/plain")) {
        try {
          // Parse the plain text error message.
          const errorText = await response.text();
          if (errorText) {
            errorMessage = errorText;
          }
        } catch (textError) {
          // Ignore text parsing error and use the default error message.
        }
      }

      // Return the error message along with a status code.
      return {
        error: true,
        status: response.status,
        message: errorMessage,
      };
    } else {
      // Request was successful, you can handle the success response here if needed.
      return {
        error: false,
        status: response.status,
      };
    }
  } catch (error) {
    return {
      error: true,
      status: 500, // Internal Server Error
      message: `Error editing person: ${error.message}`,
    };
  }
}

export default editPerson;
