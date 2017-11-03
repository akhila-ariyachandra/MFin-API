"use strict"

// Get dependecies
const Product = require("../models/productSchema")
const config = require("config")

// Error logger
const errorLogger = (routePath, err) => {
    // Log errors to the console if the server is in production mode
    if (config.util.getEnv("NODE_ENV") === "production") {
        console.log(routePath)
        console.log(err)
    }
}

module.exports = {
    // Create a new Product
    createProduct: (req, res) => {
        // Get values from request body
        const productName = req.body.productName
        const description = req.body.description
        const minAmount = req.body.minAmount
        const maxAmount = req.body.maxAmount
        const gracePeriod = req.body.gracePeriod
        const interestRate = req.body.interestRate
        const accruedInterest = req.body.accruedInterest
        const approvedBy = req.body.approvedBy
        const duration = req.body.duration

        // Create the Product
        Product.create({
            "productName": productName,
            "description": description,
            "minAmount": minAmount,
            "maxAmount": maxAmount,
            "gracePeriod": gracePeriod,
            "interestRate": interestRate,
            "accruedInterest": accruedInterest,
            "approvedBy": approvedBy,
            "duration": duration
        })
            .then((result) => {
                return res.json(result)
            })
            .catch((err) => {
                errorLogger(req.route.path, err)
                return res.send({ "error": err })
            })
    },

    // Get details of one Product
    getProduct: (req, res) => {
        // Get product ID
        const productID = req.params.productID

        Product.findOne({ "productID": productID })
            .populate("approvedBy")
            .exec()
            .then((result) => {
                return res.json(result)
            })
            .catch((err) => {
                errorLogger(req.route.path, err)
                return res.send({ "error": err })
            })
    },

    // Get details of all Products
    getProducts: (req, res) => {
        Product.find({})
            .populate("approvedBy")
            .exec()
            .then((result) => {
                return res.json(result)
            })
            .catch((err) => {
                errorLogger(req.route.path, err)
                return res.send({ "error": err })
            })
    },

    // Update the Product
    updateProduct: (req, res) => {
        // Get product ID
        const productID = req.params.productID

        // Retrieve the Product from the database
        Product.findOne({ "productID": productID })
            .then((product) => {
                // Check of the product exists or not
                if (!product) {
                    // If product doesn't exist i.e. the wrong productID was given
                    return res.json({ "error": "Record does not exist" })
                }

                // Update the product with values from the request body
                product.productName = req.body.productName
                product.description = req.body.description
                product.minAmount = req.body.minAmount
                product.maxAmount = req.body.maxAmount
                product.gracePeriod = req.body.gracePeriod
                product.interestRate = req.body.interestRate
                product.accruedInterest = req.body.accruedInterest
                product.approvedBy = req.body.approvedBy
                product.duration = req.body.duration

                // Update object in the database
                product.save()
                    .then((result) => {
                        return res.json(result)
                    })
                    .catch((err) => {
                        errorLogger(req.route.path, err)
                        return res.json({ "error": err })
                    })
            })
    }
}