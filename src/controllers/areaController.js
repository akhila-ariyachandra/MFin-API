// Area Controller

// Creating a new Area
var createArea = function (req,res,next){
    var name = req.body.name;
    var details = req.body.details;

    Area.create({
        name: name,
        details: details
    }, function (err, result) {
        if (err) {
			req.log.error('Error creating new area');
			return res.send({ 'error': err });
		}
		else {
			res.log.info('New area registered');
			return res.json({ 'result': result, 'status': 'successfully saved' });
		}
    });
};

// Getting details of one area
var getArea = function(req,res,next) {
    var areaID = req.body.areaID;

    Area.findOne({ 'areaID': areaID }, function (err, result) {
        if (err) {
			req.log.error('Error finding Area:', areaID);
			return res.send({ 'error': err });
		}
		else {
			res.log.info('Area details retrieved: ', areaID);
			return res.json(result);
		}
    });
};

// Fetching Details of all areas
var getAreas = function (req, res, next) {
	Area.find({}, function (err, result) {
		if (err) {
			req.log.error('Error retrieving all area details');
			return res.send({ 'error': err });
		}
		else {
			res.log.info('All area details retrieved');
			return res.json(result);
		}
	});
};

// Update Area details
var updateArea = function (req, res) {
	var areaID = req.body.areaID;

	// Get existing details of area
	Area.findOne({ 'areaID': areaID }, function (err, area) {
		if (err) {
			req.log.error('Error finding area to update: ', areaID);
			return res.json({ 'error': err });
		} else if (!area) {
			// If area doesn't exist i.e. the wrong areaID was given
			req.log.error('Area does not exist to update: ', areaID);
			return res.json({ 'error': 'Record does not exist' });
		}

		// Update details
		area.name = req.body.name;
		area.details = req.body.details;

		// Send data to database
		area.save(function (err, result) {
			if (err) {
				req.log.error('Error updating area: ', areaID);
				return res.json({ 'error': err });
			}
			else {
				req.log.info('Updated area: ', areaID);
				return res.json({ 'result': result });
			}
		});
	});
};
