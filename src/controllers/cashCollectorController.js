// This Controller deals with all functionalities of Cash Collector

// Creating New Cash Collector
var createCashCollector = function (req, res) {
    var name = req.body.name;
    var areaID = req.body.areaID;

    CashCollector.create({
        name: name,
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
