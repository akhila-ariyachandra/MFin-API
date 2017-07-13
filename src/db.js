/*--------------------Database--------------------*/

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// Use mockgoose for automated testing
// Mockgoose is for a temporary DB stored in RAM
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);

if (process.env.NODE_ENV === 'test') {
	// While testing use mockgoose
	mockgoose.prepareStorage().then(function () {
		mongoose.connect(config.dbPath);
	});
} else {
	// Else use the web database
	mongoose.connect(config.dbPath);
}

var db = mongoose.connection;

db.on('error', function () {
	console.log('Error occured from the database');
});

db.once('open', function dbOpen() {
	console.log('Successfully opened the database');
});
