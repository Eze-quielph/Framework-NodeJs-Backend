export function createResponse(res) {
  // Log a message indicating that response methods are being set up
  console.log("Setting up response methods");

  // Attach a 'send' method to the response object, which ends the response with the provided message
  res.send = (msg) => res.end(msg);

  // Attach a 'json' method to the response object, which sends a JSON response with the provided message
  res.json = (msg) => {

    // Set the 'Content-Type' header to indicate a JSON response
    res.setHeader("Content-Type", "application/json");

    res.end(JSON.stringify(msg));
  };

  // Attach an 'html' method to the response object, which sends an HTML response with the provided message
  res.html = (msg) => {
    // Set the 'Content-Type' header to indicate an HTML response
    res.setHeader("Content-Type", "text/html");

    res.end(msg);
  };

  // Return the modified response object
  return res;
}
