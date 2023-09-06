async function deletePerson(personId) {
  try {
    const url = `/api/people/${personId}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      let errorMessage = "An error occurred while deleting the person.";

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
      console.log("Person deleted successfully");
      return {
        error: false,
        status: response.status,
      };
    }
  } catch (error) {
    return {
      error: true,
      status: 500, // Internal Server Error
      message: `Error deleting person: ${error.message}`,
    };
  }
}

export default deletePerson;
