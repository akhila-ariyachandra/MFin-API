// This Controller deals with all functionalities of Transaction

// Creating a new Transaction
const createTransaction = (req, res) => {
    const loanID = req.body.loanID;
    const date = new Date();
    const amount = req.body.amount;
    const cashCollectorID = req.body.cashCollectorID;

    Transaction.create({
        "loanID": loanID,
        "date": date,
        "amount": amount,
        "cashCollectorID": cashCollectorID
    })
        .then((result) => {
            return res.json({ "result": result, "status": "successfully saved" });
        })
        .catch((err) => {
            return res.send({ "error": err });
        });
};

// Fetching Details of one Transaction
const getTransaction = (req, res) => {
    const transactionID = req.params.transactionID;

    Transaction.findOne({ "transactionID": transactionID })
        .then((result) => {
            return res.json(result);
        })
        .catch((err) => {
            return res.send({ "error": err });
        });
};

// Fetching Details of all Transactions
const getTransactions = (req, res) => {
    Transaction.find({})
        .then((result) => {
            return res.json(result);
        })
        .catch((err) => {
            return res.send({ "error": err });
        });
};

// Update Transaction details
const updateTransaction = (req, res) => {
    const transactionID = req.params.transactionID;

    // Get existing details of Transaction
    Transaction.findOne({ "transactionID": transactionID })
        .then((transaction) => {
            if (!transaction) {
                // If transaction doesn't exist i.e. the wrong transactionID was given
                return res.json({ "error": "Record does not exist" });
            }

            // Update details
            transaction.loanID = req.body.loanID;
            transaction.date = req.body.date;
            transaction.amount = req.body.amount;
            transaction.cashCollectorID = req.body.cashCollectorID;
            transaction.status = req.body.status;
            
            // Send data to database
            transaction.save()
                .then((result) => {
                    return res.json({ "result": result });
                })
                .catch((err) => {
                    return res.json({ "error": err });
                });
        })
        .catch((err) => {
            return res.json({ "error": err });
        });
};
