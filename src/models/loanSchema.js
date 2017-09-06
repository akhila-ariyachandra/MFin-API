// Model for the Loan
const mongoose = require("../db");
const autoIncrement = require("mongoose-sequence")(mongoose);

const schema = {
    loanType: { type: String, required: true },
    date: { type: Date, required: true },
    loanAmount: { type: Number, required: true },
    duration: { type: Number, required: true },
    interest: { type: Number, required: true },
    customerID: { type: Number, required: true },
    manager: { type: String, default: "Not set", required: true },
    status: { 
        type: String, 
        enum: [
            "pending",
            "approved",
            "rejected"
        ],
        default: "pending", 
        required: true 
    }
};

const collectionName = "loan";
const loanSchema = mongoose.Schema(schema);
loanSchema.plugin(autoIncrement, { inc_field: "loanID" });
const Loan = mongoose.model(collectionName, loanSchema);

module.exports = Loan;