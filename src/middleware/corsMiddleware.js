"use strict"

// Dependencies
const cors = require("cors")

module.exports = (app) => {
    app.use(cors({
        methods: ["POST", "GET", "PUT", "PATCH"],
        allowedHeaders: ["Content-Type", "x-access-token"]
    }))
}