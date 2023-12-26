const ejs = require('ejs');

module.exports = {
    createResponse: (res) => {
        console.log('Setting response...');

        res.send = (msg) => res.end(msg);

        res.json = (msg) => {
            console.log('Setting JSON response...');
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(msg));
        }

        res.render = (view, data) => {
          try {
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
          } catch (error) {
            console.log(error);
          }
        };

        return res;
    }
}