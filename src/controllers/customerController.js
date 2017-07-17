//This Controller deals with all functionalities of Customer

// Creating New Customer
var createCustomer = function (req, res) {
    var name = req.body.name;
    var surname = req.body.surname;
    var nic = req.body.nic;
    var address = req.body.address;
    var dob = req.body.dob;
    var phone = req.body.phone;
    var areaID = req.body.areaID;
    var longitude = req.body.longitude;
    var latitude = req.body.latitude;

    Customer.create({
        name: name,
        surname: surname,
        nic: nic,
        address: address,
        dob: dob,
        phone: phone,
        areaID: areaID,
        longitude: longitude,
        latitude: latitude
    })
		.then(function (result) {
    return res.json({ "result": result, "status": "successfully saved" });
})
		.catch(function (err) {
    return res.send({ "error": err });
});
};

// Fetching Details of one Customer
var getCustomer = function (req, res) {
    var customerID = req.params.customerID;

    Customer.findOne({ "customerID": customerID })
		.then(function (result) {
    return res.json(result);
})
		.catch(function (err) {
    return res.send({ "error": err });
});
};

// Fetching Details of all Customers
var getCustomers = function (req, res) {
    Customer.find({})
		.then(function (result) {
    return res.json(result);
})
		.catch(function (err) {
    return res.send({ "error": err });
});
};

// Update Customer details
var updateCustomer = function (req, res) {
    var customerID = req.params.customerID;

	// Get existing details of customer
    Customer.findOne({ "customerID": customerID })
		.then(function (customer) {
    if (!customer) {
				// If customer doesn't exist i.e. the wrong customerID was given
        return res.json({ "error": "Record does not exist" });
    }

			// Update details
    customer.name = req.body.name;
    customer.surname = req.body.surname;
    customer.nic = req.body.nic;
    customer.address = req.body.address;
    customer.dob = req.body.dob;
    customer.phone = req.body.phone;
    customer.areaID = req.body.areaID;
    customer.longitude = req.body.longitude;
    customer.latitude = req.body.latitude;

			// Send data to database
    customer.save()
				.then(function (result) {
    return res.json({ "result": result });
})
				.catch(function (err) {
    return res.json({ "error": err });
});
})
		.catch(function (err) {
    return res.json({ "error": err });
});
};
