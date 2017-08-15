"use strict";

const bluebird = require("bluebird");
const config = require("config");
const express = require("express");
const app = express();

global.Promise = bluebird;

const portNo = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || config.port;
const ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || "0.0.0.0";

// In memory cache
const NodeCache = require("node-cache");
// Cache to store the database items
const cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });
// Cache to store blacklisted tokens
const timeToLive = config.tokenExpireTime + 120; 
const tokenCache = new NodeCache({ stdTTL: timeToLive, checkperiod: 120 }); 

// Middleware
const middleware = require("./middleware").middleware;
middleware(app);

// Routes
const routes = require("./routes");
routes(app);

// Start server
app.listen(portNo, ip);
console.log("MFin API running on port " + portNo);

// Export modules
module.exports = {
    app: app,
    cache: cache,
    tokenCache: tokenCache
};