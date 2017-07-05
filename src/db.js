/*--------------------Database--------------------*/

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var config = require('config');

mongoose.connect(config.dbPath);
var db = mongoose.connection;

db.on('error', function () {
	console.log('Error occured from the database');
});

db.once('open', function dbOpen() {
	console.log('Successfully opened the database');
});
