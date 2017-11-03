"use strict"

/* 
    Get an instance of the server
*/
const app = require("../src/app").app

/*
    Get all dependencies
*/
const Area = require("../src/models/areaSchema")
const chai = require("chai")
const chaiHttp = require("chai-http")
const Counter = require("../src/models/counterSchema")
const Customer = require("../src/models/customerSchema")
const Employee = require("../src/models/employeeSchema")
const Loan = require("../src/models/loanSchema")
const Product = require("../src/models/productSchema")
const should = chai.should()


/* 
    Used for hashing password and pin
*/
const bcrypt = require("bcrypt")
const saltRounds = 10

chai.use(chaiHttp)

describe("Loans", () => {
    /* 
        Store authentication adminTokens
    */
    let adminToken = null
    let managerToken = null
    let receptionistToken = null
    let cashCollectorToken = null

    /*
        Store the objects
    */
    let adminObject = null
    let areaObject = null
    let customerObject = null
    let managerObject = null
    let productObject = null

    /*
        Set database before running test cases
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

        const area = {
            "name": "Kaduwela",
            "postalCode": 10640,
            "district": "Colombo"
        }

        let customer = {
            "name": "Bob",
            "surname": "Jay",
            "nic": "958642350V",
            "address": "elsewhere",
            "dob": "1995-12-29",
            "phone": "0767986623",
            "email": "bobjay@gmail.com",
            "areaID": "037"
        }

        const loan1 = {
            "product": "Fix Deposit",
            "date": "01-01-2000",
            "loanAmount": 5000,
            "duration": 6,
            "interest": 2,
        }

        const loan2 = {
            "product": "Student Loan",
            "date": "06-04-2010",
            "loanAmount": 10000,
            "duration": 24,
            "interest": 15,
            "manager": "John",
            "status": "approved"
        }

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

        Area.remove({})
            .then(() => Counter.remove({}))
            .then(() => Customer.remove({}))
            .then(() => Employee.remove({}))
            .then(() => Loan.remove({}))
            .then(() => Product.remove({}))
            .then(() => Promise.all([
                /*
                    Hash all the passwords and pins
                */
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
                /*
                    Save the hashed passwords and pins to
                    their respective objects
                */
                admin.password = hashResult[0]
                admin.pin = hashResult[1]
                manager.password = hashResult[2]
                manager.pin = hashResult[3]
                receptionist.password = hashResult[4]
                receptionist.pin = hashResult[5]
                cashCollector.password = hashResult[6]
                cashCollector.pin = hashResult[7]
            })
            /*
                Save area to database
            */
            .then(() => Area.create(area))
            .then((result) => {
                /*
                    Save the result and assign its _id
                    to the neccessary objects
                */
                areaObject = result
                customer.area = areaObject._id
                const meta = {
                    "area": areaObject._id
                }
                cashCollector.meta = meta
            })
            .then(() => Promise.all([
                /*
                    Save all four employees andcustomer to the
                    database
                */
                Employee.create(admin),
                Employee.create(manager),
                Employee.create(receptionist),
                Employee.create(cashCollector),
                Customer.create(customer)
            ]))
            .then((result) => {
                /*
                    Save customer return object 
                    and assign the _id to loan1 and loan2
                */
                adminObject = result[0]
                managerObject = result[1]
                customerObject = result[4]
                loan1.customer = customerObject._id
                loan1.manager = managerObject._id
                loan2.customer = customerObject._id
                loan2.manager = managerObject._id
                product.approvedBy = adminObject._id
            })
            /*
                Save the product to the database
            */
            .then(() => Product.create(product))
            .then((result) => {
                /*
                    Assign the _id of result to the product fields of loan
                */
                productObject = result
                loan1.product = productObject._id
                loan2.product = productObject._id
            })
            .then(() => Promise.all([
                /*
                    Save loan1 and loan2 to the database
                */
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
    })

    // Test the POST /api/loan route
    describe("POST /api/loan", () => {
        it("it should not create a loan without an authorization token", (done) => {
            const loan = {
                "product": productObject._id,
                "date": "04-03-1998",
                "loanAmount": 250000,
                "duration": 12,
                "interest": 5,
                "customer": customerObject._id
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


        it("it should not create a loan without the product field", (done) => {
            const loan = {
                "date": "04-03-1998",
                "loanAmount": 250000,
                "duration": 12,
                "interest": 5,
                "customer": customerObject._id
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
                    res.body.error.errors.should.have.property("product")
                    res.body.error.errors.product.should.have.property("properties")
                    res.body.error.errors.product.properties.should.have.property("type").eql("required")
                    done()
                })
        })

        it("it should not create a loan without the date field", (done) => {
            const loan = {
                "product": productObject._id,
                "loanAmount": 250000,
                "duration": 12,
                "interest": 5,
                "customer": customerObject._id
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
                "product": productObject._id,
                "date": "04-03-1998",
                "duration": 12,
                "interest": 5,
                "customer": customerObject._id
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
                "product": productObject._id,
                "date": "04-03-1998",
                "loanAmount": 250000,
                "interest": 5,
                "customer": customerObject._id
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
                "product": productObject._id,
                "date": "04-03-1998",
                "loanAmount": 250000,
                "duration": 12,
                "customer": customerObject._id
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

        it("it should not create a loan without the customer field", (done) => {
            const loan = {
                "product": productObject._id,
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
                    res.body.error.errors.should.have.property("customer")
                    res.body.error.errors.customer.should.have.property("properties")
                    res.body.error.errors.customer.properties.should.have.property("type").eql("required")
                    done()
                })
        })

        it("it should create a loan for the admin account type", (done) => {
            const loan = {
                "product": productObject._id,
                "date": "04-03-1998",
                "loanAmount": 250000,
                "duration": 12,
                "interest": 5,
                "customer": customerObject._id
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
                    res.body.result.should.have.property("product")
                    res.body.result.should.have.property("date")
                    res.body.result.should.have.property("loanAmount")
                    res.body.result.should.have.property("duration")
                    res.body.result.should.have.property("interest")
                    res.body.result.should.have.property("customer")
                    res.body.result.should.have.property("status").eql("pending")
                    res.body.result.should.have.property("_id")
                    done()
                })
        })

        it("it should create a loan for the manager account type", (done) => {
            const loan = {
                "product": productObject._id,
                "date": "04-03-1998",
                "loanAmount": 250000,
                "duration": 12,
                "interest": 5,
                "customer": customerObject._id
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
                    res.body.result.should.have.property("product")
                    res.body.result.should.have.property("date")
                    res.body.result.should.have.property("loanAmount")
                    res.body.result.should.have.property("duration")
                    res.body.result.should.have.property("interest")
                    res.body.result.should.have.property("customer")
                    res.body.result.should.have.property("status").eql("pending")
                    res.body.result.should.have.property("_id")
                    done()
                })
        })

        it("it should create a loan for the receptionist account type", (done) => {
            const loan = {
                "product": productObject._id,
                "date": "04-03-1998",
                "loanAmount": 250000,
                "duration": 12,
                "interest": 5,
                "customer": customerObject._id
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
                    res.body.result.should.have.property("product")
                    res.body.result.should.have.property("date")
                    res.body.result.should.have.property("loanAmount")
                    res.body.result.should.have.property("duration")
                    res.body.result.should.have.property("interest")
                    res.body.result.should.have.property("customer")
                    res.body.result.should.have.property("status").eql("pending")
                    res.body.result.should.have.property("_id")
                    done()
                })
        })

        it("it should not create a loan for the cash collector account type", (done) => {
            const loan = {
                "product": productObject._id,
                "date": "04-03-1998",
                "loanAmount": 250000,
                "duration": 12,
                "interest": 5,
                "customer": customerObject._id
            }

            chai.request(app)
                .post("/api/loan")
                .set("x-access-token", cashCollectorToken)
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
                    res.body.should.have.property("product")
                    res.body.should.have.property("date")
                    res.body.should.have.property("loanAmount").eql(250000)
                    res.body.should.have.property("duration").eql(12)
                    res.body.should.have.property("interest").eql(5)
                    res.body.should.have.property("customer")
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
                    res.body.should.have.property("product")
                    res.body.should.have.property("date")
                    res.body.should.have.property("loanAmount").eql(250000)
                    res.body.should.have.property("duration").eql(12)
                    res.body.should.have.property("interest").eql(5)
                    res.body.should.have.property("customer")
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
                    res.body.should.have.property("product")
                    res.body.should.have.property("date")
                    res.body.should.have.property("loanAmount").eql(250000)
                    res.body.should.have.property("duration").eql(12)
                    res.body.should.have.property("interest").eql(5)
                    res.body.should.have.property("customer")
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
                    res.body.should.have.property("product")
                    res.body.should.have.property("date")
                    res.body.should.have.property("loanAmount").eql(250000)
                    res.body.should.have.property("duration").eql(12)
                    res.body.should.have.property("interest").eql(5)
                    res.body.should.have.property("customer")
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
                "product": productObject._id,
                "date": "1998-04-02T18:30:00.000Z",
                "loanAmount": 250000,
                "duration": 12,
                "interest": 5,
                "customer": customerObject._id,
                "status": "Approved",
                "manager": managerObject._id
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
                "product": productObject._id,
                "date": "1998-04-02T18:30:00.000Z",
                "loanAmount": 250000,
                "duration": 12,
                "interest": 5,
                "customer": customerObject._id,
                "status": "Approved",
                "manager": managerObject._id
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

        it("it should not update the loan without the product", (done) => {
            const loan = {
                "date": "1998-04-02T18:30:00.000Z",
                "loanAmount": 250000,
                "duration": 12,
                "interest": 5,
                "customer": customerObject._id,
                "status": "Approved",
                "manager": managerObject._id
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
                    res.body.error.errors.should.have.property("product")
                    res.body.error.errors.product.should.have.property("properties")
                    res.body.error.errors.product.properties.should.have.property("type").eql("required")
                    done()
                })
        })

        it("it should not update the loan without the date", (done) => {
            const loan = {
                "product": productObject._id,
                "loanAmount": 250000,
                "duration": 12,
                "interest": 5,
                "customer": customerObject._id,
                "status": "Approved",
                "manager": managerObject._id
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
                "product": productObject._id,
                "date": "1998-04-02T18:30:00.000Z",
                "duration": 12,
                "interest": 5,
                "customer": customerObject._id,
                "status": "Approved",
                "manager": managerObject._id
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
                "product": productObject._id,
                "date": "1998-04-02T18:30:00.000Z",
                "loanAmount": 250000,
                "interest": 5,
                "customer": customerObject._id,
                "status": "Approved",
                "manager": managerObject._id
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
                "product": productObject._id,
                "date": "1998-04-02T18:30:00.000Z",
                "loanAmount": 250000,
                "duration": 12,
                "customer": customerObject._id,
                "status": "Approved",
                "manager": managerObject._id
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

        it("it should not update the loan without the customer", (done) => {
            const loan = {
                "product": productObject._id,
                "date": "1998-04-02T18:30:00.000Z",
                "loanAmount": 250000,
                "duration": 12,
                "interest": 5,
                "status": "Approved",
                "manager": managerObject._id
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
                    res.body.error.errors.should.have.property("customer")
                    res.body.error.errors.customer.should.have.property("properties")
                    res.body.error.errors.customer.properties.should.have.property("type").eql("required")
                    done()
                })
        })

        it("it should not update the loan without the status", (done) => {
            const loan = {
                "product": productObject._id,
                "date": "1998-04-02T18:30:00.000Z",
                "loanAmount": 250000,
                "duration": 12,
                "interest": 5,
                "customer": customerObject._id,
                "manager": managerObject._id
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

        it("it should not update the loan with an invalid status", (done) => {
            const loan = {
                "product": productObject._id,
                "date": "04-03-1998",
                "loanAmount": 250000,
                "duration": 12,
                "interest": 5,
                "customer": customerObject._id,
                "status": "ongoing",
                "manager": managerObject._id
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
                "product": productObject._id,
                "date": "04-03-1998",
                "loanAmount": 250000,
                "duration": 12,
                "interest": 5,
                "customer": customerObject._id,
                "status": "approved",
                "manager": managerObject._id
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
                    res.body.result.should.have.property("product")
                    res.body.result.should.have.property("date")
                    res.body.result.should.have.property("loanAmount")
                    res.body.result.should.have.property("duration")
                    res.body.result.should.have.property("interest")
                    res.body.result.should.have.property("customer")
                    res.body.result.should.have.property("manager")
                    res.body.result.should.have.property("status").eql("approved")
                    res.body.result.should.have.property("_id")
                    done()
                })
        })

        it("it should update the loan for manager account type", (done) => {
            const loan = {
                "product": productObject._id,
                "date": "04-03-1998",
                "loanAmount": 250000,
                "duration": 12,
                "interest": 5,
                "customer": customerObject._id,
                "status": "approved",
                "manager": managerObject._id
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
                    res.body.result.should.have.property("product")
                    res.body.result.should.have.property("date")
                    res.body.result.should.have.property("loanAmount")
                    res.body.result.should.have.property("duration")
                    res.body.result.should.have.property("interest")
                    res.body.result.should.have.property("customer")
                    res.body.result.should.have.property("manager")
                    res.body.result.should.have.property("status").eql("approved")
                    res.body.result.should.have.property("_id")
                    done()
                })
        })

        it("it should not update the loan for receptionist account type", (done) => {
            const loan = {
                "product": productObject._id,
                "date": "04-03-1998",
                "loanAmount": 250000,
                "duration": 12,
                "interest": 5,
                "customer": customerObject._id,
                "status": "approved",
                "manager": managerObject._id
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
                "product": productObject._id,
                "date": "04-03-1998",
                "loanAmount": 250000,
                "duration": 12,
                "interest": 5,
                "customer": customerObject._id,
                "status": "approved",
                "manager": managerObject._id
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
                "product": productObject._id,
                "date": "04-03-1998",
                "loanAmount": 250000,
                "duration": 12,
                "interest": 5,
                "customer": customerObject._id,
                "status": "closed",
                "manager": managerObject._id
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
                    res.body.result.should.have.property("product")
                    res.body.result.should.have.property("date")
                    res.body.result.should.have.property("loanAmount")
                    res.body.result.should.have.property("duration")
                    res.body.result.should.have.property("interest")
                    res.body.result.should.have.property("customer")
                    res.body.result.should.have.property("manager")
                    res.body.result.should.have.property("status").eql("closed")
                    res.body.result.should.have.property("_id")
                    done()
                })
        })

        it("it should update the loan with loan status opened", (done) => {
            const loan = {
                "product": productObject._id,
                "date": "04-03-1998",
                "loanAmount": 250000,
                "duration": 12,
                "interest": 5,
                "customer": customerObject._id,
                "status": "opened",
                "manager": managerObject._id
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
                    res.body.result.should.have.property("product")
                    res.body.result.should.have.property("date")
                    res.body.result.should.have.property("loanAmount")
                    res.body.result.should.have.property("duration")
                    res.body.result.should.have.property("interest")
                    res.body.result.should.have.property("customer")
                    res.body.result.should.have.property("manager")
                    res.body.result.should.have.property("status").eql("opened")
                    res.body.result.should.have.property("_id")
                    done()
                })
        })

        it("it should update the loan with loan status completed", (done) => {
            const loan = {
                "product": productObject._id,
                "date": "04-03-1998",
                "loanAmount": 250000,
                "duration": 12,
                "interest": 5,
                "customer": customerObject._id,
                "status": "completed",
                "manager": managerObject._id
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
                    res.body.result.should.have.property("product")
                    res.body.result.should.have.property("date")
                    res.body.result.should.have.property("loanAmount")
                    res.body.result.should.have.property("duration")
                    res.body.result.should.have.property("interest")
                    res.body.result.should.have.property("customer")
                    res.body.result.should.have.property("manager")
                    res.body.result.should.have.property("status").eql("completed")
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
                .end((err, res) => {
                    res.should.have.status(200)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error").eql("Record does not exist")
                    done()
                })
        })

        it("it should approve the loan for the admin account type", (done) => {
            chai.request(app)
                .patch("/api/loan/3/approve")
                .set("x-access-token", adminToken)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    // Check for all fields
                    res.body.should.have.property("loanID").eql(3)
                    res.body.should.have.property("manager")
                    res.body.should.have.property("status").eql("approved")
                    done()
                })
        })

        it("it should approve the loan for the manager account type", (done) => {
            chai.request(app)
                .patch("/api/loan/3/approve")
                .set("x-access-token", managerToken)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    // Check for all fields
                    res.body.should.have.property("loanID").eql(3)
                    res.body.should.have.property("manager")
                    res.body.should.have.property("status").eql("approved")
                    done()
                })
        })

        it("it should not approve the loan for the receptionist account type", (done) => {
            chai.request(app)
                .patch("/api/loan/3/approve")
                .set("x-access-token", receptionistToken)
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
                .end((err, res) => {
                    res.should.have.status(200)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error").eql("Record does not exist")
                    done()
                })
        })

        it("it should reject the loan for the admin account type", (done) => {
            chai.request(app)
                .patch("/api/loan/3/reject")
                .set("x-access-token", adminToken)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    // Check for all fields
                    res.body.should.have.property("loanID").eql(3)
                    res.body.should.have.property("manager")
                    res.body.should.have.property("status").eql("rejected")
                    done()
                })
        })

        it("it should reject the loan for the manager account type", (done) => {
            chai.request(app)
                .patch("/api/loan/3/reject")
                .set("x-access-token", managerToken)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    // Check for all fields
                    res.body.should.have.property("loanID").eql(3)
                    res.body.should.have.property("manager")
                    res.body.should.have.property("status").eql("rejected")
                    done()
                })
        })

        it("it should not reject the loan for the receptionist account type", (done) => {
            chai.request(app)
                .patch("/api/loan/3/reject")
                .set("x-access-token", receptionistToken)
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
                .end((err, res) => {
                    res.should.have.status(401)
                    res.body.should.be.a("object")
                    // Check for all fields
                    res.body.should.have.property("success")
                    res.body.should.have.property("message").eql("Unauthorised")
                    done()
                })
        })
    })
})