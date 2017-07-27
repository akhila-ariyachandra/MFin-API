"use strict";

const app = require("../src/app").app;

const chai = require("chai");
const chaiHttp = require("chai-http");
const Loan = require("../src/models/loanSchema");
const User = require("../src/models/userSchema");
const should = chai.should();

chai.use(chaiHttp);

describe("Loans", () => {
    var token = null; // Store authentication token

    // Empty the database before each test
    before((done) => {
        Loan.remove({}, (err) => {
            done();
        });
    });

    // Reset the counter of loanID before running tests
    before((done) => {
        Loan.counterReset("loanID", (err) => {
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

        chai.request(app)
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

        chai.request(app)
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

    // Test the GET /api/loan route
    describe("GET /api/loan", () => {
        it("it should not get all the loans without an authorization token", (done) => {
            chai.request(app)
                .get("/api/loan")
                .end((err, res) => {
                    res.should.have.status(401);
                    should.exist(res.body);
                    res.body.should.be.a("object");
                    res.body.should.have.property("success").eql(false);
                    res.body.should.have.property("message").eql("Unauthorised");
                    done();
                });
        });

        it("it should get all the loans", (done) => {
            chai.request(app)
                .get("/api/loan")
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
            };

            chai.request(app)
                .post("/api/loan")
                .send(loan)
                .end((err, res) => {
                    res.should.have.status(401);
                    should.exist(res.body);
                    res.body.should.be.a("object");
                    res.body.should.have.property("success").eql(false);
                    res.body.should.have.property("message").eql("Unauthorised");
                    done();
                });
        });


        it("it should not create a loan without the loanType field", (done) => {
            const loan = {
                "token": token,
                "date": "04-03-1998",
                "loanAmount": 250000,
                "duration": 12,
                "interest": 5,
                "customerID": 1
            };

            chai.request(app)
                .post("/api/loan")
                .send(loan)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error");
                    res.body.error.should.have.property("errors");
                    res.body.error.errors.should.have.property("loanType");
                    res.body.error.errors.loanType.should.have.property("properties");
                    res.body.error.errors.loanType.properties.should.have.property("type").eql("required");
                    done();
                });
        });

        it("it should not create a loan without the date field", (done) => {
            const loan = {
                "token": token,
                "loanType": "Fix Deposit",
                "loanAmount": 250000,
                "duration": 12,
                "interest": 5,
                "customerID": 1
            };

            chai.request(app)
                .post("/api/loan")
                .send(loan)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error");
                    res.body.error.should.have.property("errors");
                    res.body.error.errors.should.have.property("date");
                    res.body.error.errors.date.should.have.property("properties");
                    res.body.error.errors.date.properties.should.have.property("type").eql("required");
                    done();
                });
        });

        it("it should not create a loan without the loanAmount field", (done) => {
            const loan = {
                "token": token,
                "loanType": "Fix Deposit",
                "date": "04-03-1998",
                "duration": 12,
                "interest": 5,
                "customerID": 1
            };

            chai.request(app)
                .post("/api/loan")
                .send(loan)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error");
                    res.body.error.should.have.property("errors");
                    res.body.error.errors.should.have.property("loanAmount");
                    res.body.error.errors.loanAmount.should.have.property("properties");
                    res.body.error.errors.loanAmount.properties.should.have.property("type").eql("required");
                    done();
                });
        });

        it("it should not create a loan without the duration field", (done) => {
            const loan = {
                "token": token,
                "loanType": "Fix Deposit",
                "date": "04-03-1998",
                "loanAmount": 250000,
                "interest": 5,
                "customerID": 1
            };

            chai.request(app)
                .post("/api/loan")
                .send(loan)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error");
                    res.body.error.should.have.property("errors");
                    res.body.error.errors.should.have.property("duration");
                    res.body.error.errors.duration.should.have.property("properties");
                    res.body.error.errors.duration.properties.should.have.property("type").eql("required");
                    done();
                });
        });

        it("it should not create a loan without the interest field", (done) => {
            const loan = {
                "token": token,
                "loanType": "Fix Deposit",
                "date": "04-03-1998",
                "loanAmount": 250000,
                "duration": 12,
                "customerID": 1
            };

            chai.request(app)
                .post("/api/loan")
                .send(loan)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error");
                    res.body.error.should.have.property("errors");
                    res.body.error.errors.should.have.property("interest");
                    res.body.error.errors.interest.should.have.property("properties");
                    res.body.error.errors.interest.properties.should.have.property("type").eql("required");
                    done();
                });
        });

        it("it should not create a loan without the customerID field", (done) => {
            const loan = {
                "token": token,
                "loanType": "Fix Deposit",
                "date": "04-03-1998",
                "loanAmount": 250000,
                "duration": 12,
                "interest": 5
            };

            chai.request(app)
                .post("/api/loan")
                .send(loan)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error");
                    res.body.error.should.have.property("errors");
                    res.body.error.errors.should.have.property("customerID");
                    res.body.error.errors.customerID.should.have.property("properties");
                    res.body.error.errors.customerID.properties.should.have.property("type").eql("required");
                    done();
                });
        });

        it("it should create a loan", (done) => {
            const loan = {
                "token": token,
                "loanType": "Fix Deposit",
                "date": "04-03-1998",
                "loanAmount": 250000,
                "duration": 12,
                "interest": 5,
                "customerID": 1
            };

            chai.request(app)
                .post("/api/loan")
                .send(loan)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("status").eql("successfully saved");
                    res.body.should.have.property("result");
                    // Check for all fields
                    res.body.result.should.have.property("__v");
                    res.body.result.should.have.property("loanID").eql(1);
                    res.body.result.should.have.property("loanType");
                    res.body.result.should.have.property("date");
                    res.body.result.should.have.property("loanAmount");
                    res.body.result.should.have.property("duration");
                    res.body.result.should.have.property("interest");
                    res.body.result.should.have.property("customerID");
                    res.body.result.should.have.property("manager").eql("Not set");
                    res.body.result.should.have.property("status").eql("Pending");
                    res.body.result.should.have.property("_id");
                    done();
                });
        });
    });

    //Test the GET /api/loan/:loanID route
    describe("GET /api/loan/:loanID", () => {
        it("it should not get the loan without an authorization token", (done) => {
            chai.request(app)
                .get("/api/loan/1")
                .end((err, res) => {
                    res.should.have.status(401);
                    should.exist(res.body);
                    res.body.should.be.a("object");
                    res.body.should.have.property("success").eql(false);
                    res.body.should.have.property("message").eql("Unauthorised");
                    done();
                });
        });

        it("it should get the loan", (done) => {
            chai.request(app)
                .get("/api/loan/1")
                .set("x-access-token", token)
                .end((err, res) => {
                    res.should.have.status(200);
                    should.exist(res.body);
                    res.body.should.be.a("object");
                    res.body.should.have.property("__v");
                    res.body.should.have.property("loanID").eql(1);
                    res.body.should.have.property("loanType").eql("Fix Deposit");
                    res.body.should.have.property("date");
                    res.body.should.have.property("loanAmount").eql(250000);
                    res.body.should.have.property("duration").eql(12);
                    res.body.should.have.property("interest").eql(5);
                    res.body.should.have.property("customerID").eql(1);
                    res.body.should.have.property("manager").eql("Not set");
                    res.body.should.have.property("status").eql("Pending");
                    res.body.should.have.property("_id");
                    done();
                });
        });
    });

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
            };

            chai.request(app)
                .put("/api/loan/1")
                .send(loan)
                .end((err, res) => {
                    res.should.have.status(401);
                    should.exist(res.body);
                    res.body.should.be.a("object");
                    res.body.should.have.property("success").eql(false);
                    res.body.should.have.property("message").eql("Unauthorised");
                    done();
                });
        });

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
            };

            chai.request(app)
                .put("/api/loan/2")
                .set("x-access-token", token)
                .send(loan)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error").eql("Record does not exist");
                    done();
                });
        });

        it("it should not update the loan without the loan type", (done) => {
            const loan = {
                "date": "1998-04-02T18:30:00.000Z",
                "loanAmount": 250000,
                "duration": 12,
                "interest": 5,
                "customerID": 1,
                "status": "Approved",
                "manager": "Dineth"
            };

            chai.request(app)
                .put("/api/loan/1")
                .set("x-access-token", token)
                .send(loan)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error");
                    res.body.error.should.have.property("errors");
                    res.body.error.errors.should.have.property("loanType");
                    res.body.error.errors.loanType.should.have.property("properties");
                    res.body.error.errors.loanType.properties.should.have.property("type").eql("required");
                    done();
                });
        });

        it("it should not update the loan without the date", (done) => {
            const loan = {
                "loanType": "Fix Deposit",
                "loanAmount": 250000,
                "duration": 12,
                "interest": 5,
                "customerID": 1,
                "status": "Approved",
                "manager": "Dineth"
            };

            chai.request(app)
                .put("/api/loan/1")
                .set("x-access-token", token)
                .send(loan)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error");
                    res.body.error.should.have.property("errors");
                    res.body.error.errors.should.have.property("date");
                    res.body.error.errors.date.should.have.property("properties");
                    res.body.error.errors.date.properties.should.have.property("type").eql("required");
                    done();
                });
        });

        it("it should not update the loan without the loan amount", (done) => {
            const loan = {
                "loanType": "Fix Deposit",
                "date": "1998-04-02T18:30:00.000Z",
                "duration": 12,
                "interest": 5,
                "customerID": 1,
                "status": "Approved",
                "manager": "Dineth"
            };

            chai.request(app)
                .put("/api/loan/1")
                .set("x-access-token", token)
                .send(loan)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error");
                    res.body.error.should.have.property("errors");
                    res.body.error.errors.should.have.property("loanAmount");
                    res.body.error.errors.loanAmount.should.have.property("properties");
                    res.body.error.errors.loanAmount.properties.should.have.property("type").eql("required");
                    done();
                });
        });

        it("it should not update the loan without the duration", (done) => {
            const loan = {
                "loanType": "Fix Deposit",
                "date": "1998-04-02T18:30:00.000Z",
                "loanAmount": 250000,
                "interest": 5,
                "customerID": 1,
                "status": "Approved",
                "manager": "Dineth"
            };

            chai.request(app)
                .put("/api/loan/1")
                .set("x-access-token", token)
                .send(loan)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error");
                    res.body.error.should.have.property("errors");
                    res.body.error.errors.should.have.property("duration");
                    res.body.error.errors.duration.should.have.property("properties");
                    res.body.error.errors.duration.properties.should.have.property("type").eql("required");
                    done();
                });
        });

        it("it should not update the loan without the interest", (done) => {
            const loan = {
                "loanType": "Fix Deposit",
                "date": "1998-04-02T18:30:00.000Z",
                "loanAmount": 250000,
                "duration": 12,
                "customerID": 1,
                "status": "Approved",
                "manager": "Dineth"
            };

            chai.request(app)
                .put("/api/loan/1")
                .set("x-access-token", token)
                .send(loan)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error");
                    res.body.error.should.have.property("errors");
                    res.body.error.errors.should.have.property("interest");
                    res.body.error.errors.interest.should.have.property("properties");
                    res.body.error.errors.interest.properties.should.have.property("type").eql("required");
                    done();
                });
        });

        it("it should not update the loan without the customerID", (done) => {
            const loan = {
                "loanType": "Fix Deposit",
                "date": "1998-04-02T18:30:00.000Z",
                "loanAmount": 250000,
                "duration": 12,
                "interest": 5,
                "status": "Approved",
                "manager": "Dineth"
            };

            chai.request(app)
                .put("/api/loan/1")
                .set("x-access-token", token)
                .send(loan)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error");
                    res.body.error.should.have.property("errors");
                    res.body.error.errors.should.have.property("customerID");
                    res.body.error.errors.customerID.should.have.property("properties");
                    res.body.error.errors.customerID.properties.should.have.property("type").eql("required");
                    done();
                });
        });

        it("it should not update the loan without the status", (done) => {
            const loan = {
                "loanType": "Fix Deposit",
                "date": "1998-04-02T18:30:00.000Z",
                "loanAmount": 250000,
                "duration": 12,
                "interest": 5,
                "customerID": 1,
                "manager": "Dineth"
            };

            chai.request(app)
                .put("/api/loan/1")
                .set("x-access-token", token)
                .send(loan)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error");
                    res.body.error.should.have.property("errors");
                    res.body.error.errors.should.have.property("status");
                    res.body.error.errors.status.should.have.property("properties");
                    res.body.error.errors.status.properties.should.have.property("type").eql("required");
                    done();
                });
        });

        it("it should not update the loan without the manager", (done) => {
            const loan = {
                "loanType": "Fix Deposit",
                "date": "1998-04-02T18:30:00.000Z",
                "loanAmount": 250000,
                "duration": 12,
                "interest": 5,
                "customerID": 1,
                "status": "Approved"
            };

            chai.request(app)
                .put("/api/loan/1")
                .set("x-access-token", token)
                .send(loan)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error");
                    res.body.error.should.have.property("errors");
                    res.body.error.errors.should.have.property("manager");
                    res.body.error.errors.manager.should.have.property("properties");
                    res.body.error.errors.manager.properties.should.have.property("type").eql("required");
                    done();
                });
        });
    });
});