// Model for the Customer
const mongoose = require("../db")
const autoIncrement = require("mongoose-sequence")(mongoose)
const Schema = mongoose.Schema

const schema = {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    nic: { type: String, required: true },
    address: { type: String, required: true },
    dob: { type: Date, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    area: {
        type: Schema.Types.ObjectId,
        ref: "area",
        required: true
    }
}

const collectionName = "customer"
const customerSchema = mongoose.Schema(schema)
customerSchema.plugin(autoIncrement, { "inc_field": "customerID" })
const Customer = mongoose.model(collectionName, customerSchema)

module.exports = Customer