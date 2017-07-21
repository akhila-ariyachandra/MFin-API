// Model for the Counter
schema = {
    id: { type: String, required: true },
    seq: { type: Number, required: true }
};

collectionName = "counter";
const counterSchema = mongoose.Schema(schema);
const Counter = mongoose.model(collectionName, counterSchema);
