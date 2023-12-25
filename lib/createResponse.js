import ejs from "ejs";

export function createResponse(res) {
  console.log("Setting up response methods");

  res.send = (msg) => res.end(msg);

  res.json = (msg) => {
    console.log("Sending JSON response");
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(msg));
  };

  res.html = (msg) => {
    console.log("Sending HTML response");
    res.setHeader("Content-Type", "text/html");
    res.end(msg);
  };

  res.render = (view, data) => {
    console.log("Rendering view:", view);
    ejs.renderFile(view, data, (err, str) => {
      console.log("Rendering view:", view, data);
      if (err) {
        console.error("Error rendering view:", err);
        res.statusCode = 500;
        res.end("Internal Server Error");
      } else {
        res.setHeader("Content-Type", "text/html");
        res.end(str);
      }
    });
  };

  return res;
}
