"user strict"

const Loan = require("../models/loanSchema")
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
    // Create a new loan
    createLoan: (req, res) => {
        const product = req.body.product
        const date = req.body.date
        const loanAmount = req.body.loanAmount
        const duration = req.body.duration
        const interest = req.body.interest
        const customer = req.body.customer

        Loan.create({
            product: product,
            date: date,
            loanAmount: loanAmount,
            duration: duration,
            interest: interest,
            customer: customer
        })
            .then((result) => {
                return res.json({ "result": result, "status": "successfully saved" })
            })
            .catch((err) => {
                errorLogger(req.route.path, err)
                return res.send({ "error": err })
            })
    },

    // Fetching Details of all loans
    getLoans: (req, res) => {
        // Get data from database
        Loan.find()
            .populate("product")
            .populate("customer")
            .populate("manager")
            .exec()
            .then((result) => {
                return res.json(result)
            })
            .catch((err) => {
                errorLogger(req.route.path, err)
                return res.send({ "error": err })
            })
    },

    // Fetching Details of one loan
    getLoan: (req, res) => {
        const loanID = req.params.loanID

        Loan.findOne({ "loanID": loanID })
            .populate("product")
            .populate("customer")
            .populate("manager")
            .exec()
            .then((result) => {
                return res.json(result)
            })
            .catch((err) => {
                errorLogger(req.route.path, err)
                return res.send({ "error": err })
            })
    },

    // Update Loan details
    updateLoan: (req, res) => {
        const loanID = req.params.loanID

        // Get existing details of loan
        Loan.findOne({ "loanID": loanID })
            .then((loan) => {
                if (!loan) {
                    // If loan doesn't exist i.e. the wrong loanID was given
                    return res.json({ "error": "Record does not exist" })
                }

                // Update details
                loan.product = req.body.product
                loan.date = req.body.date
                loan.loanAmount = req.body.loanAmount
                loan.duration = req.body.duration
                loan.interest = req.body.interest
                loan.customer = req.body.customer
                loan.manager = req.body.manager
                loan.status = req.body.status

                // Send data to database
                loan.save()
                    .then((result) => {
                        return res.json({ "result": result, "status": "successfully updated" })
                    })
                    .catch((err) => {
                        errorLogger(req.route.path, err)
                        return res.send({ "error": err })
                    })
            })
            .catch((err) => {
                errorLogger(req.route.path, err)
                return res.send({ "error": err })
            })
    },

    // Approve the loan
    approveLoan: (req, res) => {
        const loanID = req.params.loanID

        // Get details of loan to be approved
        Loan.findOne({ "loanID": loanID })
            .then((loan) => {
                if (!loan) {
                    // If loan doesn't exist i.e. the wrong loanID was given
                    return res.json({ "error": "Record does not exist" })
                }

                // Change details
                loan.manager = req.decoded._doc._id
                loan.status = "approved"

                loan.save()
                    .then((result) => {
                        return res.json(result)
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
    },

    // Reject the loan
    rejectLoan: (req, res) => {
        const loanID = req.params.loanID

        // Get details of loan to be rejected
        Loan.findOne({ "loanID": loanID })
            .then((loan) => {
                if (!loan) {
                    // If loan doesn't exist i.e. the wrong loanID was given
                    return res.json({ "error": "Record does not exist" })
                }

                // Change details
                loan.manager = req.decoded._doc._id
                loan.status = "rejected"

                loan.save()
                    .then((result) => {
                        return res.json(result)
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