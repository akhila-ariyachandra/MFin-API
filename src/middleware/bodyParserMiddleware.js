"use strict"

// Dependencies
const bodyParser = require("body-parser")

module.exports = (app) => {
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())
    app.use(bodyParser.text())
    app.use(bodyParser.json({ type: "application/json" }))
}