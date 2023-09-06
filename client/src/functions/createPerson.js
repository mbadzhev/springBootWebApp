async function createPerson(personData) {
  try {
    const url = "/api/people";
    const response = await fetch(url, {
      method: "POST",
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
        }
      }
      return {
        error: true,
        status: response.status,
        message: errorMessage,
      };
    } else {
      return {
        error: false,
        status: response.status,
      };
    }
  } catch (error) {
    return {
      error: true,
      status: 500,
      message: `Error creating person: ${error.message}`,
    };
  }
}

export default createPerson;
