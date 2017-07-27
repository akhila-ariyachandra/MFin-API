"use strict";

const CashCollector = require("../models/cashCollectorSchema");
const cache = require("../app").cache;

module.exports = {
	// Creating New Cash Collector
	createCashCollector: (req, res) => {
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
	},

	// Fetching Details of one cash collector
	getCashCollector: (req, res) => {
		const cashCollectorID = req.params.cashCollectorID;

		const key = "cashCollector" + cashCollectorID;

		// Search cache for value
		cache.get(key, (err, cacheResult) => {
			if (err) {
				return res.send({ "error": err });
			}

			// If the key doesn't exist
			if (cacheResult == undefined) {

				CashCollector.findOne({ "cashCollectorID": cashCollectorID })
					.then((result) => {
						// Store the value in cache
						cache.set(key, result, (err, success) => {
							if (err) {
								return res.send({ "error": err });
							}
							return res.json(result);
						});
					})
					.catch((err) => {
						return res.send({ "error": err });
					});
			} else {
				// Return cached value
				return res.json(cacheResult);
			}
		});
	},

	// Fetching Details of cash collectors
	getCashCollectors: (req, res) => {
		CashCollector.find({})
			.then((result) => {

				// Store each of the value in the array in the cache
				for (var i = 0; i < result.length; i++) {
					const key = "cashCollector" + result[i].cashCollectorID;

					cache.set(key, result[i], (err, success) => {
						if (err) {
							return res.send({ "error": err });
						}
					});
				}

				return res.json(result);
			})
			.catch((err) => {
				return res.send({ "error": err });
			});
	},

	//Update Cash Collector details
	updateCashCollector: (req, res) => {
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
	}
};