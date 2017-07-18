// Model for the Cash Collector
schema = {
    name: { type: String, required: true },
    surname: { type: String, required: true},
    nic: { type: String, required: true},
    address: { type: String, required:true},
    phone: { type: String, required:true},
    areaID: { type: String, required: true }
};

collectionName = "cashCollector";
var cashCollectorSchema = mongoose.Schema(schema);
cashCollectorSchema.plugin(autoIncrement, { inc_field: "cashCollectorID" });
var CashCollector = mongoose.model(collectionName, cashCollectorSchema);
