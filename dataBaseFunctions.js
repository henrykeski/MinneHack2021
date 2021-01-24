var mongojs = require("mongojs");

const mongoURI = 'admin:raspberrypi@104.207.128.199/runoff?authMechanism=SCRAM-SHA-1';

// put collections needed in here
var collections = ['mains-usage', 'rain-usage', 'water-level'];

var assert = require('assert');

const DBRef = mongojs(mongoURI, collections);

/* GET: avgDailyConsmp */
// module.exports.getAvgDailyConsump = function(callback) {
//     DBRef.collection('water-level').aggregate(
//
//     )
// }

/* POST: recordWaterLevel */
module.exports.recordWaterLevel = function(data, callback) {
    DBRef.collection('water-level').save(data, function(err, result){
        console.log(data);
        if (err) {
            console.log(err);
        } else {
            // Completed
        }
    });
    callback(data);
};


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

