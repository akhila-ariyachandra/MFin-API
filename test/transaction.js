"use strict";

const app = require("../build/app.min");

const chai = require("chai");
const chaiHttp = require("chai-http");
const server = app.Server;
const Transaction = app.Transaction;
const User = app.User;
const should = chai.should();

chai.use(chaiHttp);

describe("Transactions", () => {
var token = null; // Store authentication token

    // Empty the database before each test
    before((done) => {
        Transaction.remove({}, (err) => {
            done();
        });
    });

    // Reset the counter of customerID before running tests
    before((done) => {
        Transaction.counterReset("transactionID", (err) => {
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

    // Test the  GET /api/transaction route
    describe("GET /api/transaction", () => {
        it("it should not get all the transactions without an authorization token", (done) => {
            chai.request(server)
                .get("/api/transaction")
                .end((err, res) => {
                    res.should.have.status(401);
                    should.exist(res.body);
                    res.body.should.be.a("object");
                    res.body.should.have.property("success").eql(false);
                    res.body.should.have.property("message").eql("Unauthorised");
                    done();
                });
        });

        it("it should get all the transactions", (done) => {
            chai.request(server)
                .get("/api/transaction")
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

    // Test the POST /api/transaction route
    describe("POST /api/transaction", () => {
        it("it should not create a transaction without an authorization token", (done) => {
            const transaction = {
                "loanID": 1,
                "amount": 10000,
                "cashCollectorID": 1,
                "status": "unpaid"
            };

            chai.request(server)
                .post("/api/transaction")
                .send(transaction)
                .end((err, res) => {
                    res.should.have.status(401);
                    should.exist(res.body);
                    res.body.should.be.a("object");
                    res.body.should.have.property("success").eql(false);
                    res.body.should.have.property("message").eql("Unauthorised");
                    done();
                });
        });

        it("it should not create a transaction without the loanID field", (done) => {
            const transaction = {
                "amount": 10000,
                "cashCollectorID": 1,
                "status": "unpaid"
            };

            chai.request(server)
                .post("/api/transaction")
                .set("x-access-token", token)
                .send(transaction)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error");
                    res.body.error.should.have.property("errors");
                    res.body.error.errors.should.have.property("loanID");
                    res.body.error.errors.loanID.should.have.property("properties");
                    res.body.error.errors.loanID.properties.should.have.property("type").eql("required");
                    done();
                });
        });

        it("it should not create a transaction without the amount field", (done) => {
            const transaction = {
                "loanID": 1,
                "cashCollectorID": 1,
                "status": "unpaid"
            };

            chai.request(server)
                .post("/api/transaction")
                .set("x-access-token", token)
                .send(transaction)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error");
                    res.body.error.should.have.property("errors");
                    res.body.error.errors.should.have.property("amount");
                    res.body.error.errors.amount.should.have.property("properties");
                    res.body.error.errors.amount.properties.should.have.property("type").eql("required");
                    done();
                });
        });

        it("it should not create a transaction without the cashCollectorID field", (done) => {
            const transaction = {
                "loanID": 1,
                "amount": 10000,
                "status": "unpaid"
            };

            chai.request(server)
                .post("/api/transaction")
                .set("x-access-token", token)
                .send(transaction)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error");
                    res.body.error.should.have.property("errors");
                    res.body.error.errors.should.have.property("cashCollectorID");
                    res.body.error.errors.cashCollectorID.should.have.property("properties");
                    res.body.error.errors.cashCollectorID.properties.should.have.property("type").eql("required");
                    done();
                });
        });

        it("it should create a transaction", (done) => {
            const transaction = {
                "loanID": 1,
                "amount": 10000,
                "cashCollectorID": 1,
                "status": "unpaid"
            };

            chai.request(server)
                .post("/api/transaction")
                .set("x-access-token", token)
                .send(transaction)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("status").eql("successfully saved");
                    res.body.should.have.property("result");
                    // Check for all fields
                    res.body.result.should.have.property("__v");
                    res.body.result.should.have.property("transactionID").eql(1);
                    res.body.result.should.have.property("loanID").eql(1);
                    res.body.result.should.have.property("date");
                    res.body.result.should.have.property("amount").eql(10000);                    
                    res.body.result.should.have.property("cashCollectorID").eql(1);
                    res.body.result.should.have.property("status").eql("unpaid");
                    res.body.result.should.have.property("_id");
                    done();
                });
        });

        it("it should create the 2nd transaction with transactionID 2", (done) => {
            const transaction = {
                "loanID": 2,
                "amount": 10000,
                "cashCollectorID": 1,
                "status": "unpaid"
            };

            chai.request(server)
                .post("/api/transaction")
                .set("x-access-token", token)
                .send(transaction)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("status").eql("successfully saved");
                    res.body.should.have.property("result");
                    // Check for all fields
                    res.body.result.should.have.property("__v");
                    res.body.result.should.have.property("transactionID").eql(2);
                    res.body.result.should.have.property("loanID").eql(2);
                    res.body.result.should.have.property("date");
                    res.body.result.should.have.property("amount").eql(10000);                    
                    res.body.result.should.have.property("cashCollectorID").eql(1);
                    res.body.result.should.have.property("status").eql("unpaid");
                    res.body.result.should.have.property("_id");
                    done();
                });
        });
    });

    // Test the GET /api/transaction/:transactionID route
    describe("GET /api/transaction/:transactionID", () => {
        it("it should not get the transaction without an authorization token", (done) => {
            chai.request(server)
                .get("/api/transaction/1")
                .end((err, res) => {
                    res.should.have.status(401);
                    should.exist(res.body);
                    res.body.should.be.a("object");
                    res.body.should.have.property("success").eql(false);
                    res.body.should.have.property("message").eql("Unauthorised");
                    done();
                });
        });

        it("it should get the transaction", (done) => {
            chai.request(server)
                .get("/api/transaction/1")
                .set("x-access-token", token)
                .end((err, res) => {
                    res.should.have.status(200);
                    should.exist(res.body);
                    res.body.should.be.a("object");
                    done();
                });
        });
    });

    // Test the PUT /api/transaction/:transactionID route
    describe("PUT /api/transaction/:transactionID", () => {
        it("it should not update the transaction without an authorization token", (done) => {
            const transaction = {
                "loanID": 2,
                "date": new Date(),
                "amount": 10000,
                "cashCollectorID": 1,
                "status": "unpaid"
            };

            chai.request(server)
                .put("/api/transaction/1")
                .end((err, res) => {
                    res.should.have.status(401);
                    should.exist(res.body);
                    res.body.should.be.a("object");
                    res.body.should.have.property("success").eql(false);
                    res.body.should.have.property("message").eql("Unauthorised");
                    done();
                });
        });

        it("it should not update the transaction if the wrong transactionID is given", (done) => {
            const transaction = {
                "loanID": 2,
                "date": new Date(),
                "amount": 10000,
                "cashCollectorID": 1,
                "status": "unpaid"
            };

            chai.request(server)
                .put("/api/transaction/3")
                .set("x-access-token", token)
                .send(transaction)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error").eql("Record does not exist");
                    done();
                });
        });

        it("it should not update the transaction without the loanID field", (done) => {
            const transaction = {
                "date": new Date(),
                "amount": 10000,
                "cashCollectorID": 1,
                "status": "unpaid"
            };

            chai.request(server)
                .put("/api/transaction/1")
                .set("x-access-token", token)
                .send(transaction)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error");
                    res.body.error.should.have.property("errors");
                    res.body.error.errors.should.have.property("loanID");
                    res.body.error.errors.loanID.should.have.property("properties");
                    res.body.error.errors.loanID.properties.should.have.property("type").eql("required");
                    done();
                });
        });

        it("it should not update the transaction without the date field", (done) => {
            const transaction = {
                "loanID": 2,
                "amount": 10000,
                "cashCollectorID": 1,
                "status": "unpaid"
            };

            chai.request(server)
                .put("/api/transaction/1")
                .set("x-access-token", token)
                .send(transaction)
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

        it("it should not update the transaction without the amount field", (done) => {
            const transaction = {
                "loanID": 2,
                "date": new Date(),
                "cashCollectorID": 1,
                "status": "unpaid"
            };

            chai.request(server)
                .put("/api/transaction/1")
                .set("x-access-token", token)
                .send(transaction)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error");
                    res.body.error.should.have.property("errors");
                    res.body.error.errors.should.have.property("amount");
                    res.body.error.errors.amount.should.have.property("properties");
                    res.body.error.errors.amount.properties.should.have.property("type").eql("required");
                    done();
                });
        });

        it("it should not update the transaction without the cashCollectorID field", (done) => {
            const transaction = {
                "loanID": 2,
                "date": new Date(),
                "amount": 10000,
                "status": "unpaid"
            };

            chai.request(server)
                .put("/api/transaction/1")
                .set("x-access-token", token)
                .send(transaction)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("error");
                    res.body.error.should.have.property("errors");
                    res.body.error.errors.should.have.property("cashCollectorID");
                    res.body.error.errors.cashCollectorID.should.have.property("properties");
                    res.body.error.errors.cashCollectorID.properties.should.have.property("type").eql("required");
                    done();
                });
        });

        it("it should not update the transaction without the status field", (done) => {
            const transaction = {
                "loanID": 2,
                "date": new Date(),
                "amount": 10000,
                "cashCollectorID": 1
            };

            chai.request(server)
                .put("/api/transaction/1")
                .set("x-access-token", token)
                .send(transaction)
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

        it("it should update the transaction given the transactionID", (done) => {
            const transaction = {
                "loanID": 2,
                "date": new Date(),
                "amount": 10000,
                "cashCollectorID": 1,
                "status": "unpaid"
            };

            chai.request(server)
                .put("/api/transaction/1")
                .set("x-access-token", token)
                .send(transaction)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("object");
                    res.body.should.have.property("result");
                    // Check for all fields
                    res.body.result.should.have.property("_id");
                    res.body.result.should.have.property("transactionID").eql(1);
                    res.body.result.should.have.property("loanID").eql(2);
                    res.body.result.should.have.property("date");
                    res.body.result.should.have.property("amount").eql(10000);
                    res.body.result.should.have.property("cashCollectorID").eql(1);
                    res.body.result.should.have.property("status").eql("unpaid");
                    res.body.result.should.have.property("__v");
                    done();
                });
        });
    });
});