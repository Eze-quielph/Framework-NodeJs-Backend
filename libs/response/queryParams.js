module.exports = {
  parseQueryParams: (url) => {
    // Use a regular expression to match the query part of the URL
    const result = url.match(/\?(?<query>.*)/);

    // If there is no query, return an empty object
    if (!result) return {};

    // Get the query string
    const pairs = query.match(/(?<param>\w+)=(?<value>\w+)/g);

    // Reduce the pairs into an object of key-value pairs
    return pairs.reduce((acc, curr) => {
      const [key, value] = curr.split("="); // Destructure the pair

      // Add the key-value pair to the accumulator
      acc[key] = value;

      return acc;
    }, {});
  },
};
