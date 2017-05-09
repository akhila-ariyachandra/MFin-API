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
			if (err) {
				console.log(err);
				return res.send({'error':err});	
			}
			else {
        return res.send({'result':result,'status':'successfully saved'});
      }
		});
	};
 
  // Fetching Details of Loan
  this.getLoans = function (req, res, next) {
 
    Loan.find({}, function(err, result) {
      if (err) {
        console.log(err);
        return res.send({'error':err}); 
      }
      else {
        return res.send({'Loan Details':result});
      }
    });
  };
 
return this;
 
};
 
module.exports = new loanController();