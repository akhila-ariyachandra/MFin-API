var restify = require('restify');
var config = require('./config');
var app = restify.createServer({name:'mfin-api'});
 
app.use(restify.fullResponse());
app.use(restify.bodyParser());
app.use(restify.queryParser());
 
app.listen(config.port, function() {
	console.log('Server listening on port number', process.env.PORT || config.port);
	
});

var routes = require('./routes')(app);