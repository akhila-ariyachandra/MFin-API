// Model for User
const mongoose = require("../db");

const schema = {
    username: { type: String, required: true },
    password: { type: String, required: true },
    pin: { type: String, required: true},
    admin: { type: Boolean, default: false }
};

collectionName = "user";
const userSchema = mongoose.Schema(schema);
const User = mongoose.model(collectionName, userSchema);

module.exports = User;