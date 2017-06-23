'use strict';

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const config = require('config');

mongoose.connect(config.dbPath);
const db = mongoose.connection;

db.on('error', function () {
	console.log('Error occured from the database');
});

db.once('open', function dbOpen() {
	console.log('Successfully opened the database');
});

exports.mongoose = mongoose;