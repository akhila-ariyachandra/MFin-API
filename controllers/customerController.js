//This Controller deals with all functionalities of Customer
 
function customerController () {
	var Customer = require('../models/customerSchema');
	
	// Creating New Customer
	this.createCustomer = function (req, res, next) {
		var id = req.params.id;
		var name = req.params.name;
		var surname = req.params.surname;
		var dob = req.params.dob;
		var phone = req.params.email;
				
		Customer.create({id:id,name:name,surname:surname,dob:dob,phone:phone}, function(err, result) {
			if (err) {
				console.log(err);
				return res.send({'error':err});	
			}
			else {
        return res.send({'result':result,'status':'successfully saved'});
      }
		});
	};
 
  // Fetching Details of Customer
  this.getCustomers = function (req, res, next) {
 
    Customer.find({}, function(err, result) {
      if (err) {
        console.log(err);
        return res.send({'error':err}); 
      }
      else {
        return res.send({'Customer Details':result});
      }
    });
  };
 
return this;
 
};
 
module.exports = new customerController();