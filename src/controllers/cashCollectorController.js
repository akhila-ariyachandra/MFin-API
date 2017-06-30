// This Controller deals with all functionalities of Cash Collector

// Creating New Cash Collector
var createCashCollector = function(req,res,next){
    var name = req.body.name;
    var areaID = req.body.areaID;

    CashCollector.create({
        name: name,
        areaID: areaID
    }, function(err, result) {
        if (err) {
			req.log.error('Error creating new cash collector');
			return res.send({ 'error': err });
		}
		else {
			res.log.info('New cash collector registered');
			return res.json({ 'result': result, 'status': 'successfully saved' });
		}
    })
};

// Fetching Details of one cash collector
var getCashCollector = function (req, res, next) {
	var cashCollectorID = req.params.cashCollectorID;

	CashCollector.findOne({ 'cashCollectorID': cashCollectorID }, function (err, result) {
		if (err) {
			req.log.error('Error finding Cash Collector:', cashCollectorID);
			return res.send({ 'error': err });
		}
		else {
			res.log.info('Cash Collector details retrieved: ', cashCollectorID);
			return res.json(result);
		}
	});
};

// Fetching Details of cash collectors
var getCashCollectors = function (req, res, next) {
	CashCollector.find({}, function (err, result) {
		if (err) {
			req.log.error('Error retrieving all cash collector details');
			return res.send({ 'error': err });
		}
		else {
			res.log.info('All cash collector details retrieved');
			return res.json(result);
		}
	});
};
