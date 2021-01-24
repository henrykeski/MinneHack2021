var express = require('express');
var queryParser = require('body-parser');
const querystring = require('querystring');
const https = require('https');
const app = express();

app.set("port", 42069);

var automatic = true;
var priority = "balanced" // can be "main", "rain", or "balanced"

app.use(queryParser.urlencoded({
	extended: true
}));

app.use(queryParser.json());

var dataBase = require('./dataBaseFunctions.js');
var hardware = require('./hardwareFunctions.js');
var weather = require('./weatherFunctions.js');

/* Mode Switching */
app.get('/getMode', function(req, res) {
		var docs = {
			'automatic': automatic
		};
		res.status(200).send(docs);
});

app.put('/putMode', function(req, res) {
	if (req.body == null) res.status(400);
	else {
		automatic = req.body.automatic;
		var docs = {
			"automatic": automatic
		};
		res.status(200).send(docs);
	}
});
/* End Mode Switching */

app.get('/getPriority', function(req, res) {
		var docs = {
			'priority': priority
		};
		res.status(200).send(docs);
});

app.put('/putPriority', function(req, res) {
	if (req.body == null) res.status(400);
	else {
		priority = req.body.priority;
		var docs = {
			"priority": priority
		};
		res.status(200).send(docs);
	}
});

app.get('/getWaterLevel', function(req, res) {
    hardware.getWaterLevel(null, function(docs) {
        if (docs != null) {
            res.status(200).send(docs);
        } else {
            res.status(400);
        }
    });
});

app.get('/getWaterLevelPoints', function(req, res) {
    dataBase.getWaterLevelPoints(null, function(docs) {
        if (docs != null) {
            res.status(200).send(docs);
        } else {
            res.status(400);
        }
    });
});

app.put('/getFlowRate', function(req, res) {
    dataBase.getFlowRate(req.body, function(docs) {
        if (docs != null) {
            res.status(200).send(docs);
        } else {
            res.status(400);
        }
    });
});

// app.get('/getFlowRatePoints', function(req, res) {
//     dataBase.getFlowRatePoints(null, function(docs) {
//         if (docs != null) {
//             res.status(200).send(docs);
//         } else {
//             res.status(400);
//         }
//     });
// });

app.get('/getCurrentMode', function(req, res) {
    hardware.getCurrentMode(null, function(docs) {
        if (docs != null) {
            res.status(200).send(docs);
        } else {
            res.status(400);
        }
    });
});

app.get('/getWaterSource', function(req, res) {
    hardware.getWaterSource(null, function(docs) {
        if (docs != null) {
            res.status(200).send(docs);
        } else {
            res.status(400);
        }
    });
});

app.put('/recordWaterLevel', function(req, res) {
    hardware.getWaterLevel(null, function(docs) {
        if (docs == null) {
            res.sendStatus(400);
        } else {
            var data = {'level': docs.result,
                        'date': new Date()};
            dataBase.recordWaterLevel(data, function(doc) {
                // console.log(doc);
                res.status(200).send(doc);
            });
        }
    });
});

app.get('/avgDailyConsmpMonthRain', function(req, res) {
	dataBase.avgDailyConsmpMonthRain(null, function(docs) {
		if (docs != null) {
			res.status(200).send(docs);
		} else {
			res.sendStatus(400);
		}
	});
});

app.get('/avgDailyConsmpMonthMain', function(req, res) {
	dataBase.avgDailyConsmpMonthMain(null, function(docs) {
		if (docs != null) {
			res.status(200).send(docs);
		} else {
			res.sendStatus(400);
		}
	});
});

// app.put('/recordFlowRate', function(req, res) {
//     hardware.getFlowRate(null, function(docs) {
//         if (docs == null) {
//             res.sendStatus(400);
//         } else {
//             var data = {'rate': docs.result,
//                         'date': new Date()};
//             dataBase.recordFlowRate(data, function(doc) {
//                 console.log(doc);
//                 res.status(200).send(doc);
//             });
//         }
//     });
// });

app.post('/handle', function(req,res){

    var id = req.body._id;
    var task = req.body.args;
    var headers = req.headers;
    var func = req.body.func;   // ex. photonHandle
    var access_token = 'da75d772427c03de8c622dfe934592f44d5e23dc';

    var postData = querystring.stringify({
        'args': task
    });

		const options = {
        hostname: 'api.particle.io',
        port: 443,
        path: '/v1/devices/40003e001447363333343437/'+func+'?access_token='+access_token,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': postData.length
        }
    }

    const request = https.request(options, (response) => {
        //console.log('statusCode:', response.statusCode);
        //console.log('headers:', response.headers);

        response.on('data', (d) => {
            process.stdout.write(d);
        });
    });

		request.on('error', (e) => {
        console.error(e);
    });
    request.write(postData);
    request.end();

    //console.log("id ="+id+", task is "+task);
    //console.log(access_token);
    res.status(200).send({});
});

