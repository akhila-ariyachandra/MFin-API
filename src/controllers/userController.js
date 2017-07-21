// This Controller deals with all functionalities of User

// Creating New User
const createUser = (req, res) => {
    // Run hashing asynchronously to avoid blocking the server
    bcrypt.hash(req.body.password, saltRounds).then((hash) => {
        const username = req.body.username;
        const password = hash;

        User.create({
            username: username,
            password: password
        })
            .then((result) => {
                return res.json({ "result": result, "status": "successfully saved" });
            })
            .catch((err) => {
                return res.json({ "error": err });
            });
    })
        .catch((err) => {
            return res.json({ "error": "password is required" });
        });
};

// Fetching Details of one User
const getUser = (req, res) => {
    const username = req.params.username;

    User.findOne({ "username": username })
        .then((result) => {
            return res.json(result);
        })
        .catch((err) => {
            return res.json({ "error": err });
        });
};

// Fetching Details of all Users
const getUsers = (req, res) => {
    User.find({})
        .then((result) => {
            return res.json(result);
        })
        .catch((err) => {
            return res.json({ "error": err });
        });
};

// Update User details
const updateUser = (req, res) => {
    const username = req.params.username;

    if (!req.body.password) {
        return res.json({ "error": "No password given" });
    }

    // Get existing details of user
    User.findOne({ "username": username })
        .then((user) => {
            if (!user) {
                // If User doesn't exist i.e. the wrong username was given
                return res.json({ "error": "Record does not exist" });
            }

            // Update password
            // Run hashing asynchronously to avoid blocking the server
            bcrypt.hash(req.body.password, saltRounds).then((hash) => {
                user.password = hash;

                user.save()
                    .then((result) => {
                        return res.json({ "result": result, "status": "successfully saved" });
                    })
                    .catch((err) => {
                        return res.json({ "error": err });
                    });
            });
        })
        .catch((err) => {
            return res.json({ "error": err });
        });
};

// Authenticate the User
const authenticateUser = (req, res) => {
    const username = req.body.username;

    // Find the User
    User.findOne({
        username: username
    })
        .then((user) => {
            if (!user) {
                res.json({ success: false, message: "Authentication failed. User not found." });
            } else if (user) {
                // Run password checking asynchronously to avoid blocking the server
                bcrypt.compare(req.body.password, user.password).then((result) => {
                    // Check if password matches
                    if (!result) {
                        res.json({ success: false, message: "Authentication failed. Wrong password." });
                    } else {
                        // If user is found and password is right
                        // Create a token
                        const token = jwt.sign(user, app.get("superSecret"), {
                            expiresIn: config.tokenExpireTime
                        });
                        // Return the information including token as JSON
                        res.json({
                            success: true,
                            message: "Authentication success.",
                            token: token
                        });
                    }
                })
                    .catch((err) => {
                        res.json({ success: false, message: "Authentication failed. No password given." });
                    });
            }
        })
        .catch((err) => {
            throw err;
        });
};
