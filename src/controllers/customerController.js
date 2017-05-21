//This Controller deals with all functionalities of Customer
 
function customerController () {
	const Customer = require('../models/customerSchema');
	
	// Creating New Customer
	this.createCustomer = function (req, res, next) {
		const id = req.params.id;
		const name = req.params.name;
		const surname = req.params.surname;
		const dob = req.params.dob;
		const phone = req.params.phone;
		const area = req.params.area;
		const longitude = req.params.longitude;
		const latitude = req.params.latitude;
				
		Customer.create({	id:id,
											name:name,
											surname:surname,
											dob:dob,
											phone:phone,
											area:area,
											longitude:longitude,
											latitude:latitude }, function(err, result) {
			if (err) {
				req.log.error('Error creating new customer');
				return res.send({'error':err});	
			}
			else {
        res.log.info('New customer registered');
				return res.send({'result':result,'status':'successfully saved'});
      }
		});
	};
 
  // Fetching Details of one Customer
  this.getCustomer = function (req, res, next) {
		const id = req.params.id;
 
    Customer.findOne({ 'id' : id }, function(err, result) {
      if (err) {
        req.log.error('Error finding Customer:', id);
        return res.send({'error':err}); 
      }
      else {
				res.log.info('Customer details retrieved: ', id);
        return res.send({'Customer Details':result});
      }
    });
  };
	
	// Fetching Details of all Customers
  this.getCustomers = function (req, res, next) {
		Customer.find({}, function(err, result) {
      if (err) {
        req.log.error('Error retrieving all customer details');
        return res.send({'error':err}); 
      }
      else {
				res.log.info('All customer details retrieved');
				return res.send({'Customer Details':result});
      }
    });
  };

	// Update Customer details
	this.updateCustomer = function (req, res){
		var id = req.params.id;

		// Get existing details of customer
		Customer.findById(id, function(err, customer) {
			if (err) {
        req.log.error('Error finding record: ', id);
        return res.send({'error':err}); 
      }

			// Update details
			customer.name = req.params.name;
			customer.surname = req.params.surname;
			customer.dob = req.params.dob;
			customer.phone = req.params.phone;
			customer.area = req.params.area;
			customer.longitude = req.params.longitude;
			customer.latitude = req.params.latitude;

			// Send data to database
			customer.save(function(err, result){
				if (err) {
        	req.log.error('Error updating record: ', id);
        	return res.send({'error':err}); 
      	}
      	else {
					req.log.info('Updated customer: ', id);
        	return res.send({'Customer Details':result});
      	}
			});			
		});
	};
 
return this;
 
};
 
module.exports = new customerController();