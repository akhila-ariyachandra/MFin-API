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

    const key = "area" + areaID;

    // Search cache for value
    cache.get(key, (err, cacheResult) => {
        if (err) {
            return res.send({ "error": err });
        }

        // If the key doesn't exist88
        if (cacheResult == undefined) {
            Area.findOne({ "areaID": areaID })
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
};

// Fetching Details of all areas
const getAreas = (req, res) => {
    Area.find({})
        .then((result) => {
            
            // Store each of the value in the array in the cache
            for (var i=0; i < result.length; i++) {
                const key = "area" + result[i].areaID;
                
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
