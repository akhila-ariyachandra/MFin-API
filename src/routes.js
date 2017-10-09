"use strict"

const routes = (app) => {
    // Dependencies
    const path = require("path")

    // Controllers
    const customer = require("./controllers/customerController")
    const loan = require("./controllers/loanController")
    const area = require("./controllers/areaController")
    const transaction = require("./controllers/transactionController")
    const employee = require("./controllers/employeeController")
    const product = require("./controllers/productController")

    const authenticate = require("./middleware/authenticationMiddleware")

    // All Protected routes will be prefixed with /api

    // Area
    // Create an Area
    app.post("/api/area", authenticate, area.createArea)
    // Get all Areas
    app.get("/api/area", authenticate, area.getAreas)
    // Get the Area with this ID
    app.get("/api/area/:areaID", authenticate, area.getArea)
    // Update the Area with this ID
    app.put("/api/area/:areaID", authenticate, area.updateArea)

    // Customer
    // Create a Customer
    app.post("/api/customer", authenticate, customer.createCustomer)
    // Get all Customers
    app.get("/api/customer", authenticate, customer.getCustomers)
    // Get the Customer with this ID
    app.get("/api/customer/:customerID", authenticate, customer.getCustomer)
    // Update the Customer with this ID
    app.put("/api/customer/:customerID", authenticate, customer.updateCustomer)

    // Employee
    // Create an Employee
    app.post("/api/employee", authenticate, employee.createEmployee)
    // Get all Employess
    app.get("/api/employee", authenticate, employee.getEmployees)
    // Get the Employee with this ID
    app.get("/api/employee/:employeeID", authenticate, employee.getEmployee)
    // Update the Employee with this ID
    app.put("/api/employee/:employeeID", authenticate, employee.updateEmployee)
    // Authenticate Employee
    app.post("/user/authenticate", employee.authenticateEmployee)
    // Get new a new token
    app.post("/api/user/reauthenticate", authenticate, employee.reauthenticateEmployee)
    // Logout Employee
    app.get("/api/user/logout", authenticate, employee.logout)

    // Loan
    // Create a loan
    app.post("/api/loan", authenticate, loan.createLoan)
    // Get all Loans
    app.get("/api/loan", authenticate, loan.getLoans)
    // Get the Loan with this ID
    app.get("/api/loan/:loanID", authenticate, loan.getLoan)
    // Update the Loan with this ID
    app.put("/api/loan/:loanID", authenticate, loan.updateLoan)
    // Approve the loan
    app.patch("/api/loan/:loanID/approve", authenticate, loan.approveLoan)
    // Reject the loan
    app.patch("/api/loan/:loanID/reject", authenticate, loan.rejectLoan)

    // Product
    // Create a Product
    app.post("/api/product", authenticate, product.createProduct)
    // Get all Products
    app.get("/api/product", authenticate, product.getProducts)
    // Get the Product with this ID
    app.get("/api/product/:productID", authenticate, product.getProduct)
    // Update the Product with this ID
    app.put("/api/product/:productID", authenticate, product.updateProduct)

    // Transaction
    // Create an Transaction
    app.post("/api/transaction", authenticate, transaction.createTransaction)
    // Get all Transactions
    app.get("/api/transaction", authenticate, transaction.getTransactions)
    // Get the Transaction with this ID
    app.get("/api/transaction/:transactionID", authenticate, transaction.getTransaction)
    // Update the Transaction with this ID
    app.put("/api/transaction/:transactionID", authenticate, transaction.updateTransaction)

    // View documentation
    app.get("/", function (req, res) {
        res.sendFile(path.join(__dirname + "/views/index.html"))
    })

    // View log
    app.get("/log", function (req, res) {
        res.sendFile(path.join(__dirname + "/../.log/access.log"))
    })
}

module.exports = routes