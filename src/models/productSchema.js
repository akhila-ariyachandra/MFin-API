"use strict"

// Model for the Product

// Get dependencies
const mongoose = require("../db")
const autoIncrement = require("mongoose-sequence")(mongoose)
const Schema = mongoose.Schema

const schema = {
    productName: { type: Schema.Types.String, required: true },
    description: { type: Schema.Types.String, required: true },
    minAmount: { type: Schema.Types.Number, required: true },
    maxAmount: { type: Schema.Types.Number, required: true },
    gracePeriod: { type: Schema.Types.Number, required: true },
    interestRate: { type: Schema.Types.Number, required: true },
    accruedInterest: { type: Schema.Types.Number, required: true },
    approvedBy: {
        type: Schema.Types.ObjectId,
        ref: "employee",
        required: true
    },
    validFrom: { type: Schema.Types.Date, required: true },
    validTo: { type: Schema.Types.Date, required: true }
}

const collectionName = "product"
const productSchema = mongoose.Schema(schema)
productSchema.plugin(autoIncrement, { "inc_field": "productID" })
const Product = mongoose.model(collectionName, productSchema)

module.exports = Product