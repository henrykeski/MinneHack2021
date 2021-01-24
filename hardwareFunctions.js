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

        response.on('data', (d) => {
            callback(JSON.parse(d));
            process.stdout.write(d);
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
        console.log('satusCode:', response.statusCode);
        console.log('headers:', response.headers);

        response.on('data', (d) => {
            callback(JSON.parse(d));
            process.stdout.write(d);
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
        console.log('satusCode:', response.statusCode);
        console.log('headers:', response.headers);

        response.on('data', (d) => {
            callback(JSON.parse(d));
            process.stdout.write(d);
        });
    });

    request.on('error', (e) => {
        console.error(e);
    });
    request.end();
};
