// Model for the Customer
module.exports = (function customerSchema () {
 
	const mongoose = require('../db').mongoose;
	const autoIncrement = require('mongoose-sequence');
 
	const schema = {
		name: {type: String, required: true},
		surname: {type: String, required: true},
		nic: {type: String, required: true},
		address: {type: String, required: true},
		dob: {type: Date, required: true},
		phone: {type: String, required: true},
		area: {type: mongoose.Schema.ObjectId},
		longitude: {type: String, required: true},
		latitude: {type: String, required: true}
	};
	
	const collectionName = 'customer';
	const customerSchema = mongoose.Schema(schema);
	customerSchema.plugin(autoIncrement, {inc_field: 'customerID'});
	const Customer = mongoose.model(collectionName, customerSchema);
	
	return Customer;
})();