// to kill polling: clearInterval(flowRateTimer)
var flowRateTimer = setInterval(function() {
    var time = null;
    var volume = null;
    var source = null;
  	hardware.getTimeElapsed(null, function(docs) {
        if (docs == null) {
            console.log('time could not be retrieved');
        } else {
            time = docs.result;
						hardware.getVolumeElapsed(null, function(docs) {
				        if (docs == null) {
				            console.log('volume could not be retrieved');
				        } else {
				            volume = docs.result;
										var date = new Date();
								    hardware.resetValues(null, function(doc) {
								        if (doc == 'success') {
								            //console.log('values reset');
														hardware.getWaterSource(null, function(docs) {
																if (docs == null) {
																		console.log('source could not be retrieved');
																} else {
																		source = docs.result;
																		if (time === null || volume === null || source === null) {
																				console.log('Null value from polling');
																		} else {
																				var rate = volume / time;
																				var data = {'time': time,
																										'volume': volume,
																										'rate': rate,
																										'source': source,
																										'date': new Date()};
																				dataBase.recordFlowRate(data, function(doc) {
																						//console.log(doc);
																				});
																		}
																}
														});

								        } else {
								            console.log('values could not be reset');
								        }
								    });

				        }
				    });

        }
    });

		console.log('updating flowRateTimer');

}, 5 * 1000); // polled every 5 seconds


var waterLevelTimer = setInterval(function() {
    hardware.getWaterLevel(null, function(docs) {
        if (docs == null) {
            res.sendStatus(400);
        } else {
            var data = {'level': docs.result,
                        'date': new Date()};
            dataBase.recordWaterLevel(data, function(doc) {
                //console.log(doc);
            });
        }
    });
}, 60 * 1000); // polled every minute

var chooseMainOrRain = setInterval(function() {
    hardware.getWaterLevel(null, function(docs) {
        if (docs == null) {
            res.sendStatus(400);
        } else {
            var data = {'level': docs.result,
                        'date': new Date()};
            dataBase.recordWaterLevel(data, function(doc) {
                //console.log(doc);
            });
        }
    });
}, 60 * 1000); // polled every minute


// var getWeatherData = setInterval(function() {
//     weather.updatePrecipitationForecast(null, function(docs) {
//         if (docs == null) {
//             console.log("error, no docs in getWeatherData");
//         } else {
//             // var data = {'level': docs.result,
//             //             'date': new Date()};
//             dataBase.recordWeatherData(docs, function(doc) {
//                 //console.log(doc);
//             });
//         }
//     });
// }, 10 * 1000); // polled every 10 seconds


/* Run the Botnet algorithm here */
var CronJob = require('cron').CronJob;
var job = new CronJob({
		cronTime: '0 * * * *',
		onTick: function(automatic) {
			if (!automatic) return;

			/* Data Collection */
			var level, precip;
			hardware.getWaterLevel(null, function(docs) {
				if (docs == null) level = 50;
				else level = docs.result;
			});

			weather.getPrecipChance(null, function(docs) {
				if (docs == null) precip = 0;
				else precip = docs.result;
			});

			/* General Descision Making */

			// If tank below 15%, use main
			if (level < .15 * 4095) {
				priority = 'main';
			}

			// If raining AND waterLevel >= 80, use rain
			if (precip > 60 && level >= .8 * 4095) {
				priority = 'rain';
			}

			/* Priority Based Decision Making */

			// If priority "balanced", disregard following priorities
			if (priority == "balanced") return;
			else if (priority == "main") {
				// If priority "main", favor main

				var postData = {
					"func": "photonHandle",
					"args": "main"
				}
				var options = {
		        hostname: 'api.particle.io',
		        port: 443,
		        path: '/v1/devices/40003e001447363333343437/photonHandle?access_token=da75d772427c03de8c622dfe934592f44d5e23dc',
		        method: 'POST',
		        headers: {
		            'Content-Type': 'application/x-www-form-urlencoded',
		            'Content-Length': postData.length
		        }
		    }

		    var request = https.request(options, (response) => {
		        //console.log('statusCode:', response.statusCode);
		        //console.log('headers:', response.headers);

		        response.on('data', (d) => {
		            process.stdout.write(d);
		        });
		    });

				request.on('error', (e) => {
		        console.error(e);
		    });
		    request.write(postData);
		    request.end();
			} else {
				// If priority "rain", favor rain

				var postData = {
					"func": "photonHandle",
					"args": "rain"
				}
				var options = {
		        hostname: 'api.particle.io',
		        port: 443,
		        path: '/v1/devices/40003e001447363333343437/photonHandle?access_token=da75d772427c03de8c622dfe934592f44d5e23dc',
		        method: 'POST',
		        headers: {
		            'Content-Type': 'application/x-www-form-urlencoded',
		            'Content-Length': postData.length
		        }
		    }

		    var request = https.request(options, (response) => {
		        //console.log('statusCode:', response.statusCode);
		        //console.log('headers:', response.headers);

		        response.on('data', (d) => {
		            process.stdout.write(d);
		        });
		    });

				request.on('error', (e) => {
		        console.error(e);
		    });
		    request.write(postData);
		    request.end();
			}
		},
		start: true,
		timeZone: 'America/Chicago'
});
job.start();

app.listen(app.get("port"), function () {
    console.log('nodeServer running on port ', app.get("port"));
});

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
