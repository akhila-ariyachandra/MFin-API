/*--------------------Footer--------------------*/

// Exports
module.exports = {
    Server : app, // Main server
    
    // Export models for use in test cases
    Customer : Customer, // Customer schema
    Loan : Loan, // Loan schema
    Counter : Counter, // Counter schema
    Transaction : Transaction // Transaction schema
};