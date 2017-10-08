"use strict"

const app = require("../src/app").app

const chai = require("chai")
const chaiHttp = require("chai-http")
const Loan = require("../src/models/loanSchema")
const Employee = require("../src/models/employeeSchema")
const Counter = require("../src/models/counterSchema")
const should = chai.should()

// Used for hashing password and pin
const bcrypt = require("bcrypt")
const saltRounds = 10

chai.use(chaiHttp)

describe("Loans", () => {
    // Store authentication adminTokens
    let adminToken = null
    let managerToken = null
    let receptionistToken = null
    let cashCollectorToken = null

    /* Remove all employees, loans and counters 
    , and create a new employee and new loans
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
            "phone": {
                "work": "1234567890",
                "personal": "0987654321"
            }
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
            "phone": {
                "work": "1234567890",
                "personal": "0987654321"
            }
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
            "phone": {
                "work": "1234567890",
                "personal": "0987654321"
            }
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
            "phone": {
                "work": "1234567890",
                "personal": "0987654321"
            }
        }

        const loan1 = {
            "loanType": "Fix Deposit",
            "date": "01-01-2000",
            "loanAmount": 5000,
            "duration": 6,
            "interest": 2,
            "customerID": 2
        }

        const loan2 = {
            "loanType": "Student Loan",
            "date": "06-04-2010",
            "loanAmount": 10000,
            "duration": 24,
            "interest": 15,
            "customerID": 1,
            "manager": "John",
            "status": "approved"
        }

        Employee.remove({})
            .then(() => Loan.remove({}))
            .then(() => Counter.remove({}))
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
            .then(() => Promise.all([
                Employee.create(admin),
                Employee.create(manager),
                Employee.create(receptionist),
                Employee.create(cashCollector),
                Loan.create(loan1),
                Loan.create(loan2)
            ]))
            .then(() => {
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

    // Test the GET /api/loan route
    describe("GET /api/loan", () => {
        it("it should not get all the loans without an authorization token", (done) => {
            chai.request(app)
                .get("/api/loan")
                .end((err, res) => {
                    res.should.have.status(401)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    res.body.should.have.property("success").eql(false)
                    res.body.should.have.property("message").eql("Unauthorised")
                    done()
                })
        })

        it("it should get all the loans for the admin account type", (done) => {
            chai.request(app)
                .get("/api/loan")
                .set("x-access-token", adminToken)
                .end((err, res) => {
                    res.should.have.status(200)
                    should.exist(res.body)
                    res.body.should.be.a("array")
                    res.body.length.should.be.eql(2)
                    done()
                })
        })

        it("it should get all the loans for the manager account type", (done) => {
            chai.request(app)
                .get("/api/loan")
                .set("x-access-token", managerToken)
                .end((err, res) => {
                    res.should.have.status(200)
                    should.exist(res.body)
                    res.body.should.be.a("array")
                    res.body.length.should.be.eql(2)
                    done()
                })
        })

        it("it should get all the loans for the receptionist account type", (done) => {
            chai.request(app)
                .get("/api/loan")
                .set("x-access-token", receptionistToken)
                .end((err, res) => {
                    res.should.have.status(200)
                    should.exist(res.body)
                    res.body.should.be.a("array")
                    res.body.length.should.be.eql(2)
                    done()
                })
        })

        it("it should get all the loans for the cash collector account type", (done) => {
            chai.request(app)
                .get("/api/loan")
                .set("x-access-token", cashCollectorToken)
                .end((err, res) => {
                    res.should.have.status(200)
                    should.exist(res.body)
                    res.body.should.be.a("array")
                    res.body.length.should.be.eql(2)
                    done()
                })
        })

        it("it should get loans based on status if specified in the query", (done) => {
            chai.request(app)
                .get("/api/loan?status=approved")
                .set("x-access-token", adminToken)
                .end((err, res) => {
                    res.should.have.status(200)
                    should.exist(res.body)
                    res.body.should.be.a("array")
                    res.body.length.should.be.eql(1)
                    done()
                })
        })

        it("it should get loans based on manager if specified in the query", (done) => {
            chai.request(app)
                .get("/api/loan?manager=Not+set")
                .set("x-access-token", adminToken)
                .end((err, res) => {
                    res.should.have.status(200)
                    should.exist(res.body)
                    res.body.should.be.a("array")
                    res.body.length.should.be.eql(1)
                    done()
                })
        })

        it("it should get loans based on customerID if specified in the query", (done) => {
            chai.request(app)
                .get("/api/loan?customerID=1")
                .set("x-access-token", adminToken)
                .end((err, res) => {
                    res.should.have.status(200)
                    should.exist(res.body)
                    res.body.should.be.a("array")
                    res.body.length.should.be.eql(1)
                    done()
                })
        })

        it("it should get loans based on loan type if specified in the query", (done) => {
            chai.request(app)
                .get("/api/loan?loanType=Student+Loan")
                .set("x-access-token", adminToken)
                .end((err, res) => {
                    res.should.have.status(200)
                    should.exist(res.body)
                    res.body.should.be.a("array")
                    res.body.length.should.be.eql(1)
                    done()
                })
        })
    })

    // Test the POST /api/loan route
    describe("POST /api/loan", () => {
        it("it should not create a loan without an authorization token", (done) => {
            const loan = {
                "loanType": "Fix Deposit",
                "date": "04-03-1998",
                "loanAmount": 250000,
                "duration": 12,
                "interest": 5,
                "customerID": 1
            }

            chai.request(app)
                .post("/api/loan")
                .send(loan)
                .end((err, res) => {
                    res.should.have.status(401)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    res.body.should.have.property("success").eql(false)
                    res.body.should.have.property("message").eql("Unauthorised")
                    done()
                })
        })


        it("it should not create a loan without the loanType field", (done) => {
            const loan = {
                "date": "04-03-1998",
                "loanAmount": 250000,
                "duration": 12,
                "interest": 5,
                "customerID": 1
            }

            chai.request(app)
                .post("/api/loan")
                .set("x-access-token", adminToken)
                .send(loan)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error")
                    res.body.error.should.have.property("errors")
                    res.body.error.errors.should.have.property("loanType")
                    res.body.error.errors.loanType.should.have.property("properties")
                    res.body.error.errors.loanType.properties.should.have.property("type").eql("required")
                    done()
                })
        })

        it("it should not create a loan without the date field", (done) => {
            const loan = {
                "loanType": "Fix Deposit",
                "loanAmount": 250000,
                "duration": 12,
                "interest": 5,
                "customerID": 1
            }

            chai.request(app)
                .post("/api/loan")
                .set("x-access-token", adminToken)
                .send(loan)
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

        it("it should not create a loan without the loanAmount field", (done) => {
            const loan = {
                "loanType": "Fix Deposit",
                "date": "04-03-1998",
                "duration": 12,
                "interest": 5,
                "customerID": 1
            }

            chai.request(app)
                .post("/api/loan")
                .set("x-access-token", adminToken)
                .send(loan)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error")
                    res.body.error.should.have.property("errors")
                    res.body.error.errors.should.have.property("loanAmount")
                    res.body.error.errors.loanAmount.should.have.property("properties")
                    res.body.error.errors.loanAmount.properties.should.have.property("type").eql("required")
                    done()
                })
        })

        it("it should not create a loan without the duration field", (done) => {
            const loan = {
                "loanType": "Fix Deposit",
                "date": "04-03-1998",
                "loanAmount": 250000,
                "interest": 5,
                "customerID": 1
            }

            chai.request(app)
                .post("/api/loan")
                .set("x-access-token", adminToken)
                .send(loan)
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

        it("it should not create a loan without the interest field", (done) => {
            const loan = {
                "loanType": "Fix Deposit",
                "date": "04-03-1998",
                "loanAmount": 250000,
                "duration": 12,
                "customerID": 1
            }

            chai.request(app)
                .post("/api/loan")
                .set("x-access-token", adminToken)
                .send(loan)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error")
                    res.body.error.should.have.property("errors")
                    res.body.error.errors.should.have.property("interest")
                    res.body.error.errors.interest.should.have.property("properties")
                    res.body.error.errors.interest.properties.should.have.property("type").eql("required")
                    done()
                })
        })

        it("it should not create a loan without the customerID field", (done) => {
            const loan = {
                "loanType": "Fix Deposit",
                "date": "04-03-1998",
                "loanAmount": 250000,
                "duration": 12,
                "interest": 5
            }

            chai.request(app)
                .post("/api/loan")
                .set("x-access-token", adminToken)
                .send(loan)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error")
                    res.body.error.should.have.property("errors")
                    res.body.error.errors.should.have.property("customerID")
                    res.body.error.errors.customerID.should.have.property("properties")
                    res.body.error.errors.customerID.properties.should.have.property("type").eql("required")
                    done()
                })
        })

        it("it should create a loan for the admin account type", (done) => {
            const loan = {
                "loanType": "Fix Deposit",
                "date": "04-03-1998",
                "loanAmount": 250000,
                "duration": 12,
                "interest": 5,
                "customerID": 1
            }

            chai.request(app)
                .post("/api/loan")
                .set("x-access-token", adminToken)
                .send(loan)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("status").eql("successfully saved")
                    res.body.should.have.property("result")
                    // Check for all fields
                    res.body.result.should.have.property("__v")
                    res.body.result.should.have.property("loanID").eql(3)
                    res.body.result.should.have.property("loanType")
                    res.body.result.should.have.property("date")
                    res.body.result.should.have.property("loanAmount")
                    res.body.result.should.have.property("duration")
                    res.body.result.should.have.property("interest")
                    res.body.result.should.have.property("customerID")
                    res.body.result.should.have.property("manager").eql("Not set")
                    res.body.result.should.have.property("status").eql("pending")
                    res.body.result.should.have.property("_id")
                    done()
                })
        })

        it("it should create a loan for the manager account type", (done) => {
            const loan = {
                "loanType": "Fix Deposit",
                "date": "04-03-1998",
                "loanAmount": 250000,
                "duration": 12,
                "interest": 5,
                "customerID": 1
            }

            chai.request(app)
                .post("/api/loan")
                .set("x-access-token", managerToken)
                .send(loan)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("status").eql("successfully saved")
                    res.body.should.have.property("result")
                    // Check for all fields
                    res.body.result.should.have.property("__v")
                    res.body.result.should.have.property("loanID").eql(4)
                    res.body.result.should.have.property("loanType")
                    res.body.result.should.have.property("date")
                    res.body.result.should.have.property("loanAmount")
                    res.body.result.should.have.property("duration")
                    res.body.result.should.have.property("interest")
                    res.body.result.should.have.property("customerID")
                    res.body.result.should.have.property("manager").eql("Not set")
                    res.body.result.should.have.property("status").eql("pending")
                    res.body.result.should.have.property("_id")
                    done()
                })
        })

        it("it should create a loan for the receptionist account type", (done) => {
            const loan = {
                "loanType": "Fix Deposit",
                "date": "04-03-1998",
                "loanAmount": 250000,
                "duration": 12,
                "interest": 5,
                "customerID": 1
            }

            chai.request(app)
                .post("/api/loan")
                .set("x-access-token", receptionistToken)
                .send(loan)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("status").eql("successfully saved")
                    res.body.should.have.property("result")
                    // Check for all fields
                    res.body.result.should.have.property("__v")
                    res.body.result.should.have.property("loanID").eql(5)
                    res.body.result.should.have.property("loanType")
                    res.body.result.should.have.property("date")
                    res.body.result.should.have.property("loanAmount")
                    res.body.result.should.have.property("duration")
                    res.body.result.should.have.property("interest")
                    res.body.result.should.have.property("customerID")
                    res.body.result.should.have.property("manager").eql("Not set")
                    res.body.result.should.have.property("status").eql("pending")
                    res.body.result.should.have.property("_id")
                    done()
                })
        })

        it("it should not create a loan for the cash collector account type", (done) => {
            const loan = {
                "loanType": "Fix Deposit",
                "date": "04-03-1998",
                "loanAmount": 250000,
                "duration": 12,
                "interest": 5,
                "customerID": 1
            }

            chai.request(app)
                .post("/api/loan")
                .set("x-access-token", receptionistToken)
                .send(loan)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("status").eql("successfully saved")
                    res.body.should.have.property("result")
                    done()
                })
        })
    })

    //Test the GET /api/loan/:loanID route
    describe("GET /api/loan/:loanID", () => {
        it("it should not get the loan without an authorization token", (done) => {
            chai.request(app)
                .get("/api/loan/3")
                .end((err, res) => {
                    res.should.have.status(401)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    res.body.should.have.property("success").eql(false)
                    res.body.should.have.property("message").eql("Unauthorised")
                    done()
                })
        })

        it("it should get the loan for the admin account type", (done) => {
            chai.request(app)
                .get("/api/loan/3")
                .set("x-access-token", adminToken)
                .end((err, res) => {
                    res.should.have.status(200)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    res.body.should.have.property("__v")
                    res.body.should.have.property("loanID").eql(3)
                    res.body.should.have.property("loanType").eql("Fix Deposit")
                    res.body.should.have.property("date")
                    res.body.should.have.property("loanAmount").eql(250000)
                    res.body.should.have.property("duration").eql(12)
                    res.body.should.have.property("interest").eql(5)
                    res.body.should.have.property("customerID").eql(1)
                    res.body.should.have.property("manager").eql("Not set")
                    res.body.should.have.property("status").eql("pending")
                    res.body.should.have.property("_id")
                    done()
                })
        })

        it("it should get the loan for the manager account type", (done) => {
            chai.request(app)
                .get("/api/loan/3")
                .set("x-access-token", managerToken)
                .end((err, res) => {
                    res.should.have.status(200)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    res.body.should.have.property("__v")
                    res.body.should.have.property("loanID").eql(3)
                    res.body.should.have.property("loanType").eql("Fix Deposit")
                    res.body.should.have.property("date")
                    res.body.should.have.property("loanAmount").eql(250000)
                    res.body.should.have.property("duration").eql(12)
                    res.body.should.have.property("interest").eql(5)
                    res.body.should.have.property("customerID").eql(1)
                    res.body.should.have.property("manager").eql("Not set")
                    res.body.should.have.property("status").eql("pending")
                    res.body.should.have.property("_id")
                    done()
                })
        })

        it("it should get the loan for the receptionist account type", (done) => {
            chai.request(app)
                .get("/api/loan/3")
                .set("x-access-token", receptionistToken)
                .end((err, res) => {
                    res.should.have.status(200)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    res.body.should.have.property("__v")
                    res.body.should.have.property("loanID").eql(3)
                    res.body.should.have.property("loanType").eql("Fix Deposit")
                    res.body.should.have.property("date")
                    res.body.should.have.property("loanAmount").eql(250000)
                    res.body.should.have.property("duration").eql(12)
                    res.body.should.have.property("interest").eql(5)
                    res.body.should.have.property("customerID").eql(1)
                    res.body.should.have.property("manager").eql("Not set")
                    res.body.should.have.property("status").eql("pending")
                    res.body.should.have.property("_id")
                    done()
                })
        })

        it("it should get the loan for the cash collector account type", (done) => {
            chai.request(app)
                .get("/api/loan/3")
                .set("x-access-token", cashCollectorToken)
                .end((err, res) => {
                    res.should.have.status(200)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    res.body.should.have.property("__v")
                    res.body.should.have.property("loanID").eql(3)
                    res.body.should.have.property("loanType").eql("Fix Deposit")
                    res.body.should.have.property("date")
                    res.body.should.have.property("loanAmount").eql(250000)
                    res.body.should.have.property("duration").eql(12)
                    res.body.should.have.property("interest").eql(5)
                    res.body.should.have.property("customerID").eql(1)
                    res.body.should.have.property("manager").eql("Not set")
                    res.body.should.have.property("status").eql("pending")
                    res.body.should.have.property("_id")
                    done()
                })
        })
    })

    // Test the PUT /api/loan/:loanID route
    describe("PUT /api/loan/:loanID", () => {
        it("it should not update the loan without an authorization token", (done) => {
            const loan = {
                "loanType": "Fix Deposit",
                "date": "1998-04-02T18:30:00.000Z",
                "loanAmount": 250000,
                "duration": 12,
                "interest": 5,
                "customerID": 1,
                "status": "Approved",
                "manager": "Dineth"
            }

            chai.request(app)
                .put("/api/loan/3")
                .send(loan)
                .end((err, res) => {
                    res.should.have.status(401)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    res.body.should.have.property("success").eql(false)
                    res.body.should.have.property("message").eql("Unauthorised")
                    done()
                })
        })

        it("it should not update the loan if the wrong loanID is given", (done) => {
            const loan = {
                "loanType": "Fix Deposit",
                "date": "1998-04-02T18:30:00.000Z",
                "loanAmount": 250000,
                "duration": 12,
                "interest": 5,
                "customerID": 1,
                "status": "Approved",
                "manager": "Dineth"
            }

            chai.request(app)
                .put("/api/loan/10")
                .set("x-access-token", adminToken)
                .send(loan)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error").eql("Record does not exist")
                    done()
                })
        })

        it("it should not update the loan without the loan type", (done) => {
            const loan = {
                "date": "1998-04-02T18:30:00.000Z",
                "loanAmount": 250000,
                "duration": 12,
                "interest": 5,
                "customerID": 1,
                "status": "Approved",
                "manager": "Dineth"
            }

            chai.request(app)
                .put("/api/loan/3")
                .set("x-access-token", adminToken)
                .send(loan)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error")
                    res.body.error.should.have.property("errors")
                    res.body.error.errors.should.have.property("loanType")
                    res.body.error.errors.loanType.should.have.property("properties")
                    res.body.error.errors.loanType.properties.should.have.property("type").eql("required")
                    done()
                })
        })

        it("it should not update the loan without the date", (done) => {
            const loan = {
                "loanType": "Fix Deposit",
                "loanAmount": 250000,
                "duration": 12,
                "interest": 5,
                "customerID": 1,
                "status": "Approved",
                "manager": "Dineth"
            }

            chai.request(app)
                .put("/api/loan/3")
                .set("x-access-token", adminToken)
                .send(loan)
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

        it("it should not update the loan without the loan amount", (done) => {
            const loan = {
                "loanType": "Fix Deposit",
                "date": "1998-04-02T18:30:00.000Z",
                "duration": 12,
                "interest": 5,
                "customerID": 1,
                "status": "Approved",
                "manager": "Dineth"
            }

            chai.request(app)
                .put("/api/loan/3")
                .set("x-access-token", adminToken)
                .send(loan)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error")
                    res.body.error.should.have.property("errors")
                    res.body.error.errors.should.have.property("loanAmount")
                    res.body.error.errors.loanAmount.should.have.property("properties")
                    res.body.error.errors.loanAmount.properties.should.have.property("type").eql("required")
                    done()
                })
        })

        it("it should not update the loan without the duration", (done) => {
            const loan = {
                "loanType": "Fix Deposit",
                "date": "1998-04-02T18:30:00.000Z",
                "loanAmount": 250000,
                "interest": 5,
                "customerID": 1,
                "status": "Approved",
                "manager": "Dineth"
            }

            chai.request(app)
                .put("/api/loan/3")
                .set("x-access-token", adminToken)
                .send(loan)
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

        it("it should not update the loan without the interest", (done) => {
            const loan = {
                "loanType": "Fix Deposit",
                "date": "1998-04-02T18:30:00.000Z",
                "loanAmount": 250000,
                "duration": 12,
                "customerID": 1,
                "status": "Approved",
                "manager": "Dineth"
            }

            chai.request(app)
                .put("/api/loan/3")
                .set("x-access-token", adminToken)
                .send(loan)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error")
                    res.body.error.should.have.property("errors")
                    res.body.error.errors.should.have.property("interest")
                    res.body.error.errors.interest.should.have.property("properties")
                    res.body.error.errors.interest.properties.should.have.property("type").eql("required")
                    done()
                })
        })

        it("it should not update the loan without the customerID", (done) => {
            const loan = {
                "loanType": "Fix Deposit",
                "date": "1998-04-02T18:30:00.000Z",
                "loanAmount": 250000,
                "duration": 12,
                "interest": 5,
                "status": "Approved",
                "manager": "Dineth"
            }

            chai.request(app)
                .put("/api/loan/3")
                .set("x-access-token", adminToken)
                .send(loan)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error")
                    res.body.error.should.have.property("errors")
                    res.body.error.errors.should.have.property("customerID")
                    res.body.error.errors.customerID.should.have.property("properties")
                    res.body.error.errors.customerID.properties.should.have.property("type").eql("required")
                    done()
                })
        })

        it("it should not update the loan without the status", (done) => {
            const loan = {
                "loanType": "Fix Deposit",
                "date": "1998-04-02T18:30:00.000Z",
                "loanAmount": 250000,
                "duration": 12,
                "interest": 5,
                "customerID": 1,
                "manager": "Dineth"
            }

            chai.request(app)
                .put("/api/loan/3")
                .set("x-access-token", adminToken)
                .send(loan)
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

        it("it should not update the loan without the manager", (done) => {
            const loan = {
                "loanType": "Fix Deposit",
                "date": "1998-04-02T18:30:00.000Z",
                "loanAmount": 250000,
                "duration": 12,
                "interest": 5,
                "customerID": 1,
                "status": "Approved"
            }

            chai.request(app)
                .put("/api/loan/3")
                .set("x-access-token", adminToken)
                .send(loan)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error")
                    res.body.error.should.have.property("errors")
                    res.body.error.errors.should.have.property("manager")
                    res.body.error.errors.manager.should.have.property("properties")
                    res.body.error.errors.manager.properties.should.have.property("type").eql("required")
                    done()
                })
        })

        it("it should not update the loan with an invalid status", (done) => {
            const loan = {
                "loanType": "Fix Deposit",
                "date": "04-03-1998",
                "loanAmount": 250000,
                "duration": 12,
                "interest": 5,
                "customerID": 1,
                "status": "ongoing",
                "manager": "john"
            }

            chai.request(app)
                .put("/api/loan/3")
                .set("x-access-token", adminToken)
                .send(loan)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error")
                    res.body.error.should.have.property("errors")
                    res.body.error.errors.should.have.property("status")
                    res.body.error.errors.status.should.have.property("message")
                        .eql("`ongoing` is not a valid enum value for path `status`.")
                    done()
                })
        })

        it("it should update the loan for admin account type", (done) => {
            const loan = {
                "loanType": "Fix Deposit",
                "date": "04-03-1998",
                "loanAmount": 250000,
                "duration": 12,
                "interest": 5,
                "customerID": 1,
                "status": "approved",
                "manager": "john"
            }

            chai.request(app)
                .put("/api/loan/3")
                .set("x-access-token", adminToken)
                .send(loan)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("status").eql("successfully updated")
                    res.body.should.have.property("result")
                    // Check for all fields
                    res.body.result.should.have.property("__v")
                    res.body.result.should.have.property("loanID").eql(3)
                    res.body.result.should.have.property("loanType")
                    res.body.result.should.have.property("date")
                    res.body.result.should.have.property("loanAmount")
                    res.body.result.should.have.property("duration")
                    res.body.result.should.have.property("interest")
                    res.body.result.should.have.property("customerID")
                    res.body.result.should.have.property("manager").eql("john")
                    res.body.result.should.have.property("status").eql("approved")
                    res.body.result.should.have.property("_id")
                    done()
                })
        })

        it("it should update the loan for manager account type", (done) => {
            const loan = {
                "loanType": "Fix Deposit",
                "date": "04-03-1998",
                "loanAmount": 250000,
                "duration": 12,
                "interest": 5,
                "customerID": 1,
                "status": "approved",
                "manager": "john"
            }

            chai.request(app)
                .put("/api/loan/3")
                .set("x-access-token", managerToken)
                .send(loan)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("status").eql("successfully updated")
                    res.body.should.have.property("result")
                    // Check for all fields
                    res.body.result.should.have.property("__v")
                    res.body.result.should.have.property("loanID").eql(3)
                    res.body.result.should.have.property("loanType")
                    res.body.result.should.have.property("date")
                    res.body.result.should.have.property("loanAmount")
                    res.body.result.should.have.property("duration")
                    res.body.result.should.have.property("interest")
                    res.body.result.should.have.property("customerID")
                    res.body.result.should.have.property("manager").eql("john")
                    res.body.result.should.have.property("status").eql("approved")
                    res.body.result.should.have.property("_id")
                    done()
                })
        })

        it("it should not update the loan for receptionist account type", (done) => {
            const loan = {
                "loanType": "Fix Deposit",
                "date": "04-03-1998",
                "loanAmount": 250000,
                "duration": 12,
                "interest": 5,
                "customerID": 1,
                "status": "approved",
                "manager": "john"
            }

            chai.request(app)
                .put("/api/loan/3")
                .set("x-access-token", receptionistToken)
                .send(loan)
                .end((err, res) => {
                    res.should.have.status(401)
                    res.body.should.be.a("object")
                    res.body.should.have.property("success").eql(false)
                    res.body.should.have.property("message").eql("Unauthorised")
                    done()
                })
        })

        it("it should not update the loan for cash collector account type", (done) => {
            const loan = {
                "loanType": "Fix Deposit",
                "date": "04-03-1998",
                "loanAmount": 250000,
                "duration": 12,
                "interest": 5,
                "customerID": 1,
                "status": "approved",
                "manager": "john"
            }

            chai.request(app)
                .put("/api/loan/3")
                .set("x-access-token", cashCollectorToken)
                .send(loan)
                .end((err, res) => {
                    res.should.have.status(401)
                    res.body.should.be.a("object")
                    res.body.should.have.property("success").eql(false)
                    res.body.should.have.property("message").eql("Unauthorised")
                    done()
                })
        })

        it("it should update the loan with loan status closed", (done) => {
            const loan = {
                "loanType": "Fix Deposit",
                "date": "04-03-1998",
                "loanAmount": 250000,
                "duration": 12,
                "interest": 5,
                "customerID": 1,
                "status": "closed",
                "manager": "john"
            }

            chai.request(app)
                .put("/api/loan/3")
                .set("x-access-token", adminToken)
                .send(loan)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("status").eql("successfully updated")
                    res.body.should.have.property("result")
                    // Check for all fields
                    res.body.result.should.have.property("__v")
                    res.body.result.should.have.property("loanID").eql(3)
                    res.body.result.should.have.property("loanType")
                    res.body.result.should.have.property("date")
                    res.body.result.should.have.property("loanAmount")
                    res.body.result.should.have.property("duration")
                    res.body.result.should.have.property("interest")
                    res.body.result.should.have.property("customerID")
                    res.body.result.should.have.property("manager").eql("john")
                    res.body.result.should.have.property("status").eql("closed")
                    res.body.result.should.have.property("_id")
                    done()
                })
        })

        it("it should update the loan with loan status reopened", (done) => {
            const loan = {
                "loanType": "Fix Deposit",
                "date": "04-03-1998",
                "loanAmount": 250000,
                "duration": 12,
                "interest": 5,
                "customerID": 1,
                "status": "reopened",
                "manager": "john"
            }

            chai.request(app)
                .put("/api/loan/3")
                .set("x-access-token", adminToken)
                .send(loan)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("status").eql("successfully updated")
                    res.body.should.have.property("result")
                    // Check for all fields
                    res.body.result.should.have.property("__v")
                    res.body.result.should.have.property("loanID").eql(3)
                    res.body.result.should.have.property("loanType")
                    res.body.result.should.have.property("date")
                    res.body.result.should.have.property("loanAmount")
                    res.body.result.should.have.property("duration")
                    res.body.result.should.have.property("interest")
                    res.body.result.should.have.property("customerID")
                    res.body.result.should.have.property("manager").eql("john")
                    res.body.result.should.have.property("status").eql("reopened")
                    res.body.result.should.have.property("_id")
                    done()
                })
        })
    })

    // Test the PATCH /api/loan/:loanID/approve route
    describe("PATCH /api/loan/:loanID/approve", () => {
        it("it should not approve the loan without an authorization token", (done) => {
            chai.request(app)
                .patch("/api/loan/3/approve")
                .send({ "manager": "john" })
                .end((err, res) => {
                    res.should.have.status(401)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    res.body.should.have.property("success").eql(false)
                    res.body.should.have.property("message").eql("Unauthorised")
                    done()
                })
        })

        it("it should not approve the loan with the wrong loanID", (done) => {
            chai.request(app)
                .patch("/api/loan/10/approve")
                .set("x-access-token", adminToken)
                .send({ "manager": "john" })
                .end((err, res) => {
                    res.should.have.status(200)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error").eql("Record does not exist")
                    done()
                })
        })

        it("it should not approve the loan without the manager", (done) => {
            chai.request(app)
                .patch("/api/loan/3/approve")
                .set("x-access-token", adminToken)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error")
                    res.body.error.should.have.property("errors")
                    res.body.error.errors.should.have.property("manager")
                    res.body.error.errors.manager.should.have.property("properties")
                    res.body.error.errors.manager.properties.should.have.property("type").eql("required")
                    done()
                })
        })

        it("it should approve the loan for the admin account type", (done) => {
            chai.request(app)
                .patch("/api/loan/3/approve")
                .set("x-access-token", adminToken)
                .send({ "manager": "john" })
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    // Check for all fields
                    res.body.should.have.property("loanID").eql(3)
                    res.body.should.have.property("manager").eql("john")
                    res.body.should.have.property("status").eql("approved")
                    done()
                })
        })

        it("it should approve the loan for the manager account type", (done) => {
            chai.request(app)
                .patch("/api/loan/3/approve")
                .set("x-access-token", managerToken)
                .send({ "manager": "john" })
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    // Check for all fields
                    res.body.should.have.property("loanID").eql(3)
                    res.body.should.have.property("manager").eql("john")
                    res.body.should.have.property("status").eql("approved")
                    done()
                })
        })

        it("it should not approve the loan for the receptionist account type", (done) => {
            chai.request(app)
                .patch("/api/loan/3/approve")
                .set("x-access-token", receptionistToken)
                .send({ "manager": "john" })
                .end((err, res) => {
                    res.should.have.status(401)
                    res.body.should.be.a("object")
                    // Check for all fields
                    res.body.should.have.property("success").eql(false)
                    res.body.should.have.property("message").eql("Unauthorised")
                    done()
                })
        })

        it("it should not approve the loan for the cash collector account type", (done) => {
            chai.request(app)
                .patch("/api/loan/3/approve")
                .set("x-access-token", cashCollectorToken)
                .send({ "manager": "john" })
                .end((err, res) => {
                    res.should.have.status(401)
                    res.body.should.be.a("object")
                    // Check for all fields
                    res.body.should.have.property("success").eql(false)
                    res.body.should.have.property("message").eql("Unauthorised")
                    done()
                })
        })
    })

    // Test the PATCH /api/loan/:loanID/reject route
    describe("PATCH /api/loan/:loanID/reject", () => {
        it("it should not reject the loan without an authorization token", (done) => {
            chai.request(app)
                .patch("/api/loan/3/reject")
                .send({ "manager": "john" })
                .end((err, res) => {
                    res.should.have.status(401)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    res.body.should.have.property("success").eql(false)
                    res.body.should.have.property("message").eql("Unauthorised")
                    done()
                })
        })

        it("it should not reject the loan with the wrong loanID", (done) => {
            chai.request(app)
                .patch("/api/loan/10/reject")
                .set("x-access-token", adminToken)
                .send({ "manager": "john" })
                .end((err, res) => {
                    res.should.have.status(200)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error").eql("Record does not exist")
                    done()
                })
        })

        it("it should not reject the loan without the manager", (done) => {
            chai.request(app)
                .patch("/api/loan/3/reject")
                .set("x-access-token", adminToken)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error")
                    res.body.error.should.have.property("errors")
                    res.body.error.errors.should.have.property("manager")
                    res.body.error.errors.manager.should.have.property("properties")
                    res.body.error.errors.manager.properties.should.have.property("type").eql("required")
                    done()
                })
        })

        it("it should reject the loan for the admin account type", (done) => {
            chai.request(app)
                .patch("/api/loan/3/reject")
                .set("x-access-token", adminToken)
                .send({ "manager": "john" })
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    // Check for all fields
                    res.body.should.have.property("loanID").eql(3)
                    res.body.should.have.property("manager").eql("john")
                    res.body.should.have.property("status").eql("rejected")
                    done()
                })
        })

        it("it should reject the loan for the manager account type", (done) => {
            chai.request(app)
                .patch("/api/loan/3/reject")
                .set("x-access-token", managerToken)
                .send({ "manager": "john" })
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    // Check for all fields
                    res.body.should.have.property("loanID").eql(3)
                    res.body.should.have.property("manager").eql("john")
                    res.body.should.have.property("status").eql("rejected")
                    done()
                })
        })

        it("it should not reject the loan for the receptionist account type", (done) => {
            chai.request(app)
                .patch("/api/loan/3/reject")
                .set("x-access-token", receptionistToken)
                .send({ "manager": "john" })
                .end((err, res) => {
                    res.should.have.status(401)
                    res.body.should.be.a("object")
                    // Check for all fields
                    res.body.should.have.property("success").eql(false)
                    res.body.should.have.property("message").eql("Unauthorised")
                    done()
                })
        })

        it("it should not reject the loan for the cash collector account type", (done) => {
            chai.request(app)
                .patch("/api/loan/3/reject")
                .set("x-access-token", cashCollectorToken)
                .send({ "manager": "john" })
                .end((err, res) => {
                    res.should.have.status(401)
                    res.body.should.be.a("object")
                    // Check for all fields
                    res.body.should.have.property("success").eql(false)
                    res.body.should.have.property("message").eql("Unauthorised")
                    done()
                })
        })
    })
})