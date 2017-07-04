'use strict';

// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const app = require('../build/app.min');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = app.Server;
const Loan = app.Loan;
const User = app.User;
const should = chai.should();

chai.use(chaiHttp);

describe('Loan', () => {
    var token = null; // Store authentication token

    // Empty the database before each test
    before((done) => {
        Loan.remove({}, (err) => {
            done();
        });
    });

    // Reset the counter of loanID before running tests
    before((done) => {
        Loan.counterReset('loanID', (err) => {
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
            .post('/user')
            .send(user)
            .end((err, result) => {
                // Go through the properties one by one
                result.should.have.status(200);
                result.body.should.be.a('object');
                result.body.should.have.property('status').eql('successfully saved');
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
            .post('/authenticate')
            .send(user)
            .end((err, result) => {
                // Go through the properties one by one
                result.should.have.status(200);
                result.body.should.be.a('object');
                result.body.should.have.property('success').eql(true);
                token = result.body.token;
                done();
            });
    });

    // Test the GET /api/loan route
    describe('GET /api/loan', () => {
        it('it should not get all the loans without an authorization token', (done) => {
            chai.request(server)
                .get('/api/loan')
                .end((err, res) => {
                    res.should.have.status(403);
                    should.exist(res.body);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(false);
                    res.body.should.have.property('message').eql('No token provided.');
                    done();
                });
        });

        it('it should get all the loans', (done) => {
            chai.request(server)
                .get('/api/loan')
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    should.exist(res.body);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });

    // Test the POST /api/loan route
    describe('POST /api/loan', () => {
        it('it should not create a loan without an authorization token', (done) => {
            const loan = {
                "loanType": "Fix Deposit",
                "date": "04-03-1998",
                "loanAmount": 250000,
                "duration": 12,
                "interest": 5,
                "customerID": 1
            };
            
            chai.request(server)
                .post('/api/loan')
                .send(loan)
                .end((err, res) => {
                    res.should.have.status(403);
                    should.exist(res.body);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(false);
                    res.body.should.have.property('message').eql('No token provided.');
                    done();
                });
        });


        it('it should not create a loan without the loanType field', (done) => {
            const loan = {
                "token": token,
                "date": "04-03-1998",
                "loanAmount": 250000,
                "duration": 12,
                "interest": 5,
                "customerID": 1
            }

            chai.request(server)
                .post('/api/loan')
                .send(loan)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    res.body.error.should.have.property('errors');
                    res.body.error.errors.should.have.property('loanType');
                    res.body.error.errors.loanType.should.have.property('properties');
                    res.body.error.errors.loanType.properties.should.have.property('type').eql('required');
                    done();
                });
        });

        it('it should not create a loan without the date field', (done) => {
            const loan = {
                "token": token,
                "loanType": "Fix Deposit",
                "loanAmount": 250000,
                "duration": 12,
                "interest": 5,
                "customerID": 1
            }

            chai.request(server)
                .post('/api/loan')
                .send(loan)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    res.body.error.should.have.property('errors');
                    res.body.error.errors.should.have.property('date');
                    res.body.error.errors.date.should.have.property('properties');
                    res.body.error.errors.date.properties.should.have.property('type').eql('required');
                    done();
                });
        });

        it('it should not create a loan without the loanAmount field', (done) => {
            const loan = {
                "token": token,
                "loanType": "Fix Deposit",
                "date": "04-03-1998",
                "duration": 12,
                "interest": 5,
                "customerID": 1
            }

            chai.request(server)
                .post('/api/loan')
                .send(loan)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    res.body.error.should.have.property('errors');
                    res.body.error.errors.should.have.property('loanAmount');
                    res.body.error.errors.loanAmount.should.have.property('properties');
                    res.body.error.errors.loanAmount.properties.should.have.property('type').eql('required');
                    done();
                });
        });

        it('it should not create a loan without the duration field', (done) => {
            const loan = {
                "token": token,
                "loanType": "Fix Deposit",
                "date": "04-03-1998",
                "loanAmount": 250000,
                "interest": 5,
                "customerID": 1
            }

            chai.request(server)
                .post('/api/loan')
                .send(loan)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    res.body.error.should.have.property('errors');
                    res.body.error.errors.should.have.property('duration');
                    res.body.error.errors.duration.should.have.property('properties');
                    res.body.error.errors.duration.properties.should.have.property('type').eql('required');
                    done();
                });
        });

        it('it should not create a loan without the interest field', (done) => {
            const loan = {
                "token": token,
                "loanType": "Fix Deposit",
                "date": "04-03-1998",
                "loanAmount": 250000,
                "duration": 12,
                "customerID": 1
            }

            chai.request(server)
                .post('/api/loan')
                .send(loan)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    res.body.error.should.have.property('errors');
                    res.body.error.errors.should.have.property('interest');
                    res.body.error.errors.interest.should.have.property('properties');
                    res.body.error.errors.interest.properties.should.have.property('type').eql('required');
                    done();
                });
        });

        it('it should not create a loan without the customerID field', (done) => {
            const loan = {
                "token": token,
                "loanType": "Fix Deposit",
                "date": "04-03-1998",
                "loanAmount": 250000,
                "duration": 12,
                "interest": 5
            }

            chai.request(server)
                .post('/api/loan')
                .send(loan)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    res.body.error.should.have.property('errors');
                    res.body.error.errors.should.have.property('customerID');
                    res.body.error.errors.customerID.should.have.property('properties');
                    res.body.error.errors.customerID.properties.should.have.property('type').eql('required');
                    done();
                });
        });

        it('it should create a loan', (done) => {
            const loan = {
                "token": token,
                "loanType": "Fix Deposit",
                "date": "04-03-1998",
                "loanAmount": 250000,
                "duration": 12,
                "interest": 5,
                "customerID": 1
            };

            chai.request(server)
                .post('/api/loan')
                .send(loan)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql('successfully saved');
                    res.body.should.have.property('result');
                    // Check for all fields
                    res.body.result.should.have.property('__v');
                    res.body.result.should.have.property('loanID').eql(1);
                    res.body.result.should.have.property('loanType');
                    res.body.result.should.have.property('date');
                    res.body.result.should.have.property('loanAmount');
                    res.body.result.should.have.property('duration');
                    res.body.result.should.have.property('interest');
                    res.body.result.should.have.property('customerID');
                    res.body.result.should.have.property('manager').eql('Not set');
                    res.body.result.should.have.property('status').eql('Pending');
                    res.body.result.should.have.property('_id');
                    done();
                })
        });
    });

    //Test the GET /api/loan/:loanID route
    describe('GET /api/loan/:loanID', () => {
        it('it should not get the loan without an authorization token', (done) => {
            chai.request(server)
                .get('/api/loan/1')
                .end((err, res) => {
                    res.should.have.status(403);
                    should.exist(res.body);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(false);
                    res.body.should.have.property('message').eql('No token provided.');
                    done();
                });
        });
        
        it('it should get the loan', (done) => {
            chai.request(server)
                .get('/api/loan/1')
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    should.exist(res.body);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });

    /*//test loan approval route
    describe('PUT /loanApproval', () => {
        it('it should give approval to loans', (done) => {
            const loan = new Loan({
                loanID: 1,
                manager: 'John Doe',
                status: 'Approve'
            });

            loan.save((err, loan) => {
                chai.request(server)
                    .put('/loanApproval')
                    .send(loan)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('result');
                        res.body.result.should.have.property('loanID').eql(1);
                        res.body.result.should.have.property('manager');
                        res.body.result.should.have.property('status');
                        done();
                    });
            });
        });
    });*/

});