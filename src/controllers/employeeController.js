"use strict"

const Employee = require("../models/employeeSchema")
const config = require("config")

// Error logger
const errorLogger = (routePath, err) => {
    // Log errors to the console if the server is in production mode
    if (config.util.getEnv("NODE_ENV") === "production") {
        console.log(routePath)
        console.log(err)
    }
}

// Used for hashing password and pin
const bcrypt = require("bcrypt")
const saltRounds = 10

module.exports = {
    // Creating a new Employee
    createEmployee: (req, res) => {
        let employee = {
            "name": req.body.name,
            "surname": req.body.surname,
            "nic": req.body.nic,
            "address": req.body.address,
            "dob": req.body.dob,
            "phone": {
                "work": req.body.phone.work
            },
            "email": req.body.email,
            "username": req.body.username,
            "accountType": req.body.accountType
        }

        // Check for personal phone
        if (req.body.phone.personal) {
            employee.phone.personal = req.body.phone.personal
        }

        // Check for optional meta data
        let meta = {}
        // Check for area if the account type is Cash Collector
        if ((req.body.accountType === "cashCollector") && (req.body.meta.area)) {
            meta.area = req.body.meta.area
        }
        // Add meta data to employee object
        if (meta) {
            employee.meta = meta
        }

        // Run hashing asynchronously to avoid blocking the server
        Promise.all([
            bcrypt.hash(req.body.password, saltRounds),
            bcrypt.hash(req.body.pin, saltRounds)
        ])
            .then((hashResult) => {
                employee.password = hashResult[0]
                employee.pin = hashResult[1]
            })
            .then(() => Employee.create(employee))
            .then((result) => {
                return res.json({ "result": result, "status": "successfully saved" })
            })
            .catch((err) => {
                errorLogger(req.route.path, err)
                return res.send({ "error": err })
            })
    },

    // Fetching Details of all Employees
    getEmployees: (req, res) => {
        Employee.find({})
            .populate("meta.area")
            .exec()
            .then((result) => {
                return res.json(result)
            })
            .catch((err) => {
                errorLogger(req.route.path, err)
                return res.send({ "error": err })
            })
    },

    // Fetching Details of one Employee
    getEmployee: (req, res) => {
        const employeeID = req.params.employeeID

        Employee.findOne({ "employeeID": employeeID })
            .populate("meta.area")
            .exec()
            .then((result) => {
                return res.json(result)
            })
            .catch((err) => {
                errorLogger(req.route.path, err)
                return res.send({ "error": err })
            })
    },

    // Update the Employee
    updateEmployee: (req, res) => {
        const employeeID = req.params.employeeID

        let employee = null

        // Get details of existing employee
        Employee.findOne({ "employeeID": employeeID })
            .then((result) => {
                if (!result) {
                    // If employee doesn't exist i.e. the wrong employeeID was given
                    return res.json({ "error": "Record does not exist" })
                }

                employee = result

                employee.name = req.body.name
                employee.surname = req.body.surname
                employee.nic = req.body.nic
                employee.address = req.body.address
                employee.dob = req.body.dob
                employee.phone.work = req.body.phone.work

                // Check for presence of personal phone number
                if (req.body.phone.personal) {
                    employee.phone.personal = req.body.phone.personal
                }

                employee.email = req.body.email
                employee.username = req.body.username
                employee.accountType = req.body.accountType

                // Meta data
                if (req.body.meta && employee.meta.area) {
                    employee.meta.area = req.body.meta.area
                }
            })
            .then(() => Promise.all([
                bcrypt.hash(req.body.password, saltRounds),
                bcrypt.hash(req.body.pin, saltRounds)
            ]))
            .then((hashResult) => {
                employee.password = hashResult[0]
                employee.pin = hashResult[1]
            })
            .then(() => employee.save())
            .then((result) => {
                return res.json({ "result": result })
            })
            .catch((err) => {
                errorLogger(req.route.path, err)
                return res.json({ "error": err })
            })
    },

    // Authenticate the Employee
    authenticateEmployee: (req, res) => {
        const app = require("../app").app
        const jwt = require("jsonwebtoken")
        const config = require("config")

        const username = req.body.username

        // Find the User
        Employee.findOne({
            username: username
        })
            .then((employee) => {
                if (!employee) {
                    return res.status(401).json({
                        success: false,
                        message: "Authentication failed. User not found."
                    })
                } else if (employee) {
                    // Run password checking asynchronously to avoid blocking the server
                    bcrypt.compare(req.body.password, employee.password).then((result) => {
                        // Check if password matches
                        if (!result) {
                            res.status(401).json({
                                success: false,
                                message: "Authentication failed. Wrong password."
                            })
                        } else {
                            // If user is found and password is right
                            // Create a token
                            const token = jwt.sign(employee, app.get("superSecret"), {
                                expiresIn: config.tokenExpireTime
                            })
                            // Return the information including token as JSON
                            return res.json({
                                success: true,
                                message: "Authentication success.",
                                accountType: employee.accountType,
                                token: token
                            })
                        }
                    })
                        .catch((err) => {
                            errorLogger(req.route.path, err)
                            return res.status(401).json({
                                success: false,
                                message: "Authentication failed. No password given."
                            })
                        })
                }
            })
            .catch((err) => {
                errorLogger(req.route.path, err)
                return res.json({ "error": err })
            })
    },

    // Get a new token for the Employee
    reauthenticateEmployee: (req, res) => {
        const app = require("../app").app
        const jwt = require("jsonwebtoken")
        const config = require("config")
        const tokenCache = require("../app").tokenCache

        const username = req.body.username

        Employee.findOne({
            username: username
        })
            .then((employee) => {
                if (!employee) {
                    return res.status(401).json({
                        success: false,
                        message: "Authentication failed. User not found."
                    })
                } else if (employee) {
                    // Run password checking asynchronously to avoid blocking the server
                    bcrypt.compare(req.body.pin, employee.pin).then((result) => {
                        // Check if password matches
                        if (!result) {
                            return res.status(401).json({
                                success: false,
                                message: "Authentication failed. Wrong pin."
                            })
                        } else {
                            // If user is found and pin is right

                            // First add existing token to blacklist
                            let token = req.headers["x-access-token"]

                            const dummyObject = { "value": null }

                            // Add token to blacklist
                            tokenCache.set(token, dummyObject, (err, success) => {
                                if (err) {
                                    errorLogger(req.route.path, err)
                                    return res.json({ "error": err })
                                }
                            })

                            // Create a token
                            token = jwt.sign(employee, app.get("superSecret"), {
                                expiresIn: config.tokenExpireTime
                            })
                            // Return the information including token as JSON

                            return res.json({
                                success: true,
                                message: "Authentication success.",
                                token: token
                            })
                        }
                    })
                        .catch((err) => {
                            errorLogger(req.route.path, err)
                            return res.status(401).json({
                                success: false,
                                message: "Authentication failed. No pin given."
                            })
                        })
                }
            })
            .catch((err) => {
                errorLogger(req.route.path, err)
                return res.json({ "error": err })
            })
    },

    logout: (req, res) => {
        const tokenCache = require("../app").tokenCache

        const token = req.headers["x-access-token"]

        const dummyObject = { "value": null }

        // Add token to blacklist
        tokenCache.set(token, dummyObject, (err, success) => {
            if (err) {
                errorLogger(req.route.path, err)
                return res.send({ "error": err })
            } else if (success) {
                return res.json({ "status": "Successfully logged out" })
            }
        })
    }
}