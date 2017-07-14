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
		})
			.then(function (result) {
				return res.json({ 'result': result, 'status': 'successfully saved' });
			})
			.catch(function (err) {
				return res.json({ 'error': err });
			});
	})
		.catch(function (err) {
			return res.json({ 'error': 'password is required' });
		});
};

// Fetching Details of one User
var getUser = function (req, res) {
	var username = req.params.username;

	User.findOne({ 'username': username })
		.then(function (result) {
			return res.json(result);
		})
		.catch(function (err) {
			return res.json({ 'error': err });
		});
};

// Fetching Details of all Users
var getUsers = function (req, res) {
	User.find({})
		.then(function (result) {
			return res.json(result);
		})
		.catch(function (err) {
			return res.json({ 'error': err });
		});
};

// Update User details
var updateUser = function (req, res) {
	var username = req.params.username;

	if(!req.body.password){
		return res.json({ 'error': 'No password given' });
	}

	// Get existing details of user
	User.findOne({ 'username': username })
		.then(function (user) {
			if (!user) {
				// If User doesn't exist i.e. the wrong username was given
				return res.json({ 'error': 'Record does not exist' });
			}

			// Update password
			// Run hashing asynchronously to avoid blocking the server
			bcrypt.hash(req.body.password, saltRounds).then(function (hash) {
				user.password = hash;

				user.save()
					.then(function (result) {
						return res.json({ 'result': result, 'status': 'successfully saved' });
					})
					.catch(function (err) {
						return res.json({ 'error': err });
					});
			});
		})
		.catch(function (err) {
			return res.json({ 'error': err });
		});
};

// Authenticate the User
var authenticateUser = function (req, res) {
	var username = req.body.username;

	// Find the User
	User.findOne({
		username: username
	})
		.then(function (user) {
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
							expiresIn: config.tokenExpireTime
						});
						// return the information including token as JSON
						res.json({
							success: true,
							message: 'Authentication success.',
							token: token
						});
					}
				})
				.catch(function(err){
					res.json({ success: false, message: 'Authentication failed. No password given.' });
				});
			}
		})
		.catch(function (err) {
			throw err;
		});
};
