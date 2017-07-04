//This Controller deals with all functionalities of Customer

var createLoan = function (req, res) {
	var loanType = req.body.loanType;
	var date = req.body.date;
	var loanAmount = req.body.loanAmount;
	var duration = req.body.duration;
	var interest = req.body.interest;
	var customerID = req.body.customerID;

	Loan.create({
		loanType: loanType,
		date: date,
		loanAmount: loanAmount,
		duration: duration,
		interest: interest,
		customerID: customerID
	}, function (err, result) {
		if (err) {
			return res.send({ 'error': err });
		}
		else {
			return res.json({ 'result': result, 'status': 'successfully saved' });
		}
	});
};

// Fetching Details of all loans
var getLoans = function (req, res) {
	Loan.find({}, function (err, result) {
		if (err) {
			return res.send({ 'error': err });
		}
		else {
			return res.json(result);
		}
	});
};

// Fetching Details of one loan
var getLoan = function (req, res) {
	var loanID = req.params.loanID;

	Loan.findOne({ 'loanID': loanID }, function (err, result) {
		if (err) {
			return res.send({ 'error': err });
		}
		else {
			return res.json(result);
		};
	});
};

// Update Loan details
var updateLoan = function (req, res) {
	var loanID = req.params.loanID;

	// Get existing details of loan
	Loan.findOne({ 'loanID': loanID }, function (err, loan) {
		if (err) {
			return res.send({ 'error': err });
		}
		else if (!loan) {
			// If loan doesn't exist i.e. the wrong loanID was given
			return res.json({ 'error': 'Record does not exist' });
		}

		// Update details
		loan.loanType = req.body.loanType;
		loan.date = req.body.date;
		loan.loanAmount = req.body.loanAmount;
		loan.duration = req.body.duration;
		loan.interest = req.body.interest;
		loan.customerID = req.body.customerID;
		loan.manager = req.body.manager;
		loan.status = req.body.status;

		// Send data to database
		loan.save(function (err, result) {
			if (err) {
				return res.send({ 'error': err });
			}
			else {
				return res.json({ 'Loan Details': result });
			}
		});
	});
};
