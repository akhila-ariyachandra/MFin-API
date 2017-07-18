// Model for Area
schema = {
    name: { type: String, required: true },
    postalCode: { type: Number, required: true},
    district: {type: String, required: true},
};

collectionName = "area";
var areaSchema = mongoose.Schema(schema);
areaSchema.plugin(autoIncrement, { inc_field: "areaID" });
var Area = mongoose.model(collectionName, areaSchema);
