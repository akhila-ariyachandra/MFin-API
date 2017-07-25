/*--------------------Server--------------------*/
"use strict";

const bluebird = require("bluebird");
const bodyParser = require("body-parser");
const compression = require("compression");
const config = require("config");
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const morgan = require("morgan");
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });
const rfs = require("rotating-file-stream");

global.Promise = bluebird;

const portNo = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || config.port;
const ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || "0.0.0.0";
