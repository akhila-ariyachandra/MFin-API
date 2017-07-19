"use strict";

const app = require("../build/app.min");

const chai = require("chai");
const chaiHttp = require("chai-http");
const server = app.Server;
const CashCollector = app.CashCollector;
const User = app.User;
const should = chai.should();

chai.use(chaiHttp);

describe("Cash Collectors", () => {
    var token = null; // Store authentication token

    // Empty the database before each test
    before((done) => {
        CashCollector.remove({}, (err) => {
            done();
        });
    });

    // Reset the counter of cashCollectorID before running tests
    before((done) => {
        CashCollector.counterReset("customerID", (err) => {
            done();
        });
    });

    // Remove all users before running tests
    before((done) => {
        User.remove({}, (err) => {
            done();
        });
    });

    // Create a new user before running tests
    before((done) => {
        const user = {
            "username": "mfindev",
            "password": "sliitcpp"
        };

        chai.request(server)
            .post("/user")
            .send(user)
            .end((err, result) => {
                // Go through the properties one by one
                result.should.have.status(200);
                result.body.should.be.a("object");
                result.body.should.have.property("status").eql("successfully saved");
                done();
            });
    });

    // Get a new authentication token
    before((done) => {
        const user = {
            "username": "mfindev",
            "password": "sliitcpp"
        };

        chai.request(server)
            .post("/authenticate")
            .send(user)
            .end((err, result) => {
                // Go through the properties one by one
                result.should.have.status(200);
                result.body.should.be.a("object");
                result.body.should.have.property("success").eql(true);
                token = result.body.token;
                done();
            });
    });

    // Test the  GET /api/cashCollector route
    describe("GET /api/cashCollector", () => {
        it("it should not get all the cash collectors without an authorization token", (done) => {
            chai.request(server)
                .get("/api/cashCollector")
                .end((err, res) => {
                    res.should.have.status(401);
                    should.exist(res.body);
                    res.body.should.be.a("object");
                    res.body.should.have.property("success").eql(false);
                    res.body.should.have.property("message").eql("Unauthorised");
                    done();
                });
        });

        it("it should get all the cash collectors", (done) => {
            chai.request(server)
                .get("/api/cashCollector")
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

    // Test the POST /api/cashCollector route
    describe("POST /api/cashCollector", () => {
        it("it should not create a cash collector without an authorization token", (done) => {
            const cashCollector = {
                "name": "Dananjaya",
                "surname": "Raj",
                "nic": "923456548V",
                "address": "Gampaha",
                "phone": "0712564218",
                "areaID": "2"          
            };

            chai.request(server)
                .post("/api/cashCollector")
                .send(cashCollector)
                .end((err, res) => {
                    res.should.have.status(401);
                    should.exist(res.body);
                    res.body.should.be.a("object");
                    res.body.should.have.property("success").eql(false);
                    res.body.should.have.property("message").eql("Unauthorised");
                    done();
                });
        });

        it("it should not create a cash collector without the name field", (done) => {
            const cashCollector = {
                "surname": "Raj",
                "nic": "923456548V",
                "address": "Gampaha",
                "phone": "0712564218",
                "areaID": "2"          
            };

            chai.request(server)
                .post("/api/cashCollector")
                .set("x-access-token", token)
                .send(cashCollector)
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

        it("it should not create a cash collector without the surname field", (done) => {
            const cashCollector = {
                "name": "Dananjaya",
                "nic": "923456548V",
                "address": "Gampaha",
                "phone": "0712564218",
                "areaID": "2"          
            };

            chai.request(server)
                .post("/api/cashCollector")
                .set("x-access-token", token)
                .send(cashCollector)
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

        it("it should not create a cash collector without the nic field", (done) => {
            const cashCollector = {
                "name": "Dananjaya",
                "surname": "Raj",
                "address": "Gampaha",
                "phone": "0712564218",
                "areaID": "2"          
            };

            chai.request(server)
                .post("/api/cashCollector")
                .set("x-access-token", token)
                .send(cashCollector)
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

        it("it should not create a cash collector without the address field", (done) => {
            const cashCollector = {
                "name": "Dananjaya",
                "surname": "Raj",
                "nic": "923456548V",
                "phone": "0712564218",
                "areaID": "2"          
            };

            chai.request(server)
                .post("/api/cashCollector")
                .set("x-access-token", token)
                .send(cashCollector)
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

        it("it should not create a cash collector without the phone field", (done) => {
            const cashCollector = {
                "name": "Dananjaya",
                "surname": "Raj",
                "nic": "923456548V",
                "address": "Gampaha",
                "areaID": "2"          
            };

            chai.request(server)
                .post("/api/cashCollector")
                .set("x-access-token", token)
                .send(cashCollector)
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

        it("it should not create a customer without the areaID field", (done) => {
            const cashCollector = {
                "name": "Dananjaya",
                "surname": "Raj",
                "nic": "923456548V",
                "address": "Gampaha",
                "phone": "0712564218"        
            };

            chai.request(server)
                .post("/api/cashCollector")
                .set("x-access-token", token)
                .send(cashCollector)
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

        it("it should create a cash collector", (done) => {
            const cashCollector = {
                "name": "Dananjaya",
                "surname": "Raj",
                "nic": "923456548V",
                "address": "Gampaha",
                "phone": "0712564218",
                "areaID": 2          
            };

            chai.request(server)
                .post("/api/cashCollector")
                .set("x-access-token", token)
                .send(cashCollector)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("status").eql("successfully saved");
                    res.body.should.have.property("result");
                    // Check for all fields
                    res.body.result.should.have.property("__v");
                    res.body.result.should.have.property("cashCollectorID").eql(1);
                    res.body.result.should.have.property("name").eql("Dananjaya");
                    res.body.result.should.have.property("surname").eql("Raj");
                    res.body.result.should.have.property("nic").eql("923456548V");
                    res.body.result.should.have.property("address").eql("Gampaha");
                    res.body.result.should.have.property("phone").eql("0712564218");
                    res.body.result.should.have.property("areaID").eql(2);
                    res.body.result.should.have.property("_id");
                    done();
                });
        });
    });

    // Test the GET /api/cashCollector/:cashCollectorID route
    describe("GET /api/cashCollector/:cashCollectorID", () => {
        it("it should not get the cash collector without an authorization token", (done) => {
            chai.request(server)
                .get("/api/cashCollector/1")
                .end((err, res) => {
                    res.should.have.status(401);
                    should.exist(res.body);
                    res.body.should.be.a("object");
                    res.body.should.have.property("success").eql(false);
                    res.body.should.have.property("message").eql("Unauthorised");
                    done();
                });
        });

        it("it should get the cash collector", (done) => {
            chai.request(server)
                .get("/api/cashCollector/1")
                .set("x-access-token", token)
                .end((err, res) => {
                    res.should.have.status(200);
                    should.exist(res.body);
                    res.body.should.be.a("object");
                    done();
                });
        });
    });

    // Test the PUT /api/cashCollector/:cashCollectorID route
    describe("PUT /api/cashCollector/:cashCollectorID", () => {
        it("it should not update the cash collector without an authorization token", (done) => {
            const cashCollector = {
                "name": "Dananjaya",
                "surname": "Raj",
                "nic": "923456548V",
                "address": "Gampaha",
                "phone": "0712564218",
                "areaID": 2          
            };
            
            chai.request(server)
                .put("/api/cashCollector/1")
                .send(cashCollector)
                .end((err, res) => {
                    res.should.have.status(401);
                    should.exist(res.body);
                    res.body.should.be.a("object");
                    res.body.should.have.property("success").eql(false);
                    res.body.should.have.property("message").eql("Unauthorised");
                    done();
                });
        });

        it("it should not update the cash collector if the wrong cashCollectorID is given", (done) => {
            const cashCollector = {
                "name": "Dananjaya",
                "surname": "Raj",
                "nic": "923456548V",
                "address": "Gampaha",
                "phone": "0712564218",
                "areaID": 2          
            };

            chai.request(server)
                .put("/api/cashCollector/3")
                .set("x-access-token", token)
                .send(cashCollector)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error").eql("Record does not exist");
                    done();
                });
        });

        it("it should not update the cash collector without the name field", (done) => {
            const cashCollector = {
                "surname": "Raj",
                "nic": "923456548V",
                "address": "Gampaha",
                "phone": "0712564218",
                "areaID": 2          
            };

            chai.request(server)
                .put("/api/cashCollector/1")
                .set("x-access-token", token)
                .send(cashCollector)
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

        it("it should not update the cash collector without the surname field", (done) => {
            const cashCollector = {
                "name": "Dananjaya",
                "nic": "923456548V",
                "address": "Gampaha",
                "phone": "0712564218",
                "areaID": 2          
            };

            chai.request(server)
                .put("/api/cashCollector/1")
                .set("x-access-token", token)
                .send(cashCollector)
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

        it("it should not update the cash collector without the nic field", (done) => {
            const cashCollector = {
                "name": "Dananjaya",
                "surname": "Raj",
                "address": "Gampaha",
                "phone": "0712564218",
                "areaID": 2          
            };

            chai.request(server)
                .put("/api/cashCollector/1")
                .set("x-access-token", token)
                .send(cashCollector)
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

        it("it should not update the cash collector without the address field", (done) => {
            const cashCollector = {
                "name": "Dananjaya",
                "surname": "Raj",
                "nic": "923456548V",
                "phone": "0712564218",
                "areaID": 2          
            };

            chai.request(server)
                .put("/api/cashCollector/1")
                .set("x-access-token", token)
                .send(cashCollector)
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

        it("it should not update the customer without the phone field", (done) => {
            const cashCollector = {
                "name": "Dananjaya",
                "surname": "Raj",
                "nic": "923456548V",
                "address": "Gampaha",
                "areaID": 2          
            };

            chai.request(server)
                .put("/api/cashCollector/1")
                .set("x-access-token", token)
                .send(cashCollector)
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

        it("it should not update the customer without the areaID field", (done) => {
            const cashCollector = {
                "name": "Dananjaya",
                "surname": "Raj",
                "nic": "923456548V",
                "address": "Gampaha",
                "phone": "0712564218"         
            };

            chai.request(server)
                .put("/api/cashCollector/1")
                .set("x-access-token", token)
                .send(cashCollector)
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

        it("it should update the cashCollector given the cashCollectorID", (done) => {
            const cashCollector = new CashCollector({
                "name": "Dananjaya",
                "surname": "Raj",
                "nic": "923456548V",
                "address": "Gampaha",
                "phone": "0712564218",
                "areaID": 2          
            });

            chai.request(server)
                .put("/api/cashCollector/1")
                .set("x-access-token", token)
                .send(cashCollector)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("result");
                    // Check for all fields
                    res.body.result.should.have.property("_id");
                    res.body.result.should.have.property("cashCollectorID").eql(1);
                    res.body.result.should.have.property("name").eql("Dananjaya");
                    res.body.result.should.have.property("surname").eql("Raj");
                    res.body.result.should.have.property("nic").eql("923456548V");
                    res.body.result.should.have.property("address").eql("Gampaha");
                    res.body.result.should.have.property("areaID").eql(2);
                    res.body.result.should.have.property("__v");
                    done();
                });
        });
    });
});