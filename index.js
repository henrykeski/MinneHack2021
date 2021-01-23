var express = require('express');
var queryParser = require('body-parser');

var app = express();

app.set("port", 42069);

app.use(queryParser.urlencoded({
	extended: true
}));

app.use(queryParser.json());

var dataBase = require('./dataBaseFunctions.js');

// example
// app.put('/doSometing', function (req, res) {
//     if (!req.body) {
//	  return res.sendStatus(400); //error
//     }
//     var data = { //json data };
//     dataBase.doSomething(data, function (doc) {
//	   res.send(doc);
//     });
// });
