// Model for the Cash Collector
schema = {
    name: { type: String, required: true },
    areaID: { type: Number, required: true }
};

collectionName = "cashCollector";
var cashCollectorSchema = mongoose.Schema(schema);
cashCollectorSchema.plugin(autoIncrement, { inc_field: "cashCollectorID" });
var CashCollector = mongoose.model(collectionName, cashCollectorSchema);
