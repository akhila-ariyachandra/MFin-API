/*--------------------Routes--------------------*/
var router = express.Router(); // Create instance of express router

/*app.get('/', restify.serveStatic({
    directory: __dirname,
    file: 'index.html'
}));*/

router.route('/customer')
    // Create a Customer
    .post(createCustomer)
    // Get all Customers
    .get(getCustomers);

router.route('/customer/:customerID')
    // Get the Customer with this ID
    .get(getCustomer)
    // Update the Customer with this ID
    .put(updateCustomer);

router.route('/loan')
    // Create a Loan
    .post(createLoan)
    // Get all Loans
    .get(getLoans);

router.route('/loan/:loanID')
    // Get the Loan with this ID
    .get(getLoan)
    // Update the Loan with this ID
    .put(updateLoan);

router.route('/cashCollector')
    // Create a Cash Collector
    .post(createCashCollector)
    // Get all Cash Collectors
    .get(getCashCollectors);

router.route('/cashCollector/:cashCollector')
    // Get the Cash Collector with this ID
    .get(getCashCollector);

router.route('/area')
    // Create an Area
    .post(createArea)
    // Get all Areas
    .get(getAreas);

router.route('/area/:areaID')
    // Get the Area with this ID
    .get(getArea)
    // Update the Area with this ID
    .put(updateArea);

//router.get('/logs', viewLogs); // View Logs

// Register routes
// Prefix all routes with /api
app.use('', router);
