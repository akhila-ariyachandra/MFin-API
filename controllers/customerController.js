//This Controller deals with all functionalities of Customer
 
function customerController () {
	var Customer = require('../models/customerSchema');
	
	// Creating New Customer
	this.createCustomer = function (req, res, next) {
		var id = req.params.id;
		var name = req.params.name;
		var surname = req.params.surname;
		var dob = req.params.dob;
		var phone = req.params.phone;
		var area = req.params.area;
				
		Customer.create({id:id,name:name,surname:surname,dob:dob,phone:phone,area:area}, function(err, result) {
			if (err) {
				console.log(err);
				return res.send({'error':err});	
			}
			else {
        return res.send({'result':result,'status':'successfully saved'});
      }
		});
	};
 
  // Fetching Details of one Customer
  this.getCustomer = function (req, res, next) {
		var id = req.params.id;
 
    Customer.findById(id, function(err, result) {
      if (err) {
        console.log(err);
        return res.send({'error':err}); 
      }
      else {
        return res.send({'Customer Details':result});
      }
    });
  };
	
	// Fetching Details of all Customers
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