// Model for Transaction
schema = {
    loanID: { type: Number, required: true },
    date: { type: Date, default: new Date(), required: true },
    amount: { type: Number, required: true },
    cashCollectorID: { type: Number, required: true },
    status: { type: String, default: "unpaid", required: true }
};

collectionName = "transaction";
const transactionSchema = mongoose.Schema(schema);
transactionSchema.plugin(autoIncrement, { inc_field: "transactionID" });
const Transaction = mongoose.model(collectionName, transactionSchema);
