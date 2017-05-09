// Model for the Loan
module.exports = (function loanSchema () {
 
	var mongoose = require('../db').mongoose;
 
	var schema = {
		loanType: {type: String, required: true},
		date: {type: Date, required: true},
		loanAmount: {type: Number, required: true},
		duration: {type: Number, require:true},
		interest: {type: Number, required: true},
		customer: {type: mongoose.Schema.ObjectId}
	};
	var collectionName = 'loan';
	var loanSchema = mongoose.Schema(schema);
	var Loan = mongoose.model(collectionName, loanSchema);
	
	return Loan;
})();