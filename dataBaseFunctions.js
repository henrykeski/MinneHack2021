var mongojs = require("mongojs");

const mongoURI = 'mongodb://admin:raspberrypi@localhost:27017/runoff?authSource=admin';

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

/* PUT: recordWaterLevel */
module.exports.recordWaterLevel = function(data, callback) {
    DBRef.collection('water-level').save(data, function(err, result){
        // console.log(data);
        if (err) {
            console.log(err);
        } else {
            // Completed
        }
    });
    callback(data);
};

/* PUT: recordFlowRate */
module.exports.recordFlowRate = function(data, callback) {
    var dbName;
    switch (data.source) {
        case 'main':
            dbName = 'mains-usage';
            break;
        case 'rain':
            dbName = 'rain-usage';
            break;
        default:
            dbName = 'mains-usage'; // issue here, changed to main for time being
    }
    // console.log(data.source);
    // console.log("\n\ndbName:\n\n" + dbName);

    DBRef.collection(dbName).save(data, function(err, result){
        if (err) {
            console.log(err);
        } else {
            // Completed
        }
    });
    callback(data);
};

module.exports.getFlowRate = function(data, callback){
  let col = data.waterSource;
  console.log("collection: " + col);
  // let startDate = new Date(data.startDate);
  // let endDate = new Date(data.endDate);
  // console.log("startDate: " + startDate);
  // console.log("endDate: " + endDate);
  DBRef.collection(col).find().sort({date:-1}).limit(1).toArray(function(err, result){
      if (err) {
          console.log(err);
      } else if (!result){
        console.log("No results!");
      }
       else {
         result = result;
         console.log(result);
         callback(result);
          // Completed
      }
  });
}

// module.exports.getFlowRatePoints = function(data, callback){
//   let col = data.waterSource;
//   console.log("collection: " + col);
//   let startDate = new Date(data.startDate);
//   let endDate = new Date(data.endDate);
//   // console.log("startDate: " + startDate);
//   // console.log("endDate: " + endDate);
//   DBRef.collection(col).find({date: {$gte:startDate, $lte:endDate}}).toArray(function(err, result){
//       if (err) {
//           console.log(err);
//       } else if (!result){
//         console.log("No results!");
//       }
//        else {
//          result = {pairs:result};
//          // console.log(result);
//          callback(result);
//           // Completed
//       }<com.jjoe64.graphview.GraphView

//   });
// }

/* GET: waterLevelPoints */
module.exports.getWaterLevelPoints = function(data, callback) {
    // let startDate = new Date(data.startDate);
    // let endDate = new Date(data.endDate);
    // console.log("startDate: " + startDate);
    // console.log("endDate: " + endDate);
    // DBRef.collection('water-level').find({date: {$gte:startDate, $lte:endDate}}).limit(100).toArray(function(err, result){
    //     if (err) {
    //         console.log(err);
    //     } else if (!result){
    //       console.log("No results!");
    //     }
    //      else {
    //        result = {pairs:result};
    //        // console.log(result);
    //        callback(result);
    //         // Completed
    //     }
    // });

    DBRef.collection('water-level').aggregate([
      {
        $match: {"date": {$gte: new Date(new Date().getFullYear(), new Date().getMonth - 1, new Date().getDate())}}
      },
      {
        $group: {
          _id: {$dateToString: {format: "%m-%d", date: "$date"}},
          dailyAvgLevel: {$avg: "$level"}
        },
      },
      {
        $sort: {_id: 1}
      }
    ]).toArray(function(err, result) {
      if (err) {
        console.log(err);
      } else if (!result) {
        console.log("No results!");
      } else {
        result = {pairs:result};
        callback(result);
      }
    });
};

/* PUT: recordWeatherData */
module.exports.recordWeatherData = function(data, callback) {
    DBRef.collection('weather').save(data, function(err, result){
        // console.log(data);
        if (err) {
            console.log(err);
        } else {
            // Completed
        }
    });
    callback(data);
};

/* GET: avgDailyConsmpMonth */
module.exports.avgDailyConsmpMonthRain = function(data, callback) {
    DBRef.collection('rain-usage').aggregate([
      {
        $match: {"date": {$gte: new Date(new Date().getFullYear(), new Date().getMonth - 1, new Date().getDate())}}
      },
      {
        $group: {
          _id: {$dateToString: {format: "%m-%d", date: "$date"}},
          dailyVolume: {$sum: "$volume"},
        }
      },
      {
        $sort: {_id: 1}
      }
    ]).toArray(function(err, result){
      if (err) {
        console.log(err);
      } else if (!result) {
        console.log("No results!");
      } else {
        result = {pairs:result};
        callback(result);
      }
    });
};

/* GET: avgDailyConsmpMonthMain */
module.exports.avgDailyConsmpMonthMain = function(data, callback) {
    DBRef.collection('mains-usage').aggregate([
      {
        $match: {"date": {$gte: new Date(new Date().getFullYear(), new Date().getMonth - 1, new Date().getDate())}}
      },
      {
        $group: {
          _id: {$dateToString: {format: "%m-%d", date: "$date"}},
          dailyVolume: {$sum: "$volume"},
        }
      },
      {
        $sort: {_id: 1}
      }
    ]).toArray(function(err, result){
      if (err) {
        console.log(err);
      } else if (!result) {
        console.log("No results!");
      } else {
        result = {pairs:result};
        callback(result);
      }
    });
};

/* GET: waterLevelPoints */
// module.exports.getFlowRatePoints = function(data, callback) {
//     let startDate = new Date(data.startDate);
//     let endDate = new Date(data.endDate);
//     let waterSource = data.waterSource;
//     console.log("startDate: " + startDate);
//     console.log("endDate: " + endDate);
//     DBRef.collection('water-level').find({date: {$gte:startDate, $lte:endDate}}).toArray(function(err, result){
//         if (err) {
//             console.log(err);
//         } else if (!result){
//           console.log("No results!");
//         }
//          else {
//           callback(result);
//             // Completed
//         }
//     });
// };




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
