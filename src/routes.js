module.exports = function (app) {
    const customer = require('./controllers/customerController');
    const loan = require('./controllers/loanController');
    const logs = require('./controllers/loggingController');

    const restify = require('restify');
    const path = require('path');

    app.get('/', restify.serveStatic({
        directory: path.join(__dirname, 'views'),
        file: 'index.html'
    }));

    app.post('/createCustomer', customer.createCustomer); //Create Customer API
    app.get('/getCustomer/:customerID', customer.getCustomer);  // Get one Customer Details API
    app.get('/getCustomers', customer.getCustomers);  // Get All Customer Details API
    app.put('/updateCustomer', customer.updateCustomer); // Update Customer details

    app.post('/createLoan', loan.createLoan); // create loan API
    app.get('/getLoans', loan.getLoans); // get loan details
    app.get('/getLoan/:loanID', loan.getLoan); // get one loan
    app.put('/updateLoan', loan.updateLoan); //Update Loan Details
    app.put('/loanApproval', loan.loanApproval); //loan aproval

    app.get('/viewLogs', logs.viewLogs); // View Logs
};