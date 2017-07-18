// Area Controller

// Creating a new Area
var createArea = function (req, res) {
    var name = req.body.name;
    var postalCode = req.body.postalCode;
    var district = req.body.district;

    Area.create({
        name: name,
        postalCode:postalCode,
        district:district
    })
        .then(function (result) {
            return res.json({ "result": result, "status": "successfully saved" });
        })
        .catch(function (err) {
            return res.send({ "error": err });
        });
};

// Getting details of one area
var getArea = function (req, res) {
    var areaID = req.params.areaID;
    
    Area.findOne({ "areaID": areaID })
    .then(function (result) {
        return res.json(result);
    })
    .catch(function(err){
        return res.send({ "error": err });
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
    var areaID = req.params.areaID;

    // Get existing details of area
    Area.findOne({ "areaID": areaID })
        .then(function (area) {
            if (!area) {
                // If area doesn't exist i.e. the wrong areaID was given
                return res.json({ "error": "Record does not exist" });
            }

            // Update details
            area.name = req.body.name;
            area.postalCode = req.body.postalCode;
            area.district = req.body.district;

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
