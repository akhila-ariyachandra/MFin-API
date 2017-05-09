// Model for the Customer
module.exports = (function customerSchema () {
 
	var mongoose = require('../db').mongoose;
 
	var schema = {
		id: {type: String, required: true},
		name: {type: String, required: true},
		surname: {type: String, required: true},
		dob: {type: Date, required: true},
		phone: {type: String, required: true},
		area: {type: mongoose.Schema.ObjectId}
	};
	var collectionName = 'customer';
	var customerSchema = mongoose.Schema(schema);
	var Customer = mongoose.model(collectionName, customerSchema);
	
	return Customer;
})();