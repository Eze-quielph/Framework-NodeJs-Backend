// Function to process middleware in the context of a request and response
export function processMiddleware(middleware, req, res) {
  // If no middleware is provided, resolve with a Promise containing true
  if (!middleware) {
    return new Promise((resolve) => resolve(true));
  }

  // If middleware is provided, return a Promise to handle asynchronous operations
  return new Promise((resolve) => {
    // Call the middleware function with the request, response, and a callback to resolve the Promise
    middleware(req, res, function () {
      // Once the middleware completes its operation, resolve the Promise with true
      resolve(true);
    });
  });
}
