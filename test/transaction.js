"use strict"

const app = require("../src/app").app

const chai = require("chai")
const chaiHttp = require("chai-http")
const Transaction = require("../src/models/transactionSchema")
const Employee = require("../src/models/employeeSchema")
const Loan = require("../src/models/loanSchema")
const Customer = require("../src/models/customerSchema")
const Product = require("../src/models/productSchema")
const Area = require("../src/models/areaSchema")
const Counter = require("../src/models/counterSchema")
const should = chai.should()

// Used for hashing password and pin
const bcrypt = require("bcrypt")
const saltRounds = 10

chai.use(chaiHttp)

describe("Transactions", () => {
    // Store authentication adminTokens
    let adminToken = null
    let managerToken = null
    let receptionistToken = null
    let cashCollectorToken = null

    // Store the objects
    let productObject = null
    let customerObject = null
    let loanObject = null
    let cashCollectorObject = null
    let areaObject = null

    /* Remove all employees, loans and counters 
    , and create a new employee
    before running tests*/
    before((done) => {
        let admin = {
            "name": "John",
            "surname": "Doe",
            "nic": "123456789V",
            "address": "nowhere",
            "dob": "1980-01-01",
            "email": "john.doe@gmail.com",
            "username": "john",
            "password": "sliitcpp",
            "pin": "1234",
            "accountType": "admin",
            "phone":"1234567890"
        }

        let manager = {
            "name": "Jane",
            "surname": "Doe",
            "nic": "123456789V",
            "address": "nowhere",
            "dob": "1980-01-01",
            "email": "john.doe@gmail.com",
            "username": "jane",
            "password": "sliitcpp",
            "pin": "1234",
            "accountType": "manager",
            "phone":"1234567890"
        }

        let receptionist = {
            "name": "James",
            "surname": "Doe",
            "nic": "123456789V",
            "address": "nowhere",
            "dob": "1980-01-01",
            "email": "john.doe@gmail.com",
            "username": "james",
            "password": "sliitcpp",
            "pin": "1234",
            "accountType": "receptionist",
            "phone":"1234567890"
        }

        let cashCollector = {
            "name": "Jake",
            "surname": "Doe",
            "nic": "123456789V",
            "address": "nowhere",
            "dob": "1980-01-01",
            "email": "john.doe@gmail.com",
            "username": "jake",
            "password": "sliitcpp",
            "pin": "1234",
            "accountType": "cashCollector",
            "phone":"1234567890"
        }

        let customer = {
            "name": "Bob",
            "surname": "Jay",
            "nic": "958642350V",
            "address": "elsewhere",
            "dob": "1995-12-29",
            "phone": "0767986623",
            "email": "bobjay@gmail.com",
            "areaID": "037",
            longitude: "87.8",
            latitude: "130.5"
        }

        const loan = {
            "loanType": "Test Loan",
            "date": new Date(),
            "loanAmount": 10000,
            "duration": 14,
            "interest": 10,
            "customerID": 1
        }

        const product = {
            "productName": "One month loan",
            "description": "Loan for a duration of one month",
            "minAmount": 10000,
            "maxAmount": 30000,
            "gracePeriod": 2,
            "interestRate": 2,
            "accruedInterest": 4,
            "validFrom": "01/01/2017",
            "validTo": "01/01/2018"
        }

        const area = {
            "name": "Kaduwela",
            "postalCode": 10640,
            "district": "Colombo"
        }

        Employee.remove({})
            .then(() => Transaction.remove({}))
            .then(() => Counter.remove({}))
            .then(() => Customer.remove({}))
            .then(() => Product.remove({}))
            .then(() => Loan.remove({}))
            .then(() => Area.remove({}))
            .then(() => Promise.all([
                bcrypt.hash(admin.password, saltRounds),
                bcrypt.hash(admin.pin, saltRounds),
                bcrypt.hash(manager.password, saltRounds),
                bcrypt.hash(manager.pin, saltRounds),
                bcrypt.hash(receptionist.password, saltRounds),
                bcrypt.hash(receptionist.pin, saltRounds),
                bcrypt.hash(cashCollector.password, saltRounds),
                bcrypt.hash(cashCollector.pin, saltRounds)
            ]))
            .then((hashResult) => {
                admin.password = hashResult[0]
                admin.pin = hashResult[1]
                manager.password = hashResult[2]
                manager.pin = hashResult[3]
                receptionist.password = hashResult[4]
                receptionist.pin = hashResult[5]
                cashCollector.password = hashResult[6]
                cashCollector.pin = hashResult[7]
            })
            .then(() => Area.create(area))
            .then((result) => {
                areaObject = result
                customer.area = areaObject._id
            })
            .then(() => Promise.all([
                Employee.create(admin),
                Employee.create(manager),
                Employee.create(receptionist),
                Employee.create(cashCollector),
                Customer.create(customer)
            ]))
            .then((result) => {
                cashCollectorObject = result[3]
                customerObject = result[4]
                loan.customer = customerObject._id
                loan.manager = result[1]._id
                product.approvedBy = result[1]._id
            })
            .then(() => Product(product))
            .then((result) => {
                productObject = result
                loan.product = productObject._id
            })
            .then(() => Loan.create(loan))
            .then((result) => {
                loanObject = result
                done()
            })
    })

    // Get a new authentication token for the admin
    before((done) => {
        const user = {
            "username": "john",
            "password": "sliitcpp"
        }

        chai.request(app)
            .post("/user/authenticate")
            .send(user)
            .end((err, result) => {
                // Go through the properties one by one
                result.should.have.status(200)
                result.body.should.be.a("object")
                result.body.should.have.property("success").eql(true)
                result.body.should.have.property("accountType").eql("admin")
                adminToken = result.body.token
                done()
            })
    })

    // Get a new authentication token for the manager
    before((done) => {
        const user = {
            "username": "jane",
            "password": "sliitcpp"
        }

        chai.request(app)
            .post("/user/authenticate")
            .send(user)
            .end((err, result) => {
                // Go through the properties one by one
                result.should.have.status(200)
                result.body.should.be.a("object")
                result.body.should.have.property("success").eql(true)
                result.body.should.have.property("accountType").eql("manager")
                managerToken = result.body.token
                done()
            })
    })

    // Get a new authentication token for the receptionist
    before((done) => {
        const user = {
            "username": "james",
            "password": "sliitcpp"
        }

        chai.request(app)
            .post("/user/authenticate")
            .send(user)
            .end((err, result) => {
                // Go through the properties one by one
                result.should.have.status(200)
                result.body.should.be.a("object")
                result.body.should.have.property("success").eql(true)
                result.body.should.have.property("accountType").eql("receptionist")
                receptionistToken = result.body.token
                done()
            })
    })

    // Get a new authentication token for the cash collector
    before((done) => {
        const user = {
            "username": "jake",
            "password": "sliitcpp"
        }

        chai.request(app)
            .post("/user/authenticate")
            .send(user)
            .end((err, result) => {
                // Go through the properties one by one
                result.should.have.status(200)
                result.body.should.be.a("object")
                result.body.should.have.property("success").eql(true)
                result.body.should.have.property("accountType").eql("cashCollector")
                cashCollectorToken = result.body.token
                done()
            })
    })

    // Test the  GET /api/transaction route
    describe("GET /api/transaction", () => {
        it("it should not get all the transactions without an authorization token", (done) => {
            chai.request(app)
                .get("/api/transaction")
                .end((err, res) => {
                    res.should.have.status(401)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    res.body.should.have.property("success").eql(false)
                    res.body.should.have.property("message").eql("Unauthorised")
                    done()
                })
        })

        it("it should get all the transactions for the admin account type", (done) => {
            chai.request(app)
                .get("/api/transaction")
                .set("x-access-token", adminToken)
                .end((err, res) => {
                    res.should.have.status(200)
                    should.exist(res.body)
                    res.body.should.be.a("array")
                    res.body.length.should.be.eql(0)
                    done()
                })
        })

        it("it should get all the transactions for the manager account type", (done) => {
            chai.request(app)
                .get("/api/transaction")
                .set("x-access-token", managerToken)
                .end((err, res) => {
                    res.should.have.status(200)
                    should.exist(res.body)
                    res.body.should.be.a("array")
                    res.body.length.should.be.eql(0)
                    done()
                })
        })

        it("it should not get all the transactions for the receptionist account type", (done) => {
            chai.request(app)
                .get("/api/transaction")
                .set("x-access-token", receptionistToken)
                .end((err, res) => {
                    res.should.have.status(401)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    res.body.should.have.property("success").eql(false)
                    res.body.should.have.property("message").eql("Unauthorised")
                    done()
                })
        })

        it("it should get all the transactions for the cash collector account type", (done) => {
            chai.request(app)
                .get("/api/transaction")
                .set("x-access-token", managerToken)
                .end((err, res) => {
                    res.should.have.status(200)
                    should.exist(res.body)
                    res.body.should.be.a("array")
                    res.body.length.should.be.eql(0)
                    done()
                })
        })
    })

    // Test the POST /api/transaction route
    describe("POST /api/transaction", () => {
        it("it should not create a transaction without an authorization token", (done) => {
            const transaction = {
                "loan": loanObject._id,
                "amount": 10000,
                "cashCollector": cashCollectorObject._id,
                "status": "unpaid"
            }

            chai.request(app)
                .post("/api/transaction")
                .send(transaction)
                .end((err, res) => {
                    res.should.have.status(401)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    res.body.should.have.property("success").eql(false)
                    res.body.should.have.property("message").eql("Unauthorised")
                    done()
                })
        })

        it("it should not create a transaction without the loan field", (done) => {
            const transaction = {
                "amount": 10000,
                "cashCollector": cashCollectorObject._id,
                "status": "unpaid"
            }

            chai.request(app)
                .post("/api/transaction")
                .set("x-access-token", adminToken)
                .send(transaction)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error")
                    res.body.error.should.have.property("errors")
                    res.body.error.errors.should.have.property("loan")
                    res.body.error.errors.loan.should.have.property("properties")
                    res.body.error.errors.loan.properties.should.have.property("type").eql("required")
                    done()
                })
        })

        it("it should not create a transaction without the amount field", (done) => {
            const transaction = {
                "loan": loanObject._id,
                "cashCollector": cashCollectorObject._id,
                "status": "unpaid"
            }

            chai.request(app)
                .post("/api/transaction")
                .set("x-access-token", adminToken)
                .send(transaction)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error")
                    res.body.error.should.have.property("errors")
                    res.body.error.errors.should.have.property("amount")
                    res.body.error.errors.amount.should.have.property("properties")
                    res.body.error.errors.amount.properties.should.have.property("type").eql("required")
                    done()
                })
        })

        it("it should not create a transaction without the cashCollector field", (done) => {
            const transaction = {
                "loan": loanObject._id,
                "amount": 10000,
                "status": "unpaid"
            }

            chai.request(app)
                .post("/api/transaction")
                .set("x-access-token", adminToken)
                .send(transaction)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error")
                    res.body.error.should.have.property("errors")
                    res.body.error.errors.should.have.property("cashCollector")
                    res.body.error.errors.cashCollector.should.have.property("properties")
                    res.body.error.errors.cashCollector.properties.should.have.property("type").eql("required")
                    done()
                })
        })

        it("it should create a transaction for the admin account type", (done) => {
            const transaction = {
                "loan": loanObject._id,
                "amount": 10000,
                "cashCollector": cashCollectorObject._id,
                "status": "unpaid"
            }

            // Remove all transactions before running test
            Transaction.remove({}, () => {
                // Reset ID counter before running test
                Counter.remove({}, () => {
                    chai.request(app)
                        .post("/api/transaction")
                        .set("x-access-token", adminToken)
                        .send(transaction)
                        .end((err, res) => {
                            res.should.have.status(200)
                            res.body.should.be.a("object")
                            res.body.should.have.property("status").eql("successfully saved")
                            res.body.should.have.property("result")
                            // Check for all fields
                            res.body.result.should.have.property("__v")
                            res.body.result.should.have.property("transactionID").eql(1)
                            res.body.result.should.have.property("loan")
                            res.body.result.should.have.property("date")
                            res.body.result.should.have.property("amount").eql(10000)
                            res.body.result.should.have.property("cashCollector")
                            res.body.result.should.have.property("status").eql("unpaid")
                            res.body.result.should.have.property("_id")
                            done()
                        })
                })
            })
        })

        it("it should create a transaction for the manager account type", (done) => {
            const transaction = {
                "loan": loanObject._id,
                "amount": 10000,
                "cashCollector": cashCollectorObject._id,
                "status": "unpaid"
            }

            // Remove all transactions before running test
            Transaction.remove({}, () => {
                // Reset ID counter before running test
                Counter.remove({}, () => {
                    chai.request(app)
                        .post("/api/transaction")
                        .set("x-access-token", managerToken)
                        .send(transaction)
                        .end((err, res) => {
                            res.should.have.status(200)
                            res.body.should.be.a("object")
                            res.body.should.have.property("status").eql("successfully saved")
                            res.body.should.have.property("result")
                            // Check for all fields
                            res.body.result.should.have.property("__v")
                            res.body.result.should.have.property("transactionID").eql(1)
                            res.body.result.should.have.property("loan")
                            res.body.result.should.have.property("date")
                            res.body.result.should.have.property("amount").eql(10000)
                            res.body.result.should.have.property("cashCollector")
                            res.body.result.should.have.property("status").eql("unpaid")
                            res.body.result.should.have.property("_id")
                            done()
                        })
                })
            })
        })

        it("it should not create a transaction for the receptionist account type", (done) => {
            const transaction = {
                "loan": loanObject._id,
                "amount": 10000,
                "cashCollector": cashCollectorObject._id,
                "status": "unpaid"
            }

            chai.request(app)
                .post("/api/transaction")
                .set("x-access-token", receptionistToken)
                .send(transaction)
                .end((err, res) => {
                    res.should.have.status(401)
                    res.body.should.be.a("object")
                    res.body.should.have.property("success").eql(false)
                    res.body.should.have.property("message").eql("Unauthorised")
                    done()
                })

        })

        it("it should create a transaction for the cash collector account type", (done) => {
            const transaction = {
                "loan": loanObject._id,
                "amount": 10000,
                "cashCollector": cashCollectorObject._id,
                "status": "unpaid"
            }

            // Remove all transactions before running test
            Transaction.remove({}, () => {
                // Reset ID counter before running test
                Counter.remove({}, () => {
                    chai.request(app)
                        .post("/api/transaction")
                        .set("x-access-token", cashCollectorToken)
                        .send(transaction)
                        .end((err, res) => {
                            res.should.have.status(200)
                            res.body.should.be.a("object")
                            res.body.should.have.property("status").eql("successfully saved")
                            res.body.should.have.property("result")
                            // Check for all fields
                            res.body.result.should.have.property("__v")
                            res.body.result.should.have.property("transactionID").eql(1)
                            res.body.result.should.have.property("loan")
                            res.body.result.should.have.property("date")
                            res.body.result.should.have.property("amount").eql(10000)
                            res.body.result.should.have.property("cashCollector")
                            res.body.result.should.have.property("status").eql("unpaid")
                            res.body.result.should.have.property("_id")
                            done()
                        })
                })
            })
        })

        it("it should create the 2nd transaction with transactionID 2", (done) => {
            const transaction = {
                "loan": loanObject._id,
                "amount": 10000,
                "cashCollector": cashCollectorObject._id,
                "status": "unpaid"
            }

            chai.request(app)
                .post("/api/transaction")
                .set("x-access-token", adminToken)
                .send(transaction)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("status").eql("successfully saved")
                    res.body.should.have.property("result")
                    // Check for all fields
                    res.body.result.should.have.property("__v")
                    res.body.result.should.have.property("transactionID").eql(2)
                    res.body.result.should.have.property("loan")
                    res.body.result.should.have.property("date")
                    res.body.result.should.have.property("amount").eql(10000)
                    res.body.result.should.have.property("cashCollector")
                    res.body.result.should.have.property("status").eql("unpaid")
                    res.body.result.should.have.property("_id")
                    done()
                })
        })
    })

    // Test the GET /api/transaction/:transactionID route
    describe("GET /api/transaction/:transactionID", () => {
        it("it should not get the transaction without an authorization token", (done) => {
            chai.request(app)
                .get("/api/transaction/1")
                .end((err, res) => {
                    res.should.have.status(401)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    res.body.should.have.property("success").eql(false)
                    res.body.should.have.property("message").eql("Unauthorised")
                    done()
                })
        })

        it("it should get the transaction for the admin account type", (done) => {
            chai.request(app)
                .get("/api/transaction/1")
                .set("x-access-token", adminToken)
                .end((err, res) => {
                    res.should.have.status(200)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    done()
                })
        })

        it("it should get the transaction for the manager account type", (done) => {
            chai.request(app)
                .get("/api/transaction/1")
                .set("x-access-token", managerToken)
                .end((err, res) => {
                    res.should.have.status(200)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    done()
                })
        })

        it("it should not get the transaction for the receptionist account type", (done) => {
            chai.request(app)
                .get("/api/transaction/1")
                .set("x-access-token", receptionistToken)
                .end((err, res) => {
                    res.should.have.status(401)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    res.body.should.have.property("success").eql(false)
                    res.body.should.have.property("message").eql("Unauthorised")
                    done()
                })
        })

        it("it should get the transaction for the cash collector account type", (done) => {
            chai.request(app)
                .get("/api/transaction/1")
                .set("x-access-token", cashCollectorToken)
                .end((err, res) => {
                    res.should.have.status(200)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    done()
                })
        })
    })

    // Test the PUT /api/transaction/:transactionID route
    describe("PUT /api/transaction/:transactionID", () => {
        it("it should not update the transaction without an authorization token", (done) => {
            const transaction = {
                "loan": loanObject._id,
                "date": new Date(),
                "amount": 10000,
                "cashCollector": cashCollectorObject._id,
                "status": "unpaid"
            }

            chai.request(app)
                .put("/api/transaction/1")
                .end((err, res) => {
                    res.should.have.status(401)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    res.body.should.have.property("success").eql(false)
                    res.body.should.have.property("message").eql("Unauthorised")
                    done()
                })
        })

        it("it should not update the transaction if the wrong transactionID is given", (done) => {
            const transaction = {
                "loan": loanObject._id,
                "date": new Date(),
                "amount": 10000,
                "cashCollector": cashCollectorObject._id,
                "status": "unpaid"
            }

            chai.request(app)
                .put("/api/transaction/3")
                .set("x-access-token", adminToken)
                .send(transaction)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error").eql("Record does not exist")
                    done()
                })
        })

        it("it should not update the transaction without the loan field", (done) => {
            const transaction = {
                "date": new Date(),
                "amount": 10000,
                "cashCollector": cashCollectorObject._id,
                "status": "unpaid"
            }

            chai.request(app)
                .put("/api/transaction/1")
                .set("x-access-token", adminToken)
                .send(transaction)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error")
                    res.body.error.should.have.property("errors")
                    res.body.error.errors.should.have.property("loan")
                    res.body.error.errors.loan.should.have.property("properties")
                    res.body.error.errors.loan.properties.should.have.property("type").eql("required")
                    done()
                })
        })

        it("it should not update the transaction without the date field", (done) => {
            const transaction = {
                "loan": loanObject._id,
                "amount": 10000,
                "cashCollector": cashCollectorObject._id,
                "status": "unpaid"
            }

            chai.request(app)
                .put("/api/transaction/1")
                .set("x-access-token", adminToken)
                .send(transaction)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error")
                    res.body.error.should.have.property("errors")
                    res.body.error.errors.should.have.property("date")
                    res.body.error.errors.date.should.have.property("properties")
                    res.body.error.errors.date.properties.should.have.property("type").eql("required")
                    done()
                })
        })

        it("it should not update the transaction without the amount field", (done) => {
            const transaction = {
                "loan": loanObject._id,
                "date": new Date(),
                "cashCollector": cashCollectorObject._id,
                "status": "unpaid"
            }

            chai.request(app)
                .put("/api/transaction/1")
                .set("x-access-token", adminToken)
                .send(transaction)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error")
                    res.body.error.should.have.property("errors")
                    res.body.error.errors.should.have.property("amount")
                    res.body.error.errors.amount.should.have.property("properties")
                    res.body.error.errors.amount.properties.should.have.property("type").eql("required")
                    done()
                })
        })

        it("it should not update the transaction without the cashCollector field", (done) => {
            const transaction = {
                "loan": loanObject._id,
                "date": new Date(),
                "amount": 10000,
                "status": "unpaid"
            }

            chai.request(app)
                .put("/api/transaction/1")
                .set("x-access-token", adminToken)
                .send(transaction)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error")
                    res.body.error.should.have.property("errors")
                    res.body.error.errors.should.have.property("cashCollector")
                    res.body.error.errors.cashCollector.should.have.property("properties")
                    res.body.error.errors.cashCollector.properties.should.have.property("type").eql("required")
                    done()
                })
        })

        it("it should not update the transaction without the status field", (done) => {
            const transaction = {
                "loan": loanObject._id,
                "date": new Date(),
                "amount": 10000,
                "cashCollector": cashCollectorObject._id,
            }

            chai.request(app)
                .put("/api/transaction/1")
                .set("x-access-token", adminToken)
                .send(transaction)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error")
                    res.body.error.should.have.property("errors")
                    res.body.error.errors.should.have.property("status")
                    res.body.error.errors.status.should.have.property("properties")
                    res.body.error.errors.status.properties.should.have.property("type").eql("required")
                    done()
                })
        })

        it("it should update the transaction given the transactionID for the admin account type", (done) => {
            const transaction = {
                "loan": loanObject._id,
                "date": new Date(),
                "amount": 10000,
                "cashCollector": cashCollectorObject._id,
                "status": "unpaid"
            }

            chai.request(app)
                .put("/api/transaction/1")
                .set("x-access-token", adminToken)
                .send(transaction)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("result")
                    // Check for all fields
                    res.body.result.should.have.property("_id")
                    res.body.result.should.have.property("transactionID").eql(1)
                    res.body.result.should.have.property("loan")
                    res.body.result.should.have.property("date")
                    res.body.result.should.have.property("amount").eql(10000)
                    res.body.result.should.have.property("cashCollector")
                    res.body.result.should.have.property("status").eql("unpaid")
                    res.body.result.should.have.property("__v")
                    done()
                })
        })

        it("it should update the transaction given the transactionID for the manager account type", (done) => {
            const transaction = {
                "loan": loanObject._id,
                "date": new Date(),
                "amount": 10000,
                "cashCollector": cashCollectorObject._id,
                "status": "unpaid"
            }

            chai.request(app)
                .put("/api/transaction/1")
                .set("x-access-token", managerToken)
                .send(transaction)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("result")
                    // Check for all fields
                    res.body.result.should.have.property("_id")
                    res.body.result.should.have.property("transactionID").eql(1)
                    res.body.result.should.have.property("loan")
                    res.body.result.should.have.property("date")
                    res.body.result.should.have.property("amount").eql(10000)
                    res.body.result.should.have.property("cashCollector")
                    res.body.result.should.have.property("status").eql("unpaid")
                    res.body.result.should.have.property("__v")
                    done()
                })
        })

        it("it should not update the transaction given the transactionID for the receptionist account type", (done) => {
            const transaction = {
                "loan": loanObject._id,
                "date": new Date(),
                "amount": 10000,
                "cashCollector": cashCollectorObject._id,
                "status": "unpaid"
            }

            chai.request(app)
                .put("/api/transaction/1")
                .set("x-access-token", receptionistToken)
                .send(transaction)
                .end((err, res) => {
                    res.should.have.status(401)
                    res.body.should.be.a("object")
                    res.body.should.have.property("success").eql(false)
                    res.body.should.have.property("message").eql("Unauthorised")
                    done()
                })
        })

        it("it should update the transaction given the transactionID for the cash collector account type", (done) => {
            const transaction = {
                "loan": loanObject._id,
                "date": new Date(),
                "amount": 10000,
                "cashCollector": cashCollectorObject._id,
                "status": "unpaid"
            }

            chai.request(app)
                .put("/api/transaction/1")
                .set("x-access-token", cashCollectorToken)
                .send(transaction)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("result")
                    // Check for all fields
                    res.body.result.should.have.property("_id")
                    res.body.result.should.have.property("transactionID").eql(1)
                    res.body.result.should.have.property("loan")
                    res.body.result.should.have.property("date")
                    res.body.result.should.have.property("amount").eql(10000)
                    res.body.result.should.have.property("cashCollector")
                    res.body.result.should.have.property("status").eql("unpaid")
                    res.body.result.should.have.property("__v")
                    done()
                })
        })
    })
})