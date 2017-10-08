"use strict"

const app = require("../src/app").app

const chai = require("chai")
const chaiHttp = require("chai-http")
const Employee = require("../src/models/employeeSchema")
const Counter = require("../src/models/counterSchema")
const should = chai.should()

// Used for hashing password and pin
const bcrypt = require("bcrypt")
const saltRounds = 10

chai.use(chaiHttp)

describe("Employees", () => {
    // Store authentication tokens
    let adminToken = null
    let managerToken = null
    let receptionistToken = null
    let cashCollectorToken = null

    // Store new authentication tokens
    let newAdminToken = null
    let newManagerToken = null
    let newReceptionistToken = null
    let newCashCollectorToken = null

    /* Remove all employees and counters 
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

        Employee.remove({})
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
            ]))
            .then(() => {
                done()
            })
    })

    // Test the POST /user/authenticate route
    describe("POST /user/authenticate", (done) => {
        it("it should not get an authorization token with the wrong username", (done) => {
            const user = {
                "username": "john1",
                "password": "sliitccp"
            }

            chai.request(app)
                .post("/user/authenticate")
                .send(user)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(401)
                    res.body.should.be.a("object")
                    res.body.should.have.property("success").eql(false)
                    res.body.should.have.property("message").eql("Authentication failed. User not found.")
                    done()
                })
        })

        it("it should not get an authorization token with the wrong password", (done) => {
            const user = {
                "username": "john",
                "password": "sliitccp1"
            }

            chai.request(app)
                .post("/user/authenticate")
                .send(user)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(401)
                    res.body.should.be.a("object")
                    res.body.should.have.property("success").eql(false)
                    res.body.should.have.property("message").eql("Authentication failed. Wrong password.")
                    done()
                })
        })

        it("it should not get an authorization token without the password", (done) => {
            const user = {
                "username": "john",
            }

            chai.request(app)
                .post("/user/authenticate")
                .send(user)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(401)
                    res.body.should.be.a("object")
                    res.body.should.have.property("success").eql(false)
                    res.body.should.have.property("message").eql("Authentication failed. No password given.")
                    done()
                })
        })

        it("it should return an authorization token and the account type for the admin account type", (done) => {
            const user = {
                "username": "john",
                "password": "sliitcpp"
            }

            chai.request(app)
                .post("/user/authenticate")
                .send(user)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("success").eql(true)
                    res.body.should.have.property("accountType")
                    adminToken = res.body.token
                    done()
                })
        })

        it("it should return an authorization token and the account type for the manager account type", (done) => {
            const user = {
                "username": "jane",
                "password": "sliitcpp"
            }

            chai.request(app)
                .post("/user/authenticate")
                .send(user)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("success").eql(true)
                    res.body.should.have.property("accountType")
                    managerToken = res.body.token
                    done()
                })
        })

        it("it should return an authorization token and the account type for the receptionist account type", (done) => {
            const user = {
                "username": "james",
                "password": "sliitcpp"
            }

            chai.request(app)
                .post("/user/authenticate")
                .send(user)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("success").eql(true)
                    res.body.should.have.property("accountType")
                    receptionistToken = res.body.token
                    done()
                })
        })

        it("it should return an authorization token and the account type for the cash collector account type", (done) => {
            const user = {
                "username": "jake",
                "password": "sliitcpp"
            }

            chai.request(app)
                .post("/user/authenticate")
                .send(user)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("success").eql(true)
                    res.body.should.have.property("accountType")
                    cashCollectorToken = res.body.token
                    done()
                })
        })
    })

    // Test the GET /api/employee route
    describe("GET /api/employee", () => {
        it("it should not get all the employees without an authorization token", (done) => {
            chai.request(app)
                .get("/api/employee")
                .end((err, res) => {
                    res.should.have.status(401)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    res.body.should.have.property("success").eql(false)
                    res.body.should.have.property("message").eql("Unauthorised")
                    done()
                })
        })

        it("it should get all the employees for the admin account type", (done) => {
            chai.request(app)
                .get("/api/employee")
                .set("x-access-token", adminToken)
                .end((err, res) => {
                    res.should.have.status(200)
                    should.exist(res.body)
                    res.body.should.be.a("array")
                    res.body.length.should.be.eql(4)
                    done()
                })
        })

        it("it should get all the employees for the manager account type", (done) => {
            chai.request(app)
                .get("/api/employee")
                .set("x-access-token", managerToken)
                .end((err, res) => {
                    res.should.have.status(200)
                    should.exist(res.body)
                    res.body.should.be.a("array")
                    res.body.length.should.be.eql(4)
                    done()
                })
        })

        it("it should get all the employees for the receptionist account type", (done) => {
            chai.request(app)
                .get("/api/employee")
                .set("x-access-token", receptionistToken)
                .end((err, res) => {
                    res.should.have.status(200)
                    should.exist(res.body)
                    res.body.should.be.a("array")
                    res.body.length.should.be.eql(4)
                    done()
                })
        })

        it("it should get all the employees for the cash collector account type", (done) => {
            chai.request(app)
                .get("/api/employee")
                .set("x-access-token", cashCollectorToken)
                .end((err, res) => {
                    res.should.have.status(200)
                    should.exist(res.body)
                    res.body.should.be.a("array")
                    res.body.length.should.be.eql(4)
                    done()
                })
        })
    })

    // Test the POST /api/employee route
    describe("POST /api/employee", () => {
        it("it should not create an employee without an authorization token", (done) => {
            const employee = {
                "name": "Jacob",
                "surname": "Doe",
                "nic": "123456789V",
                "address": "nowhere",
                "dob": "1980-01-01",
                "email": "jacob.doe@gmail.com",
                "username": "jacob",
                "password": "sliitcpp",
                "pin": "1234",
                "accountType": "admin",
                "phone": {
                    "work": "1234567890",
                    "personal": "0987654321"
                }
            }

            chai.request(app)
                .post("/api/employee")
                .send(employee)
                .end((err, res) => {
                    res.should.have.status(401)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    res.body.should.have.property("success").eql(false)
                    res.body.should.have.property("message").eql("Unauthorised")
                    done()
                })
        })

        it("it should not create an employee without the name field", (done) => {
            const employee = {
                "surname": "Doe",
                "nic": "123456789V",
                "address": "nowhere",
                "dob": "1980-01-01",
                "email": "jacob.doe@gmail.com",
                "username": "jacob",
                "password": "sliitcpp",
                "pin": "1234",
                "accountType": "admin",
                "phone": {
                    "work": "1234567890",
                    "personal": "0987654321"
                }
            }

            chai.request(app)
                .post("/api/employee")
                .set("x-access-token", adminToken)
                .send(employee)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error")
                    res.body.error.should.have.property("errors")
                    res.body.error.errors.should.have.property("name")
                    res.body.error.errors.name.should.have.property("properties")
                    res.body.error.errors.name.properties.should.have.property("type").eql("required")
                    done()
                })
        })

        it("it should not create an employee without the surname field", (done) => {
            const employee = {
                "name": "Jacob",
                "nic": "123456789V",
                "address": "nowhere",
                "dob": "1980-01-01",
                "email": "jacob.doe@gmail.com",
                "username": "jacob",
                "password": "sliitcpp",
                "pin": "1234",
                "accountType": "admin",
                "phone": {
                    "work": "1234567890",
                    "personal": "0987654321"
                }
            }

            chai.request(app)
                .post("/api/employee")
                .set("x-access-token", adminToken)
                .send(employee)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error")
                    res.body.error.should.have.property("errors")
                    res.body.error.errors.should.have.property("surname")
                    res.body.error.errors.surname.should.have.property("properties")
                    res.body.error.errors.surname.properties.should.have.property("type").eql("required")
                    done()
                })
        })

        it("it should not create an employee without the nic field", (done) => {
            const employee = {
                "name": "Jacob",
                "surname": "Doe",
                "address": "nowhere",
                "dob": "1980-01-01",
                "email": "jacob.doe@gmail.com",
                "username": "jacob",
                "password": "sliitcpp",
                "pin": "1234",
                "accountType": "admin",
                "phone": {
                    "work": "1234567890",
                    "personal": "0987654321"
                }
            }

            chai.request(app)
                .post("/api/employee")
                .set("x-access-token", adminToken)
                .send(employee)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error")
                    res.body.error.should.have.property("errors")
                    res.body.error.errors.should.have.property("nic")
                    res.body.error.errors.nic.should.have.property("properties")
                    res.body.error.errors.nic.properties.should.have.property("type").eql("required")
                    done()
                })
        })

        it("it should not create an employee without the address field", (done) => {
            const employee = {
                "name": "Jacob",
                "surname": "Doe",
                "nic": "123456789V",
                "dob": "1980-01-01",
                "email": "jacob.doe@gmail.com",
                "username": "jacob",
                "password": "sliitcpp",
                "pin": "1234",
                "accountType": "admin",
                "phone": {
                    "work": "1234567890",
                    "personal": "0987654321"
                }
            }

            chai.request(app)
                .post("/api/employee")
                .set("x-access-token", adminToken)
                .send(employee)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error")
                    res.body.error.should.have.property("errors")
                    res.body.error.errors.should.have.property("address")
                    res.body.error.errors.address.should.have.property("properties")
                    res.body.error.errors.address.properties.should.have.property("type").eql("required")
                    done()
                })
        })

        it("it should not create an employee without the dob field", (done) => {
            const employee = {
                "name": "Jacob",
                "surname": "Doe",
                "nic": "123456789V",
                "address": "nowhere",
                "email": "jacob.doe@gmail.com",
                "username": "jacob",
                "password": "sliitcpp",
                "pin": "1234",
                "accountType": "admin",
                "phone": {
                    "work": "1234567890",
                    "personal": "0987654321"
                }
            }

            chai.request(app)
                .post("/api/employee")
                .set("x-access-token", adminToken)
                .send(employee)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error")
                    res.body.error.should.have.property("errors")
                    res.body.error.errors.should.have.property("dob")
                    res.body.error.errors.dob.should.have.property("properties")
                    res.body.error.errors.dob.properties.should.have.property("type").eql("required")
                    done()
                })
        })

        it("it should not create an employee without the email field", (done) => {
            const employee = {
                "name": "Jacob",
                "surname": "Doe",
                "nic": "123456789V",
                "address": "nowhere",
                "dob": "1980-01-01",
                "username": "jacob",
                "password": "sliitcpp",
                "pin": "1234",
                "accountType": "admin",
                "phone": {
                    "work": "1234567890",
                    "personal": "0987654321"
                }
            }

            chai.request(app)
                .post("/api/employee")
                .set("x-access-token", adminToken)
                .send(employee)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error")
                    res.body.error.should.have.property("errors")
                    res.body.error.errors.should.have.property("email")
                    res.body.error.errors.email.should.have.property("properties")
                    res.body.error.errors.email.properties.should.have.property("type").eql("required")
                    done()
                })
        })

        it("it should not create an employee without the username field", (done) => {
            const employee = {
                "name": "Jacob",
                "surname": "Doe",
                "nic": "123456789V",
                "address": "nowhere",
                "dob": "1980-01-01",
                "email": "jacob.doe@gmail.com",
                "password": "sliitcpp",
                "pin": "1234",
                "accountType": "admin",
                "phone": {
                    "work": "1234567890",
                    "personal": "0987654321"
                }
            }

            chai.request(app)
                .post("/api/employee")
                .set("x-access-token", adminToken)
                .send(employee)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error")
                    res.body.error.should.have.property("errors")
                    res.body.error.errors.should.have.property("username")
                    res.body.error.errors.username.should.have.property("properties")
                    res.body.error.errors.username.properties.should.have.property("type").eql("required")
                    done()
                })
        })

        it("it should not create an employee without the password field", (done) => {
            const employee = {
                "name": "Jacob",
                "surname": "Doe",
                "nic": "123456789V",
                "address": "nowhere",
                "dob": "1980-01-01",
                "email": "jacob.doe@gmail.com",
                "username": "jacob",
                "pin": "1234",
                "accountType": "admin",
                "phone": {
                    "work": "1234567890",
                    "personal": "0987654321"
                }
            }

            chai.request(app)
                .post("/api/employee")
                .set("x-access-token", adminToken)
                .send(employee)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error")
                    res.body.error.should.be.a("object")
                    done()
                })
        })

        it("it should not create an employee without the pin field", (done) => {
            const employee = {
                "name": "Jacob",
                "surname": "Doe",
                "nic": "123456789V",
                "address": "nowhere",
                "dob": "1980-01-01",
                "email": "jacob.doe@gmail.com",
                "username": "jacob",
                "password": "sliitcpp",
                "accountType": "admin",
                "phone": {
                    "work": "1234567890",
                    "personal": "0987654321"
                }
            }

            chai.request(app)
                .post("/api/employee")
                .set("x-access-token", adminToken)
                .send(employee)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error")
                    res.body.error.should.be.a("object")
                    done()
                })
        })

        it("it should not create an employee without the accountType field", (done) => {
            const employee = {
                "name": "Jacob",
                "surname": "Doe",
                "nic": "123456789V",
                "address": "nowhere",
                "dob": "1980-01-01",
                "email": "jacob.doe@gmail.com",
                "username": "jacob",
                "password": "sliitcpp",
                "pin": "1234",
                "phone": {
                    "work": "1234567890",
                    "personal": "0987654321"
                }
            }

            chai.request(app)
                .post("/api/employee")
                .set("x-access-token", adminToken)
                .send(employee)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error")
                    res.body.error.should.have.property("errors")
                    res.body.error.errors.should.have.property("accountType")
                    res.body.error.errors.accountType.should.have.property("properties")
                    res.body.error.errors.accountType.properties.should.have.property("type").eql("required")
                    done()
                })
        })

        it("it should not create an employee without the phone.work field", (done) => {
            const employee = {
                "name": "Jacob",
                "surname": "Doe",
                "nic": "123456789V",
                "address": "nowhere",
                "dob": "1980-01-01",
                "email": "jacob.doe@gmail.com",
                "username": "jacob",
                "password": "sliitcpp",
                "pin": "1234",
                "accountType": "admin",
                "phone": {
                    "personal": "0987654321"
                }
            }

            chai.request(app)
                .post("/api/employee")
                .set("x-access-token", adminToken)
                .send(employee)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error")
                    res.body.error.should.have.property("errors")
                    res.body.error.errors.should.have.property("phone.work")
                    done()
                })
        })

        it("it should create an employee for the admin account type", (done) => {
            const employee = {
                "name": "Jacob",
                "surname": "Doe",
                "nic": "123456789V",
                "address": "nowhere",
                "dob": "1980-01-01",
                "email": "jacob.doe@gmail.com",
                "username": "jacob",
                "password": "sliitcpp",
                "pin": "1234",
                "accountType": "admin",
                "phone": {
                    "work": "1234567890",
                    "personal": "0987654321"
                }
            }

            chai.request(app)
                .post("/api/employee")
                .set("x-access-token", adminToken)
                .send(employee)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("status").eql("successfully saved")
                    res.body.should.have.property("result")
                    res.body.result.should.have.property("employeeID").eql(5)
                    done()
                })
        })

        it("it should create an employee for the manager account type", (done) => {
            const employee = {
                "name": "Jerry",
                "surname": "Doe",
                "nic": "123456789V",
                "address": "nowhere",
                "dob": "1980-01-01",
                "email": "jerry.doe@gmail.com",
                "username": "jerry",
                "password": "sliitcpp",
                "pin": "1234",
                "accountType": "admin",
                "phone": {
                    "work": "1234567890",
                    "personal": "0987654321"
                }
            }

            chai.request(app)
                .post("/api/employee")
                .set("x-access-token", adminToken)
                .send(employee)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("status").eql("successfully saved")
                    res.body.should.have.property("result")
                    res.body.result.should.have.property("employeeID").eql(6)
                    done()
                })
        })

        it("it should not create an employee for the receptionist account type", (done) => {
            const employee = {
                "name": "Jacob",
                "surname": "Doe",
                "nic": "123456789V",
                "address": "nowhere",
                "dob": "1980-01-01",
                "email": "jacob.doe@gmail.com",
                "username": "jacob",
                "password": "sliitcpp",
                "pin": "1234",
                "accountType": "admin",
                "phone": {
                    "work": "1234567890",
                    "personal": "0987654321"
                }
            }

            chai.request(app)
                .post("/api/employee")
                .set("x-access-token", receptionistToken)
                .send(employee)
                .end((err, res) => {
                    res.should.have.status(401)
                    res.body.should.be.a("object")
                    res.body.should.have.property("success").eql(false)
                    res.body.should.have.property("message").eql("Unauthorised")
                    done()
                })
        })

        it("it should not create an employee for the cash collector account type", (done) => {
            const employee = {
                "name": "Jacob",
                "surname": "Doe",
                "nic": "123456789V",
                "address": "nowhere",
                "dob": "1980-01-01",
                "email": "jacob.doe@gmail.com",
                "username": "jacob",
                "password": "sliitcpp",
                "pin": "1234",
                "accountType": "admin",
                "phone": {
                    "work": "1234567890",
                    "personal": "0987654321"
                }
            }

            chai.request(app)
                .post("/api/employee")
                .set("x-access-token", cashCollectorToken)
                .send(employee)
                .end((err, res) => {
                    res.should.have.status(401)
                    res.body.should.be.a("object")
                    res.body.should.have.property("success").eql(false)
                    res.body.should.have.property("message").eql("Unauthorised")
                    done()
                })
        })
    })

    // Test the GET /api/employee/:employeeID route
    describe("GET /api/employee/:employeeID", () => {
        it("it should not get the employee without an authorization token", (done) => {
            chai.request(app)
                .get("/api/employee/2")
                .end((err, res) => {
                    res.should.have.status(401)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    res.body.should.have.property("success").eql(false)
                    res.body.should.have.property("message").eql("Unauthorised")
                    done()
                })
        })

        it("it should get the employee for the admin account type", (done) => {
            chai.request(app)
                .get("/api/employee/2")
                .set("x-access-token", adminToken)
                .end((err, res) => {
                    res.should.have.status(200)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    done()
                })
        })

        it("it should get the employee for the manager account type", (done) => {
            chai.request(app)
                .get("/api/employee/2")
                .set("x-access-token", managerToken)
                .end((err, res) => {
                    res.should.have.status(200)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    done()
                })
        })

        it("it should get the employee for the receptionist account type", (done) => {
            chai.request(app)
                .get("/api/employee/2")
                .set("x-access-token", receptionistToken)
                .end((err, res) => {
                    res.should.have.status(200)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    done()
                })
        })

        it("it should get the employee for the cash collector account type", (done) => {
            chai.request(app)
                .get("/api/employee/2")
                .set("x-access-token", cashCollectorToken)
                .end((err, res) => {
                    res.should.have.status(200)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    done()
                })
        })
    })

    // Tets the PUT /api/employee/:employeeID route
    describe("PUT /api/employee/:employeeID", () => {
        it("it should not update the employee without an authorization token", (done) => {
            const employee = {
                "name": "Jacob",
                "surname": "Doe",
                "nic": "123456789V",
                "address": "nowhere",
                "dob": "1980-01-01",
                "email": "jacob.doe@gmail.com",
                "username": "jacob",
                "password": "sliitcpp",
                "pin": "1234",
                "accountType": "admin",
                "phone": {
                    "work": "1234567890",
                    "personal": "0987654321"
                }
            }

            chai.request(app)
                .put("/api/employee/6")
                .send(employee)
                .end((err, res) => {
                    res.should.have.status(401)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    res.body.should.have.property("success").eql(false)
                    res.body.should.have.property("message").eql("Unauthorised")
                    done()
                })
        })

        it("it should not update the employee without the name field", (done) => {
            const employee = {
                "surname": "Doe",
                "nic": "123456789V",
                "address": "nowhere",
                "dob": "1980-01-01",
                "email": "jacob.doe@gmail.com",
                "username": "jacob",
                "password": "sliitcpp",
                "pin": "1234",
                "accountType": "admin",
                "phone": {
                    "work": "1234567890",
                    "personal": "0987654321"
                }
            }

            chai.request(app)
                .put("/api/employee/6")
                .set("x-access-token", adminToken)
                .send(employee)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error")
                    res.body.error.should.have.property("errors")
                    res.body.error.errors.should.have.property("name")
                    res.body.error.errors.name.should.have.property("properties")
                    res.body.error.errors.name.properties.should.have.property("type").eql("required")
                    done()
                })
        })

        it("it should not update the employee without the surname field", (done) => {
            const employee = {
                "name": "Jacob",
                "nic": "123456789V",
                "address": "nowhere",
                "dob": "1980-01-01",
                "email": "jacob.doe@gmail.com",
                "username": "jacob",
                "password": "sliitcpp",
                "pin": "1234",
                "accountType": "admin",
                "phone": {
                    "work": "1234567890",
                    "personal": "0987654321"
                }
            }

            chai.request(app)
                .put("/api/employee/6")
                .set("x-access-token", adminToken)
                .send(employee)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error")
                    res.body.error.should.have.property("errors")
                    res.body.error.errors.should.have.property("surname")
                    res.body.error.errors.surname.should.have.property("properties")
                    res.body.error.errors.surname.properties.should.have.property("type").eql("required")
                    done()
                })
        })

        it("it should not update the employee without the nic field", (done) => {
            const employee = {
                "name": "Jacob",
                "surname": "Doe",
                "address": "nowhere",
                "dob": "1980-01-01",
                "email": "jacob.doe@gmail.com",
                "username": "jacob",
                "password": "sliitcpp",
                "pin": "1234",
                "accountType": "admin",
                "phone": {
                    "work": "1234567890",
                    "personal": "0987654321"
                }
            }

            chai.request(app)
                .put("/api/employee/6")
                .set("x-access-token", adminToken)
                .send(employee)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error")
                    res.body.error.should.have.property("errors")
                    res.body.error.errors.should.have.property("nic")
                    res.body.error.errors.nic.should.have.property("properties")
                    res.body.error.errors.nic.properties.should.have.property("type").eql("required")
                    done()
                })
        })

        it("it should not update the employee without the address field", (done) => {
            const employee = {
                "name": "Jacob",
                "surname": "Doe",
                "nic": "123456789V",
                "dob": "1980-01-01",
                "email": "jacob.doe@gmail.com",
                "username": "jacob",
                "password": "sliitcpp",
                "pin": "1234",
                "accountType": "admin",
                "phone": {
                    "work": "1234567890",
                    "personal": "0987654321"
                }
            }

            chai.request(app)
                .put("/api/employee/6")
                .set("x-access-token", adminToken)
                .send(employee)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error")
                    res.body.error.should.have.property("errors")
                    res.body.error.errors.should.have.property("address")
                    res.body.error.errors.address.should.have.property("properties")
                    res.body.error.errors.address.properties.should.have.property("type").eql("required")
                    done()
                })
        })

        it("it should not update the employee without the dob field", (done) => {
            const employee = {
                "name": "Jacob",
                "surname": "Doe",
                "nic": "123456789V",
                "address": "nowhere",
                "email": "jacob.doe@gmail.com",
                "username": "jacob",
                "password": "sliitcpp",
                "pin": "1234",
                "accountType": "admin",
                "phone": {
                    "work": "1234567890",
                    "personal": "0987654321"
                }
            }

            chai.request(app)
                .put("/api/employee/6")
                .set("x-access-token", adminToken)
                .send(employee)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error")
                    res.body.error.should.have.property("errors")
                    res.body.error.errors.should.have.property("dob")
                    res.body.error.errors.dob.should.have.property("properties")
                    res.body.error.errors.dob.properties.should.have.property("type").eql("required")
                    done()
                })
        })

        it("it should not update the employee without the email field", (done) => {
            const employee = {
                "name": "Jacob",
                "surname": "Doe",
                "nic": "123456789V",
                "address": "nowhere",
                "dob": "1980-01-01",
                "username": "jacob",
                "password": "sliitcpp",
                "pin": "1234",
                "accountType": "admin",
                "phone": {
                    "work": "1234567890",
                    "personal": "0987654321"
                }
            }

            chai.request(app)
                .put("/api/employee/6")
                .set("x-access-token", adminToken)
                .send(employee)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error")
                    res.body.error.should.have.property("errors")
                    res.body.error.errors.should.have.property("email")
                    res.body.error.errors.email.should.have.property("properties")
                    res.body.error.errors.email.properties.should.have.property("type").eql("required")
                    done()
                })
        })

        it("it should not update the employee without the username field", (done) => {
            const employee = {
                "name": "Jacob",
                "surname": "Doe",
                "nic": "123456789V",
                "address": "nowhere",
                "dob": "1980-01-01",
                "email": "jacob.doe@gmail.com",
                "password": "sliitcpp",
                "pin": "1234",
                "accountType": "admin",
                "phone": {
                    "work": "1234567890",
                    "personal": "0987654321"
                }
            }

            chai.request(app)
                .put("/api/employee/6")
                .set("x-access-token", adminToken)
                .send(employee)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error")
                    res.body.error.should.have.property("errors")
                    res.body.error.errors.should.have.property("username")
                    res.body.error.errors.username.should.have.property("properties")
                    res.body.error.errors.username.properties.should.have.property("type").eql("required")
                    done()
                })
        })

        it("it should not update the employee without the password field", (done) => {
            const employee = {
                "name": "Jacob",
                "surname": "Doe",
                "nic": "123456789V",
                "address": "nowhere",
                "dob": "1980-01-01",
                "email": "jacob.doe@gmail.com",
                "username": "jacob",
                "pin": "1234",
                "accountType": "admin",
                "phone": {
                    "work": "1234567890",
                    "personal": "0987654321"
                }
            }

            chai.request(app)
                .put("/api/employee/6")
                .set("x-access-token", adminToken)
                .send(employee)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error")
                    done()
                })
        })

        it("it should not update the employee without the pin field", (done) => {
            const employee = {
                "name": "Jacob",
                "surname": "Doe",
                "nic": "123456789V",
                "address": "nowhere",
                "dob": "1980-01-01",
                "email": "jacob.doe@gmail.com",
                "username": "jacob",
                "password": "sliitcpp",
                "accountType": "admin",
                "phone": {
                    "work": "1234567890",
                    "personal": "0987654321"
                }
            }

            chai.request(app)
                .put("/api/employee/6")
                .set("x-access-token", adminToken)
                .send(employee)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error")
                    done()
                })
        })

        it("it should not update the employee without the account type field", (done) => {
            const employee = {
                "name": "Jacob",
                "surname": "Doe",
                "nic": "123456789V",
                "address": "nowhere",
                "dob": "1980-01-01",
                "email": "jacob.doe@gmail.com",
                "username": "jacob",
                "password": "sliitcpp",
                "pin": "1234",
                "phone": {
                    "work": "1234567890",
                    "personal": "0987654321"
                }
            }

            chai.request(app)
                .put("/api/employee/6")
                .set("x-access-token", adminToken)
                .send(employee)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error")
                    res.body.error.should.have.property("errors")
                    res.body.error.errors.should.have.property("accountType")
                    res.body.error.errors.accountType.should.have.property("properties")
                    res.body.error.errors.accountType.properties.should.have.property("type").eql("required")
                    done()
                })
        })

        it("it should not update the employee without the phone.work field", (done) => {
            const employee = {
                "name": "Jacob",
                "surname": "Doe",
                "nic": "123456789V",
                "address": "nowhere",
                "dob": "1980-01-01",
                "email": "jacob.doe@gmail.com",
                "username": "jacob",
                "password": "sliitcpp",
                "pin": "1234",
                "accountType": "admin",
                "phone": {
                    "personal": "0987654321"
                }
            }

            chai.request(app)
                .put("/api/employee/6")
                .set("x-access-token", adminToken)
                .send(employee)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error")
                    res.body.error.should.have.property("errors")
                    res.body.error.errors.should.have.property("phone.work")
                    done()
                })
        })

        it("it should update the employee for the admin account type", (done) => {
            const employee = {
                "name": "Jacob",
                "surname": "Doe",
                "nic": "123456789V",
                "address": "nowhere",
                "dob": "1980-01-01",
                "email": "jacob.doe@gmail.com",
                "username": "jacob",
                "password": "sliitcpp",
                "pin": "1234",
                "accountType": "admin",
                "phone": {
                    "work": "1234567890",
                    "personal": "0987654321"
                }
            }

            chai.request(app)
                .put("/api/employee/6")
                .set("x-access-token", adminToken)
                .send(employee)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("result")
                    res.body.result.should.have.property("employeeID").eql(6)
                    done()
                })
        })

        it("it should update the employee for the manager account type", (done) => {
            const employee = {
                "name": "Jacob",
                "surname": "Doe",
                "nic": "123456789V",
                "address": "nowhere",
                "dob": "1980-01-01",
                "email": "jacob.doe@gmail.com",
                "username": "jacob",
                "password": "sliitcpp",
                "pin": "1234",
                "accountType": "admin",
                "phone": {
                    "work": "1234567890",
                    "personal": "0987654321"
                }
            }

            chai.request(app)
                .put("/api/employee/6")
                .set("x-access-token", managerToken)
                .send(employee)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("result")
                    res.body.result.should.have.property("employeeID").eql(6)
                    done()
                })
        })

        it("it should not update the employee for the receptionist account type", (done) => {
            const employee = {
                "name": "Jacob",
                "surname": "Doe",
                "nic": "123456789V",
                "address": "nowhere",
                "dob": "1980-01-01",
                "email": "jacob.doe@gmail.com",
                "username": "jacob",
                "password": "sliitcpp",
                "pin": "1234",
                "accountType": "admin",
                "phone": {
                    "work": "1234567890",
                    "personal": "0987654321"
                }
            }

            chai.request(app)
                .put("/api/employee/6")
                .set("x-access-token", receptionistToken)
                .send(employee)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(401)
                    res.body.should.be.a("object")
                    res.body.should.have.property("success").eql(false)
                    res.body.should.have.property("message").eql("Unauthorised")
                    done()
                })
        })

        it("it should not update the employee for the cash collector account type", (done) => {
            const employee = {
                "name": "Jacob",
                "surname": "Doe",
                "nic": "123456789V",
                "address": "nowhere",
                "dob": "1980-01-01",
                "email": "jacob.doe@gmail.com",
                "username": "jacob",
                "password": "sliitcpp",
                "pin": "1234",
                "accountType": "admin",
                "phone": {
                    "work": "1234567890",
                    "personal": "0987654321"
                }
            }

            chai.request(app)
                .put("/api/employee/6")
                .set("x-access-token", cashCollectorToken)
                .send(employee)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(401)
                    res.body.should.be.a("object")
                    res.body.should.have.property("success").eql(false)
                    res.body.should.have.property("message").eql("Unauthorised")
                    done()
                })
        })
    })

    // Test the POST /api/user/reauthenticate route
    describe("POST /api/user/reauthenticate", () => {
        it("it should not reauthenticate the user without an authorization token", (done) => {
            const user = {
                "username": "john",
                "pin": "1234"
            }

            chai.request(app)
                .post("/api/user/reauthenticate")
                .send(user)
                .end((err, res) => {
                    res.should.have.status(401)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    res.body.should.have.property("success").eql(false)
                    res.body.should.have.property("message").eql("Unauthorised")
                    done()
                })
        })

        it("it should not get a new token with the wrong username", (done) => {
            const user = {
                "username": "john1",
                "pin": "1234"
            }

            chai.request(app)
                .post("/api/user/reauthenticate")
                .set("x-access-token", adminToken)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(401)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    res.body.should.have.property("success").eql(false)
                    res.body.should.have.property("message").eql("Authentication failed. User not found.")
                    done()
                })
        })

        it("it should not get a new token with no pin given", (done) => {
            const user = {
                "username": "john"
            }

            chai.request(app)
                .post("/api/user/reauthenticate")
                .set("x-access-token", adminToken)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(401)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    res.body.should.have.property("success").eql(false)
                    res.body.should.have.property("message").eql("Authentication failed. No pin given.")
                    done()
                })
        })

        it("it should not get a new token with the wrong pin", (done) => {
            const user = {
                "username": "john",
                "pin": "12345"
            }

            chai.request(app)
                .post("/api/user/reauthenticate")
                .set("x-access-token", adminToken)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(401)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    res.body.should.have.property("success").eql(false)
                    res.body.should.have.property("message").eql("Authentication failed. Wrong pin.")
                    done()
                })
        })

        it("it should get a new token for the admin account type", (done) => {
            const user = {
                "username": "john",
                "pin": "1234"
            }

            chai.request(app)
                .post("/api/user/reauthenticate")
                .set("x-access-token", adminToken)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    res.body.should.have.property("success").eql(true)
                    res.body.should.have.property("message").eql("Authentication success.")
                    res.body.should.have.property("token")
                    newAdminToken = res.body.token
                    done()
                })
        })

        it("it should get a new token for the manager account type", (done) => {
            const user = {
                "username": "jane",
                "pin": "1234"
            }

            chai.request(app)
                .post("/api/user/reauthenticate")
                .set("x-access-token", managerToken)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    res.body.should.have.property("success").eql(true)
                    res.body.should.have.property("message").eql("Authentication success.")
                    res.body.should.have.property("token")
                    newManagerToken = res.body.token
                    done()
                })
        })

        it("it should get a new token for the receptionist account type", (done) => {
            const user = {
                "username": "james",
                "pin": "1234"
            }

            chai.request(app)
                .post("/api/user/reauthenticate")
                .set("x-access-token", receptionistToken)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    res.body.should.have.property("success").eql(true)
                    res.body.should.have.property("message").eql("Authentication success.")
                    res.body.should.have.property("token")
                    newReceptionistToken = res.body.token
                    done()
                })
        })

        it("it should get a new token for the cash collector account type", (done) => {
            const user = {
                "username": "jake",
                "pin": "1234"
            }

            chai.request(app)
                .post("/api/user/reauthenticate")
                .set("x-access-token", cashCollectorToken)
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    res.body.should.have.property("success").eql(true)
                    res.body.should.have.property("message").eql("Authentication success.")
                    res.body.should.have.property("token")
                    newCashCollectorToken = res.body.token
                    done()
                })
        })

        it("it should invalidate the previous token", (done) => {
            chai.request(app)
                .get("/api/employee")
                .set("x-access-token", adminToken)
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

    // Test the GET /api/user/logout route
    describe("GET /api/user/logout", () => {
        it("it should not reauthenticate the user without an authorization token", (done) => {
            chai.request(app)
                .get("/api/user/logout")
                .end((err, res) => {
                    res.should.have.status(401)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    res.body.should.have.property("success").eql(false)
                    res.body.should.have.property("message").eql("Unauthorised")
                    done()
                })
        })

        it("it should succesfully logout for the admin account type", (done) => {
            chai.request(app)
                .get("/api/user/logout")
                .set("x-access-token", newAdminToken)
                .end((err, res) => {
                    res.should.have.status(200)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    res.body.should.have.property("status").eql("Successfully logged out")
                    done()
                })
        })

        it("it should succesfully logout for the manager account type", (done) => {
            chai.request(app)
                .get("/api/user/logout")
                .set("x-access-token", newManagerToken)
                .end((err, res) => {
                    res.should.have.status(200)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    res.body.should.have.property("status").eql("Successfully logged out")
                    done()
                })
        })

        it("it should succesfully logout for the receptionist account type", (done) => {
            chai.request(app)
                .get("/api/user/logout")
                .set("x-access-token", newReceptionistToken)
                .end((err, res) => {
                    res.should.have.status(200)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    res.body.should.have.property("status").eql("Successfully logged out")
                    done()
                })
        })

        it("it should succesfully logout for the cash collector account type", (done) => {
            chai.request(app)
                .get("/api/user/logout")
                .set("x-access-token", newCashCollectorToken)
                .end((err, res) => {
                    res.should.have.status(200)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    res.body.should.have.property("status").eql("Successfully logged out")
                    done()
                })
        })

        it("it should invalidate the token", (done) => {
            chai.request(app)
                .get("/api/employee")
                .set("x-access-token", newAdminToken)
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