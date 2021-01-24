const https = require('https');


/* GET: waterLevel */
module.exports.getWaterLevel = function(req, callback) {
    const options = {
        hostname: 'api.particle.io',
        port: 443,
        path: '/v1/devices/40003e001447363333343437/waterLevel?access_token=da75d772427c03de8c622dfe934592f44d5e23dc',
        method: 'GET'
    };

    const request = https.request(options, (response) => {
        console.log('statusCode:', response.statusCode);
        console.log('headers:', response.headers);
        console.log("GOT WATER LEVEL");

        response.on('data', (d) => {
            console.log(JSON.parse(d));
            callback(JSON.parse(d));
            // process.stdout.write(d);
        });
    });

    request.on('error', (e) => {
        console.error(e);
    });
    request.end();
};

/* GET: flowRate */
module.exports.getFlowRate = function(req, callback) {
    const options = {
        hostname: 'api.particle.io',
        port: 443,
        path: '/v1/devices/40003e001447363333343437/flowRate?access_token=da75d772427c03de8c622dfe934592f44d5e23dc',
        method: 'GET'
    };

    const request = https.request(options, (response) => {
        //console.log('statusCode:', response.statusCode);
        //console.log('ogresponse.headers);

        response.on('data', (d) => {
            callback(JSON.parse(d));
            // process.stdout.write(d);
        });
    });
    request.on('error', (e) => {
        console.error(e);
    });
    request.end();
};

/* GET: currentMode */
module.exports.getCurrentMode = function(req, callback) {
    const options = {
        hostname: 'api.particle.io',
        port: 443,
        path: '/v1/devices/40003e001447363333343437/SOMETHINGHERE',
        method: 'GET'
    };

    const request = https.request(options, (response) => {
        //console.log('satusCode:', response.statusCode);
        //console.log('headers:', response.headers);

        response.on('data', (d) => {
            console.log(d);
            callback(JSON.parse(d));
        });
    });

    request.on('error', (e) => {
        console.error(e);
    });
    request.end();
};

/* GET: waterSource */
module.exports.getWaterSource = function(req, callback) {
    const options = {
        hostname: 'api.particle.io',
        port: 443,
        path: '/v1/devices/40003e001447363333343437/waterSource?access_token=da75d772427c03de8c622dfe934592f44d5e23dc',
        method: 'GET'
    };

    const request = https.request(options, (response) => {
        //console.log('satusCode:', response.statusCode);
        //console.log('headers:', response.headers);

        response.on('data', (d) => {
            callback(JSON.parse(d));
            // process.stdout.write(d);
        });
    });

    request.on('error', (e) => {
        console.error(e);
    });
    request.end();
};

/* GET: timeElapsed in seconds */
module.exports.getTimeElapsed = function(req, callback) {
    const options = {
        hostname: 'api.particle.io',
        port: 443,
        path: '/v1/devices/40003e001447363333343437/timeElapsed?access_token=da75d772427c03de8c622dfe934592f44d5e23dc',
        method: 'GET'
    };

    const request = https.request(options, (response) => {
        //console.log('statusCode:', response.statusCode);
        //console.log('headers:', response.headers);

        response.on('data', (d) => {
            callback(JSON.parse(d));
            // process.stdout.write(d);
        });
    });

    request.on('error', (e) => {
        console.error(e);
    });
    request.end();
};

/* GET: volumeElapsed */
module.exports.getVolumeElapsed = function(req, callback) {
    const options = {
        hostname: 'api.particle.io',
        port: 443,
        path: '/v1/devices/40003e001447363333343437/volumeElapsed?access_token=da75d772427c03de8c622dfe934592f44d5e23dc',
        method: 'GET'
    };

    const request = https.request(options, (response) => {
        //console.log('statusCode:', response.statusCode);
        //console.log('headers:', response.headers);

        response.on('data', (d) => {
            callback(JSON.parse(d));
            // process.stdout.write(d);
        });
    });

    request.on('error', (e) => {
        console.error(e);
    });
    request.end();
};

/* PUT: resetValues */
module.exports.resetValues = function(req, callback) {
    const options = {
        hostname: 'api.particle.io',
        port: 443,
        path: '/v1/devices/40003e001447363333343437/resetValues?access_token=da75d772427c03de8c622dfe934592f44d5e23dc',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': 0
        }
    };

    const request = https.request(options, (response) => {
        //console.log('statusCode: response.statusCode');
        //console.log('headers:', response.headers);

        response.on('data', (d) => {
            callback('success');
        });
    });

    request.on('error', (e) => {
        console.error(e);
    });
    request.end();
};
