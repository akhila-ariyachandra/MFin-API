/*--------------------Server--------------------*/
'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var config = require('config');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var portNo = process.env.PORT || config.port;
