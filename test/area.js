"use strict"

const app = require("../src/app").app

const chai = require("chai")
const chaiHttp = require("chai-http")
const Area = require("../src/models/areaSchema")
const Employee = require("../src/models/employeeSchema")
const Counter = require("../src/models/counterSchema")
const should = chai.should()

// Used for hashing password and pin
const bcrypt = require("bcrypt")
const saltRounds = 10

chai.use(chaiHttp)

describe("Areas", () => {
    // Store authentication tokens
    let adminToken = null
    let managerToken = null
    let receptionistToken = null
    let cashCollectorToken = null

    /* Remove all employees, areas and counters
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
            .then(() => Area.remove({}))
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
            .then((result) => {
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

    // Test the  GET /api/area route
    describe("GET /api/area", () => {
        it("it should not get all the areas without an authorization token", (done) => {
            chai.request(app)
                .get("/api/area")
                .end((err, res) => {
                    res.should.have.status(401)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    res.body.should.have.property("success").eql(false)
                    res.body.should.have.property("message").eql("Unauthorised")
                    done()
                })
        })

        it("it should get all the areas for admin account type", (done) => {
            chai.request(app)
                .get("/api/area")
                .set("x-access-token", adminToken)
                .end((err, res) => {
                    res.should.have.status(200)
                    should.exist(res.body)
                    res.body.should.be.a("array")
                    res.body.length.should.be.eql(0)
                    done()
                })
        })

        it("it should get all the areas for manager account type", (done) => {
            chai.request(app)
                .get("/api/area")
                .set("x-access-token", managerToken)
                .end((err, res) => {
                    res.should.have.status(200)
                    should.exist(res.body)
                    res.body.should.be.a("array")
                    res.body.length.should.be.eql(0)
                    done()
                })
        })
        it("it should get all the areas for receptionist account type", (done) => {
            chai.request(app)
                .get("/api/area")
                .set("x-access-token", receptionistToken)
                .end((err, res) => {
                    res.should.have.status(200)
                    should.exist(res.body)
                    res.body.should.be.a("array")
                    res.body.length.should.be.eql(0)
                    done()
                })
        })
        it("it should get all the areas for cash collector account type", (done) => {
            chai.request(app)
                .get("/api/area")
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

    // Test the POST /api/area route
    describe("POST /api/area", () => {
        it("it should not create an area without an authorization token", (done) => {
            const area = {
                "name": "Kaduwela",
                "postalCode": 10640,
                "district": "Colombo"
            }

            chai.request(app)
                .post("/api/area")
                .send(area)
                .end((err, res) => {
                    res.should.have.status(401)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    res.body.should.have.property("success").eql(false)
                    res.body.should.have.property("message").eql("Unauthorised")
                    done()
                })
        })


        it("it should not create an area without the name field", (done) => {
            const area = {
                "postalCode": 10640,
                "district": "Colombo"
            }

            chai.request(app)
                .post("/api/area")
                .set("x-access-token", adminToken)
                .send(area)
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

        it("it should not create an area without the postalCode field", (done) => {
            const area = {
                "name": "Kaduwela",
                "district": "Colombo"
            }

            chai.request(app)
                .post("/api/area")
                .set("x-access-token", adminToken)
                .send(area)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error")
                    res.body.error.should.have.property("errors")
                    res.body.error.errors.should.have.property("postalCode")
                    res.body.error.errors.postalCode.should.have.property("properties")
                    res.body.error.errors.postalCode.properties.should.have.property("type").eql("required")
                    done()
                })
        })

        it("it should not create an area without the district field", (done) => {
            const area = {
                "name": "Kaduwela",
                "postalCode": 10640
            }

            chai.request(app)
                .post("/api/area")
                .set("x-access-token", adminToken)
                .send(area)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error")
                    res.body.error.should.have.property("errors")
                    res.body.error.errors.should.have.property("district")
                    res.body.error.errors.district.should.have.property("properties")
                    res.body.error.errors.district.properties.should.have.property("type").eql("required")
                    done()
                })
        })

        it("it should create an area for the admin account type", (done) => {
            const area = {
                "name": "Kaduwela",
                "postalCode": 10640,
                "district": "Colombo"
            }

            // Remove all areas before running
            Area.remove({}, () => {
                // Reset counter before running
                Counter.remove({}, () => {
                    chai.request(app)
                        .post("/api/area")
                        .set("x-access-token", adminToken)
                        .send(area)
                        .end((err, res) => {
                            res.should.have.status(200)
                            res.body.should.be.a("object")
                            res.body.should.have.property("status").eql("successfully saved")
                            res.body.should.have.property("result")
                            // Check for all fields
                            res.body.result.should.have.property("__v")
                            res.body.result.should.have.property("areaID").eql(1)
                            res.body.result.should.have.property("name").eql("Kaduwela")
                            res.body.result.should.have.property("postalCode").eql(10640)
                            res.body.result.should.have.property("district").eql("Colombo")
                            res.body.result.should.have.property("_id")
                            done()
                        })
                })
            })
        })

        it("it should create an area for the manager account type", (done) => {
            const area = {
                "name": "Kaduwela",
                "postalCode": 10640,
                "district": "Colombo"
            }

            // Remove all areas before running
            Area.remove({}, () => {
                // Reset counter before running
                Counter.remove({}, () => {
                    chai.request(app)
                        .post("/api/area")
                        .set("x-access-token", managerToken)
                        .send(area)
                        .end((err, res) => {
                            res.should.have.status(200)
                            res.body.should.be.a("object")
                            res.body.should.have.property("status").eql("successfully saved")
                            res.body.should.have.property("result")
                            // Check for all fields
                            res.body.result.should.have.property("__v")
                            res.body.result.should.have.property("areaID").eql(1)
                            res.body.result.should.have.property("name").eql("Kaduwela")
                            res.body.result.should.have.property("postalCode").eql(10640)
                            res.body.result.should.have.property("district").eql("Colombo")
                            res.body.result.should.have.property("_id")
                            done()
                        })
                })
            })
        })

        it("it should not create an area for the receptionist account type", (done) => {
            const area = {
                "name": "Kaduwela",
                "postalCode": 10640,
                "district": "Colombo"
            }

            chai.request(app)
                .post("/api/area")
                .set("x-access-token", receptionistToken)
                .send(area)
                .end((err, res) => {
                    res.should.have.status(401)
                    res.body.should.be.a("object")
                    res.body.should.have.property("success").eql(false)
                    res.body.should.have.property("message").eql("Unauthorised")
                    done()
                })
        })

        it("it should not create an area for the cash collector account type", (done) => {
            const area = {
                "name": "Kaduwela",
                "postalCode": 10640,
                "district": "Colombo"
            }

            chai.request(app)
                .post("/api/area")
                .set("x-access-token", cashCollectorToken)
                .send(area)
                .end((err, res) => {
                    res.should.have.status(401)
                    res.body.should.be.a("object")
                    res.body.should.have.property("success").eql(false)
                    res.body.should.have.property("message").eql("Unauthorised")
                    done()
                })
        })
    })

    // Test the GET /api/area/:areaID route
    describe("GET /api/area/:areaID", () => {
        it("it should not get the area without an authorization token", (done) => {
            chai.request(app)
                .get("/api/area/1")
                .end((err, res) => {
                    res.should.have.status(401)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    res.body.should.have.property("success").eql(false)
                    res.body.should.have.property("message").eql("Unauthorised")
                    done()
                })
        })

        it("it should get the area for the admin account type", (done) => {
            chai.request(app)
                .get("/api/area/1")
                .set("x-access-token", adminToken)
                .end((err, res) => {
                    res.should.have.status(200)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    done()
                })
        })

        it("it should get the area for the manager account type", (done) => {
            chai.request(app)
                .get("/api/area/1")
                .set("x-access-token", managerToken)
                .end((err, res) => {
                    res.should.have.status(200)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    done()
                })
        })

        it("it should get the area for the receptionist account type", (done) => {
            chai.request(app)
                .get("/api/area/1")
                .set("x-access-token", receptionistToken)
                .end((err, res) => {
                    res.should.have.status(200)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    done()
                })
        })

        it("it should get the area for the cash collector account type", (done) => {
            chai.request(app)
                .get("/api/area/1")
                .set("x-access-token", cashCollectorToken)
                .end((err, res) => {
                    res.should.have.status(200)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    done()
                })
        })
    })

    // Test the PUT /api/area/:areaID route
    describe("PUT /api/area/:areaID", () => {
        it("it should not update the area without an authorization token", (done) => {
            const area = new Area({
                "name": "Kaduwela",
                "postalCode": 10640,
                "district": "Colombo"
            })

            chai.request(app)
                .put("/api/area/1")
                .send(area)
                .end((err, res) => {
                    res.should.have.status(401)
                    should.exist(res.body)
                    res.body.should.be.a("object")
                    res.body.should.have.property("success").eql(false)
                    res.body.should.have.property("message").eql("Unauthorised")
                    done()
                })
        })

        it("it should not update the customer if the wrong areaID is given", (done) => {
            const area = new Area({
                "name": "Kaduwela",
                "postalCode": 10640,
                "district": "Colombo"
            })

            chai.request(app)
                .put("/api/area/3")
                .set("x-access-token", adminToken)
                .send(area)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error").eql("Record does not exist")
                    done()
                })
        })

        it("it should not update the area without the name field", (done) => {
            const area = {
                "postalCode": 10640,
                "district": "Colombo"
            }


            chai.request(app)
                .put("/api/area/1")
                .set("x-access-token", adminToken)
                .send(area)
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

        it("it should not update the area without the postalCode field", (done) => {
            const area = {
                "name": "Kaduwela",
                "district": "Colombo"
            }

            chai.request(app)
                .put("/api/area/1")
                .set("x-access-token", adminToken)
                .send(area)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error")
                    res.body.error.should.have.property("errors")
                    res.body.error.errors.should.have.property("postalCode")
                    res.body.error.errors.postalCode.should.have.property("properties")
                    res.body.error.errors.postalCode.properties.should.have.property("type").eql("required")
                    done()
                })
        })

        it("it should not update the area without the district field", (done) => {
            const area = new Area({
                "name": "Kaduwela",
                "postalCode": 10640
            })

            chai.request(app)
                .put("/api/area/1")
                .set("x-access-token", adminToken)
                .send(area)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("error")
                    res.body.error.should.have.property("errors")
                    res.body.error.errors.should.have.property("district")
                    res.body.error.errors.district.should.have.property("properties")
                    res.body.error.errors.district.properties.should.have.property("type").eql("required")
                    done()
                })
        })

        it("it should update the area given the areaID for the admin account type", (done) => {
            const area = new Area({
                "name": "Kaduwela",
                "postalCode": 10640,
                "district": "Colombo"
            })

            chai.request(app)
                .put("/api/area/1")
                .set("x-access-token", adminToken)
                .send(area)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("result")
                    // Check for all fields
                    res.body.result.should.have.property("_id")
                    res.body.result.should.have.property("areaID").eql(1)
                    res.body.result.should.have.property("name").eql("Kaduwela")
                    res.body.result.should.have.property("postalCode").eql(10640)
                    res.body.result.should.have.property("district").eql("Colombo")
                    res.body.result.should.have.property("__v")
                    done()
                })
        })

        it("it should update the area given the areaID for the manager account type", (done) => {
            const area = new Area({
                "name": "Kaduwela",
                "postalCode": 10640,
                "district": "Colombo"
            })

            chai.request(app)
                .put("/api/area/1")
                .set("x-access-token", managerToken)
                .send(area)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a("object")
                    res.body.should.have.property("result")
                    // Check for all fields
                    res.body.result.should.have.property("_id")
                    res.body.result.should.have.property("areaID").eql(1)
                    res.body.result.should.have.property("name").eql("Kaduwela")
                    res.body.result.should.have.property("postalCode").eql(10640)
                    res.body.result.should.have.property("district").eql("Colombo")
                    res.body.result.should.have.property("__v")
                    done()
                })
        })

        it("it should not update the area given the areaID for the receptionist account type", (done) => {
            const area = new Area({
                "name": "Kaduwela",
                "postalCode": 10640,
                "district": "Colombo"
            })

            chai.request(app)
                .put("/api/area/1")
                .set("x-access-token", receptionistToken)
                .send(area)
                .end((err, res) => {
                    res.should.have.status(401)
                    res.body.should.be.a("object")
                    res.body.should.have.property("success").eql(false)
                    res.body.should.have.property("message").eql("Unauthorised")
                    done()
                })
        })

        it("it should not update the area given the areaID for the cash collector account type", (done) => {
            const area = new Area({
                "name": "Kaduwela",
                "postalCode": 10640,
                "district": "Colombo"
            })

            chai.request(app)
                .put("/api/area/1")
                .set("x-access-token", cashCollectorToken)
                .send(area)
                .end((err, res) => {
                    res.should.have.status(401)
                    res.body.should.be.a("object")
                    res.body.should.have.property("success").eql(false)
                    res.body.should.have.property("message").eql("Unauthorised")
                    done()
                })
        })
    })
})