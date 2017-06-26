//This Controller deals with all functionalities of Customer

// Creating New Customer
var createCustomer = function (req, res, next) {
	var name = req.body.name;
	var surname = req.body.surname;
	var nic = req.body.nic;
	var address = req.body.address;
	var dob = req.body.dob;
	var phone = req.body.phone;
	var area = req.body.area;
	var longitude = req.body.longitude;
	var latitude = req.body.latitude;

	Customer.create({
		name: name,
		surname: surname,
		nic: nic,
		address: address,
		dob: dob,
		phone: phone,
		area: area,
		longitude: longitude,
		latitude: latitude
	}, function (err, result) {
		if (err) {
			req.log.error('Error creating new customer');
			return res.send({ 'error': err });
		}
		else {
			res.log.info('New customer registered');
			return res.json({ 'result': result, 'status': 'successfully saved' });
		}
	});
};

// Fetching Details of one Customer
var getCustomer = function (req, res, next) {
	var customerID = req.params.customerID;

	Customer.findOne({ 'customerID': customerID }, function (err, result) {
		if (err) {
			req.log.error('Error finding Customer:', customerID);
			return res.send({ 'error': err });
		}
		else {
			res.log.info('Customer details retrieved: ', customerID);
			return res.json(result);
		}
	});
};

// Fetching Details of all Customers
var getCustomers = function (req, res, next) {
	Customer.find({}, function (err, result) {
		if (err) {
			req.log.error('Error retrieving all customer details');
			return res.send({ 'error': err });
		}
		else {
			res.log.info('All customer details retrieved');
			return res.json(result);
		}
	});
};

// Update Customer details
var updateCustomer = function (req, res) {
	var customerID = req.body.customerID;

	// Get existing details of customer
	Customer.findOne({ 'customerID': customerID }, function (err, customer) {
		if (err) {
			req.log.error('Error finding customer to update: ', customerID);
			return res.json({ 'error': err });
		} else if (!customer) {
			// If customer doesn't exist i.e. the wrong customerID was given
			req.log.error('Customer does not exist to update: ', customerID);
			return res.json({ 'error': 'Record does not exist' });
		}

		// Update details
		customer.name = req.body.name;
		customer.surname = req.body.surname;
		customer.nic = req.body.nic;
		customer.address = req.body.address;
		customer.dob = req.body.dob;
		customer.phone = req.body.phone;
		customer.area = req.body.area;
		customer.longitude = req.body.longitude;
		customer.latitude = req.body.latitude;

		// Send data to database
		customer.save(function (err, result) {
			if (err) {
				req.log.error('Error updating customer: ', customerID);
				return res.json({ 'error': err });
			}
			else {
				req.log.info('Updated customer: ', customerID);
				return res.json({ 'result': result });
			}
		});
	});
};
