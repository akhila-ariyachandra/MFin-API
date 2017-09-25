"use strict";

const Transaction = require("../models/transactionSchema");

module.exports = {
    // Creating a new Transaction
    createTransaction: (req, res) => {
        const loan = req.body.loan;
        const date = new Date();
        const amount = req.body.amount;
        const cashCollector = req.body.cashCollector;

        Transaction.create({
            "loan": loan,
            "date": date,
            "amount": amount,
            "cashCollector": cashCollector
        })
            .then((result) => {
                return res.json({ "result": result, "status": "successfully saved" });
            })
            .catch((err) => {
                return res.send({ "error": err });
            });
    },

    // Fetching Details of one Transaction
    getTransaction: (req, res) => {
        const cache = require("../app").cache;

        const transactionID = req.params.transactionID;

        const key = "transaction" + transactionID;

        // Search cache for value
        cache.get(key, (err, cacheResult) => {
            if (err) {
                return res.send({ "error": err });
            }

            // If the key doesn't exist
            if (cacheResult == undefined) {
                Transaction.findOne({ "transactionID": transactionID })
                    .populate("loan")
                    .populate("cashCollector")
                    .exec()
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

    // Fetching Details of all Transactions
    getTransactions: (req, res) => {
        const cache = require("../app").cache;

        Transaction.find({})
            .populate("loan")
            .populate("cashCollector")
            .exec()
            .then((result) => {

                // Store each of the value in the array in the cache
                for (let i = 0; i < result.length; i++) {
                    const key = "transaction" + result[i].transactionID;

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

    // Update Transaction details
    updateTransaction: (req, res) => {
        const transactionID = req.params.transactionID;

        // Get existing details of Transaction
        Transaction.findOne({ "transactionID": transactionID })
            .populate("loan")
            .populate("cashCollector")
            .exec()
            .then((transaction) => {
                if (!transaction) {
                    // If transaction doesn't exist i.e. the wrong transactionID was given
                    return res.json({ "error": "Record does not exist" });
                }

                // Update details
                transaction.loan = req.body.loan;
                transaction.date = req.body.date;
                transaction.amount = req.body.amount;
                transaction.cashCollector = req.body.cashCollector;
                transaction.status = req.body.status;

                // Send data to database
                transaction.save()
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