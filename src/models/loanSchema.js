// Model for the Loan
module.exports = (function loanSchema() {

	const mongoose = require('../db').mongoose;
	const autoIncrement = require('mongoose-sequence');

	const schema = {
		loanType: { type: String, required: true },
		date: { type: Date, required: true },
		loanAmount: { type: Number, required: true },
		duration: { type: Number, required: true },
		interest: { type: Number, required: true },
		customerID: { type: Number, required: true },
		manager: { type: String, default: 'Not set' },
		status: { type: String, default: 'Pending' }
	};

	const collectionName = 'loan';
	const loanSchema = mongoose.Schema(schema);
	loanSchema.plugin(autoIncrement, { inc_field: 'loanID' });
	const Loan = mongoose.model(collectionName, loanSchema);

	return Loan;
})();