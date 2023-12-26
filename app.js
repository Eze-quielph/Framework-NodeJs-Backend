const { _initServer_, configureStatic } = require("./index");
const path = require("path");
const vista = path.join(__dirname, "view", "index.ejs");

const app = _initServer_();

const data = [];

// Configure static files
configureStatic("view");

// Routes
app.get("/help", (req, res) => {
  res.send("Hello World");
});
app.get("/html", (req, res) => {
  res.render(vista, { title: "Hello World" });
});

app.post("/post", (req, res) => {
  data.push(req.body);
  res.send("push");
});

app.get("/get", (req, res) => {
  res.json(data);
});

app.put("/put", (req, res) => {
  data.forEach((item, index) => {
    if (item.id === req.body.id) {
      data[index] = req.body;
    }
  });
  res.send("put");
});

app.delete("/delete", (req, res) => {
  data.forEach((item, index) => {
    if (item.id === req.body.id) {
      data.splice(index, 1);
    }
  });
  res.send("delete");
});

app.listen(3001, () => {
  console.log("server is running on port 3001");
});
