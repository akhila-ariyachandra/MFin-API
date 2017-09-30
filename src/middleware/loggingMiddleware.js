"use strict"

// Dependencies
const config = require("config")
const path = require("path")
const logPath = path.join(__dirname + "/../.log/")
const morgan = require("morgan")
const rfs = require("rotating-file-stream")

module.exports = (app) => {
    // Don't show the log when it is test
    if (config.util.getEnv("NODE_ENV") !== "test") {
        // Create a rotating write stream 
        const accessLogStream = rfs("access.log", {
            interval: "7d", // Rotate weekly 
            path: logPath,
            compress: true
        })

        // Use morgan to log requests to the log file
        app.use(morgan("combined", { stream: accessLogStream }))

        // Don't show the console log when in production mode
        if (config.util.getEnv("NODE_ENV") !== "production") {
            // Use morgan to log requests to the console
            app.use(morgan("dev"))
        }
    }
}