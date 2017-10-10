"use strict"

// Dependencies
const bodyParser = require("./bodyParserMiddleware")
const cors = require("./corsMiddleware")
const logger = require("./loggingMiddleware")
const compression = require("compression")

module.exports = (app) => {
    // Body parser middleware
    bodyParser(app)

    // CORS middleware
    cors(app)

    // Logging middleware
    logger(app)

    // Miscellaneous middleware
    app.use(compression())
}
