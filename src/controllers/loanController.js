"user strict";

const Loan = require("../models/loanSchema");
const config = require("config");

// Error logger
const errorLogger = (err) => {
    // Log errors to the console if the server is in production mode
    if (config.util.getEnv("NODE_ENV") === "production") {
        console.log(req.route.path);
        console.log(err);
    }
};

module.exports = {
    // Create a new loan
    createLoan: (req, res) => {
        const loanType = req.body.loanType;
        const date = req.body.date;
        const loanAmount = req.body.loanAmount;
        const duration = req.body.duration;
        const interest = req.body.interest;
        const customerID = req.body.customerID;

        Loan.create({
            loanType: loanType,
            date: date,
            loanAmount: loanAmount,
            duration: duration,
            interest: interest,
            customerID: customerID
        })
            .then((result) => {
                return res.json({ "result": result, "status": "successfully saved" });
            })
            .catch((err) => {
                errorLogger(err);
                return res.send({ "error": err });
            });
    },

    // Fetching Details of all loans
    getLoans: (req, res) => {
        const cache = require("../app").cache;

        // Setting search options for data retrieval from the database
        let searchOptions = {};

        // Add manager to search limiter if specified in route query
        if (req.query.manager) {
            searchOptions.manager = req.query.manager;
        }

        // Add status to search limiter if specified in route query
        if (req.query.status) {
            searchOptions.status = req.query.status;
        }

        // Add customerID to search limiter if specified in route query
        if (req.query.customerID) {
            searchOptions.customerID = req.query.customerID;
        }

        // Add loanType to search limiter if specified in route query
        if (req.query.loanType) {
            searchOptions.loanType = req.query.loanType;
        }

        // Get data from database
        Loan.find(searchOptions)
            .then((result) => {

                // Store each of the value in the array in the cache
                for (let i = 0; i < result.length; i++) {
                    const key = "loan" + result[i].loanID;

                    cache.set(key, result[i], (err, success) => {
                        if (err) {
                            errorLogger(err);
                            return res.send({ "error": err });
                        }
                    });
                }

                return res.json(result);
            })
            .catch((err) => {
                errorLogger(err);
                return res.send({ "error": err });
            });
    },

    // Fetching Details of one loan
    getLoan: (req, res) => {
        const cache = require("../app").cache;

        const loanID = req.params.loanID;

        const key = "loan" + loanID;

        // Search cache for value
        cache.get(key, (err, cacheResult) => {
            if (err) {
                errorLogger(err);;
                return res.send({ "error": err });
            }

            // If the key doesn't exist
            if (cacheResult == undefined) {
                Loan.findOne({ "loanID": loanID })
                    .then((result) => {
                        // Store the value in cache
                        cache.set(key, result, (err, success) => {
                            if (err) {
                                errorLogger(err);
                                return res.send({ "error": err });
                            }
                            return res.json(result);
                        });
                    })
                    .catch((err) => {
                        errorLogger(err);
                        return res.send({ "error": err });
                    });
            } else {
                // Return cached value
                return res.json(cacheResult);
            }
        });
    },

    // Update Loan details
    updateLoan: (req, res) => {
        const loanID = req.params.loanID;

        // Get existing details of loan
        Loan.findOne({ "loanID": loanID })
            .then((loan) => {
                if (!loan) {
                    // If loan doesn't exist i.e. the wrong loanID was given
                    return res.json({ "error": "Record does not exist" });
                }

                // Update details
                loan.loanType = req.body.loanType;
                loan.date = req.body.date;
                loan.loanAmount = req.body.loanAmount;
                loan.duration = req.body.duration;
                loan.interest = req.body.interest;
                loan.customerID = req.body.customerID;
                loan.manager = req.body.manager;
                loan.status = req.body.status;

                // Send data to database
                loan.save()
                    .then((result) => {
                        return res.json({ "result": result, "status": "successfully updated" });
                    })
                    .catch((err) => {
                        errorLogger(err);
                        return res.send({ "error": err });
                    });
            })
            .catch((err) => {
                errorLogger(err);
                return res.send({ "error": err });
            });
    },

    // Approve the loan
    approveLoan: (req, res) => {
        const loanID = req.params.loanID;

        // Get details of loan to be approved
        Loan.findOne({ "loanID": loanID })
            .then((loan) => {
                if (!loan) {
                    // If loan doesn't exist i.e. the wrong loanID was given
                    return res.json({ "error": "Record does not exist" });
                }

                // Change details
                loan.manager = req.body.manager;
                loan.status = "approved";

                loan.save()
                    .then((result) => {
                        return res.json(result);
                    })
                    .catch((err) => {
                        errorLogger(err);
                        return res.json({ "error": err });
                    });
            })
            .catch((err) => {
                errorLogger(err);
                return res.json({ "error": err });
            });
    },

    // Reject the loan
    rejectLoan: (req, res) => {
        const loanID = req.params.loanID;

        // Get details of loan to be rejected
        Loan.findOne({ "loanID": loanID })
            .then((loan) => {
                if (!loan) {
                    // If loan doesn't exist i.e. the wrong loanID was given
                    return res.json({ "error": "Record does not exist" });
                }

                // Change details
                loan.manager = req.body.manager;
                loan.status = "rejected";

                loan.save()
                    .then((result) => {
                        return res.json(result);
                    })
                    .catch((err) => {
                        errorLogger(err);
                        return res.json({ "error": err });
                    });
            })
            .catch((err) => {
                errorLogger(err);
                return res.json({ "error": err });
            });
    }
};