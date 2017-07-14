'use strict';

// During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const app = require('../build/app.min');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = app.Server;
const User = app.User;
const should = chai.should();

chai.use(chaiHttp);

describe('Users', () => {
    var token = null; // Store authentication token

    // Empty the database before each test
    before((done) => {
        User.remove({}, (err) => {
            done();
        });
    });

    // Test the POST /user route
    describe('POST /user', () => {
        it('it should not create a user without the username field', (done) => {
            const user = {
                "password": "sliit123"
            };

            chai.request(server)
                .post('/user')
                .send(user)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    res.body.error.should.have.property('errors');
                    res.body.error.errors.should.have.property('username');
                    res.body.error.errors.username.should.have.property('properties');
                    res.body.error.errors.username.properties.should.have.property('type').eql('required');
                    done();
                });
        });

        it('it should not create a user without the password field', (done) => {
            const user = {
                "username": "mfindev"
            };

            chai.request(server)
                .post('/user')
                .send(user)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error').eql('password is required');
                    done();
                });
        });

        it('it should create a new user', (done) => {
            const user = {
                "username": "mfindev",
                "password": "mfindev"
            };

            chai.request(server)
                .post('/user')
                .send(user)
                .end((err, res) => {
                    // Go through the properties one by one
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('status').eql('successfully saved');
                    res.body.should.have.property('result');
                    // Check for all fields
                    res.body.result.should.have.property('__v');
                    res.body.result.should.have.property('username').eql('mfindev');
                    res.body.result.should.have.property('password');
                    res.body.result.should.have.property('_id');
                    res.body.result.should.have.property('admin');
                    done();
                });
        });
    });

    // Test the POST /authenticate route
    describe('POST /authenticate', () => {
        it('it should not authenticate without the username field entered', (done) => {
            const user = {
                "password": "mfindev"
            };

            chai.request(server)
                .post('/authenticate')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(false);
                    res.body.should.have.property('message').eql('Authentication failed. User not found.');
                    done();
                });
        });

        it('it should not authenticate without the password field entered', (done) => {
            const user = {
                "username": "mfindev"
            };

            chai.request(server)
                .post('/authenticate')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(false);
                    res.body.should.have.property('message').eql('Authentication failed. No password given.');
                    done();
                });
        });

        it('it should not authenticate without the correct username', (done) => {
            const user = {
                "username": "mfindev1",
                "password": "mfindev"
            };

            chai.request(server)
                .post('/authenticate')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(false);
                    res.body.should.have.property('message').eql('Authentication failed. User not found.');
                    done();
                });
        });

        it('it should not authenticate without the correct password', (done) => {
            const user = {
                "username": "mfindev",
                "password": "mfindev1"
            };

            chai.request(server)
                .post('/authenticate')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(false);
                    res.body.should.have.property('message').eql('Authentication failed. Wrong password.');
                    done();
                });
        });

        it('it should authenticate successfully with the correct username and password', (done) => {
            const user = {
                "username": "mfindev",
                "password": "mfindev"
            };

            chai.request(server)
                .post('/authenticate')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(true);
                    res.body.should.have.property('message').eql('Authentication success.');
                    res.body.should.have.property('token');
                    token = res.body.token;
                    done();
                });
        });
    });

    // Test the GET /api/user route
    describe('GET /api/user', (done) => {
        it('it should not get all the users without an authorization token', (done) => {
            chai.request(server)
                .get('/api/user')
                .end((err, res) => {
                    res.should.have.status(401);
                    should.exist(res.body);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(false);
                    res.body.should.have.property('message').eql('Unauthorised');
                    done();
                });
        });

        it('it should get all the users', (done) => {
            chai.request(server)
                .get('/api/user')
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    should.exist(res.body);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(1);
                    done();
                });
        });
    });

    // Test the GET /api/user/:username route
    describe('GET /api/user/:username', (done) => {
        it('it should not get the user without an authorization token', (done) => {
            chai.request(server)
                .get('/api/user/mfindev')
                .end((err, res) => {
                    res.should.have.status(401);
                    should.exist(res.body);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(false);
                    res.body.should.have.property('message').eql('Unauthorised');
                    done();
                });
        });

        it('it should get null if a wrong username is given', (done) => {
            chai.request(server)
                .get('/api/user/mfindev1')
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    should.not.exist(res.body);
                    done();
                });
        });

        it('it should get the user', (done) => {
            chai.request(server)
                .get('/api/user/mfindev')
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    should.exist(res.body);
                    res.body.should.be.a('object');
                    res.body.should.have.property('_id');
                    res.body.should.have.property('username').eql('mfindev');
                    res.body.should.have.property('password');
                    res.body.should.have.property('__v');
                    res.body.should.have.property('admin');
                    done();
                });
        });
    });

    // Test the PUT /api/user/:username route
    describe('PUT /api/user/:username', () => {
        it('it should not update the user without an authorization token', (done) => {
            chai.request(server)
                .put('/api/user/mfindev')
                .end((err, res) => {
                    res.should.have.status(401);
                    should.exist(res.body);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(false);
                    res.body.should.have.property('message').eql('Unauthorised');
                    done();
                });
        });

        it('it should not update the user if the wrong username is given', (done) => {
            const customer = {
                "password": "mfindev"
            };

            chai.request(server)
                .put('/api/user/mfindev1')
                .set('x-access-token', token)
                .send(customer)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error').eql('Record does not exist');
                    done();
                });
        });

        it('it should not update the user without the password field', (done) => {
            const customer = {
            };

            chai.request(server)
                .put('/api/user/mfindev')
                .set('x-access-token', token)
                .send(customer)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error').eql('No password given');
                    done();
                });
        });

        it('it should update the user given the username', (done) => {
            const customer = {
                "password": "mfindev1"
            };

            chai.request(server)
                .put('/api/user/mfindev')
                .set('x-access-token', token)
                .send(customer)
                .end((err, res) => {
                    res.should.have.status(200);
                    should.exist(res.body);
                    res.body.should.be.a('object');
                    // Go through the properties one by one
                    res.body.should.have.property('result');
                    res.body.result.should.have.property('_id');
                    res.body.result.should.have.property('username').eql('mfindev');
                    res.body.result.should.have.property('password');
                    res.body.result.should.have.property('__v');
                    res.body.result.should.have.property('admin');
                    res.body.should.have.property('status').eql('successfully saved');
                    done();
                });
        });
    });
});