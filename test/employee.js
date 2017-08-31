"use strict";

const app = require("../src/app").app;

const chai = require("chai");
const chaiHttp = require("chai-http");
const Employee = require("../src/models/employeeSchema");
const Counter = require("../src/models/counterSchema");
const should = chai.should();

// Used for hashing password and pin
const bcrypt = require("bcrypt");
const saltRounds = 10;

chai.use(chaiHttp);

describe("Employees", () => {
    var token = null; // Store authentication token

    /* Remove all employees and counters 
    , and create a new employee
    before running tests*/
    before((done) => {
        let employee = {
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
        };

        Employee.remove({})
            .then(() => Counter.remove({}))
            .then(() => Promise.all([
                bcrypt.hash(employee.password, saltRounds),
                bcrypt.hash(employee.pin, saltRounds)
            ]))
            .then((hashResult) => {
                employee.password = hashResult[0];
                employee.pin = hashResult[1];
            })
            .then(() => Employee.create(employee))
            .then((result) => {
                done();
            });
    });

    // Get a new authentication token
    before((done) => {
        const user = {
            "username": "john",
            "password": "sliitcpp"
        };

        chai.request(app)
            .post("/employee/authenticate")
            .send(user)
            .end((err, result) => {
                // Go through the properties one by one
                result.should.have.status(200);
                result.body.should.be.a("object");
                result.body.should.have.property("success").eql(true);
                result.body.should.have.property("accountType").eql("admin");
                token = result.body.token;
                done();
            });
    });

    // Test the GET /api/employee route
    describe("GET /api/employee", () => {
        it("it should not get all the employees without an authorization token", (done) => {
            chai.request(app)
                .get("/api/employee")
                .end((err, res) => {
                    res.should.have.status(401);
                    should.exist(res.body);
                    res.body.should.be.a("object");
                    res.body.should.have.property("success").eql(false);
                    res.body.should.have.property("message").eql("Unauthorised");
                    done();
                });
        });

        it("it should get all the employees", (done) => {
            chai.request(app)
                .get("/api/employee")
                .set("x-access-token", token)
                .end((err, res) => {
                    res.should.have.status(200);
                    should.exist(res.body);
                    res.body.should.be.a("array");
                    res.body.length.should.be.eql(1);
                    done();
                });
        });
    });

    // Test the POST /api/employee route
    describe("POST /api/employee", () => {
        it("it should not create an employee without an authorization token", (done) => {
            const employee = {
                "name": "Jane",
                "surname": "Doe",
                "nic": "123456789V",
                "address": "nowhere",
                "dob": "1980-01-01",
                "email": "jane.doe@gmail.com",
                "username": "jane",
                "password": "sliitcpp",
                "pin": "1234",
                "accountType": "admin",
                "phone": {
                    "work": "1234567890",
                    "personal": "0987654321"
                }
            };

            chai.request(app)
                .post("/api/employee")
                .send(employee)
                .end((err, res) => {
                    res.should.have.status(401);
                    should.exist(res.body);
                    res.body.should.be.a("object");
                    res.body.should.have.property("success").eql(false);
                    res.body.should.have.property("message").eql("Unauthorised");
                    done();
                });
        });

        it("it should not create an employee without the name field", (done) => {
            const employee = {
                "surname": "Doe",
                "nic": "123456789V",
                "address": "nowhere",
                "dob": "1980-01-01",
                "email": "jane.doe@gmail.com",
                "username": "jane",
                "password": "sliitcpp",
                "pin": "1234",
                "accountType": "admin",
                "phone": {
                    "work": "1234567890",
                    "personal": "0987654321"
                }
            };

            chai.request(app)
                .post("/api/employee")
                .set("x-access-token", token)
                .send(employee)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error");
                    res.body.error.should.have.property("errors");
                    res.body.error.errors.should.have.property("name");
                    res.body.error.errors.name.should.have.property("properties");
                    res.body.error.errors.name.properties.should.have.property("type").eql("required");
                    done();
                });
        });

        it("it should not create an employee without the surname field", (done) => {
            const employee = {
                "name": "Jane",
                "nic": "123456789V",
                "address": "nowhere",
                "dob": "1980-01-01",
                "email": "jane.doe@gmail.com",
                "username": "jane",
                "password": "sliitcpp",
                "pin": "1234",
                "accountType": "admin",
                "phone": {
                    "work": "1234567890",
                    "personal": "0987654321"
                }
            };

            chai.request(app)
                .post("/api/employee")
                .set("x-access-token", token)
                .send(employee)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error");
                    res.body.error.should.have.property("errors");
                    res.body.error.errors.should.have.property("surname");
                    res.body.error.errors.surname.should.have.property("properties");
                    res.body.error.errors.surname.properties.should.have.property("type").eql("required");
                    done();
                });
        });

        it("it should not create an employee without the nic field", (done) => {
            const employee = {
                "name": "Jane",
                "surname": "Doe",
                "address": "nowhere",
                "dob": "1980-01-01",
                "email": "jane.doe@gmail.com",
                "username": "jane",
                "password": "sliitcpp",
                "pin": "1234",
                "accountType": "admin",
                "phone": {
                    "work": "1234567890",
                    "personal": "0987654321"
                }
            };

            chai.request(app)
                .post("/api/employee")
                .set("x-access-token", token)
                .send(employee)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error");
                    res.body.error.should.have.property("errors");
                    res.body.error.errors.should.have.property("nic");
                    res.body.error.errors.nic.should.have.property("properties");
                    res.body.error.errors.nic.properties.should.have.property("type").eql("required");
                    done();
                });
        });

        it("it should not create an employee without the address field", (done) => {
            const employee = {
                "name": "Jane",
                "surname": "Doe",
                "nic": "123456789V",
                "dob": "1980-01-01",
                "email": "jane.doe@gmail.com",
                "username": "jane",
                "password": "sliitcpp",
                "pin": "1234",
                "accountType": "admin",
                "phone": {
                    "work": "1234567890",
                    "personal": "0987654321"
                }
            };

            chai.request(app)
                .post("/api/employee")
                .set("x-access-token", token)
                .send(employee)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error");
                    res.body.error.should.have.property("errors");
                    res.body.error.errors.should.have.property("address");
                    res.body.error.errors.address.should.have.property("properties");
                    res.body.error.errors.address.properties.should.have.property("type").eql("required");
                    done();
                });
        });

        it("it should not create an employee without the dob field", (done) => {
            const employee = {
                "name": "Jane",
                "surname": "Doe",
                "nic": "123456789V",
                "address": "nowhere",
                "email": "jane.doe@gmail.com",
                "username": "jane",
                "password": "sliitcpp",
                "pin": "1234",
                "accountType": "admin",
                "phone": {
                    "work": "1234567890",
                    "personal": "0987654321"
                }
            };

            chai.request(app)
                .post("/api/employee")
                .set("x-access-token", token)
                .send(employee)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error");
                    res.body.error.should.have.property("errors");
                    res.body.error.errors.should.have.property("dob");
                    res.body.error.errors.dob.should.have.property("properties");
                    res.body.error.errors.dob.properties.should.have.property("type").eql("required");
                    done();
                });
        });

        it("it should not create an employee without the email field", (done) => {
            const employee = {
                "name": "Jane",
                "surname": "Doe",
                "nic": "123456789V",
                "address": "nowhere",
                "dob": "1980-01-01",
                "username": "jane",
                "password": "sliitcpp",
                "pin": "1234",
                "accountType": "admin",
                "phone": {
                    "work": "1234567890",
                    "personal": "0987654321"
                }
            };

            chai.request(app)
                .post("/api/employee")
                .set("x-access-token", token)
                .send(employee)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error");
                    res.body.error.should.have.property("errors");
                    res.body.error.errors.should.have.property("email");
                    res.body.error.errors.email.should.have.property("properties");
                    res.body.error.errors.email.properties.should.have.property("type").eql("required");
                    done();
                });
        });

        it("it should not create an employee without the username field", (done) => {
            const employee = {
                "name": "Jane",
                "surname": "Doe",
                "nic": "123456789V",
                "address": "nowhere",
                "dob": "1980-01-01",
                "email": "jane.doe@gmail.com",
                "password": "sliitcpp",
                "pin": "1234",
                "accountType": "admin",
                "phone": {
                    "work": "1234567890",
                    "personal": "0987654321"
                }
            };

            chai.request(app)
                .post("/api/employee")
                .set("x-access-token", token)
                .send(employee)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error");
                    res.body.error.should.have.property("errors");
                    res.body.error.errors.should.have.property("username");
                    res.body.error.errors.username.should.have.property("properties");
                    res.body.error.errors.username.properties.should.have.property("type").eql("required");
                    done();
                });
        });

        it("it should not create an employee without the password field", (done) => {
            const employee = {
                "name": "Jane",
                "surname": "Doe",
                "nic": "123456789V",
                "address": "nowhere",
                "dob": "1980-01-01",
                "email": "jane.doe@gmail.com",
                "username": "jane",
                "pin": "1234",
                "accountType": "admin",
                "phone": {
                    "work": "1234567890",
                    "personal": "0987654321"
                }
            };

            chai.request(app)
                .post("/api/employee")
                .set("x-access-token", token)
                .send(employee)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error");
                    res.body.error.should.be.a("object");
                    done();
                });
        });

        it("it should not create an employee without the pin field", (done) => {
            const employee = {
                "name": "Jane",
                "surname": "Doe",
                "nic": "123456789V",
                "address": "nowhere",
                "dob": "1980-01-01",
                "email": "jane.doe@gmail.com",
                "username": "jane",
                "password": "sliitcpp",
                "accountType": "admin",
                "phone": {
                    "work": "1234567890",
                    "personal": "0987654321"
                }
            };

            chai.request(app)
                .post("/api/employee")
                .set("x-access-token", token)
                .send(employee)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error");
                    res.body.error.should.be.a("object");
                    done();
                });
        });

        it("it should not create an employee without the accountType field", (done) => {
            const employee = {
                "name": "Jane",
                "surname": "Doe",
                "nic": "123456789V",
                "address": "nowhere",
                "dob": "1980-01-01",
                "email": "jane.doe@gmail.com",
                "username": "jane",
                "password": "sliitcpp",
                "pin": "1234",
                "phone": {
                    "work": "1234567890",
                    "personal": "0987654321"
                }
            };

            chai.request(app)
                .post("/api/employee")
                .set("x-access-token", token)
                .send(employee)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error");
                    res.body.error.should.have.property("errors");
                    res.body.error.errors.should.have.property("accountType");
                    res.body.error.errors.accountType.should.have.property("properties");
                    res.body.error.errors.accountType.properties.should.have.property("type").eql("required");
                    done();
                });
        });

        it("it should not create an employee without the phone.work field", (done) => {
            const employee = {
                "name": "Jane",
                "surname": "Doe",
                "nic": "123456789V",
                "address": "nowhere",
                "dob": "1980-01-01",
                "email": "jane.doe@gmail.com",
                "username": "jane",
                "password": "sliitcpp",
                "pin": "1234",
                "accountType": "admin",
                "phone": {
                    "personal": "0987654321"
                }
            };

            chai.request(app)
                .post("/api/employee")
                .set("x-access-token", token)
                .send(employee)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error");
                    res.body.error.should.have.property("errors");
                    res.body.error.errors.should.have.property("phone.work");
                    done();
                });
        });

        it("it should not create an employee without an authorization token", (done) => {
            const employee = {
                "name": "Jane",
                "surname": "Doe",
                "nic": "123456789V",
                "address": "nowhere",
                "dob": "1980-01-01",
                "email": "jane.doe@gmail.com",
                "username": "jane",
                "password": "sliitcpp",
                "pin": "1234",
                "accountType": "admin",
                "phone": {
                    "work": "1234567890",
                    "personal": "0987654321"
                }
            };

            chai.request(app)
                .post("/api/employee")
                .set("x-access-token", token)
                .send(employee)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("status").eql("successfully saved");
                    res.body.should.have.property("result");
                    res.body.result.should.have.property("employeeID").eql(2);
                    done();
                });
        });
    });

    // Test the GET /api/employee/:employeeID route
    describe("GET /api/employee/:employeeID", () => {
        it("it should not get the employee without an authorization token", (done) => {
            chai.request(app)
                .get("/api/employee/2")
                .end((err, res) => {
                    res.should.have.status(401);
                    should.exist(res.body);
                    res.body.should.be.a("object");
                    res.body.should.have.property("success").eql(false);
                    res.body.should.have.property("message").eql("Unauthorised");
                    done();
                });
        });

        it("it should get the employee", (done) => {
            chai.request(app)
                .get("/api/employee/2")
                .set("x-access-token", token)
                .end((err, res) => {
                    res.should.have.status(200);
                    should.exist(res.body);
                    res.body.should.be.a("object");
                    done();
                });
        });
    });
});