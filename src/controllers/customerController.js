"use strict";

const Customer = require("../models/customerSchema");

module.exports = {
    // Creating New Customer
    createCustomer: (req, res) => {
        const name = req.body.name;
        const surname = req.body.surname;
        const nic = req.body.nic;
        const address = req.body.address;
        const dob = req.body.dob;
        const phone = req.body.phone;
        const areaID = req.body.areaID;
        const longitude = req.body.longitude;
        const latitude = req.body.latitude;

        Customer.create({
            name: name,
            surname: surname,
            nic: nic,
            address: address,
            dob: dob,
            phone: phone,
            areaID: areaID,
            longitude: longitude,
            latitude: latitude
        })
            .then((result) => {
                return res.json({ "result": result, "status": "successfully saved" });
            })
            .catch((err) => {
                return res.send({ "error": err });
            });
    },

    // Fetching Details of one Customer
    getCustomer: (req, res) => {
        const cache = require("../app").cache;
        
        const customerID = req.params.customerID;

        const key = "customer" + customerID;

        // Search cache for value
        cache.get(key, (err, cacheResult) => {
            if (err) {
                return res.send({ "error": err });
            }

            // If the key doesn't exist
            if (cacheResult == undefined) {
                Customer.findOne({ "customerID": customerID })
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

    // Fetching Details of all Customers
    getCustomers: (req, res) => {
        const cache = require("../app").cache;
        
        Customer.find({})
            .then((result) => {

                // Store each of the value in the array in the cache
                for (var i = 0; i < result.length; i++) {
                    const key = "customer" + result[i].customerID;

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

    // Update Customer details
    updateCustomer: (req, res) => {
        const customerID = req.params.customerID;

        // Get existing details of customer
        Customer.findOne({ "customerID": customerID })
            .then((customer) => {
                if (!customer) {
                    // If customer doesn't exist i.e. the wrong customerID was given
                    return res.json({ "error": "Record does not exist" });
                }

                // Update details
                customer.name = req.body.name;
                customer.surname = req.body.surname;
                customer.nic = req.body.nic;
                customer.address = req.body.address;
                customer.dob = req.body.dob;
                customer.phone = req.body.phone;
                customer.areaID = req.body.areaID;
                customer.longitude = req.body.longitude;
                customer.latitude = req.body.latitude;

                // Send data to database
                customer.save()
                    .then((result) => {
                        return res.json({ "result": result });
                    })
                    .catch((err) => {
                        return res.json({ "error": err });
                    });
            })
            .catch((err) => {
                return res.json({ "error": err });
            });
    }
};