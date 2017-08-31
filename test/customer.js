"use strict";

const app = require("../src/app").app;

const chai = require("chai");
const chaiHttp = require("chai-http");
const Customer = require("../src/models/customerSchema");
const Employee = require("../src/models/employeeSchema");
const Counter = require("../src/models/counterSchema");
const should = chai.should();

// Used for hashing password and pin
const bcrypt = require("bcrypt");
const saltRounds = 10;

chai.use(chaiHttp);

describe("Customers", () => {
    let token = null; // Store authentication token

    /* Remove all employees, loans and counters 
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
            .then(() => Customer.remove({}))
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

    // Test the  GET /api/customer route
    describe("GET /api/customer", () => {
        it("it should not get all the customers without an authorization token", (done) => {
            chai.request(app)
                .get("/api/customer")
                .end((err, res) => {
                    res.should.have.status(401);
                    should.exist(res.body);
                    res.body.should.be.a("object");
                    res.body.should.have.property("success").eql(false);
                    res.body.should.have.property("message").eql("Unauthorised");
                    done();
                });
        });

        it("it should get all the customers", (done) => {
            chai.request(app)
                .get("/api/customer")
                .set("x-access-token", token)
                .end((err, res) => {
                    res.should.have.status(200);
                    should.exist(res.body);
                    res.body.should.be.a("array");
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });

    // Test the POST /api/customer route
    describe("POST /api/customer", () => {
        it("it should not create a customer without an authorization token", (done) => {
            const customer = {
                "name": "Jane",
                "surname": "Doe",
                "nic": "801234567V",
                "address": "123/X Baker St., Narnia",
                "dob": "01-01-1980",
                "phone": "123456789",
                "email": "jane@doe.com",
                "areaID": "1",
                "longitude": "6°54'52.8 N",
                "latitude": "79°58'24.1 E"
            };

            chai.request(app)
                .post("/api/customer")
                .send(customer)
                .end((err, res) => {
                    res.should.have.status(401);
                    should.exist(res.body);
                    res.body.should.be.a("object");
                    res.body.should.have.property("success").eql(false);
                    res.body.should.have.property("message").eql("Unauthorised");
                    done();
                });
        });

        it("it should not create a customer without the name field", (done) => {
            const customer = {
                "surname": "Doe",
                "nic": "801234567V",
                "address": "123/X Baker St., Narnia",
                "dob": "01-01-1980",
                "phone": "123456789",
                "email": "jane@doe.com",
                "areaID": "1",
                "longitude": "6°54'52.8 N",
                "latitude": "79°58'24.1 E"
            };

            chai.request(app)
                .post("/api/customer")
                .set("x-access-token", token)
                .send(customer)
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

        it("it should not create a customer without the surname field", (done) => {
            const customer = {
                "name": "John",
                "nic": "801234567V",
                "address": "123/X Baker St., Narnia",
                "dob": "01-01-1980",
                "phone": "123456789",
                "email": "jane@doe.com",
                "areaID": "1",
                "longitude": "6°54'52.8 N",
                "latitude": "79°58'24.1 E"
            };

            chai.request(app)
                .post("/api/customer")
                .set("x-access-token", token)
                .send(customer)
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

        it("it should not create a customer without the nic field", (done) => {
            const customer = {
                "name": "John",
                "surname": "Doe",
                "address": "123/X Baker St., Narnia",
                "dob": "01-01-1980",
                "phone": "123456789",
                "email": "jane@doe.com",
                "areaID": "1",
                "longitude": "6°54'52.8 N",
                "latitude": "79°58'24.1 E"
            };

            chai.request(app)
                .post("/api/customer")
                .set("x-access-token", token)
                .send(customer)
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

        it("it should not create a customer without the address field", (done) => {
            const customer = {
                "name": "John",
                "surname": "Doe",
                "nic": "801234567V",
                "dob": "01-01-1980",
                "phone": "123456789",
                "email": "jane@doe.com",
                "areaID": "1",
                "longitude": "6°54'52.8 N",
                "latitude": "79°58'24.1 E"
            };

            chai.request(app)
                .post("/api/customer")
                .set("x-access-token", token)
                .send(customer)
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

        it("it should not create a customer without the DOB field", (done) => {
            const customer = {
                "name": "John",
                "surname": "Doe",
                "nic": "801234567V",
                "address": "123/X Baker St., Narnia",
                "phone": "123456789",
                "email": "jane@doe.com",
                "areaID": "1",
                "longitude": "6°54'52.8 N",
                "latitude": "79°58'24.1 E"
            };

            chai.request(app)
                .post("/api/customer")
                .set("x-access-token", token)
                .send(customer)
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

        it("it should not create a customer without the phone field", (done) => {
            const customer = {
                "name": "John",
                "surname": "Doe",
                "nic": "801234567V",
                "address": "123/X Baker St., Narnia",
                "dob": "01-01-1980",
                "email": "jane@doe.com",
                "areaID": "1",
                "longitude": "6°54'52.8 N",
                "latitude": "79°58'24.1 E"
            };

            chai.request(app)
                .post("/api/customer")
                .set("x-access-token", token)
                .send(customer)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error");
                    res.body.error.should.have.property("errors");
                    res.body.error.errors.should.have.property("phone");
                    res.body.error.errors.phone.should.have.property("properties");
                    res.body.error.errors.phone.properties.should.have.property("type").eql("required");
                    done();
                });
        });

        it("it should not create a customer without the email field", (done) => {
            const customer = {
                "name": "John",
                "surname": "Doe",
                "nic": "801234567V",
                "address": "123/X Baker St., Narnia",
                "dob": "01-01-1980",
                "phone": "123456789",
                "areaID": "1",
                "longitude": "6°54'52.8 N",
                "latitude": "79°58'24.1 E"
            };

            chai.request(app)
                .post("/api/customer")
                .set("x-access-token", token)
                .send(customer)
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

        it("it should not create a customer without the areaID field", (done) => {
            const customer = {
                "name": "John",
                "surname": "Doe",
                "nic": "801234567V",
                "address": "123/X Baker St., Narnia",
                "dob": "01-01-1980",
                "phone": "123456789",
                "email": "jane@doe.com",
                "longitude": "6°54'52.8 N",
                "latitude": "79°58'24.1 E"
            };

            chai.request(app)
                .post("/api/customer")
                .set("x-access-token", token)
                .send(customer)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error");
                    res.body.error.should.have.property("errors");
                    res.body.error.errors.should.have.property("areaID");
                    res.body.error.errors.areaID.should.have.property("properties");
                    res.body.error.errors.areaID.properties.should.have.property("type").eql("required");
                    done();
                });
        });

        it("it should not create a customer without the longitude field", (done) => {
            const customer = {
                "name": "John",
                "surname": "Doe",
                "nic": "801234567V",
                "address": "123/X Baker St., Narnia",
                "dob": "01-01-1980",
                "phone": "123456789",
                "email": "jane@doe.com",
                "areaID": "1",
                "latitude": "79°58'24.1 E"
            };

            chai.request(app)
                .post("/api/customer")
                .set("x-access-token", token)
                .send(customer)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error");
                    res.body.error.should.have.property("errors");
                    res.body.error.errors.should.have.property("longitude");
                    res.body.error.errors.longitude.should.have.property("properties");
                    res.body.error.errors.longitude.properties.should.have.property("type").eql("required");
                    done();
                });
        });

        it("it should not create a customer without the latitude field", (done) => {
            const customer = {
                "name": "John",
                "surname": "Doe",
                "nic": "801234567V",
                "address": "123/X Baker St., Narnia",
                "dob": "01-01-1980",
                "phone": "123456789",
                "email": "jane@doe.com",
                "areaID": "1",
                "longitude": "6°54'52.8 N"
            };

            chai.request(app)
                .post("/api/customer")
                .set("x-access-token", token)
                .send(customer)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error");
                    res.body.error.should.have.property("errors");
                    res.body.error.errors.should.have.property("latitude");
                    res.body.error.errors.latitude.should.have.property("properties");
                    res.body.error.errors.latitude.properties.should.have.property("type").eql("required");
                    done();
                });
        });

        it("it should create a customer", (done) => {
            const customer = {
                "name": "John",
                "surname": "Doe",
                "nic": "801234567V",
                "address": "123/X Baker St., Narnia",
                "dob": "01-01-1980",
                "phone": "123456789",
                "email": "jane@doe.com",
                "areaID": "1",
                "longitude": "6°54'52.8 N",
                "latitude": "79°58'24.1 E"
            };

            chai.request(app)
                .post("/api/customer")
                .set("x-access-token", token)
                .send(customer)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("status").eql("successfully saved");
                    res.body.should.have.property("result");
                    // Check for all fields
                    res.body.result.should.have.property("__v");
                    res.body.result.should.have.property("customerID").eql(1);
                    res.body.result.should.have.property("name");
                    res.body.result.should.have.property("surname");
                    res.body.result.should.have.property("nic");
                    res.body.result.should.have.property("address");
                    res.body.result.should.have.property("dob");
                    res.body.result.should.have.property("phone");
                    res.body.result.should.have.property("areaID");
                    res.body.result.should.have.property("longitude");
                    res.body.result.should.have.property("latitude");
                    res.body.result.should.have.property("_id");
                    done();
                });
        });

        it("it should create the 2nd customer with customerID 2", (done) => {
            const customer = {
                "name": "Jane",
                "surname": "Doe",
                "nic": "801234567V",
                "address": "123/X Baker St., Narnia",
                "dob": "01-01-1980",
                "phone": "123456789",
                "email": "jane@doe.com",
                "areaID": "1",
                "longitude": "6°54'52.8 N",
                "latitude": "79°58'24.1 E"
            };

            chai.request(app)
                .post("/api/customer")
                .set("x-access-token", token)
                .send(customer)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("status").eql("successfully saved");
                    res.body.should.have.property("result");
                    // Check for all fields
                    res.body.result.should.have.property("__v");
                    res.body.result.should.have.property("customerID").eql(2);
                    res.body.result.should.have.property("name");
                    res.body.result.should.have.property("surname");
                    res.body.result.should.have.property("nic");
                    res.body.result.should.have.property("address");
                    res.body.result.should.have.property("dob");
                    res.body.result.should.have.property("phone");
                    res.body.result.should.have.property("areaID");
                    res.body.result.should.have.property("longitude");
                    res.body.result.should.have.property("latitude");
                    res.body.result.should.have.property("_id");
                    done();
                });
        });
    });

    // Test the GET /api/customer/:customerID route
    describe("GET /api/customer/:customerID", () => {
        it("it should not get the customer without an authorization token", (done) => {
            chai.request(app)
                .get("/api/customer/1")
                .end((err, res) => {
                    res.should.have.status(401);
                    should.exist(res.body);
                    res.body.should.be.a("object");
                    res.body.should.have.property("success").eql(false);
                    res.body.should.have.property("message").eql("Unauthorised");
                    done();
                });
        });

        it("it should get the customer", (done) => {
            chai.request(app)
                .get("/api/customer/1")
                .set("x-access-token", token)
                .end((err, res) => {
                    res.should.have.status(200);
                    should.exist(res.body);
                    res.body.should.be.a("object");
                    done();
                });
        });
    });

    // Test the PUT /api/customer/:customerID route
    describe("PUT /api/customer/:customerID", () => {
        it("it should not update the customer without an authorization token", (done) => {
            chai.request(app)
                .put("/api/customer/1")
                .end((err, res) => {
                    res.should.have.status(401);
                    should.exist(res.body);
                    res.body.should.be.a("object");
                    res.body.should.have.property("success").eql(false);
                    res.body.should.have.property("message").eql("Unauthorised");
                    done();
                });
        });

        it("it should not update the customer if the wrong customerID is given", (done) => {
            const customer = new Customer({
                "name": "John",
                "surname": "Doe",
                "nic": "801234567V",
                "address": "123/X Baker St., Narnia",
                "dob": "01-02-1980",
                "phone": "123456789",
                "email": "jane@doe.com",
                "areaID": "1",
                "longitude": "6°54'52.8 N",
                "latitude": "79°58'24.1 E"
            });

            chai.request(app)
                .put("/api/customer/3")
                .set("x-access-token", token)
                .send(customer)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error").eql("Record does not exist");
                    done();
                });
        });

        it("it should not update the customer without the name field", (done) => {
            const customer = {
                "surname": "Doe",
                "nic": "801234567V",
                "address": "123/X Baker St., Narnia",
                "dob": "01-01-1980",
                "phone": "123456789",
                "email": "jane@doe.com",
                "areaID": "1",
                "longitude": "6°54'52.8 N",
                "latitude": "79°58'24.1 E"
            };

            chai.request(app)
                .put("/api/customer/1")
                .set("x-access-token", token)
                .send(customer)
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

        it("it should not update the customer without the surname field", (done) => {
            const customer = {
                "name": "John",
                "nic": "801234567V",
                "address": "123/X Baker St., Narnia",
                "dob": "01-01-1980",
                "phone": "123456789",
                "email": "jane@doe.com",
                "areaID": "1",
                "longitude": "6°54'52.8 N",
                "latitude": "79°58'24.1 E"
            };

            chai.request(app)
                .put("/api/customer/1")
                .set("x-access-token", token)
                .send(customer)
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

        it("it should not update the customer without the nic field", (done) => {
            const customer = {
                "name": "John",
                "surname": "Doe",
                "address": "123/X Baker St., Narnia",
                "dob": "01-01-1980",
                "phone": "123456789",
                "email": "jane@doe.com",
                "areaID": "1",
                "longitude": "6°54'52.8 N",
                "latitude": "79°58'24.1 E"
            };

            chai.request(app)
                .put("/api/customer/1")
                .set("x-access-token", token)
                .send(customer)
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

        it("it should not update the customer without the address field", (done) => {
            const customer = {
                "name": "John",
                "surname": "Doe",
                "nic": "801234567V",
                "dob": "01-01-1980",
                "phone": "123456789",
                "email": "jane@doe.com",
                "areaID": "1",
                "longitude": "6°54'52.8 N",
                "latitude": "79°58'24.1 E"
            };

            chai.request(app)
                .put("/api/customer/1")
                .set("x-access-token", token)
                .send(customer)
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

        it("it should not update the customer without the DOB field", (done) => {
            const customer = {
                "name": "John",
                "surname": "Doe",
                "nic": "801234567V",
                "address": "123/X Baker St., Narnia",
                "phone": "123456789",
                "email": "jane@doe.com",
                "areaID": "1",
                "longitude": "6°54'52.8 N",
                "latitude": "79°58'24.1 E"
            };

            chai.request(app)
                .put("/api/customer/1")
                .set("x-access-token", token)
                .send(customer)
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

        it("it should not update the customer without the phone field", (done) => {
            const customer = {
                "name": "John",
                "surname": "Doe",
                "nic": "801234567V",
                "address": "123/X Baker St., Narnia",
                "dob": "01-01-1980",
                "email": "jane@doe.com",
                "areaID": "1",
                "longitude": "6°54'52.8 N",
                "latitude": "79°58'24.1 E"
            };

            chai.request(app)
                .put("/api/customer/1")
                .set("x-access-token", token)
                .send(customer)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error");
                    res.body.error.should.have.property("errors");
                    res.body.error.errors.should.have.property("phone");
                    res.body.error.errors.phone.should.have.property("properties");
                    res.body.error.errors.phone.properties.should.have.property("type").eql("required");
                    done();
                });
        });

        it("it should not update the customer without the phone field", (done) => {
            const customer = {
                "name": "John",
                "surname": "Doe",
                "nic": "801234567V",
                "address": "123/X Baker St., Narnia",
                "dob": "01-01-1980",
                "phone": "123456789",
                "areaID": "1",
                "longitude": "6°54'52.8 N",
                "latitude": "79°58'24.1 E"
            };

            chai.request(app)
                .put("/api/customer/1")
                .set("x-access-token", token)
                .send(customer)
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

        it("it should not update the customer without the areaID field", (done) => {
            const customer = {
                "name": "John",
                "surname": "Doe",
                "nic": "801234567V",
                "address": "123/X Baker St., Narnia",
                "dob": "01-01-1980",
                "phone": "123456789",
                "email": "jane@doe.com",
                "longitude": "6°54'52.8 N",
                "latitude": "79°58'24.1 E"
            };

            chai.request(app)
                .put("/api/customer/1")
                .set("x-access-token", token)
                .send(customer)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error");
                    res.body.error.should.have.property("errors");
                    res.body.error.errors.should.have.property("areaID");
                    res.body.error.errors.areaID.should.have.property("properties");
                    res.body.error.errors.areaID.properties.should.have.property("type").eql("required");
                    done();
                });
        });

        it("it should not update the customer without the longitude field", (done) => {
            const customer = {
                "name": "John",
                "surname": "Doe",
                "nic": "801234567V",
                "address": "123/X Baker St., Narnia",
                "dob": "01-01-1980",
                "phone": "123456789",
                "email": "jane@doe.com",
                "areaID": "1",
                "latitude": "79°58'24.1 E"
            };

            chai.request(app)
                .put("/api/customer/1")
                .set("x-access-token", token)
                .send(customer)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error");
                    res.body.error.should.have.property("errors");
                    res.body.error.errors.should.have.property("longitude");
                    res.body.error.errors.longitude.should.have.property("properties");
                    res.body.error.errors.longitude.properties.should.have.property("type").eql("required");
                    done();
                });
        });

        it("it should not update the customer without the latitude field", (done) => {
            const customer = {
                "name": "John",
                "surname": "Doe",
                "nic": "801234567V",
                "address": "123/X Baker St., Narnia",
                "dob": "01-01-1980",
                "phone": "123456789",
                "email": "jane@doe.com",
                "areaID": "1",
                "longitude": "6°54'52.8 N"
            };

            chai.request(app)
                .put("/api/customer/1")
                .set("x-access-token", token)
                .send(customer)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error");
                    res.body.error.should.have.property("errors");
                    res.body.error.errors.should.have.property("latitude");
                    res.body.error.errors.latitude.should.have.property("properties");
                    res.body.error.errors.latitude.properties.should.have.property("type").eql("required");
                    done();
                });
        });

        it("it should update the customer given the customerID", (done) => {
            const customer = new Customer({
                customerID: 1,
                name: "John",
                surname: "Doe",
                nic: "801234567V",
                address: "123/X Baker St., Narnia",
                dob: "01-02-1980",
                phone: "123456789",
                "email": "jane@doe.com",
                areaID: 1,
                longitude: "6°54'52.8 N",
                latitude: "79°58'24.1 E"
            });

            chai.request(app)
                .put("/api/customer/1")
                .set("x-access-token", token)
                .send(customer)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("result");
                    // Check for all fields
                    res.body.result.should.have.property("_id");
                    res.body.result.should.have.property("customerID").eql(1);
                    res.body.result.should.have.property("name");
                    res.body.result.should.have.property("surname");
                    res.body.result.should.have.property("nic");
                    res.body.result.should.have.property("address");
                    res.body.result.should.have.property("dob");
                    res.body.result.should.have.property("phone");
                    res.body.result.should.have.property("areaID");
                    res.body.result.should.have.property("longitude");
                    res.body.result.should.have.property("latitude");
                    res.body.result.should.have.property("__v");
                    done();
                });
        });
    });
});