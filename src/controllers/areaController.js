// Area Controller

// Creating a new Area
var createArea = function (req, res) {
    var name = req.body.name;
    var details = req.body.details;

    Area.create({
        name: name,
        details: details
    })
		.then(function (result) {
    return res.json({ "result": result, "status": "successfully saved" });
})
		.catch(function (err) {
    return res.send({ "error": err });
});
};

// Getting details of one area
var getArea = function (req, res, next) {
    var areaID = req.body.areaID;

    Area.findOne({ "areaID": areaID }, function (err, result) {
        if (err) {
			//req.log.error('Error finding Area:', areaID);
            return res.send({ "error": err });
        }
        else {
			//res.log.info('Area details retrieved: ', areaID);
            return res.json(result);
        }
    });
};

// Fetching Details of all areas
var getAreas = function (req, res) {
    Area.find({})
		.then(function (result) {
    return res.json(result);
})
		.catch(function (err) {
    return res.send({ "error": err });
});
};

// Update Area details
var updateArea = function (req, res) {
    var areaID = req.body.areaID;

	// Get existing details of area
    Area.findOne({ "areaID": areaID })
		.then(function (area) {
    if (!area) {
				// If area doesn't exist i.e. the wrong areaID was given
        return res.json({ "error": "Record does not exist" });
    }

			// Update details
    area.name = req.body.name;
    area.details = req.body.details;

			// Send data to database
    area.save()
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
