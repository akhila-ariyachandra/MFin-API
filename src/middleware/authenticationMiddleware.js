"use strict"

module.exports = (req, res, next) => {
    // Dependencies
    const accessPermissions = require("config").accessPermissions
    const app = require("../app").app
    const jwt = require("jsonwebtoken")
    const tokenCache = require("../app").tokenCache

    // Get permissions
    const route = req.method + " " + req.route.path
    const permissions = accessPermissions.find(a => a.route === route)

    // Check header or url parameters or post parameters for token
    const token = req.headers["x-access-token"]

    // Check if token is blacklisted
    tokenCache.get(token, (err, cacheResult) => {
        if (err) {
            return res.status(401).send({
                success: false,
                message: "Unauthorised"
            })
        } else if (cacheResult) {
            // Token exists in blacklist
            return res.status(401).send({
                success: false,
                message: "Unauthorised"
            })
        } else if (token) {
            // Verifies secret and checks exp
            jwt.verify(token, app.get("superSecret"), (err, decoded) => {
                if (err || !permissions[decoded._doc.accountType]) {
                    /* If error decoding token or the permission for account type 
                    is set to false */
                    return res.status(401).send({
                        success: false,
                        message: "Unauthorised"
                    })
                } else if (permissions[decoded._doc.accountType]) {
                    // If everything is good, save to request for use in other routes
                    req.decoded = decoded
                    return next()
                }
            })
        } else {
            // If there is no token
            // Return an error
            return res.status(401).send({
                success: false,
                message: "Unauthorised"
            })
        }
    })
}