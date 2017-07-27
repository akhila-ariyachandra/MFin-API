// Model for the Counter
const mongoose = require("../db");

const schema = {
    id: { type: String, required: true },
    seq: { type: Number, required: true }
};

const collectionName = "counter";
const counterSchema = mongoose.Schema(schema);
const Counter = mongoose.model(collectionName, counterSchema);

module.exports = Counter;