/*--------------------Server--------------------*/
'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var config = require('config');
var morgan = require('morgan');
var jwt = require('jsonwebtoken');
var fs = require('fs');
var path = require('path');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// create a write stream (in append mode) 
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'})

// use morgan to log requests to the log file
app.use(morgan('combined', {stream: accessLogStream}));
// use morgan to log requests to the console
app.use(morgan('dev'));

app.set('superSecret', config.secret); // secret variable

var portNo = process.env.PORT || config.port;
