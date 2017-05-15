'use strict';

const mongoose = require('mongoose');
const Customer = require('../src/models/customerSchema');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/app');
const should = chai.should();

chai.use(chaiHttp);

describe('Customers', () => {
    describe('/getCustomers', () => {
        it('it should GET all the customers', (done) => {
            chai.request(server)
                .get('/getCustomers')
                .end((err, res) => {
                    res.should.have.status(200);
                    should.exist(res.body);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });
});