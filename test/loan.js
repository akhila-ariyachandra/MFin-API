'use strict';

// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const Loan = require('../src/models/loanSchema');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/app');
const should = chai.should();

chai.use(chaiHttp);

describe('Loan',() =>{
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

    // Test the /getLoans route
    describe('GET /getLoans', () => {
        it('it should GET all the loans', (done) => {
            chai.request(server)
                .get('/getLoans')
                .end((err, res) => {
                    res.should.have.status(200);
                    should.exist(res.body);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
            });
        });
    });

    // Test the /createLoan route
    describe('POST /createLoan', () => {
  
        it('it should not create a loan without the loanType field', (done) => {
            const loan = {
                date: '04-03-1998',
                loanAmount : '250000',
                duration : '12',
                interest : '5',
                customerID : 1 
            }

            chai.request(server)
                .post('/createLoan')
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
                loanType: 'Fix Deposit',
                loanAmount : '250000',
                duration : '12',
                interest : '5',
                customerID : 1 
            }

            chai.request(server)
                .post('/createLoan')
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
                loanType: 'Fix Deposit',
                date: '04-03-1998', 
                duration : '12',
                interest : '5',
                customerID : 1 
            }

            chai.request(server)
                .post('/createLoan')
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
                loanType: 'Fix Deposit',
                date: '04-03-1998', 
                loanAmount : '250000',
                interest : '5',
                customerID : 1 
            }

            chai.request(server)
                .post('/createLoan')
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
                loanType: 'Fix Deposit',
                date: '04-03-1998', 
                loanAmount : '250000',
                duration : '12',
                customerID : 1 
            }

            chai.request(server)
                .post('/createLoan')
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
                loanType: 'Fix Deposit',
                date: '04-03-1998', 
                loanAmount : '250000',
                duration : '12',
                interest : '5'
            }

            chai.request(server)
                .post('/createLoan')
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
                loanType: 'Fix Deposit',
                date: '04-03-1998',
                loanAmount: 250000,
                duration: 12,
                interest: 5,
                customerID: 1
            };

            chai.request(server)
                .post('/createLoan')
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

    //Test the /getLoan/:loanID route
    describe('GET /getLoan/:loanID', () => {
        it('it should GET the loan', (done) => {
            chai.request(server)
                .get('/getLoan/1')
                .end((err, res) => {
                    res.should.have.status(200);
                    should.exist(res.body);
                    res.body.should.be.a('object');
                    done();
            });
        });
    });

    //test loan approval route
    describe('PUT /loanApproval', () => {
        it('it should give approval to loans', (done) => {
            const loan = new Loan({ loanID : 1,
                                    manager : 'John Doe',
                                    status : 'Approve'});

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
    });

});