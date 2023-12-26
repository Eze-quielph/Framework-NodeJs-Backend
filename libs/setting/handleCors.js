module.exports = {
  handleCors: (req, res, options) => {
    // Allow CORS
    res.setHeader("Access-Control-Allow-Origin", options.allowOrigin || "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      options.allowMethods || "GET, POST, PUT, DELETE"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      options.allowHeaders || "Content-Type"
    );
  },
};
