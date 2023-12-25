// Function to parse query parameters from a URL
export function parseQueryParams(url) {
  // Use a regular expression to match the query part of the URL
  const result = url.match(/\?(?<query>.*)/);

  // If there is no query part, return an empty object
  if (!result) {
    return {};
  }

  // Destructure the 'query' group from the regular expression result
  const {
    groups: { query },
  } = result;

  // Use a regular expression to match pairs of key-value parameters in the query
  const pairs = query.match(/(?<param>\w+)=(?<value>\w+)/g);

  // Reduce the pairs into an object of key-value pairs
  const params = pairs.reduce((acc, curr) => {
    // Split each pair into key and value
    const [key, value] = curr.split("=");

    // Assign the key-value pair to the accumulator object
    acc[key] = value;

    // Return the updated accumulator
    return acc;
  }, {});

  // Return the parsed query parameters
  return params;
}
