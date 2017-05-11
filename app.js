'use strict';
const restify = require('restify');
const config = require('./config');
const bunyan = require('bunyan');

const log = bunyan.createLogger({
    name: 'MFin',
    streams: [{
        type: 'rotating-file',
        path: 'logs/MFin.log',
        period: '1d',   // daily rotation
        count: 3        // keep 3 back copies
    }]
});

const app = restify.createServer({
	name: 'mfin-api',
	log: log
});

app.use(restify.fullResponse());
app.use(restify.bodyParser());
app.use(restify.queryParser());

const portNo = process.env.PORT || config.port;
 
app.listen(portNo, function() {
	console.log('%s listening at %s', app.name, app.url);
	
});

const routes = require('./routes')(app);