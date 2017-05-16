'use strict';

const mongoose = require('mongoose');
const Customer = require('../src/models/customerSchema');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/app');
const should = chai.should();

chai.use(chaiHttp);

describe('Customers', () => {
    // Test the /getCustomers route
    describe('GET /getCustomers', () => {
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
    
    // Test the /createCustomers route
    describe('POST /createCustomer', () => {
        it('it should not create a customer without the surname field', (done) => {
            const customer = {
                id : 2,
                name : 'John',
                dob : '01-01-1980',
                phone : '123456789',
                area : '59114c08494ebe30537ce7a5' 
            }

            chai.request(server)
                .post('/createCustomer')
                .send(customer)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    res.body.error.should.have.property('errors');
                    res.body.error.errors.should.have.property('surname');
                    res.body.error.errors.surname.should.have.property('properties');
                    res.body.error.errors.surname.properties.should.have.property('type').eql('required');
                    done();
                });
        });
        
        it('it should not create a customer without the DOB field', (done) => {
            const customer = {
                id : 2,
                name : 'John',
                surname : 'Doe',
                phone : '123456789',
                area : '59114c08494ebe30537ce7a5' 
            }

            chai.request(server)
                .post('/createCustomer')
                .send(customer)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    res.body.error.should.have.property('errors');
                    res.body.error.errors.should.have.property('dob');
                    res.body.error.errors.dob.should.have.property('properties');
                    res.body.error.errors.dob.properties.should.have.property('type').eql('required');
                    done();
                });
        });

        it('it should create a customer', (done) => {
            const customer = {
                id : 2,
                name : 'John',
                surname : 'Doe',
                dob : '01-01-1980',
                phone : '123456789',
                area : '59114c08494ebe30537ce7a5' 
            }

            chai.request(server)
                .post('/createCustomer')
                .send(customer)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql('successfully saved');
                    res.body.should.have.property('result');
                    // Check for all fields
                    res.body.result.should.have.property('__v');
                    res.body.result.should.have.property('id');
                    res.body.result.should.have.property('name');
                    res.body.result.should.have.property('surname');
                    res.body.result.should.have.property('dob');
                    res.body.result.should.have.property('phone');
                    res.body.result.should.have.property('area');
                    res.body.result.should.have.property('_id');
                    done();
                });
        });
    });
});