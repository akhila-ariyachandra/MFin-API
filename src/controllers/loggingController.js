//This Controller deals with all functionalities of Logging
 
function loggingController () {
	const fs = require('fs');
	const async = require('async');

	const dirPath = './logs/';

	// View Logs
	this.viewLogs = function(req, res){
		fs.readdir(dirPath, function (err, filesPath) {
    		if (err) throw err;
    		filesPath = filesPath.map(function(filePath){	//generating paths to file
        		return dirPath + filePath;
    		});
    		async.map(filesPath, function(filePath, cb){ //reading files or dir
        		fs.readFile(filePath, 'utf8', cb);
    		}, function(err, results) {
        		res.send(results);
    		});
		});
	};
	 
	return this;
};
 
module.exports = new loggingController();