"use strict"

const Customer = require("../models/customerSchema")
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
    // Creating New Customer
    createCustomer: (req, res) => {
        const name = req.body.name
        const surname = req.body.surname
        const nic = req.body.nic
        const address = req.body.address
        const dob = req.body.dob
        const phone = req.body.phone
        const email = req.body.email
        const area = req.body.area

        Customer.create({
            name: name,
            surname: surname,
            nic: nic,
            address: address,
            dob: dob,
            phone: phone,
            email: email,
            area: area
        })
            .then((result) => {
                return res.json({ "result": result, "status": "successfully saved" })
            })
            .catch((err) => {
                errorLogger(req.route.path, err)
                return res.send({ "error": err })
            })
    },

    // Fetching Details of one Customer
    getCustomer: (req, res) => {
        const customerID = req.params.customerID

        Customer.findOne({ "customerID": customerID })
            .populate("area")
            .exec()
            .then((result) => {
                return res.json(result)
            })
            .catch((err) => {
                errorLogger(req.route.path, err)
                return res.send({ "error": err })
            })
    },

    // Fetching Details of all Customers
    getCustomers: (req, res) => {
        Customer.find({})
            .populate("area")
            .exec()
            .then((result) => {
                return res.json(result)
            })
            .catch((err) => {
                errorLogger(req.route.path, err)
                return res.send({ "error": err })
            })
    },

    // Update Customer details
    updateCustomer: (req, res) => {
        const customerID = req.params.customerID

        // Get existing details of customer
        Customer.findOne({ "customerID": customerID })
            .then((customer) => {
                if (!customer) {
                    // If customer doesn't exist i.e. the wrong customerID was given
                    return res.json({ "error": "Record does not exist" })
                }

                // Update details
                customer.name = req.body.name
                customer.surname = req.body.surname
                customer.nic = req.body.nic
                customer.address = req.body.address
                customer.dob = req.body.dob
                customer.phone = req.body.phone
                customer.email = req.body.email
                customer.area = req.body.area

                // Send data to database
                customer.save()
                    .then((result) => {
                        return res.json({ "result": result })
                    })
                    .catch((err) => {
                        errorLogger(req.route.path, err)
                        return res.json({ "error": err })
                    })
            })
            .catch((err) => {
                errorLogger(req.route.path, err)
                return res.json({ "error": err })
            })
    }
}