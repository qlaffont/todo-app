/* eslint-disable import/no-dynamic-require */
// Import Dependencies
const express = require("express");
const bodyParser = require("body-parser");
const nconf = require("nconf");
const { join } = require("path");
const responseTime = require("response-time");
const mongoose = require("mongoose");
const path = require("path");
const Raven = require("raven");
const Logger = require("le_node");
const winston = require("winston");
const helmet = require("helmet");

// Load App Variables
nconf.argv().env();

// Required App Variables
nconf.required(["MONGODB_URI"]);

// Add Log
const level = nconf.get("LOG") || "silly";

if (nconf.get("LE_KEY")) {
  global.logger = new Logger({ token: nconf.get("LE_KEY") });
} else {
  global.logger = winston.createLogger({
    level,
    format: winston.format.json(),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({
        filename: "logs/prod.log"
      })
    ]
  });
}

global.appRoot = path.resolve(__dirname);

if (nconf.get("SENTRY_KEY")) {
  Raven.config(nconf.get("SENTRY_KEY")).install();
  process.on("uncaughtException", err => {
    Raven.captureException(err);
  });
}

global.catchError = err => {
  if (nconf.get("SENTRY_KEY")) {
    Raven.captureException(err);
  }
  global.logger.warn(err);
};

global.logger.info("[INFO] -> Start App");

// ---------------------------------------------------------------------------

// DATABASE CONFIGURATION

// MONGODB : Database Connection
mongoose.Promise = global.Promise;

// Load Models with Config Loader
const Models = require(join(process.cwd(), "config", "modelLoader"))(mongoose);

mongoose.connect(nconf.get("MONGODB_URI"), { useNewUrlParser: true, useCreateIndex: true });
mongoose.set("useFindAndModify", false);

// ---------------------------------------------------------------------------

// API CONFIGURATION

const app = express();

// Set Global Var
app.set("APP", require("./package.json").name);
app.set("VERSION", require("./package.json").version);

// Add Error Log for sentry
if (nconf.get("SENTRY_KEY")) {
  app.use(Raven.requestHandler());
}

// Accept JSON & Url Encoded
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(
  bodyParser.json({
    limit: "50mb"
  })
);

// Integrate Helmet to secure server
app.use(helmet());

// Add Response Time
app.use(responseTime());

// EXPRESS : Express Configuration
app.all("*", (req, res, next) => {
  res.header("Access-Control-Allow-Credentials", false);
  res.header("Access-Control-Allow-Methods", "GET, PUT, DELETE, POST, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

// Allow for Web Clients
app.options("*", (req, res) => {
  res.status(200).json({ msg: "OK" });
});

// Load Routes
require(join(process.cwd(), "config", "routeLoader"))(app, Models);

// Handle Error
if (nconf.get("SENTRY_KEY")) {
  // The error handler must be before any other error middleware
  app.use(Raven.errorHandler());

  // Optional fallthrough error handler
  app.use(function onError(err, req, res) {
    // The error id is attached to `res.sentry` to be returned
    // and optionally displayed to the user for support.
    res.statusCode = 500;
    res.end(`${res.sentry}\n`);
  });
}

// Default result for API
app.all("/api/*", (req, res) => {
  res.status(404).send({ message: "404" });
});

// EXPRESS : Start Server
app.listen(nconf.get("PORT") || 80);

global.logger.info(`[API] -> Listening on Port : ${nconf.get("PORT") || 80}`);

// ---------------------------------------------------------------------------

// Add export to accept test
module.exports = app;
