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
    beforeEach((done) => { 
        Loan.remove({}, (err) => { 
           done();         
        });     
    });

      // Test the /createLoan route
    describe('POST /createLoan', () => {
        it('it should not create a loan without the loanType field', (done) => {
            const loan = {
                date : '04-03-1998',
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
                    res.body.error.errors.should.have.property('loanType');
                    res.body.error.errors.loanType.should.have.property('properties');
                    res.body.error.errors.loanType.properties.should.have.property('type').eql('required');
                    done();
                });
        });
    });


});
