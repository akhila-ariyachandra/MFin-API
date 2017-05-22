//This Controller deals with all functionalities of Customer
 
function loanController () {
	var Loan = require('../models/loanSchema');
	
	// Creating New Loan
	this.createLoan = function (req, res, next) {
		var loanType = req.params.loanType;
		var date = req.params.date;
		var loanAmount = req.params.loanAmount;
		var duration = req.params.duration;
		var interest = req.params.interest;
		var customer = req.params.customer;
		
		Loan.create({loanType:loanType,date:date,loanAmount:loanAmount,duration:duration,interest:interest,customer:customer}, function(err, result) {
		//changing log or error
			if (err) {
				req.log.error('Error creating new loan');
				return res.send({'error':err});	
			}
			else {
				req.log.info('New loan registered');
        return res.send({'result':result,'status':'successfully saved'});
      }
		});
	};
 
  // Fetching Details of Loan
  this.getLoans = function (req, res, next) {
 
    Loan.find({}, function(err, result) {
      if (err) {
        req.log.error('Error getting loans: ', id);
        return res.send({'error':err}); 
      }
      else {
				req.log.info('Retrived loan: ', id);
        return res.send({'Loan Details':result});
      }
    });
  };
 
//feching loan details of 1 customer
	this.getLoan = function (req, res, next){
		var id = req.params.id;
		
		Loan.findById(id, function(err, result){
			if(err)
			{
				req.log.error('Error getting loan: ', id);
				return res.send({'error':err});
			}
			else{
				req.log.info('Retrived loan');
				return res.send({'Loan details':result});
			};
		});
	};

// Update Loan details
	this.updateLoan = function (req, res){
		//console.log('called');
		var id = req.params.id;

		// Get existing details of loan
		Loan.findById(id, function(err, loan) {
			if (err) {
        req.log.error('Error find loan details:', id);
        return res.send({'error':err}); 
      }

			// Update details
			loan.loanType = req.params.loanType;
			loan.date = req.params.date;
			loan.loanAmount = req.params.loanAmount;
			loan.duration = req.params.duration;
			loan.interest = req.params.interest;
			loan.customer = req.params.customer;
			
			// Send data to database
			loan.save(function(err, result){
				if (err) {
        	req.log.error('Error updating loan: ', id);
        	return res.send({'error':err}); 
      	}
      	else {
						req.log.info('Updated loan details: ', id);
        		return res.send({'Loan Details':result});
      	}
			});			
		});
	};


	return this;
 
};
 
module.exports = new loanController();