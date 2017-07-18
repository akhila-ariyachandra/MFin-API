// This Controller deals with all functionalities of Cash Collector

// Creating New Cash Collector
var createCashCollector = function (req, res) {
	var name = req.body.name;
	var surname = req.body.surname;
	var nic = req.body.nic;
	var address = req.body.address;
	var phone = req.body.phone;
	var areaID = req.body.areaID;

	CashCollector.create({
		name: name,
		surname: surname,
		nic: nic,
		address: address,
		phone: phone,
		areaID: areaID
	})
		.then(function (result) {
			return res.json({ "result": result, "status": "successfully saved" });
		})
		.catch(function (err) {
			return res.send({ "error": err });
		});
};

// Fetching Details of one cash collector
var getCashCollector = function (req, res) {
	var cashCollectorID = req.params.cashCollectorID;

	CashCollector.findOne({ "cashCollectorID": cashCollectorID })
		.then(function (result) {
			return res.json(result);
		})
		.catch(function (err) {
			return res.send({ "error": err });
		});
};

// Fetching Details of cash collectors
var getCashCollectors = function (req, res) {
	CashCollector.find({})
		.then(function (result) {
			return res.json(result);
		})
		.catch(function (err) {
			return res.send({ "error": err });
		});
};

//Update Cash Collector details
var updateCashCollector = function (req, res) {
	var cashCollectorID = req.params.cashCollectorID;
	
	// Get existing details of Cash Collectors
	CashCollector.findOne({ "cashCollectorID": cashCollectorID })
		.then(function (cashcollector) {
			if (!cashcollector) {
				// If Cash Collector doesn't exist i.e. the wrong cashCollectorID was given
				return res.json({ "error": "Record does not exist" });
			}

			//Update details
			cashcollector.name = req.body.name;
			cashcollector.surname = req.body.surname;
			cashcollector.nic = req.body.nic;
			cashcollector.address = req.body.address;
			cashcollector.phone = req.body.phone;
			cashcollector.areaID = req.body.areaID;

			//Send data to database
			cashcollector.save()
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