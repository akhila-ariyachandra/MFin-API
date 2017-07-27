"use strict";

const Transaction = require("../models/transactionSchema");
const cache = require("../app").cache;

module.exports = {
    // Creating a new Transaction
    createTransaction: (req, res) => {
        const loanID = req.body.loanID;
        const date = new Date();
        const amount = req.body.amount;
        const cashCollectorID = req.body.cashCollectorID;

        Transaction.create({
            "loanID": loanID,
            "date": date,
            "amount": amount,
            "cashCollectorID": cashCollectorID
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
        Transaction.find({})
            .then((result) => {

                // Store each of the value in the array in the cache
                for (var i = 0; i < result.length; i++) {
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
            .then((transaction) => {
                if (!transaction) {
                    // If transaction doesn't exist i.e. the wrong transactionID was given
                    return res.json({ "error": "Record does not exist" });
                }

                // Update details
                transaction.loanID = req.body.loanID;
                transaction.date = req.body.date;
                transaction.amount = req.body.amount;
                transaction.cashCollectorID = req.body.cashCollectorID;
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