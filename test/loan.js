'use strict';

// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
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

    // Test the /createLoan route
    describe('POST /createLoan', () => {
  
    it('it should not create a loan without the date field', (done) => {
            const loan = {
                loanType: 'Fix Deposit',
                loanAmount : '250000',
                duration : '12',
                interest : '5',
                customer : 1 
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
                customer : 1 
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
                customer : 1 
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
                customer : 1 
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
        it('it should not create a loan without the customer field', (done) => {
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
                    res.body.error.errors.should.have.property('customer');
                    res.body.error.errors.customer.should.have.property('properties');
                    res.body.error.errors.customer.properties.should.have.property('type').eql('required');
                    done();
                });
        });
    });

      //Test the /getLoan /<id> route
        describe('GET /getLoan/<id>', () => {

            it('it should GET the loan', (done) => {

                    chai.request(server)
                        .get('/getLoan/5927f1d52d0c201f6cf58be4')
                        .end((err, res) => {

                            res.should.have.status(200);
                            should.exist(res.body);
                            res.body.should.be.a('object');
                            done();

                        });

            });

        });

        //test loan approval route

    describe('PUT /loan_aproval', () => {

        it('it should give approval to loans', (done) => {
            const loan = new Loan({id : 1,
                                    manager : 'Dineth Lahiru',
                                status : 'Approve'});

                loan.save((err, loan) => {
                    chai.request(server)
                        .put('/loan_aproval')
                        .send(loan)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('result');

                            res.body.result.should.have.property('id').eql(1);
                            res.body.result.should.have.property('manager');
                            res.body.result.should.have.property('status');
                            done();
                        });
                });
        });

    });


 });
