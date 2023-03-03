var express = require('express');
var app = express();
var ObjectId = require('mongodb').ObjectId;

app.get('/', function(req, res, next) {	
		res.sendStatus(200);
});

module.exports = app;
