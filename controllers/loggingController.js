//This Controller deals with all functionalities of Customer
 
function loggingController () {
	const fs = require('fs');

	// View Logs
	this.viewLogs = function(req, res){
		var data = '';
		const readStream = fs.createReadStream('./logs/MFin.log', 'utf8');
		readStream.on('data', function(stream){
			data += stream;
		}).on('end', function(){
			res.send({'logs':data});
		});
	};
	 
	return this;
};
 
module.exports = new loggingController();