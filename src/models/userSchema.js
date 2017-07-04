// Model for User
schema = {
    username: { type: String, required: true },
    password: { type: String, required: true },
    admin: {type: Boolean, default: false}
}

collectionName = 'user';
var userSchema = mongoose.Schema(schema);
var User = mongoose.model(collectionName, userSchema);
