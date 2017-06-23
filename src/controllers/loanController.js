//This Controller deals with all functionalities of Customer

function loanController() {
	const Loan = require('../models/loanSchema');

	// Creating New Loan
	this.createLoan = function (req, res, next) {
		const loanType = req.params.loanType;
		const date = req.params.date;
		const loanAmount = req.params.loanAmount;
		const duration = req.params.duration;
		const interest = req.params.interest;
		const customerID = req.params.customerID;

		Loan.create({
			loanType: loanType,
			date: date,
			loanAmount: loanAmount,
			duration: duration,
			interest: interest,
			customerID: customerID
		}, function (err, result) {
			//changing log or error
			if (err) {
				req.log.error('Error creating new loan');
				return res.send({ 'error': err });
			}
			else {
				req.log.info('New loan registered');
				return res.json({ 'result': result, 'status': 'successfully saved' });
			}
		});
	};

	// Fetching Details of all loans
	this.getLoans = function (req, res, next) {
		Loan.find({}, function (err, result) {
			if (err) {
				req.log.error('Error getting all loans');
				return res.send({ 'error': err });
			}
			else {
				req.log.info('Retrived all loans');
				return res.json(result);
			}
		});
	};

	// Fetching Details of one loan
	this.getLoan = function (req, res, next) {
		const loanID = req.params.loanID;

		Loan.findOne({ 'loanID': loanID }, function (err, result) {
			if (err) {
				req.log.error('Error getting loan: ', loanID);
				return res.send({ 'error': err });
			}
			else {
				req.log.info('Retrived loan');
				return res.json(result);
			};
		});
	};

	// Update Loan details
	this.updateLoan = function (req, res) {
		const loanID = req.params.loanID;

		// Get existing details of loan
		Loan.findOne({ 'loanID': loanID }, function (err, loan) {
			if (err) {
				req.log.error('Error find loan details:', id);
				return res.send({ 'error': err });
			}
			else if (!loan) {
				// If loan doesn't exist i.e. the wrong loanID was given
				req.log.error('Loan does not exist to update: ', loanID);
				return res.json({ 'error': 'Record does not exist' });
			}

			// Update details
			loan.loanType = req.params.loanType;
			loan.date = req.params.date;
			loan.loanAmount = req.params.loanAmount;
			loan.duration = req.params.duration;
			loan.interest = req.params.interest;
			loan.customerID = req.params.customerID;

			// Send data to database
			loan.save(function (err, result) {
				if (err) {
					req.log.error('Error updating loan: ', loanID);
					return res.send({ 'error': err });
				}
				else {
					req.log.info('Updated loan details: ', loanID);
					return res.json({ 'Loan Details': result });
				}
			});
		});
	};

	//loan aproval
	this.loanApproval = function (req, res) {
		const loanID = req.params.loanID;
		//geting existing details from loan
		Loan.findOne({ 'loanID': loanID }, function (err, loan) {
			if (err) {
				console.log(err);
				return res.send({ 'error': err });
			}
			else if (!loan) {
				// If loan doesn't exist i.e. the wrong loanID was given
				req.log.error('Loan does not exist to update: ', loanID);
				return res.json({ 'error': 'Record does not exist' });
			}

			//update deteails
			loan.manager = req.params.manager;
			loan.status = req.params.status;

			//send data to database
			loan.save(function (err, result) {
				if (err) {
					console.log(err);
					return res.send({ 'error': err });
				}
				else {
					return res.json({ 'Aproval details': result });
				}
			});
		});
	};

	return this;
};

module.exports = new loanController();