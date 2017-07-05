/*--------------------Server--------------------*/
'use strict';

var bodyParser = require('body-parser');
var compression = require('compression');
var config = require('config');
var express = require('express');
var app = express();
var fs = require('fs');
var jwt = require('jsonwebtoken');
var morgan = require('morgan');
var path = require('path');

global.Promise = require('bluebird');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.text());                                    
app.use(bodyParser.json({ type: 'application/json'})); 

// Use compression middleware
app.use(compression());

// create a write stream (in append mode) 
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

//don't show the log when it is test
if (config.util.getEnv('NODE_ENV') !== 'test') {
    // use morgan to log requests to the log file
    app.use(morgan('combined', { stream: accessLogStream }));
    // use morgan to log requests to the console
    app.use(morgan('dev'));
}

app.set('superSecret', config.secret); // secret variable

var portNo = process.env.PORT || config.port;
