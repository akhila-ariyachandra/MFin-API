/*--------------------Routes--------------------*/

var path = require('path');

app.get('/', restify.serveStatic({
    directory: path.join(__dirname, 'views'),
    file: 'index.html'
}));

app.post('/customer', createCustomer); //Create Customer API
app.get('/customer/:customerID', getCustomer);  // Get one Customer Details API
app.get('/customer', getCustomers);  // Get All Customer Details API
app.put('/customer', updateCustomer); // Update Customer details

app.post('/loan', createLoan); // create loan API
app.get('/loan', getLoans); // get loan details
app.get('/loan/:loanID', getLoan); // get one loan
app.put('/loan', updateLoan); //Update Loan Details
app.put('/loan', loanApproval); //loan aproval

app.get('/logs', viewLogs); // View Logs
