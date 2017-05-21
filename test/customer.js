'use strict';

// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const Customer = require('../src/models/customerSchema');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/app');
const should = chai.should();

chai.use(chaiHttp);

describe('Customers', () => {
    // Empty the database before each test
    beforeEach((done) => { 
        Customer.remove({}, (err) => { 
           done();         
        });     
    });
    
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
        it('it should not create a customer without the name field', (done) => {
            const customer = {
                id : 1,
                surname : 'Doe',
                dob : '01-01-1980',
                phone : '123456789',
                area : '59114c08494ebe30537ce7a5',
                longitude : "6°54'52.8 N",
                latitude : "79°58'24.1 E" 
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
                    res.body.error.errors.should.have.property('name');
                    res.body.error.errors.name.should.have.property('properties');
                    res.body.error.errors.name.properties.should.have.property('type').eql('required');
                    done();
                });
        });
        
        it('it should not create a customer without the surname field', (done) => {
            const customer = {
                id : 1,
                name : 'John',
                dob : '01-01-1980',
                phone : '123456789',
                area : '59114c08494ebe30537ce7a5',
                longitude : "6°54'52.8 N",
                latitude : "79°58'24.1 E" 
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
                id : 1,
                name : 'John',
                surname : 'Doe',
                phone : '123456789',
                area : '59114c08494ebe30537ce7a5',
                longitude : "6°54'52.8 N",
                latitude : "79°58'24.1 E"  
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

        it('it should not create a customer without the phone field', (done) => {
            const customer = {
                id : 1,
                name : 'John',
                surname : 'Doe',
                dob : '01-01-1980',
                area : '59114c08494ebe30537ce7a5',
                longitude : "6°54'52.8 N",
                latitude : "79°58'24.1 E"  
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
                    res.body.error.errors.should.have.property('phone');
                    res.body.error.errors.phone.should.have.property('properties');
                    res.body.error.errors.phone.properties.should.have.property('type').eql('required');
                    done();
                });
        });

        it('it should not create a customer without the longitude field', (done) => {
            const customer = {
                id : 1,
                name : 'John',
                surname : 'Doe',
                dob : '01-01-1980',
                phone : '123456789',
                area : '59114c08494ebe30537ce7a5',
                latitude : "79°58'24.1 E"  
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
                    res.body.error.errors.should.have.property('longitude');
                    res.body.error.errors.longitude.should.have.property('properties');
                    res.body.error.errors.longitude.properties.should.have.property('type').eql('required');
                    done();
                });
        });

        it('it should not create a customer without the latitude field', (done) => {
            const customer = {
                id : 1,
                name : 'John',
                surname : 'Doe',
                dob : '01-01-1980',
                phone : '123456789',
                area : '59114c08494ebe30537ce7a5',
                longitude : "6°54'52.8 N"  
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
                    res.body.error.errors.should.have.property('latitude');
                    res.body.error.errors.latitude.should.have.property('properties');
                    res.body.error.errors.latitude.properties.should.have.property('type').eql('required');
                    done();
                });
        });

        it('it should create a customer', (done) => {
            const customer = {
                id : 1,
                name : 'John',
                surname : 'Doe',
                dob : '01-01-1980',
                phone : '123456789',
                area : '59114c08494ebe30537ce7a5',
                longitude : "6°54'52.8 N",
                latitude : "79°58'24.1 E"  
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
                    res.body.result.should.have.property('longitude');
                    res.body.result.should.have.property('latitude');
                    res.body.result.should.have.property('_id');
                    done();
                });
        });
    });

    // Test the /getCustomer/<id> route
    describe('GET /getCustomer/<id>', () => {
        it('it should GET the customer', (done) => {
            chai.request(server)
                .get('/getCustomer/1')
                .end((err, res) => {
                    res.should.have.status(200);
                    should.exist(res.body);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });
});