"use strict";

const app = require("../build/app.min");

const chai = require("chai");
const chaiHttp = require("chai-http");
const server = app.Server;
const Area = app.Area;
const User = app.User;
const should = chai.should();

chai.use(chaiHttp);

describe("Areas", () => {
    var token = null; // Store authentication token

    // Empty the database before each test
    before((done) => {
        Area.remove({}, (err) => {
            done();
        });
    });

    // Reset the counter of areaID before running tests
    before((done) => {
        Area.counterReset("areaID", (err) => {
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

    // Test the  GET /api/area route
    describe("GET /api/area", () => {
        it("it should not get all the areas without an authorization token", (done) => {
            chai.request(server)
                .get("/api/area")
                .end((err, res) => {
                    res.should.have.status(401);
                    should.exist(res.body);
                    res.body.should.be.a("object");
                    res.body.should.have.property("success").eql(false);
                    res.body.should.have.property("message").eql("Unauthorised");
                    done();
                });
        });

        it("it should get all the areas", (done) => {
            chai.request(server)
                .get("/api/area")
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

    // Test the POST /api/area route
    describe("POST /api/area", () => {
        it("it should not create an area without an authorization token", (done) => {
            const area = {
                "name": "Kaduwela",
                "postalCode": 10640,
                "district": "Colombo"
            };

            chai.request(server)
                .post("/api/area")
                .send(area)
                .end((err, res) => {
                    res.should.have.status(401);
                    should.exist(res.body);
                    res.body.should.be.a("object");
                    res.body.should.have.property("success").eql(false);
                    res.body.should.have.property("message").eql("Unauthorised");
                    done();
                });
        });

        
        it("it should not create an area without the name field", (done) => {
            const area = {
                "postalCode": 10640,
                "district": "Colombo"
            };

            chai.request(server)
                .post("/api/area")
                .set("x-access-token", token)
                .send(area)
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

        it("it should not create an area without the postalCode field", (done) => {
            const area = {
                "name": "Kaduwela",
                "district": "Colombo"
            };

            chai.request(server)
                .post("/api/area")
                .set("x-access-token", token)
                .send(area)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error");
                    res.body.error.should.have.property("errors");
                    res.body.error.errors.should.have.property("postalCode");
                    res.body.error.errors.postalCode.should.have.property("properties");
                    res.body.error.errors.postalCode.properties.should.have.property("type").eql("required");
                    done();
                });
        });

        it("it should not create an area without the district field", (done) => {
            const area = {
                "name": "Kaduwela",
                "postalCode": 10640
            };

            chai.request(server)
                .post("/api/area")
                .set("x-access-token", token)
                .send(area)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error");
                    res.body.error.should.have.property("errors");
                    res.body.error.errors.should.have.property("district");
                    res.body.error.errors.district.should.have.property("properties");
                    res.body.error.errors.district.properties.should.have.property("type").eql("required");
                    done();
                });
        });

        it("it should create a area", (done) => {
            const area = {
                "name": "Kaduwela",
                "postalCode": 10640,
                "district": "Colombo"
            };

            chai.request(server)
                .post("/api/area")
                .set("x-access-token", token)
                .send(area)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("status").eql("successfully saved");
                    res.body.should.have.property("result");
                    // Check for all fields
                    res.body.result.should.have.property("__v");
                    res.body.result.should.have.property("areaID").eql(1);
                    res.body.result.should.have.property("name").eql("Kaduwela");
                    res.body.result.should.have.property("postalCode").eql(10640);
                    res.body.result.should.have.property("district").eql("Colombo");
                    res.body.result.should.have.property("_id");
                    done();
                });
        });
    });
    
    // Test the GET /api/area/:areaID route
    describe("GET /api/area/:areaID", () => {
        it("it should not get the area without an authorization token", (done) => {
            chai.request(server)
                .get("/api/area/1")
                .end((err, res) => {
                    res.should.have.status(401);
                    should.exist(res.body);
                    res.body.should.be.a("object");
                    res.body.should.have.property("success").eql(false);
                    res.body.should.have.property("message").eql("Unauthorised");
                    done();
                });
        });

        it("it should get the area", (done) => {
            chai.request(server)
                .get("/api/area/1")
                .set("x-access-token", token)
                .end((err, res) => {
                    res.should.have.status(200);
                    should.exist(res.body);
                    res.body.should.be.a("object");
                    done();
                });
        });
    });

    // Test the PUT /api/area/:areaID route
    describe("PUT /api/area/:areaID", () => {
        it("it should not update the area without an authorization token", (done) => {
            const area = new Area({
                "name": "Kaduwela",
                "postalCode": 10640,
                "district": "Colombo"
            });
            
            chai.request(server)
                .put("/api/area/1")
                .send(area)
                .end((err, res) => {
                    res.should.have.status(401);
                    should.exist(res.body);
                    res.body.should.be.a("object");
                    res.body.should.have.property("success").eql(false);
                    res.body.should.have.property("message").eql("Unauthorised");
                    done();
                });
        });

        it("it should not update the customer if the wrong areaID is given", (done) => {
            const area = new Area({
                "name": "Kaduwela",
                "postalCode": 10640,
                "district": "Colombo"
            });

            chai.request(server)
                .put("/api/area/3")
                .set("x-access-token", token)
                .send(area)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error").eql("Record does not exist");
                    done();
                });
        });

        it("it should not update the area without the name field", (done) => {
            const area = {
                "postalCode": 10640,
                "district": "Colombo"
            };


            chai.request(server)
                .put("/api/area/1")
                .set("x-access-token", token)
                .send(area)
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

        it("it should not update the area without the postalCode field", (done) => {
            const area = {
                "name": "Kaduwela",
                "district": "Colombo"
            };

            chai.request(server)
                .put("/api/area/1")
                .set("x-access-token", token)
                .send(area)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error");
                    res.body.error.should.have.property("errors");
                    res.body.error.errors.should.have.property("postalCode");
                    res.body.error.errors.postalCode.should.have.property("properties");
                    res.body.error.errors.postalCode.properties.should.have.property("type").eql("required");
                    done();
                });
        });

        it("it should not update the area without the district field", (done) => {
            const area = new Area({
                "name": "Kaduwela",
                "postalCode": 10640
            });

            chai.request(server)
                .put("/api/area/1")
                .set("x-access-token", token)
                .send(area)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error");
                    res.body.error.should.have.property("errors");
                    res.body.error.errors.should.have.property("district");
                    res.body.error.errors.district.should.have.property("properties");
                    res.body.error.errors.district.properties.should.have.property("type").eql("required");
                    done();
                });
        });

        it("it should update the area given the areaID", (done) => {
            const area = new Area({
                "name": "Kaduwela",
                "postalCode": 10640,
                "district": "Colombo"
            });

            chai.request(server)
                .put("/api/area/1")
                .set("x-access-token", token)
                .send(area)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("result");
                    // Check for all fields
                    res.body.result.should.have.property("_id");
                    res.body.result.should.have.property("areaID").eql(1);
                    res.body.result.should.have.property("name").eql("Kaduwela");
                    res.body.result.should.have.property("postalCode").eql(10640);
                    res.body.result.should.have.property("district").eql("Colombo");
                    res.body.result.should.have.property("__v");
                    done();
                });
        });
    });
});