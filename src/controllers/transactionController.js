"use strict";

const Transaction = require("../models/transactionSchema");
const config = require("config");

// Error logger
const errorLogger = (routePath, err) => {
    // Log errors to the console if the server is in production mode
    if (config.util.getEnv("NODE_ENV") === "production") {
        console.log(routePath);
        console.log(err);
    }
};

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
                errorLogger(req.route.path, err);
                return res.send({ "error": err });
            });
    },

    // Fetching Details of one Transaction
    getTransaction: (req, res) => {
        const transactionID = req.params.transactionID;

        Transaction.findOne({ "transactionID": transactionID })
            .populate("loan")
            .populate("cashCollector")
            .exec()
            .then((result) => {
                return res.json(result);
            })
            .catch((err) => {
                errorLogger(req.route.path, err);
                return res.send({ "error": err });
            });
    },

    // Fetching Details of all Transactions
    getTransactions: (req, res) => {
        Transaction.find({})
            .populate("loan")
            .populate("cashCollector")
            .exec()
            .then((result) => {
                return res.json(result);
            })
            .catch((err) => {
                errorLogger(req.route.path, err);
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
                        errorLogger(req.route.path, err);
                        return res.json({ "error": err });
                    });
            })
            .catch((err) => {
                errorLogger(req.route.path, err);
                return res.json({ "error": err });
            });
    }
};