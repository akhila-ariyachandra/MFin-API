module.exports = function(app) {
	const customer = require('./controllers/customerController');
    const loan = require('./controllers/loanController');
    const logs = require('./controllers/loggingController');

    app.get('/', function(req, res, next) {
		return res.send("WELCOME TO MFIN API");
	});
 
    app.post('/createCustomer', customer.createCustomer); //Create Customer API
    app.get('/getCustomer/:id', customer.getCustomer);  // Get one Customer Details API
    app.get('/getCustomers', customer.getCustomers);  // Get All Customer Details API
    app.put('/updateCustomer', customer.updateCustomer); // Update Customer details

    app.post('/createLoan', loan.createLoan); //create loan API
    app.get('/getLoans', loan.getLoans); //get loan details
    app.get('/getLoan/:id', loan.getLoan); // get one loan
    app.put('/updateLoan', loan.updateLoan); //Update Loan Details

    app.get('/viewLogs', logs.viewLogs); // View Logs
};