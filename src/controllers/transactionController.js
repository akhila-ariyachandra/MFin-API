// This Controller deals with all functionalities of Transaction

// Calculating the next transaction for a customer
var getNextTransaction = function (req, res, next) {
    var customerID = req.params.customerID;

    // Get the loan details
    Loan.findOne({ 'customerID': customerID }, function (err, result) {
        if (err) {
            req.log.error('Error calculating transaction');
            return res.send({ 'error': err });
        }
        else {
            var loanID = result.loanID;
            var loanAmount = result.loanAmount;
            var interest = result.interest;
            var paymentAmount = loanAmount * (interest / 100);

            Transaction.create({
                loanID: loanID,
                amount: paymentAmount
            }, function (err, result) {
                if (err) {
                    req.log.error('Error calculating transaction');
                    return res.send({ 'error': err });
                }
                else {
                    res.log.info('New transaction calculated for customer: ', customerID);
                    return res.json(result);
                }
            });
        }
    });
};