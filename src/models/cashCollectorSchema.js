// Model for the Cash Collector
schema = {
    name: { type: String, required: true },
    surname: { type: String, required: true},
    nic: { type: String, required: true},
    address: { type: String, required:true},
    phone: { type: String, required:true},
    areaID: { type: Number, required: true }
};

collectionName = "cashCollector";
const cashCollectorSchema = mongoose.Schema(schema);
cashCollectorSchema.plugin(autoIncrement, { inc_field: "cashCollectorID" });
const CashCollector = mongoose.model(collectionName, cashCollectorSchema);
