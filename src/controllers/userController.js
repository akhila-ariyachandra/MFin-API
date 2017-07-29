"use strict";

const User = require("../models/userSchema");

// Used for hashing password
const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = {
    // Creating New User
    createUser: (req, res) => {
        // Run hashing asynchronously to avoid blocking the server
        Promise.all([
            bcrypt.hash(req.body.password, saltRounds),
            bcrypt.hash(req.body.pin, saltRounds)
        ])
            .then((hashResult) => {
                const username = req.body.username;
                const password = hashResult[0];
                const pin = hashResult[1];

                User.create({
                    username: username,
                    password: password,
                    pin: pin
                })
                    .then((result) => {
                        return res.json({ "result": result, "status": "successfully saved" });
                    })
                    .catch((err) => {
                        return res.json({ "error": err });
                    });
            })
            .catch((err) => {
                return res.json({ "error": "password and pin are required" });
            });
    },

    // Fetching Details of one User
    getUser: (req, res) => {
        const cache = require("../app").cache;

        const username = req.params.username;

        const key = "user" + username;

        // Search cache for value
        cache.get(key, (err, cacheResult) => {
            if (err) {
                return res.send({ "error": err });
            }

            // If the key doesn't exist
            if (cacheResult == undefined) {
                User.findOne({ "username": username })
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
                        return res.json({ "error": err });
                    });
            } else {
                // Return cached value
                return res.json(cacheResult);
            }
        });
    },

    // Fetching Details of all Users
    getUsers: (req, res) => {
        const cache = require("../app").cache;

        User.find({})
            .then((result) => {

                // Store each of the value in the array in the cache
                for (var i = 0; i < result.length; i++) {
                    const key = "user" + result[i].username;

                    cache.set(key, result[i], (err, success) => {
                        if (err) {
                            return res.send({ "error": err });
                        }
                    });
                }

                return res.json(result);
            })
            .catch((err) => {
                return res.json({ "error": err });
            });
    },

    // Update User details
    updateUser: (req, res) => {
        const username = req.params.username;

        if (!req.body.password) {
            return res.json({ "error": "No password given" });
        } else if (!req.body.pin) {
            return res.json({ "error": "No pin given" });
        }

        // Get existing details of user
        User.findOne({ "username": username })
            .then((user) => {
                if (!user) {
                    // If User doesn't exist i.e. the wrong username was given
                    return res.json({ "error": "Record does not exist" });
                }

                // Update password and pin
                // Run hashing asynchronously to avoid blocking the server
                Promise.all([
                    bcrypt.hash(req.body.password, saltRounds),
                    bcrypt.hash(req.body.pin, saltRounds)
                ])
                    .then((hashResult) => {
                        user.password = hashResult[0];
                        user.pin = hashResult[1];

                        user.save()
                            .then((result) => {
                                return res.json({ "result": result, "status": "successfully saved" });
                            })
                            .catch((err) => {
                                return res.json({ "error": err });
                            });
                    });
            })
            .catch((err) => {
                return res.json({ "error": err });
            });
    },

    // Authenticate the User
    authenticateUser: (req, res) => {
        const app = require("../app").app;
        const jwt = require("jsonwebtoken");
        const config = require("config");

        const username = req.body.username;

        // Find the User
        User.findOne({
            username: username
        })
            .then((user) => {
                if (!user) {
                    res.json({ success: false, message: "Authentication failed. User not found." });
                } else if (user) {
                    // Run password checking asynchronously to avoid blocking the server
                    bcrypt.compare(req.body.password, user.password).then((result) => {
                        // Check if password matches
                        if (!result) {
                            res.json({ success: false, message: "Authentication failed. Wrong password." });
                        } else {
                            // If user is found and password is right
                            // Create a token
                            const token = jwt.sign(user, app.get("superSecret"), {
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
                            res.json({ success: false, message: "Authentication failed. No password given." });
                        });
                }
            })
            .catch((err) => {
                throw err;
            });
    },

    reauthenticateUser: (req, res) => {
        const app = require("../app").app;
        const jwt = require("jsonwebtoken");
        const config = require("config");

        const username = req.body.username;

        User.findOne({
            username: username
        })
            .then((user) => {
                if (!user) {
                    res.json({ success: false, message: "Authentication failed. User not found." });
                } else if (user) {
                    // Run password checking asynchronously to avoid blocking the server
                    bcrypt.compare(req.body.pin, user.pin).then((result) => {
                        // Check if password matches
                        if (!result) {
                            res.json({ success: false, message: "Authentication failed. Wrong pin." });
                        } else {
                            // If user is found and pin is right
                            // Create a token
                            const token = jwt.sign(user, app.get("superSecret"), {
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
                            res.json({ success: false, message: "Authentication failed. No pin given." });
                        });
                }
            })
            .catch((err) => {
                throw err;
            });
    }
};