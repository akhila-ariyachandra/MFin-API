// Model for the Loan
const mongoose = require("../db")
const autoIncrement = require("mongoose-sequence")(mongoose)
const Schema = mongoose.Schema

const schema = {
    product: {
        type: Schema.Types.ObjectId,
        ref: "product",
        required: true
    },
    date: { type: Date, required: true },
    loanAmount: { type: Number, required: true },
    duration: { type: Number, required: true },
    interest: { type: Number, required: true },
    customer: {
        type: Schema.Types.ObjectId,
        ref: "customer",
        required: true
    },
    manager: { 
        type: Schema.Types.ObjectId, 
        ref: "employee"
    },
    status: {
        type: String,
        enum: [
            "pending",
            "approved",
            "rejected",
            "closed",
            "opened",
            "completed"
        ],
        default: "pending",
        required: true
    }


}

const collectionName = "loan"
const loanSchema = mongoose.Schema(schema)
loanSchema.plugin(autoIncrement, { "inc_field": "loanID" })
const Loan = mongoose.model(collectionName, loanSchema)

module.exports = Loan