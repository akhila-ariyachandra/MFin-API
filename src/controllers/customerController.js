//This Controller deals with all functionalities of Customer

// Creating New Customer
const createCustomer = (req, res) => {
    const name = req.body.name;
    const surname = req.body.surname;
    const nic = req.body.nic;
    const address = req.body.address;
    const dob = req.body.dob;
    const phone = req.body.phone;
    const areaID = req.body.areaID;
    const longitude = req.body.longitude;
    const latitude = req.body.latitude;

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
        .then((result) => {
            return res.json({ "result": result, "status": "successfully saved" });
        })
        .catch((err) => {
            return res.send({ "error": err });
        });
};

// Fetching Details of one Customer
const getCustomer = (req, res) => {
    const customerID = req.params.customerID;

    Customer.findOne({ "customerID": customerID })
        .then((result) => {
            return res.json(result);
        })
        .catch((err) => {
            return res.send({ "error": err });
        });
};

// Fetching Details of all Customers
const getCustomers = (req, res) => {
    Customer.find({})
        .then((result) => {
            return res.json(result);
        })
        .catch((err) => {
            return res.send({ "error": err });
        });
};

// Update Customer details
const updateCustomer = (req, res) => {
    const customerID = req.params.customerID;

    // Get existing details of customer
    Customer.findOne({ "customerID": customerID })
        .then((customer) => {
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
                .then((result) => {
                    return res.json({ "result": result });
                })
                .catch((err) => {
                    return res.json({ "error": err });
                });
        })
        .catch((err) => {
            return res.json({ "error": err });
        });
};
