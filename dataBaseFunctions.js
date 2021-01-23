var mongojs = require("mongojs");

var url = 'mongodb://104.207.128.199/hackDatabase';

// put collections needed in here
var collections = ['myCollection'];

var assert = require('assert');

var DBRef = mongojs(url, collections);

// the following are anonymous functions that will be used in index.js
// example
// module.exports.doSomething = function(Data, callback) {
//     DBRef.collection('myCollection').save(Data, function(err, result) {
//	  if (err) {
//	      console.log(err)
//	 } else {
//	      Do stuff with data here
//	 }
//     }
// };
