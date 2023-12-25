import http from "http";
import { parse } from "./lib/url-to-regex";
import { parseQueryParams } from "./lib/query-params";
import { readBody } from "./lib/read-body";
import { createResponse } from "./lib/createResponse";
import { processMiddleware } from "./lib/processMiddleware";

let server;

export function _initServer_() {
  let routeTable = {};

  // Function to register a path with its corresponding callback, method, and middleware
  function registerPath(path, cb, method, middleware) {
    if (!routeTable[path]) {
      routeTable[path] = {};
    }
    routeTable[path] = {
      ...routeTable[path],
      [method]: cb,
      [method + "-middleware"]: middleware,
    };
  }

  // Create an HTTP server to handle incoming requests
  server = http.createServer(async (req, res) => {
    const routes = Object.keys(routeTable);
    let parseMethod = "json";
    let match = false;

    // Iterate over registered routes to find a match
    for (var i = 0; i < routes.length; i++) {
      const route = routes[i];
      const parsedRoute = parse(route);

      // Check if the request URL matches the route pattern and method is supported
      if (
        new RegExp(parsedRoute).test(req.url) &&
        routeTable[route][req.method.toLowerCase()]
      ) {
        let cb = routeTable[route][req.method.toLowerCase()];
        let middleware =
          routeTable[route][`${req.method.toLowerCase()}-middleware`];
        const m = req.url.match(new RegExp(parsedRoute));

        // Extract route parameters and query parameters from the request
        req.params = m.groups;
        req.query = parseQueryParams(req.url);

        // Read the request body
        let body = await readBody(req);

        // Parse the body if the parse method is set to JSON
        if (parseMethod === "json") {
          body = body ? JSON.parse(body) : {};
        }

        // Attach the parsed body to the request object
        req.body = body;

        // Process middleware and get the result
        const result = middleware
          ? await processMiddleware(middleware, req, createResponse(res))
          : true;

        // If middleware passes, invoke the route callback with the request and response
        if (result) {
          cb(req, createResponse(res));
        }

        // Set match to true and break the loop
        match = true;
        break;
      }
    }

    // If no match is found, respond with a 404 Not Found
    if (!match) {
      res.statusCode = 404;
      res.end("Not found");
    }
  });

  // Expose an API for registering HTTP methods, parsing request bodies, and starting the server
  return {
    get: (path, ...rest) => {
      if (rest.length === 1) {
        registerPath(path, rest[0], "get");
      } else {
        registerPath(path, rest[1], "get", rest[0]);
      }
    },
    post: (path, ...rest) => {
      if (rest.length === 1) {
        registerPath(path, rest[0], "post");
      } else {
        registerPath(path, rest[1], "post", rest[0]);
      }
    },
    put: (path, ...rest) => {
      if (rest.length === 1) {
        registerPath(path, rest[0], "put");
      } else {
        registerPath(path, rest[1], "put", rest[0]);
      }
    },
    delete: (path, ...rest) => {
      if (rest.length === 1) {
        registerPath(path, rest[0], "delete");
      } else {
        registerPath(path, rest[1], "delete", rest[0]);
      }
    },
    bodyParse: (method) => (parseMethod = method),
    listen: (port, cb) => {
      server.listen(port, cb);
    },
    _server: server,
  };
}
