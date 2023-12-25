# Framework NodeJs inpired ExpressJS

# Usage: 
  ```npm i framework-nodejs-backend```

# Repositories: [https://github.com/Eze-quielph/Framework-NodeJs-Backend]

# Colaborators: 
1. Ezequiel Benitez:
    - Linkedin: [https://www.linkedin.com/in/ezequiel-benitez2203/]
    - Github: [https://github.com/Eze-quielph]
    - Web Site: [https://ezequiel-benitez.vercel.app/]
    - Contact: ezequiel_developer@outlook.com

# Example to usage:
```
import { _initServer_ } from "./server";
const app = _initServer_();


app.get("/products/:id", (req, res) => {
  console.log("query params", req.query);
  console.log("req.params", req.params);
  res.json("product id");
});

app.get("/products", (req, res) => {
  console.log("query params", req.query);
    res.json("products");
});

app.post("/products", (req, res) => {
  console.info("body", req.body);
  res.json(req.body);
});

app.get(
  "/orders",
  (req, res, next) => {
    if (req.headers["authorization"] === "abc123") {
      console.log("next", next);
      next();
    } else {
      res.statusCode = 401;
      res.send("Not allowed");
    }
  },
  (req, res) => {
    res.send("Protected route");
  }
);

app.listen(3000, () => {
  console.log("Server running on 3000");
});
```