"use strict";

const routes = (app) => {
    const express = require("express");

    // Router is used for all the protected routes
    const router = express.Router(); // Create instance of express router
    const path = require("path");

    // Controllers
    const customer = require("./controllers/customerController");
    const loan = require("./controllers/loanController");
    const cashCollector = require("./controllers/cashCollectorController");
    const area = require("./controllers/areaController");
    const user = require("./controllers/userController");
    const transaction = require("./controllers/transactionController");

    const authenticate = require("./middleware").authenticate;

    // Protect routes with authentication middleware
    router.use(authenticate);

    router.route("/customer")
        // Create a Customer
        .post(customer.createCustomer)
        // Get all Customers
        .get(customer.getCustomers);

    router.route("/customer/:customerID")
        // Get the Customer with this ID
        .get(customer.getCustomer)
        // Update the Customer with this ID
        .put(customer.updateCustomer);

    router.route("/loan")
        // Create a Loan
        .post(loan.createLoan)
        // Get all Loans
        .get(loan.getLoans);

    router.route("/loan/:loanID")
        // Get the Loan with this ID
        .get(loan.getLoan)
        // Update the Loan with this ID
        .put(loan.updateLoan);

    router.route("/cashCollector")
        // Create a Cash Collector
        .post(cashCollector.createCashCollector)
        // Get all Cash Collectors
        .get(cashCollector.getCashCollectors);

    router.route("/cashCollector/:cashCollectorID")
        // Get the Cash Collector with this ID
        .get(cashCollector.getCashCollector)
        // Update the Cash Collector with this ID
        .put(cashCollector.updateCashCollector);

    router.route("/area")
        // Create an Area
        .post(area.createArea)
        // Get all Areas
        .get(area.getAreas);

    router.route("/area/:areaID")
        // Get the Area with this ID
        .get(area.getArea)
        // Update the Area with this ID
        .put(area.updateArea);

    router.route("/user")
        // Get all Users
        .get(user.getUsers);

    router.route("/user/:username")
        // Get the User with this username
        .get(user.getUser)
        // Update the User with this username
        .put(user.updateUser);

    router.route("/transaction")
        // Create an Transaction
        .post(transaction.createTransaction)
        // Get all Transactions
        .get(transaction.getTransactions);

    router.route("/transaction/:transactionID")
        // Get the Transaction with this ID
        .get(transaction.getTransaction)
        // Update the Transaction with this ID
        .put(transaction.updateTransaction);

    // Unprotected routes
    // View documentation
    app.get("/", function (req, res) {
        res.sendFile(path.join(__dirname + "/views/index.html"));
    });

    // Create a User 
    app.post("/user", user.createUser);

    // Authenticate User
    app.post("/authenticate", user.authenticateUser);

    // View log
    app.get("/log", function (req, res) {
        res.sendFile(path.join(__dirname + "/../access.log"));
    });

    // Register routes
    // Prefix all protected routes with /api
    app.use("/api", router);
};

module.exports = routes;