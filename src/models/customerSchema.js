// Model for the Customer
module.exports = (function customerSchema () {
 
	const mongoose = require('../db').mongoose;
 
	const schema = {
		id: {type: String, required: true},
		name: {type: String, required: true},
		surname: {type: String, required: true},
		dob: {type: Date, required: true},
		phone: {type: String, required: true},
		area: {type: mongoose.Schema.ObjectId},
		longitude: {type: String, required: true},
		latitude: {type: String, required: true}
	};
	const collectionName = 'customer';
	const customerSchema = mongoose.Schema(schema);
	const Customer = mongoose.model(collectionName, customerSchema);
	
	return Customer;
})();