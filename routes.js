module.exports = function(app) {
	var customer = require('./controllers/customerController');
    
    app.get('/', function(req, res, next) {
		return res.send("WELCOME TO MFIN API");
	});
 
    app.post('/createCustomer', customer.createCustomer); //Create Customer API
    app.get('/getCustomer', customer.getCustomer);  // Get All Customer Details API
};