/*--------------------Routes--------------------*/

var path = require('path');

app.get('/', restify.serveStatic({
    directory: path.join(__dirname, 'views'),
    file: 'index.html'
}));

app.post('/createCustomer', createCustomer); //Create Customer API
app.get('/getCustomer/:customerID', getCustomer);  // Get one Customer Details API
app.get('/getCustomers', getCustomers);  // Get All Customer Details API
app.put('/updateCustomer', updateCustomer); // Update Customer details

app.post('/createLoan', createLoan); // create loan API
app.get('/getLoans', getLoans); // get loan details
app.get('/getLoan/:loanID', getLoan); // get one loan
app.put('/updateLoan', updateLoan); //Update Loan Details
app.put('/loanApproval', loanApproval); //loan aproval

app.get('/viewLogs', viewLogs); // View Logs
