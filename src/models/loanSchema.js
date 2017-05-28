// Model for the Loan
module.exports = (function loanSchema () {
 
	const mongoose = require('../db').mongoose;
 
	const schema = {
		loanType: {type: String, required: true},
		date: {type: Date, required: true},
		loanAmount: {type: Number, required: true},
		duration: {type: Number, required:true},
		interest: {type: Number, required: true},
		customer: {type: mongoose.Schema.ObjectId}
	};
	const collectionName = 'loan';
	const loanSchema = mongoose.Schema(schema);
	const Loan = mongoose.model(collectionName, loanSchema);
	
	return Loan;
})();