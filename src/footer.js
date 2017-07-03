/*--------------------Footer--------------------*/

// Exports
module.exports = {
    Server : app, // Main server
    
    // Export models for use in test cases
    Customer : Customer, // Customer schema
    Loan : Loan, // Loan schema
    Counter : Counter, // Counter schema
    Transaction : Transaction, // Transaction schema
    CashCollector: CashCollector, // Cash Collector schema 
    Area: Area // Area Schema
};

// Start server
app.listen(portNo);
console.log('MFin API running on port ' + portNo);