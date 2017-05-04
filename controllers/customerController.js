//This Controller deals with all functionalities of Customer
 
function customerController () {
	var Customer = require('../models/customerSchema');
	
	// Creating New Customer
	this.createCustomer = function (req, res, next) {
		var name = req.params.name;
		var email = req.params.email;
		var age = req.params.age;
		var city = req.params.city;
		
		Customer.create({name:name,email:email,age:age,city:city}, function(err, result) {
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
  this.getCustomer = function (req, res, next) {
 
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