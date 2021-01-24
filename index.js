var express = require('express');
var queryParser = require('body-parser');
const querystring = require('querystring');
const https = require('https');
const app = express();

app.set("port", 42069);

app.use(queryParser.urlencoded({
	extended: true
}));

app.use(queryParser.json());

var dataBase = require('./dataBaseFunctions.js');
var hardware = require('./hardwareFunctions.js');

app.get('/getWaterLevel', function(req, res) {
    hardware.getWaterLevel(null, function(docs) {
        if (docs != null) {
            res.status(200).send(docs);
        } else {
            res.status(400);
        }
    });
});

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

app.put('/recordWaterLevel', function (req, res) {
    hardware.getWaterLevel(null, function(docs) {
        if (docs == null) {
            res.sendStatus(400);
        } else {
            var data = {'level': docs.result};
            dataBase.recordWaterLevel(data, function(doc) {
                console.log(doc);
                res.status(200).send(doc);
            });
        }
    });
});

app.post('/handle', function(req,res){

    var id = req.body._id;
    var task = req.body.args;
    var headers = req.headers;
    var func = req.body.func;   // ex. photonHandle
    var access_token = req.get('da75d772427c03de8c622dfe934592f44d5e23dc');

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
        console.log('statusCode:', response.statusCode);
        console.log('headers:', response.headers);

        response.on('data', (d) => {
            process.stdout.write(d);
        });
    });

    request.on('error', (e) => {
        console.error(e);
    });
    request.write(postData);
    request.end();

    console.log("id ="+id+", task is "+task);
    console.log(access_token);
    res.status(200).send('data going back to the client');
});

// to kill polling: clearInterval(waterLevelTimer)
// var waterLevelTimer = setInterval(function() {

// }, 60 * 1000);

app.listen(app.get("port"), function () {
    console.log('nodeServer running on port ', app.get("port"));
});

// Corey's example https stuff
//
//
//
// const https = require('https');
// var privateKey  = fs.readFileSync('/etc/letsencrypt/live/hack.d.umn.edu/privkey.pem', 'utf8');
// var certificate = fs.readFileSync('/etc/letsencrypt/live/hack.d.umn.edu/fullchain.pem', 'utf8');
// var credentials = {key: privateKey, cert: certificate};
//
// const app = express();
//
// var httpsServer = https.createServer(credentials, app);
//
//
//
// const PORT = 3000;
// const api = require('./routes/api');
// app.use(cors());
// app.use(bodyParser.json());
// app.use('/api', api);
//
// //app.get('/', (req, res) => {
// //  res.send('Hello from server')
// //});
//
// // app.listen(PORT, () => {
// //   console.log('Server running on localhost:' + PORT);
// // });
// httpsServer.listen(PORT, () => {
//   console.log('HTTPS server listening on localhost:' + PORT);
//   });


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
