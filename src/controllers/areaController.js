// Area Controller

// Creating a new Area
const createArea = (req, res) => {
    const name = req.body.name;
    const postalCode = req.body.postalCode;
    const district = req.body.district;

    Area.create({
        name: name,
        postalCode: postalCode,
        district: district
    })
        .then((result) => {
            return res.json({ "result": result, "status": "successfully saved" });
        })
        .catch((err) => {
            return res.send({ "error": err });
        });
};

// Getting details of one area
const getArea = (req, res) => {
    const areaID = req.params.areaID;

    Area.findOne({ "areaID": areaID })
        .then((result) => {
            return res.json(result);
        })
        .catch((err) => {
            return res.send({ "error": err });
        });
};

// Fetching Details of all areas
const getAreas = (req, res) => {
    Area.find({})
        .then((result) => {
            return res.json(result);
        })
        .catch((err) => {
            return res.send({ "error": err });
        });
};

// Update Area details
const updateArea = (req, res) => {
    const areaID = req.params.areaID;

    // Get existing details of area
    Area.findOne({ "areaID": areaID })
        .then((area) => {
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
