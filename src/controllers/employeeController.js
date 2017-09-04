"use strict";

const Employee = require("../models/employeeSchema");

// Used for hashing password and pin
const bcrypt = require("bcrypt");
const saltRounds = 10;

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
        };

        // Check for personal phone
        if (req.body.phone.personal) {
            employee.phone.personal = req.body.phone.personal;
        }

        // Check for optional meta data
        let meta = {};
        // Check for areaID if the account type is Cash Collector
        if ((req.body.accountType === "cashCollector") && (req.body.meta.areaID)) {
            meta.areaID = req.body.meta.areaID;
        }
        // Add meta data to employee object
        if (meta) {
            employee.meta = meta;
        }

        // Run hashing asynchronously to avoid blocking the server
        Promise.all([
            bcrypt.hash(req.body.password, saltRounds),
            bcrypt.hash(req.body.pin, saltRounds)
        ])
            .then((hashResult) => {
                employee.password = hashResult[0];
                employee.pin = hashResult[1];
            })
            .then(() => Employee.create(employee))
            .then((result) => {
                return res.json({ "result": result, "status": "successfully saved" });
            })
            .catch((err) => {
                return res.send({ "error": err });
            });
    },

    // Fetching Details of all Employees
    getEmployees: (req, res) => {
        const cache = require("../app").cache;

        Employee.find({})
            .then((result) => {

                // Store each of the value in the array in the cache
                for (let i = 0; i < result.length; i++) {
                    const key = "employee" + result[i].employeeID;

                    cache.set(key, result[i], (err, success) => {
                        if (err) {
                            return res.send({ "error": err });
                        }
                    });
                }

                return res.json(result);
            })
            .catch((err) => {
                return res.send({ "error": err });
            });
    },

    // Fetching Details of one Employee
    getEmployee: (req, res) => {
        const cache = require("../app").cache;

        const employeeID = req.params.employeeID;

        const key = "employee" + employeeID;

        // Search cache for value
        cache.get(key, (err, cacheResult) => {
            if (err) {
                return res.send({ "error": err });
            }

            // If the key doesn't exist
            if (cacheResult == undefined) {
                Employee.findOne({ "employeeID": employeeID })
                    .then((result) => {
                        // Store the value in cache
                        cache.set(key, result, (err, success) => {
                            if (err) {
                                return res.send({ "error": err });
                            }
                            return res.json(result);
                        });
                    })
                    .catch((err) => {
                        return res.send({ "error": err });
                    });
            } else {
                // Return cached value
                return res.json(cacheResult);
            }
        });
    },

    // Update the Employee
    updateEmployee: (req, res) => {
        const employeeID = req.body.employeeID;

        let employee = null;

        // Get details of existing employee
        Employee.findOne({ "employeeID": employeeID })
            .then((result) => {
                if (!result) {
                    // If employee doesn't exist i.e. the wrong employeeID was given
                    return res.json({ "error": "Record does not exist" });
                }

                employee = result;

                employee.name = req.body.name;
                employee.surname = req.body.surname;
                employee.nic = req.body.nic;
                employee.dob = req.body.dob;
                employee.phone.work = req.body.phone.work;

                // Check for presence of personal phone number
                if (req.body.phone.personal) {
                    employee.phone.personal = req.body.phone.personal;
                }

                employee.email = req.body.email;
                employee.username = req.body.username;
                employee.accountType = req.body.accountType;

                // Meta data
                if (req.body.meta.areaID) {
                    employee.meta.areaID = req.body.meta.areaID;
                }
            })
            .then(() => Promise.all([
                bcrypt.hash(req.body.password, saltRounds),
                bcrypt.hash(req.body.pin, saltRounds)
            ]))
            .then((hashResult) => {
                employee.password = hashResult[0];
                employee.pin = hashResult[1];
            })
            .then(() => employee.save())
            .then((result) => {
                return res.json({ "result": result });
            })
            .catch((err) => {
                return res.json({ "error": err });
            });
    },

    // Authenticate the Employee
    authenticateEmployee: (req, res) => {
        const app = require("../app").app;
        const jwt = require("jsonwebtoken");
        const config = require("config");

        const username = req.body.username;

        // Find the User
        Employee.findOne({
            username: username
        })
            .then((employee) => {
                if (!employee) {
                    res.status(401).json({
                        success: false,
                        message: "Authentication failed. User not found."
                    });
                } else if (employee) {
                    // Run password checking asynchronously to avoid blocking the server
                    bcrypt.compare(req.body.password, employee.password).then((result) => {
                        // Check if password matches
                        if (!result) {
                            res.status(401).json({
                                success: false,
                                message: "Authentication failed. Wrong password."
                            });
                        } else {
                            // If user is found and password is right
                            // Create a token
                            const token = jwt.sign(employee, app.get("superSecret"), {
                                expiresIn: config.tokenExpireTime
                            });
                            // Return the information including token as JSON
                            res.json({
                                success: true,
                                message: "Authentication success.",
                                accountType: employee.accountType,
                                token: token
                            });
                        }
                    })
                        .catch((err) => {
                            res.status(401).json({
                                success: false,
                                message: "Authentication failed. No password given."
                            });
                        });
                }
            })
            .catch((err) => {
                throw err;
            });
    },

    // Get a new token for the Employee
    reauthenticateEmployee: (req, res) => {
        const app = require("../app").app;
        const jwt = require("jsonwebtoken");
        const config = require("config");
        const tokenCache = require("../app").tokenCache;

        const username = req.body.username;

        Employee.findOne({
            username: username
        })
            .then((employee) => {
                if (!employee) {
                    res.status(401).json({
                        success: false,
                        message: "Authentication failed. User not found."
                    });
                } else if (employee) {
                    // Run password checking asynchronously to avoid blocking the server
                    bcrypt.compare(req.body.pin, employee.pin).then((result) => {
                        // Check if password matches
                        if (!result) {
                            res.status(401).json({
                                success: false,
                                message: "Authentication failed. Wrong pin."
                            });
                        } else {
                            // If user is found and pin is right

                            // First add existing token to blacklist
                            let token = req.headers["x-access-token"];

                            const dummyObject = { "value": null };

                            // Add token to blacklist
                            tokenCache.set(token, dummyObject, (err, success) => {
                                if (err) {
                                    return res.send({ "error": err });
                                }
                            });

                            // Create a token
                            token = jwt.sign(employee, app.get("superSecret"), {
                                expiresIn: config.tokenExpireTime
                            });
                            // Return the information including token as JSON

                            res.json({
                                success: true,
                                message: "Authentication success.",
                                token: token
                            });
                        }
                    })
                        .catch((err) => {
                            res.status(401).json({
                                success: false,
                                message: "Authentication failed. No pin given."
                            });
                        });
                }
            })
            .catch((err) => {
                throw err;
            });
    },

    logout: (req, res) => {
        const tokenCache = require("../app").tokenCache;

        const token = req.headers["x-access-token"];

        const dummyObject = { "value": null };

        // Add token to blacklist
        tokenCache.set(token, dummyObject, (err, success) => {
            if (err) {
                return res.send({ "error": err });
            } else if (success) {
                return res.json({ "status": "Successfully logged out" });
            }
        });
    }
};