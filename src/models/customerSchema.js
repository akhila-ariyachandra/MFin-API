// Model for the Customer
const mongoose = require("../db");
const autoIncrement = require("mongoose-sequence");

const schema = {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    nic: { type: String, required: true },
    address: { type: String, required: true },
    dob: { type: Date, required: true },
    phone: { type: String, required: true },
    areaID: { type: Number, required: true },
    longitude: { type: String, required: true },
    latitude: { type: String, required: true }
};

const collectionName = "customer";
const customerSchema = mongoose.Schema(schema);
customerSchema.plugin(autoIncrement, { inc_field: "customerID" });
const Customer = mongoose.model(collectionName, customerSchema);

module.exports = Customer;