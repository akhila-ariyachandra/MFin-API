var restify = require('restify');
var config = require('./config');
var bunyan = require('bunyan');

var log = bunyan.createLogger({
    name: 'MFin',
    streams: [{
        type: 'rotating-file',
        path: 'logs/MFin.log',
        period: '1d',   // daily rotation
        count: 3        // keep 3 back copies
    }]
});

var app = restify.createServer({
	name: 'mfin-api',
	log: log
});

app.use(restify.fullResponse());
app.use(restify.bodyParser());
app.use(restify.queryParser());
 
app.listen(config.port, function() {
	console.log('Server listening on port number', process.env.PORT || config.port);
	
});

var routes = require('./routes')(app);