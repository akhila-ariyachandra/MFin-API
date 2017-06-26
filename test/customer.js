'use strict';

// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const app = require('../build/app.min');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = app.app;
const Customer = app.Customer;
const should = chai.should();

chai.use(chaiHttp);

describe('Customers', () => {
    // Empty the database before each test
    before((done) => {
        Customer.remove({}, (err) => {
            done();
        });
    });

    // Reset the counter of customerID before running tests
    before((done) => {
        Customer.counterReset('customerID', (err) => {
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
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });

    // Test the /createCustomers route
    describe('POST /createCustomer', () => {
        it('it should not create a customer without the name field', (done) => {
            const customer = {
                surname: 'Doe',
                nic: '801234567V',
                address: '123/X Baker St., Narnia',
                dob: '01-01-1980',
                phone: '123456789',
                area: '59114c08494ebe30537ce7a5',
                longitude: "6°54'52.8 N",
                latitude: "79°58'24.1 E"
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
                name: 'John',
                nic: '801234567V',
                address: '123/X Baker St., Narnia',
                dob: '01-01-1980',
                phone: '123456789',
                area: '59114c08494ebe30537ce7a5',
                longitude: "6°54'52.8 N",
                latitude: "79°58'24.1 E"
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

        it('it should not create a customer without the nic field', (done) => {
            const customer = {
                name: 'John',
                surname: 'Doe',
                address: '123/X Baker St., Narnia',
                dob: '01-01-1980',
                phone: '123456789',
                area: '59114c08494ebe30537ce7a5',
                longitude: "6°54'52.8 N",
                latitude: "79°58'24.1 E"
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
                    res.body.error.errors.should.have.property('nic');
                    res.body.error.errors.nic.should.have.property('properties');
                    res.body.error.errors.nic.properties.should.have.property('type').eql('required');
                    done();
                });
        });

        it('it should not create a customer without the address field', (done) => {
            const customer = {
                name: 'John',
                surname: 'Doe',
                nic: '801234567V',
                dob: '01-01-1980',
                phone: '123456789',
                area: '59114c08494ebe30537ce7a5',
                longitude: "6°54'52.8 N",
                latitude: "79°58'24.1 E"
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
                    res.body.error.errors.should.have.property('address');
                    res.body.error.errors.address.should.have.property('properties');
                    res.body.error.errors.address.properties.should.have.property('type').eql('required');
                    done();
                });
        });

        it('it should not create a customer without the DOB field', (done) => {
            const customer = {
                name: 'John',
                surname: 'Doe',
                nic: '801234567V',
                address: '123/X Baker St., Narnia',
                phone: '123456789',
                area: '59114c08494ebe30537ce7a5',
                longitude: "6°54'52.8 N",
                latitude: "79°58'24.1 E"
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
                name: 'John',
                surname: 'Doe',
                nic: '801234567V',
                address: '123/X Baker St., Narnia',
                dob: '01-01-1980',
                area: '59114c08494ebe30537ce7a5',
                longitude: "6°54'52.8 N",
                latitude: "79°58'24.1 E"
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
                name: 'John',
                surname: 'Doe',
                nic: '801234567V',
                address: '123/X Baker St., Narnia',
                dob: '01-01-1980',
                phone: '123456789',
                area: '59114c08494ebe30537ce7a5',
                latitude: "79°58'24.1 E"
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
                name: 'John',
                surname: 'Doe',
                nic: '801234567V',
                address: '123/X Baker St., Narnia',
                dob: '01-01-1980',
                phone: '123456789',
                area: '59114c08494ebe30537ce7a5',
                longitude: "6°54'52.8 N"
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
                name: 'John',
                surname: 'Doe',
                nic: '801234567V',
                address: '123/X Baker St., Narnia',
                dob: '01-01-1980',
                phone: '123456789',
                area: '59114c08494ebe30537ce7a5',
                longitude: "6°54'52.8 N",
                latitude: "79°58'24.1 E"
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
                    res.body.result.should.have.property('customerID').eql(1);
                    res.body.result.should.have.property('name');
                    res.body.result.should.have.property('surname');
                    res.body.result.should.have.property('nic');
                    res.body.result.should.have.property('address');
                    res.body.result.should.have.property('dob');
                    res.body.result.should.have.property('phone');
                    res.body.result.should.have.property('area');
                    res.body.result.should.have.property('longitude');
                    res.body.result.should.have.property('latitude');
                    res.body.result.should.have.property('_id');
                    done();
                });
        });

        it('it should create the 2nd customer with customerID 2', (done) => {
            const customer = {
                name: 'Jane',
                surname: 'Doe',
                nic: '801234567V',
                address: '123/X Baker St., Narnia',
                dob: '01-01-1980',
                phone: '123456789',
                area: '59114c08494ebe30537ce7a5',
                longitude: "6°54'52.8 N",
                latitude: "79°58'24.1 E"
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
                    res.body.result.should.have.property('customerID').eql(2);
                    res.body.result.should.have.property('name');
                    res.body.result.should.have.property('surname');
                    res.body.result.should.have.property('nic');
                    res.body.result.should.have.property('address');
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

    // Test the /getCustomer/:customerID route
    describe('GET /getCustomer/:customerID', () => {
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

    // Test the /updateCustomer route
    describe('PUT /updateCustomer', () => {
        it('it should not update the customer if the wrong customerID is given', (done) => {
            const customer = new Customer({
                customerID: 3,
                name: 'John',
                surname: 'Doe',
                nic: '801234567V',
                address: '123/X Baker St., Narnia',
                dob: '01-02-1980',
                phone: '123456789',
                area: '59114c08494ebe30537ce7a5',
                longitude: "6°54'52.8 N",
                latitude: "79°58'24.1 E"
            });

            customer.save((err, customer) => {
                chai.request(server)
                    .put('/updateCustomer')
                    .send(customer)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('error').eql('Record does not exist');
                        done();
                    });
            });
        });

        it('it should update the customer given the customerID', (done) => {
            const customer = new Customer({
                customerID: 1,
                name: 'John',
                surname: 'Doe',
                nic: '801234567V',
                address: '123/X Baker St., Narnia',
                dob: '01-02-1980',
                phone: '123456789',
                area: '59114c08494ebe30537ce7a5',
                longitude: "6°54'52.8 N",
                latitude: "79°58'24.1 E"
            });

            customer.save((err, customer) => {
                chai.request(server)
                    .put('/updateCustomer')
                    .send(customer)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('result');
                        // Check for all fields
                        res.body.result.should.have.property('_id');
                        res.body.result.should.have.property('customerID').eql(1);
                        res.body.result.should.have.property('name');
                        res.body.result.should.have.property('surname');
                        res.body.result.should.have.property('nic');
                        res.body.result.should.have.property('address');
                        res.body.result.should.have.property('dob');
                        res.body.result.should.have.property('phone');
                        res.body.result.should.have.property('area');
                        res.body.result.should.have.property('longitude');
                        res.body.result.should.have.property('latitude');
                        res.body.result.should.have.property('__v');
                        done();
                    });
            });
        });
    });
});