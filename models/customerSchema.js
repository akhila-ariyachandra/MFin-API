// Model for the Customer
module.exports = (function customerSchema () {
 
	var mongoose = require('../db').mongoose;
 
	var schema = {
		name: {type: String, required: true},
		email: {type: String, required: true},
		age: {type: String, required: true},
		city: {type: String, required: true}
	};
	var collectionName = 'customer';
	var customerSchema = mongoose.Schema(schema);
	var Customer = mongoose.model(collectionName, customerSchema);
	
	return Customer;
})();