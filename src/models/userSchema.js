// Model for User
schema = {
    username: { type: String, required: true },
    password: { type: String, required: true },
    admin: { type: Boolean, default: false }
};

collectionName = "user";
const userSchema = mongoose.Schema(schema);
const User = mongoose.model(collectionName, userSchema);
