// Model for the Counter
module.exports = (function counterSchema () {
 
	const mongoose = require('../db').mongoose;
	
	const schema = {
        id: {type: String, required: true},
        seq: {type: Number, required: true}
	};
	
	const collectionName = 'counter';
	const counterSchema = mongoose.Schema(schema);
	const Counter = mongoose.model(collectionName, counterSchema);
	
	return Counter;
})();