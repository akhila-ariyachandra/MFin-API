// Model for Transaction
const mongoose = require("../db");
const autoIncrement = require("mongoose-sequence")(mongoose);

const schema = {
    loanID: { type: Number, required: true },
    date: { type: Date, default: new Date(), required: true },
    amount: { type: Number, required: true },
    cashCollectorID: { type: Number, required: true },
    status: { type: String, default: "unpaid", required: true }
};

const collectionName = "transaction";
const transactionSchema = mongoose.Schema(schema);
transactionSchema.plugin(autoIncrement, { inc_field: "transactionID" });
const Transaction = mongoose.model(collectionName, transactionSchema);

module.exports = Transaction;