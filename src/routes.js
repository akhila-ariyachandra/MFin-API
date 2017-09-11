"use strict";

const routes = (app) => {
    const express = require("express");

    // Router is used for all the protected routes
    const router = express.Router(); // Create instance of express router
    const path = require("path");

    // Controllers
    const customer = require("./controllers/customerController");
    const loan = require("./controllers/loanController");
    const area = require("./controllers/areaController");
    const transaction = require("./controllers/transactionController");
    const employee = require("./controllers/employeeController");

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

    router.route("/loan/:loanID/approve")
        // Approve the loan
        .patch(loan.approveLoan);

    router.route("/loan/:loanID/reject")
        // Reject the loan
        .patch(loan.rejectLoan);

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

    router.route("/employee")
        // Create an Employee
        .post(employee.createEmployee)
        // Get all Employess
        .get(employee.getEmployees);

    router.route("/employee/:employeeID")
        // Get the Employee with this ID
        .get(employee.getEmployee)
        // Update the Employee with this ID
        .put(employee.updateEmployee);

    router.route("/user/reauthenticate")
        // Get new a new token
        .post(employee.reauthenticateEmployee);

    router.route("/user/logout")
        // Logout Employee
        .get(employee.logout);

    // Unprotected routes
    // View documentation
    app.get("/", function (req, res) {
        res.sendFile(path.join(__dirname + "/views/index.html"));
    });

    // Authenticate Employee
    app.post("/user/authenticate", employee.authenticateEmployee);

    // View log
    app.get("/log", function (req, res) {
        res.sendFile(path.join(__dirname + "/../.log/access.log"));
    });

    // Register routes
    // Prefix all protected routes with /api
    app.use("/api", router);
};

module.exports = routes;