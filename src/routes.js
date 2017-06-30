/*--------------------Routes--------------------*/

app.get('/', restify.serveStatic({
    directory: __dirname,
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

app.get('/transaction/:customerID', getNextTransaction);

app.post('/cashCollector', createCashCollector); // Create Cash Collector
app.get('/cashCollector/:cashCollectorID', getCashCollector);  // Get one Cash Collector Details 
app.get('/cashCollector', getCashCollectors);  // Get All Cash Collector Details

app.post('/area', createArea); // Create Area 
app.get('/area/:areaID', getArea);  // Get one Area Details
app.get('/area', getAreas);  // Get All Area Details
app.put('/area', updateArea); // Update Area details

app.get('/logs', viewLogs); // View Logs
