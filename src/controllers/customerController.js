//This Controller deals with all functionalities of Customer

function customerController() {
	const Customer = require('../models/customerSchema');

	// Creating New Customer
	this.createCustomer = function (req, res, next) {
		const name = req.params.name;
		const surname = req.params.surname;
		const nic = req.params.nic;
		const address = req.params.address;
		const dob = req.params.dob;
		const phone = req.params.phone;
		const area = req.params.area;
		const longitude = req.params.longitude;
		const latitude = req.params.latitude;

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
	this.getCustomer = function (req, res, next) {
		const customerID = req.params.customerID;

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
	this.getCustomers = function (req, res, next) {
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
	this.updateCustomer = function (req, res) {
		const customerID = req.params.customerID;

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
			customer.name = req.params.name;
			customer.surname = req.params.surname;
			customer.nic = req.params.nic;
			customer.address = req.params.address;
			customer.dob = req.params.dob;
			customer.phone = req.params.phone;
			customer.area = req.params.area;
			customer.longitude = req.params.longitude;
			customer.latitude = req.params.latitude;

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

	return this;

};

module.exports = new customerController();