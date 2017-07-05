// This Controller deals with all functionalities of User

// Creating New User
var createUser = function (req, res) {
	// Run hashing asynchronously to avoid blocking the server
	bcrypt.hash(req.body.password, saltRounds).then(function (hash) {
		var username = req.body.username;
		var password = hash;
		User.create({
			username: username,
			password: password
		}, function (err, result) {
			if (err) {
				return res.json({ 'error': err });
			}
			else {
				return res.json({ 'result': result, 'status': 'successfully saved' });
			}
		});
	});
};

// Fetching Details of one User
var getUser = function (req, res) {
	var username = req.params.username;

	User.findOne({ 'username': username }, function (err, result) {
		if (err) {
			return res.json({ 'error': err });
		}
		else {
			return res.json(result);
		}
	});
};

// Fetching Details of all Users
var getUsers = function (req, res) {
	User.find({}, function (err, result) {
		if (err) {
			return res.json({ 'error': err });
		}
		else {
			return res.json(result);
		}
	});
};

// Update User details
var updateUser = function (req, res) {
	var username = req.params.username;

	// Get existing details of user
	User.findOne({ 'username': username }, function (err, user) {
		if (err) {
			return res.json({ 'error': err });
		} else if (!user) {
			// If User doesn't exist i.e. the wrong username was given
			return res.json({ 'error': 'Record does not exist' });
		}

		// Update details
		user.password = req.body.password;

		// Send data to database
		user.save(function (err, result) {
			if (err) {
				return res.json({ 'error': err });
			}
			else {
				return res.json({ 'result': result });
			}
		});
	});
};

// Authenticate the User
var authenticateUser = function (req, res) {
	var username = req.body.username;

	// Find the User
	User.findOne({
		username: username
	}, function (err, user) {
		if (err) {
			throw err;
		}
		if (!user) {
			res.json({ success: false, message: 'Authentication failed. User not found.' });
		} else if (user) {
			// Run password checking asynchronously to avoid blocking the server
			bcrypt.compare(req.body.password, user.password).then(function (result) {
				// check if password matches
				if (!result) {
					res.json({ success: false, message: 'Authentication failed. Wrong password.' });
				} else {
					// if user is found and password is right
					// create a token
					var token = jwt.sign(user, app.get('superSecret'), {
						expiresIn: 1800
					});
					// return the information including token as JSON
					res.json({
						success: true,
						message: 'Authentication success.',
						token: token
					});
				}
			});
		}
	});
};
