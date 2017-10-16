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
    phone: {
        work: { type: String, required: true },
        personal: { type: String }
    },
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    pin: { type: String, required: true },
    accountType: {
        type: String,
        enum: [
            "admin",
            "manager",
            "receptionist",
            "cashCollector",
        ],
        required: true
    },
    meta: {
        area: {
            type: Schema.Types.ObjectId,
            ref: "area"
        } // Used if the employee is a Cash Collector
    }
}

const collectionName = "employee"
const employeeSchema = mongoose.Schema(schema)
employeeSchema.plugin(autoIncrement, { "inc_field": "employeeID" })
const Employee = mongoose.model(collectionName, employeeSchema)

module.exports = Employee