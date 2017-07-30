"use strict";

module.exports = {
    middleware: (app) => {
        const config = require("config");
        const bodyParser = require("body-parser");
        const compression = require("compression");
        const morgan = require("morgan");
        const rfs = require("rotating-file-stream");

        app.set("superSecret", config.secret); // Secret variable

        // Logging
        const path = require("path");
        const logPath = path.join(__dirname + "/../");

        // Don't show the log when it is test
        if (config.util.getEnv("NODE_ENV") !== "test") {
            // Create a rotating write stream 
            const accessLogStream = rfs("access.log", {
                interval: "7d", // Rotate weekly 
                path: logPath,
                compress: true
            });

            // Use morgan to log requests to the log file
            app.use(morgan("combined", { stream: accessLogStream }));

            // Don't show the console log when in production mode
            if (config.util.getEnv("NODE_ENV") !== "production") {
                // Use morgan to log requests to the console
                app.use(morgan("dev"));
            }
        }

        // Body parsers
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());
        app.use(bodyParser.text());
        app.use(bodyParser.json({ type: "application/json" }));

        // Use compression middleware
        app.use(compression());

        // CORS (for browser issues)
        const cors = require("cors");
        app.use(cors({
            methods: ["POST", "GET", "PUT"],
            allowedHeaders: ["Content-Type", "x-access-token"]
        }));
    },

    // Authenticate User
    authenticate: (req, res, next) => {
        const tokenCache = require("./app").tokenCache;

        // Check header or url parameters or post parameters for token
        const token = req.body.token || req.query.token || req.headers["x-access-token"];

        // Check if token is blacklisted
        tokenCache.get(token, (err, cacheResult) => {
            if (err) {
                return res.status(401).send({
                    success: false,
                    message: "Unauthorised"
                });
            } else if (cacheResult) {
                // Token exists in blacklist
                return res.status(401).send({
                    success: false,
                    message: "Unauthorised"
                });
            } else if (token) {
                const app = require("./app").app;
                const jwt = require("jsonwebtoken");

                // Verifies secret and checks exp
                jwt.verify(token, app.get("superSecret"), (err, decoded) => {
                    if (err) {
                        return res.status(401).send({
                            success: false,
                            message: "Unauthorised"
                        });

                    } else {
                        // If everything is good, save to request for use in other routes
                        req.decoded = decoded;
                        return next();
                    }
                });
            } else {

                // If there is no token
                // Return an error
                return res.status(401).send({
                    success: false,
                    message: "Unauthorised"
                });

            }
        });
    }
};