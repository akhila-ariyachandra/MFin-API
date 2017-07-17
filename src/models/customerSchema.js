// Model for the Customer
schema = {
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

collectionName = "customer";
var customerSchema = mongoose.Schema(schema);
customerSchema.plugin(autoIncrement, { inc_field: "customerID" });
var Customer = mongoose.model(collectionName, customerSchema);
