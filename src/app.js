/*--------------------Server--------------------*/
'use strict';

var bluebird = require('bluebird');
var bodyParser = require('body-parser');
var compression = require('compression');
var config = require('config');
var express = require('express');
var app = express();
var fs = require('fs');
var jwt = require('jsonwebtoken');
var morgan = require('morgan');
var rfs = require('rotating-file-stream');

global.Promise = bluebird;

var logDirectory = __dirname;

// ensure log directory exists 
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

// create a rotating write stream 
var accessLogStream = rfs('access.log', {
  interval: '1d', // rotate daily 
  path: logDirectory
})

//don't show the log when it is test
if (config.util.getEnv('NODE_ENV') !== 'test') {
    // use morgan to log requests to the log file
    // (Displayed temporarily)
    //app.use(morgan('combined', { stream: accessLogStream })); 
    // use morgan to log requests to the console
    app.use(morgan('dev'));
}

app.set('superSecret', config.secret); // secret variable

var portNo = process.env.PORT || config.port;
