// Model for Transaction
schema = {
    loanID: { type: Number, required: true },
    date: { type: Date, default: new Date() },
    amount: { type: Number, required: true },
    cashCollectorID: { type: Number, default: -1 },
    status: { type: String, default: "Unpaid" }
};

collectionName = "transaction";
var transactionSchema = mongoose.Schema(schema);
transactionSchema.plugin(autoIncrement, { inc_field: "transactionID" });
var Transaction = mongoose.model(collectionName, transactionSchema);
