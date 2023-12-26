const http = require("http");
const fs = require("fs");
const path = require("node:path");
const createLogger = require("./libs/setting/logger");
const { handleCors } = require("./libs/setting/handleCors");
const { parse } = require("./libs/response/urlToRegex");
const { parseQueryParams } = require("./libs/response/queryParams");
const { readBody } = require("./libs/response/readBody");
const { createResponse } = require("./libs/response/createResponse");
const { processMiddleware } = require("./libs/middlewares/processMiddeware");
const { runMiddleware } = require("./libs/middlewares/handleMiddlewareCustom");

const Logger = createLogger;

let server;
let middlewareStack = [];
let staticPath = "public";

let corsOptions = {
  allowOrigin: "*",
  allowMethods: "GET, POST, PUT, DELETE",
  allowHeaders: "Content-Type",
};

function configureStatic(path) {
  staticPath = path;
}

function configureCors(options) {
  corsOptions = {
    ...corsOptions,
    ...options,
  };
}
function _initServer_() {
  let routeTable = {};

  function registerPath(method, path, cb, middleware) {
    if (!routeTable[path]) {
      routeTable[path] = {};
    }

    routeTable[path][method] = {
      cb,
      middleware,
    };
  }

  server = http.createServer(async (req, res) => {
    try {
      handleCors(req, res, corsOptions);
      await runMiddleware(req, res, middlewareStack);

      const staticFilePath = path.join(staticPath, req.url);
      if (
        fs.existsSync(staticFilePath) &&
        fs.statSync(staticFilePath).isFile()
      ) {
        const fileContent = fs.readFileSync(staticFilePath);
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end(fileContent);
        return;
      }

      const routes = Object.keys(routeTable);
      let match = false;
      let parseMethod = "json";

      for (let i = 0; i < routes.length; i++) {
        const route = routes[i];
        const methods = routeTable[route];

        if (
          new RegExp(`^${route}$`).test(req.url) &&
          methods[req.method.toLowerCase()]
        ) {
          const { cb, middleware } = methods[req.method.toLowerCase()];
          const m = req.url.match(new RegExp(`^${route}$`));

          req.params = m.groups;
          req.query = parseQueryParams(req.url);
          let body = await readBody(req);

          if (parseMethod === "json") {
            body = body ? JSON.parse(body) : {};
          }

          req.body = body;

          const result = middleware
            ? await processMiddleware(middleware, req, createResponse(res))
            : true;

          if (result) {
            cb(req, createResponse(res));
          }

          match = true;
          break;
        }
      }

      if (!match) {
        res.statusCode = 404;
        res.end("Not found");
      }
    } catch (error) {
      console.error("Unhandled error:", error);
      createResponse(res).send("Internal Server Error");
    }
  });

  return {
    get: (path, ...rest) => {
      try {
        if (rest.length === 1) {
          registerPath("get", path, rest[0]);
        } else {
          registerPath("get", path, rest[1], rest[0]);
        }
      } catch (error) {
        console.error("Error in get function:", error);
        createResponse(res).send("Internal Server Error");
      }
    },
    post: (path, ...rest) => {
      try {
        if (rest.length === 1) {
          registerPath("post", path, rest[0]);
        } else {
          registerPath("post", path, rest[1], rest[0]);
        }
      } catch (error) {
        // Handle errors specific to the post function here
        console.error("Error in post function:", error);
        // Respond with an error message
        createResponse(res).send("Internal Server Error");
      }
    },
    put: (path, ...rest) => {
      try {
        if (rest.length === 1) {
          registerPath("put", path, rest[0]);
        } else {
          registerPath("put", path, rest[1], rest[0]);
        }
      } catch (error) {
        // Handle errors specific to the put function here
        console.error("Error in put function:", error);
        // Respond with an error message
        createResponse(res).send("Internal Server Error");
      }
    },
    delete: (path, ...rest) => {
      try {
        if (rest.length === 1) {
          registerPath("delete", path, rest[0]);
        } else {
          registerPath("delete", path, rest[1], rest[0]);
        }
      } catch (error) {
        // Handle errors specific to the delete function here
        console.error("Error in delete function:", error);
        // Respond with an error message
        createResponse(res).send("Internal Server Error");
      }
    },
    bodyParse: (method) => (parseMethod = method),
    listen: (port, cb) => {
      server.listen(port, cb);
    },
    _server: server,
  };
}

module.exports = {
  _initServer_,
  configureCors,
  configureStatic,
  Logger,
};
