// Model for Area
const mongoose = require("../db");
const autoIncrement = require("mongoose-sequence")(mongoose);

const schema = {
    name: { type: String, required: true },
    postalCode: { type: Number, required: true },
    district: { type: String, required: true },
};

const collectionName = "area";
const areaSchema = mongoose.Schema(schema);
areaSchema.plugin(autoIncrement, { inc_field: "areaID" });
const Area = mongoose.model(collectionName, areaSchema);

module.exports = Area;