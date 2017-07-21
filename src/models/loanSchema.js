// Model for the Loan
schema = {
    loanType: { type: String, required: true },
    date: { type: Date, required: true },
    loanAmount: { type: Number, required: true },
    duration: { type: Number, required: true },
    interest: { type: Number, required: true },
    customerID: { type: Number, required: true },
    manager: { type: String, default: "Not set", required: true },
    status: { type: String, default: "Pending", required: true }
};

collectionName = "loan";
const loanSchema = mongoose.Schema(schema);
loanSchema.plugin(autoIncrement, { inc_field: "loanID" });
const Loan = mongoose.model(collectionName, loanSchema);
