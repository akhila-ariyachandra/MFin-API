// Model for Area
schema = {
    name: { type: String, required: true },
    postalCode: { type: Number, required: true},
    district: {type: String, required: true},
};

collectionName = "area";
const areaSchema = mongoose.Schema(schema);
areaSchema.plugin(autoIncrement, { inc_field: "areaID" });
const Area = mongoose.model(collectionName, areaSchema);
