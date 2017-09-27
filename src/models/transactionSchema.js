// Model for Transaction
const mongoose = require("../db");
const autoIncrement = require("mongoose-sequence")(mongoose);
const Schema = mongoose.Schema;

const schema = {
    loan: { 
        type: Schema.Types.ObjectId,
        ref: "loan",
        required: true 
    },
    date: { type: Date, default: new Date(), required: true },
    amount: { type: Number, required: true },
    cashCollector: {
        type: Schema.Types.ObjectId,
        ref: "employee",
        required: true
    },
    status: { type: String, default: "unpaid", required: true }
};

const collectionName = "transaction";
const transactionSchema = mongoose.Schema(schema);
transactionSchema.plugin(autoIncrement, { inc_field: "transactionID" });
const Transaction = mongoose.model(collectionName, transactionSchema);

module.exports = Transaction;