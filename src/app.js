/*--------------------Server--------------------*/
"use strict";

var bluebird = require("bluebird");
var bodyParser = require("body-parser");
var compression = require("compression");
var config = require("config");
var express = require("express");
var app = express();
var fs = require("fs");
var jwt = require("jsonwebtoken");
var morgan = require("morgan");
var rfs = require("rotating-file-stream");

global.Promise = bluebird;

var logDirectory = __dirname;

// Ensure log directory exists 
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// Create a rotating write stream 
var accessLogStream = rfs("access.log", {
  interval: "1d", // Rotate daily 
  path: logDirectory
});

// Don't show the log when it is test
if (config.util.getEnv("NODE_ENV") !== "test") {
  // Use morgan to log requests to the log file
  app.use(morgan("combined", { stream: accessLogStream }));
  // Use morgan to log requests to the console
  app.use(morgan("dev"));
}

app.set("superSecret", config.secret); // Secret variable

var portNo = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || config.port;
var ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || "0.0.0.0";
