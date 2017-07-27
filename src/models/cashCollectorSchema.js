// Model for the Cash Collector
const mongoose = require("../db");
const autoIncrement = require("mongoose-sequence");

const schema = {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    nic: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    areaID: { type: Number, required: true }
};

const collectionName = "cashCollector";
const cashCollectorSchema = mongoose.Schema(schema);
cashCollectorSchema.plugin(autoIncrement, { inc_field: "cashCollectorID" });
const CashCollector = mongoose.model(collectionName, cashCollectorSchema);

module.exports = CashCollector;