// This Controller deals with all functionalities of Transaction

// Calculating the next transaction for a customer
var getNextTransaction = function (req, res, next) {
    var customerID = req.params.customerID;

    // Get the loan details
    Loan.findOne({ "customerID": customerID })
        .then(function (result) {

            var loanID = result.loanID;
            var loanAmount = result.loanAmount;
            var interest = result.interest;
            var paymentAmount = loanAmount * (interest / 100);

            Transaction.create({
                loanID: loanID,
                amount: paymentAmount
            })
                .then(function (result) {
                    return res.json(result);
                })
                .catch(function (err) {
                    return res.send({ "error": err });
                });
        })
        .catch(function (err) {
            return res.send({ "error": err });
        });
};
