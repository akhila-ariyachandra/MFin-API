// This Controller deals with all functionalities of Cash Collector

// Creating New Cash Collector
const createCashCollector = (req, res) => {
	const name = req.body.name;
	const surname = req.body.surname;
	const nic = req.body.nic;
	const address = req.body.address;
	const phone = req.body.phone;
	const areaID = req.body.areaID;

	CashCollector.create({
		name: name,
		surname: surname,
		nic: nic,
		address: address,
		phone: phone,
		areaID: areaID
	})
		.then((result) => {
			return res.json({ "result": result, "status": "successfully saved" });
		})
		.catch((err) => {
			return res.send({ "error": err });
		});
};

// Fetching Details of one cash collector
const getCashCollector = (req, res) => {
	const cashCollectorID = req.params.cashCollectorID;

	CashCollector.findOne({ "cashCollectorID": cashCollectorID })
		.then((result) => {
			return res.json(result);
		})
		.catch((err) => {
			return res.send({ "error": err });
		});
};

// Fetching Details of cash collectors
const getCashCollectors = (req, res) => {
	CashCollector.find({})
		.then((result) => {
			return res.json(result);
		})
		.catch((err) => {
			return res.send({ "error": err });
		});
};

//Update Cash Collector details
const updateCashCollector = (req, res) => {
	const cashCollectorID = req.params.cashCollectorID;

	// Get existing details of Cash Collectors
	CashCollector.findOne({ "cashCollectorID": cashCollectorID })
		.then((cashcollector) => {
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