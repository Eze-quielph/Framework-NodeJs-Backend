// Function to read the body from a request
export function readBody(req) {
  // Return a Promise to handle asynchronous operations
  return new Promise((resolve, reject) => {
    // Initialize an empty string to store the request body
    let body = "";

    // Event handler for when data is received in chunks
    req.on("data", (chunk) => {
      // Log each chunk of data received
      console.log(chunk);

      // Append the chunk to the body string
      body += "" + chunk;
    });

    // Event handler for when the request has ended
    req.on("end", () => {
      // Resolve the Promise with the accumulated body
      resolve(body);
    });

    // Event handler for request errors
    req.on("error", (err) => {
      // Reject the Promise with the error
      reject(err);
    });
  });
}
