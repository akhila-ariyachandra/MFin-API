/*--------------------Routes--------------------*/
// Router is used for all the protected routes
const router = express.Router(); // Create instance of express router
const path = require("path");

// Protect routes with authentication middleware
router.use(authenticate);

router.route("/customer")
    // Create a Customer
    .post(createCustomer)
    // Get all Customers
    .get(getCustomers);

router.route("/customer/:customerID")
    // Get the Customer with this ID
    .get(getCustomer)
    // Update the Customer with this ID
    .put(updateCustomer);

router.route("/loan")
    // Create a Loan
    .post(createLoan)
    // Get all Loans
    .get(getLoans);

router.route("/loan/:loanID")
    // Get the Loan with this ID
    .get(getLoan)
    // Update the Loan with this ID
    .put(updateLoan);

router.route("/cashCollector")
    // Create a Cash Collector
    .post(createCashCollector)
    // Get all Cash Collectors
    .get(getCashCollectors);

router.route("/cashCollector/:cashCollectorID")
    // Get the Cash Collector with this ID
    .get(getCashCollector)
    // Update the Cash Collector with this ID
    .put(updateCashCollector);

router.route("/area")
    // Create an Area
    .post(createArea)
    // Get all Areas
    .get(getAreas);

router.route("/area/:areaID")
    // Get the Area with this ID
    .get(getArea)
    // Update the Area with this ID
    .put(updateArea);

router.route("/user")
    // Get all Users
    .get(getUsers);

router.route("/user/:username")
    // Get the User with this username
    .get(getUser)
    // Update the User with this username
    .put(updateUser);

router.route("/transaction")
    // Create an Transaction
    .post(createTransaction)
    // Get all Transactions
    .get(getTransactions);

router.route("/transaction/:transactionID")
    // Get the Transaction with this ID
    .get(getTransaction)
    // Update the Transaction with this ID
    .put(updateTransaction);

// Unprotected routes
// View documentation
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/index.html"));
});

// Create a User 
app.post("/user", createUser);

// Authenticate User
app.post("/authenticate", authenticateUser);

// View log
app.get("/log", function (req, res) {
    res.sendFile(path.join(__dirname + "/access.log"));
});

// Register routes
// Prefix all protected routes with /api
app.use("/api", router);
