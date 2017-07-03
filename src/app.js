/*--------------------Server--------------------*/
'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var config = require('config');
var morgan = require('morgan');
var jwt = require('jsonwebtoken');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));

app.set('superSecret', config.secret); // secret variable

var portNo = process.env.PORT || config.port;
