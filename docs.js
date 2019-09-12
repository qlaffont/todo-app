/* eslint-disable global-require */
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const nconf = require("nconf");
const swaggerJSDoc = require("swagger-jsdoc");

const app = express();

// Swagger definition
const swaggerDefinition = {
  info: {
    title: require("./package.json").name,
    version: require("./package.json").version,
    description: require("./package.json").description
  },
  host: `${nconf.get("API_HOSTNAME") || "localhost"}:${nconf.get("API_PORT") || 3000}`,
  basePath: "/"
};

// options for the swagger docs
const options = {
  // import swaggerDefinitions
  swaggerDefinition,
  // path to the API docs
  apis: ["./components/**/*.js"]
};

// initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

// serve swagger
app.get("/swagger.json", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

app.get("*", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.disable("x-powered-by");
console.log("Swagger Doc Open at 127.0.0.1:9000"); // eslint-disable-line no-console
app.listen(9000, "localhost");
