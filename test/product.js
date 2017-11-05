"use strict"

// Get dependencies
const app = require("../src/app").app
const chai = require("chai")
const chaiHttp = require("chai-http")
const Product = require("../src/models/productSchema")
const Employee = require("../src/models/employeeSchema")
const Counter = require("../src/models/counterSchema")
const should = chai.should()

// Used for hashing password and pin
const bcrypt = require("bcrypt")
const saltRounds = 10

chai.use(chaiHttp)

describe("Product", () => {
    // Store authentication tokens
    let adminToken = null
    let managerToken = null
    let receptionistToken = null
    let cashCollectorToken = null

    // Store the admin and manager objects
    let adminObject = null
    let managerObject = null

    /*
        Remove all employees, products and counters, and
        create new employees before running the tests
    */
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
            "phone": "1234567890"
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
            "phone": "1234567890"
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
            "phone": "1234567890"
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
            "phone": "1234567890"
        }

        // Remove all existing employees
        Employee.remove({})
            // Remove all existing products
            .then(() => Product.remove({}))
            // Remove all existing counters
            .then(() => Counter.remove({}))
            // Hash all passwords and pins
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
            // Update passwords and pins with hashed values
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
            // Save all employees to database
            .then(() => Promise.all([
                Employee.create(admin),
                Employee.create(manager),
                Employee.create(receptionist),
                Employee.create(cashCollector),
            ]))
            .then((result) => {
                adminObject = result[0]
                managerObject = result[1]
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

    // Test the GET /api/product route
    describe("GET /api/product", () => {
        it("it should not get all the products without an authorization token", (done) => {
            chai.request(app)
                .get("/api/product")
                .end((err, res) => {
                    res.should.have.status(401)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    res.body.should.have.property("success").eql(false)
                    res.body.should.have.property("message").eql("Unauthorised")
                    done()
                })
        })

        it("it should get all the products for the admin account type", (done) => {
            chai.request(app)
                .get("/api/product")
                .set("x-access-token", adminToken)
                .end((err, res) => {
                    res.should.have.status(200)
                    should.exist(res.body)
                    res.body.should.be.a("array")
                    res.body.length.should.be.eql(0)
                    done()
                })
        })

        it("it should get all the products for the manager account type", (done) => {
            chai.request(app)
                .get("/api/product")
                .set("x-access-token", managerToken)
                .end((err, res) => {
                    res.should.have.status(200)
                    should.exist(res.body)
                    res.body.should.be.a("array")
                    res.body.length.should.be.eql(0)
                    done()
                })
        })

        it("it should get all the products for the receptionist account type", (done) => {
            chai.request(app)
                .get("/api/product")
                .set("x-access-token", receptionistToken)
                .end((err, res) => {
                    res.should.have.status(200)
                    should.exist(res.body)
                    res.body.should.be.a("array")
                    res.body.length.should.be.eql(0)
                    done()
                })
        })

        it("it should get all the products for the cash collector account type", (done) => {
            chai.request(app)
                .get("/api/product")
                .set("x-access-token", cashCollectorToken)
                .end((err, res) => {
                    res.should.have.status(200)
                    should.exist(res.body)
                    res.body.should.be.a("array")
                    res.body.length.should.be.eql(0)
                    done()
                })
        })
    })

    // Test the POST /api/product route
    describe("POST /api/product", () => {
        it("it should not create a product without an authorization token", (done) => {
            const product = {
                "productName": "One month loan",
                "description": "Loan for a duration of one month",
                "minAmount": 10000,
                "maxAmount": 30000,
                "gracePeriod": 2,
                "interestRate": 2,
                "accruedInterest": 4,
                "approvedBy": adminObject._id,
                "duration": 30
            }

            chai.request(app)
                .post("/api/product")
                .send(product)
                .end((err, res) => {
                    res.should.have.status(401)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    res.body.should.have.property("success").eql(false)
                    res.body.should.have.property("message").eql("Unauthorised")
                    done()
                })
        })

        it("it should not create a product without the productName field", (done) => {
            const product = {
                "description": "Loan for a duration of one month",
                "minAmount": 10000,
                "maxAmount": 30000,
                "gracePeriod": 2,
                "interestRate": 2,
                "accruedInterest": 4,
                "approvedBy": adminObject._id,
                "duration": 30
            }

            chai.request(app)
                .post("/api/product")
                .set("x-access-token", adminToken)
                .send(product)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error")
                    res.body.error.should.have.property("errors")
                    res.body.error.errors.should.have.property("productName")
                    res.body.error.errors.productName.should.have.property("properties")
                    res.body.error.errors.productName.properties.should.have.property("type").eql("required")
                    done()
                })
        })

        it("it should not create a product without the description field", (done) => {
            const product = {
                "productName": "One month loan",
                "minAmount": 10000,
                "maxAmount": 30000,
                "gracePeriod": 2,
                "interestRate": 2,
                "accruedInterest": 4,
                "approvedBy": adminObject._id,
                "duration": 30
            }

            chai.request(app)
                .post("/api/product")
                .set("x-access-token", adminToken)
                .send(product)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error")
                    res.body.error.should.have.property("errors")
                    res.body.error.errors.should.have.property("description")
                    res.body.error.errors.description.should.have.property("properties")
                    res.body.error.errors.description.properties.should.have.property("type").eql("required")
                    done()
                })
        })

        it("it should not create a product without the minAmount field", (done) => {
            const product = {
                "productName": "One month loan",
                "description": "Loan for a duration of one month",
                "maxAmount": 30000,
                "gracePeriod": 2,
                "interestRate": 2,
                "accruedInterest": 4,
                "approvedBy": adminObject._id,
                "duration": 30
            }

            chai.request(app)
                .post("/api/product")
                .set("x-access-token", adminToken)
                .send(product)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error")
                    res.body.error.should.have.property("errors")
                    res.body.error.errors.should.have.property("minAmount")
                    res.body.error.errors.minAmount.should.have.property("properties")
                    res.body.error.errors.minAmount.properties.should.have.property("type").eql("required")
                    done()
                })
        })

        it("it should not create a product without the maxAmount field", (done) => {
            const product = {
                "productName": "One month loan",
                "description": "Loan for a duration of one month",
                "minAmount": 10000,
                "gracePeriod": 2,
                "interestRate": 2,
                "accruedInterest": 4,
                "approvedBy": adminObject._id,
                "duration": 30
            }

            chai.request(app)
                .post("/api/product")
                .set("x-access-token", adminToken)
                .send(product)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error")
                    res.body.error.should.have.property("errors")
                    res.body.error.errors.should.have.property("maxAmount")
                    res.body.error.errors.maxAmount.should.have.property("properties")
                    res.body.error.errors.maxAmount.properties.should.have.property("type").eql("required")
                    done()
                })
        })

        it("it should not create a product without the gracePeriod field", (done) => {
            const product = {
                "productName": "One month loan",
                "description": "Loan for a duration of one month",
                "minAmount": 10000,
                "maxAmount": 30000,
                "interestRate": 2,
                "accruedInterest": 4,
                "approvedBy": adminObject._id,
                "duration": 30
            }

            chai.request(app)
                .post("/api/product")
                .set("x-access-token", adminToken)
                .send(product)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error")
                    res.body.error.should.have.property("errors")
                    res.body.error.errors.should.have.property("gracePeriod")
                    res.body.error.errors.gracePeriod.should.have.property("properties")
                    res.body.error.errors.gracePeriod.properties.should.have.property("type").eql("required")
                    done()
                })
        })

        it("it should not create a product without the interestRate field", (done) => {
            const product = {
                "productName": "One month loan",
                "description": "Loan for a duration of one month",
                "minAmount": 10000,
                "maxAmount": 30000,
                "gracePeriod": 2,
                "accruedInterest": 4,
                "approvedBy": adminObject._id,
                "duration": 30
            }

            chai.request(app)
                .post("/api/product")
                .set("x-access-token", adminToken)
                .send(product)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error")
                    res.body.error.should.have.property("errors")
                    res.body.error.errors.should.have.property("interestRate")
                    res.body.error.errors.interestRate.should.have.property("properties")
                    res.body.error.errors.interestRate.properties.should.have.property("type").eql("required")
                    done()
                })
        })

        it("it should not create a product without the accruedInterest field", (done) => {
            const product = {
                "productName": "One month loan",
                "description": "Loan for a duration of one month",
                "minAmount": 10000,
                "maxAmount": 30000,
                "gracePeriod": 2,
                "interestRate": 2,
                "approvedBy": adminObject._id,
                "duration": 30
            }

            chai.request(app)
                .post("/api/product")
                .set("x-access-token", adminToken)
                .send(product)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error")
                    res.body.error.should.have.property("errors")
                    res.body.error.errors.should.have.property("accruedInterest")
                    res.body.error.errors.accruedInterest.should.have.property("properties")
                    res.body.error.errors.accruedInterest.properties.should.have.property("type").eql("required")
                    done()
                })
        })

        it("it should not create a product without the duration field", (done) => {
            const product = {
                "productName": "One month loan",
                "description": "Loan for a duration of one month",
                "minAmount": 10000,
                "maxAmount": 30000,
                "gracePeriod": 2,
                "interestRate": 2,
                "accruedInterest": 4
            }

            chai.request(app)
                .post("/api/product")
                .set("x-access-token", adminToken)
                .send(product)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error")
                    res.body.error.should.have.property("errors")
                    res.body.error.errors.should.have.property("duration")
                    res.body.error.errors.duration.should.have.property("properties")
                    res.body.error.errors.duration.properties.should.have.property("type").eql("required")
                    done()
                })
        })

        it("it should create a product for the admin account type", (done) => {
            const product = {
                "productName": "One month loan",
                "description": "Loan for a duration of one month",
                "minAmount": 10000,
                "maxAmount": 30000,
                "gracePeriod": 2,
                "interestRate": 2,
                "accruedInterest": 4,
                "approvedBy": adminObject._id,
                "duration": 30
            }

            // Remove all products before running the test
            Product.remove({}, () => {
                // Reset counter before running test
                Counter.remove({}, () => {
                    chai.request(app)
                        .post("/api/product")
                        .set("x-access-token", adminToken)
                        .send(product)
                        .end((err, res) => {
                            res.should.have.status(200)
                            res.body.should.be.a("object")
                            // Check for all fields
                            res.body.should.have.property("__v")
                            res.body.should.have.property("_id")
                            res.body.should.have.property("productID").eql(1)
                            res.body.should.have.property("productName").eql("One month loan")
                            res.body.should.have.property("description").eql("Loan for a duration of one month")
                            res.body.should.have.property("minAmount").eql(10000)
                            res.body.should.have.property("maxAmount").eql(30000)
                            res.body.should.have.property("gracePeriod").eql(2)
                            res.body.should.have.property("interestRate").eql(2)
                            res.body.should.have.property("accruedInterest").eql(4)
                            res.body.should.have.property("approvedBy")
                            res.body.should.have.property("duration").eql(30)
                            done()
                        })
                })
            })
        })

        it("it should create a product for the manager account type", (done) => {
            const product = {
                "productName": "One month loan",
                "description": "Loan for a duration of one month",
                "minAmount": 10000,
                "maxAmount": 30000,
                "gracePeriod": 2,
                "interestRate": 2,
                "accruedInterest": 4,
                "approvedBy": managerObject._id,
                "duration": 30
            }

            // Remove all products before running the test
            Product.remove({}, () => {
                // Reset counter before running test
                Counter.remove({}, () => {
                    chai.request(app)
                        .post("/api/product")
                        .set("x-access-token", managerToken)
                        .send(product)
                        .end((err, res) => {
                            res.should.have.status(200)
                            res.body.should.be.a("object")
                            // Check for all fields
                            res.body.should.have.property("__v")
                            res.body.should.have.property("_id")
                            res.body.should.have.property("productID").eql(1)
                            res.body.should.have.property("productName").eql("One month loan")
                            res.body.should.have.property("description").eql("Loan for a duration of one month")
                            res.body.should.have.property("minAmount").eql(10000)
                            res.body.should.have.property("maxAmount").eql(30000)
                            res.body.should.have.property("gracePeriod").eql(2)
                            res.body.should.have.property("interestRate").eql(2)
                            res.body.should.have.property("accruedInterest").eql(4)
                            res.body.should.have.property("approvedBy")
                            res.body.should.have.property("duration").eql(30)
                            done()
                        })
                })
            })
        })
    })

    // Test the GET /api/product/:productID route
    describe("GET /api/product/:productID", () => {
        it("it should not get the product without an authorization token", (done) => {
            chai.request(app)
                .get("/api/product/1")
                .end((err, res) => {
                    res.should.have.status(401)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    res.body.should.have.property("success").eql(false)
                    res.body.should.have.property("message").eql("Unauthorised")
                    done()
                })
        })

        it("it should get the product for the admin account type", (done) => {
            chai.request(app)
                .get("/api/product/1")
                .set("x-access-token", adminToken)
                .end((err, res) => {
                    res.should.have.status(200)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    // Check if approvedBy field has proper nested object
                    res.body.should.have.property("approvedBy")
                    res.body.approvedBy.should.be.a("object")
                    done()
                })
        })

        it("it should get the product for the manager account type", (done) => {
            chai.request(app)
                .get("/api/product/1")
                .set("x-access-token", managerToken)
                .end((err, res) => {
                    res.should.have.status(200)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    // Check if approvedBy field has proper nested object
                    res.body.should.have.property("approvedBy")
                    res.body.approvedBy.should.be.a("object")
                    done()
                })
        })

        it("it should get the product for the receptionist account type", (done) => {
            chai.request(app)
                .get("/api/product/1")
                .set("x-access-token", receptionistToken)
                .end((err, res) => {
                    res.should.have.status(200)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    // Check if approvedBy field has proper nested object
                    res.body.should.have.property("approvedBy")
                    res.body.approvedBy.should.be.a("object")
                    done()
                })
        })

        it("it should get the product for the cash collector account type", (done) => {
            chai.request(app)
                .get("/api/product/1")
                .set("x-access-token", cashCollectorToken)
                .end((err, res) => {
                    res.should.have.status(200)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    // Check if approvedBy field has proper nested object
                    res.body.should.have.property("approvedBy")
                    res.body.approvedBy.should.be.a("object")
                    done()
                })
        })
    })

    // Test the PUT /api/product/:productID route
    describe("PUT /api/product/:productID", () => {
        it("it should not update the product without an authorization token", (done) => {
            const product = {
                "productName": "One month loan",
                "description": "Loan for a duration of one month",
                "minAmount": 10000,
                "maxAmount": 30000,
                "gracePeriod": 2,
                "interestRate": 2,
                "accruedInterest": 4,
                "approvedBy": adminObject._id,
                "duration": 30
            }

            chai.request(app)
                .put("/api/product/1")
                .send(product)
                .end((err, res) => {
                    res.should.have.status(401)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    res.body.should.have.property("success").eql(false)
                    res.body.should.have.property("message").eql("Unauthorised")
                    done()
                })
        })

        it("it should not update the product with the wrong productID", (done) => {
            const product = {
                "productName": "One month loan",
                "description": "Loan for a duration of one month",
                "minAmount": 10000,
                "maxAmount": 30000,
                "gracePeriod": 2,
                "interestRate": 2,
                "accruedInterest": 4,
                "approvedBy": adminObject._id,
                "duration": 30
            }

            chai.request(app)
                .put("/api/product/2")
                .set("x-access-token", adminToken)
                .send(product)
                .end((err, res) => {
                    res.should.have.status(200)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error").eql("Record does not exist")
                    done()
                })
        })

        it("it should not update the product without the productName field", (done) => {
            const product = {
                "description": "Loan for a duration of one month",
                "minAmount": 10000,
                "maxAmount": 30000,
                "gracePeriod": 2,
                "interestRate": 2,
                "accruedInterest": 4,
                "approvedBy": adminObject._id,
                "duration": 30
            }

            chai.request(app)
                .put("/api/product/1")
                .set("x-access-token", adminToken)
                .send(product)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error")
                    res.body.error.should.have.property("errors")
                    res.body.error.errors.should.have.property("productName")
                    res.body.error.errors.productName.should.have.property("properties")
                    res.body.error.errors.productName.properties.should.have.property("type").eql("required")
                    done()
                })
        })

        it("it should not update the product without the description field", (done) => {
            const product = {
                "productName": "One month loan",
                "minAmount": 10000,
                "maxAmount": 30000,
                "gracePeriod": 2,
                "interestRate": 2,
                "accruedInterest": 4,
                "approvedBy": adminObject._id,
                "duration": 30
            }

            chai.request(app)
                .put("/api/product/1")
                .set("x-access-token", adminToken)
                .send(product)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error")
                    res.body.error.should.have.property("errors")
                    res.body.error.errors.should.have.property("description")
                    res.body.error.errors.description.should.have.property("properties")
                    res.body.error.errors.description.properties.should.have.property("type").eql("required")
                    done()
                })
        })

        it("it should not update the product without the minAmount field", (done) => {
            const product = {
                "productName": "One month loan",
                "description": "Loan for a duration of one month",
                "maxAmount": 30000,
                "gracePeriod": 2,
                "interestRate": 2,
                "accruedInterest": 4,
                "approvedBy": adminObject._id,
                "duration": 30
            }

            chai.request(app)
                .put("/api/product/1")
                .set("x-access-token", adminToken)
                .send(product)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error")
                    res.body.error.should.have.property("errors")
                    res.body.error.errors.should.have.property("minAmount")
                    res.body.error.errors.minAmount.should.have.property("properties")
                    res.body.error.errors.minAmount.properties.should.have.property("type").eql("required")
                    done()
                })
        })

        it("it should not update the product without the maxAmount field", (done) => {
            const product = {
                "productName": "One month loan",
                "description": "Loan for a duration of one month",
                "minAmount": 10000,
                "gracePeriod": 2,
                "interestRate": 2,
                "accruedInterest": 4,
                "approvedBy": adminObject._id,
                "duration": 30
            }

            chai.request(app)
                .put("/api/product/1")
                .set("x-access-token", adminToken)
                .send(product)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error")
                    res.body.error.should.have.property("errors")
                    res.body.error.errors.should.have.property("maxAmount")
                    res.body.error.errors.maxAmount.should.have.property("properties")
                    res.body.error.errors.maxAmount.properties.should.have.property("type").eql("required")
                    done()
                })
        })

        it("it should not update product without the gracePeriod field", (done) => {
            const product = {
                "productName": "One month loan",
                "description": "Loan for a duration of one month",
                "minAmount": 10000,
                "maxAmount": 30000,
                "interestRate": 2,
                "accruedInterest": 4,
                "approvedBy": adminObject._id,
                "duration": 30
            }

            chai.request(app)
                .put("/api/product/1")
                .set("x-access-token", adminToken)
                .send(product)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error")
                    res.body.error.should.have.property("errors")
                    res.body.error.errors.should.have.property("gracePeriod")
                    res.body.error.errors.gracePeriod.should.have.property("properties")
                    res.body.error.errors.gracePeriod.properties.should.have.property("type").eql("required")
                    done()
                })
        })

        it("it should not update the product without the interestRate field", (done) => {
            const product = {
                "productName": "One month loan",
                "description": "Loan for a duration of one month",
                "minAmount": 10000,
                "maxAmount": 30000,
                "gracePeriod": 2,
                "accruedInterest": 4,
                "approvedBy": adminObject._id,
                "duration": 30
            }

            chai.request(app)
                .put("/api/product/1")
                .set("x-access-token", adminToken)
                .send(product)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error")
                    res.body.error.should.have.property("errors")
                    res.body.error.errors.should.have.property("interestRate")
                    res.body.error.errors.interestRate.should.have.property("properties")
                    res.body.error.errors.interestRate.properties.should.have.property("type").eql("required")
                    done()
                })
        })

        it("it should not update the product without the accruedInterest field", (done) => {
            const product = {
                "productName": "One month loan",
                "description": "Loan for a duration of one month",
                "minAmount": 10000,
                "maxAmount": 30000,
                "gracePeriod": 2,
                "interestRate": 2,
                "approvedBy": adminObject._id,
                "duration": 30
            }

            chai.request(app)
                .put("/api/product/1")
                .set("x-access-token", adminToken)
                .send(product)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error")
                    res.body.error.should.have.property("errors")
                    res.body.error.errors.should.have.property("accruedInterest")
                    res.body.error.errors.accruedInterest.should.have.property("properties")
                    res.body.error.errors.accruedInterest.properties.should.have.property("type").eql("required")
                    done()
                })
        })

        it("it should not update the product without the approvedBy field", (done) => {
            const product = {
                "productName": "One month loan",
                "description": "Loan for a duration of one month",
                "minAmount": 10000,
                "maxAmount": 30000,
                "gracePeriod": 2,
                "interestRate": 2,
                "accruedInterest": 4,
                "duration": 30
            }

            chai.request(app)
                .put("/api/product/1")
                .set("x-access-token", adminToken)
                .send(product)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error")
                    res.body.error.should.have.property("errors")
                    res.body.error.errors.should.have.property("approvedBy")
                    res.body.error.errors.approvedBy.should.have.property("properties")
                    res.body.error.errors.approvedBy.properties.should.have.property("type").eql("required")
                    done()
                })
        })

        it("it should not update the product without the duration field", (done) => {
            const product = {
                "productName": "One month loan",
                "description": "Loan for a duration of one month",
                "minAmount": 10000,
                "maxAmount": 30000,
                "gracePeriod": 2,
                "interestRate": 2,
                "accruedInterest": 4
            }

            chai.request(app)
                .put("/api/product/1")
                .set("x-access-token", adminToken)
                .send(product)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error")
                    res.body.error.should.have.property("errors")
                    res.body.error.errors.should.have.property("duration")
                    res.body.error.errors.duration.should.have.property("properties")
                    res.body.error.errors.duration.properties.should.have.property("type").eql("required")
                    done()
                })
        })

        it("it should update the product for the admin account type", (done) => {
            const product = {
                "productName": "One month loan",
                "description": "Loan for a duration of one month",
                "minAmount": 10000,
                "maxAmount": 30000,
                "gracePeriod": 2,
                "interestRate": 2,
                "accruedInterest": 4,
                "approvedBy": adminObject._id,
                "duration": 30
            }

            chai.request(app)
                .put("/api/product/1")
                .set("x-access-token", adminToken)
                .send(product)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    // Check for all fields
                    res.body.should.have.property("__v")
                    res.body.should.have.property("_id")
                    res.body.should.have.property("productID").eql(1)
                    res.body.should.have.property("productName").eql("One month loan")
                    res.body.should.have.property("description").eql("Loan for a duration of one month")
                    res.body.should.have.property("minAmount").eql(10000)
                    res.body.should.have.property("maxAmount").eql(30000)
                    res.body.should.have.property("gracePeriod").eql(2)
                    res.body.should.have.property("interestRate").eql(2)
                    res.body.should.have.property("accruedInterest").eql(4)
                    res.body.should.have.property("approvedBy")
                    res.body.should.have.property("duration").eql(30)
                    done()
                })
        })

        it("it should update the product for the manager account type", (done) => {
            const product = {
                "productName": "One month loan",
                "description": "Loan for a duration of one month",
                "minAmount": 10000,
                "maxAmount": 30000,
                "gracePeriod": 2,
                "interestRate": 2,
                "accruedInterest": 4,
                "approvedBy": managerObject._id,
                "duration": 30
            }

            chai.request(app)
                .put("/api/product/1")
                .set("x-access-token", managerToken)
                .send(product)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    // Check for all fields
                    res.body.should.have.property("__v")
                    res.body.should.have.property("_id")
                    res.body.should.have.property("productID").eql(1)
                    res.body.should.have.property("productName").eql("One month loan")
                    res.body.should.have.property("description").eql("Loan for a duration of one month")
                    res.body.should.have.property("minAmount").eql(10000)
                    res.body.should.have.property("maxAmount").eql(30000)
                    res.body.should.have.property("gracePeriod").eql(2)
                    res.body.should.have.property("interestRate").eql(2)
                    res.body.should.have.property("accruedInterest").eql(4)
                    res.body.should.have.property("approvedBy")
                    res.body.should.have.property("duration").eql(30)
                    done()
                })
        })
    })

    // Test the PATCH /api/product/:productID route
    describe("PATCH /api/product/:productID", () => {
        it("it should not approve the product without an authorization token", (done) => {
            chai.request(app)
                .patch("/api/product/1/approve")
                .end((err, res) => {
                    res.should.have.status(401)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    res.body.should.have.property("success").eql(false)
                    res.body.should.have.property("message").eql("Unauthorised")
                    done()
                })
        })

        it("it should not approve the product with the wrong productID", (done) => {
            chai.request(app)
                .patch("/api/product/2/approve")
                .set("x-access-token", adminToken)
                .end((err, res) => {
                    res.should.have.status(200)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error").eql("Record does not exist")
                    done()
                })
        })

        it("it should approve the product for the admin account type", (done) => {
            chai.request(app)
                .patch("/api/product/1/approve")
                .set("x-access-token", adminToken)
                .end((err, res) => {
                    res.should.have.status(200)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    res.body.should.have.property("additionalApproval")
                    done()
                })
        })

        it("it should approve the product for the manager account type", (done) => {
            chai.request(app)
                .patch("/api/product/1/approve")
                .set("x-access-token", managerToken)
                .end((err, res) => {
                    res.should.have.status(200)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    res.body.should.have.property("additionalApproval")
                    done()
                })
        })

        it("it should approve the product for the receptionist account type", (done) => {
            chai.request(app)
                .patch("/api/product/1/approve")
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

        it("it should approve the product for the cash collector account type", (done) => {
            chai.request(app)
                .patch("/api/product/1/approve")
                .set("x-access-token", cashCollectorToken)
                .end((err, res) => {
                    res.should.have.status(401)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    res.body.should.have.property("success").eql(false)
                    res.body.should.have.property("message").eql("Unauthorised")
                    done()
                })
        })
    })
})