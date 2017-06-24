// Model for the Counter
schema = {
	id: { type: String, required: true },
	seq: { type: Number, required: true }
};

collectionName = 'counter';
var counterSchema = mongoose.Schema(schema);
var Counter = mongoose.model(collectionName, counterSchema);
