const https = require('https');
// const http = require('http');
const parseXml = require('xml2js').parseString;

/* GET: waterLevel */
module.exports.updatePrecipitationForecast = function(req, callback) {
    // var lat = req.lat; // 38.99
    // var lon = req.lon; // 77.01
    // let startDate = new Date(data.startDate);
    // let endDate = new Date(data.endDate);

    const options = {
      hostname: 'api.weather.gov',
      port: 443,
      path: '/gridpoints/DLH/89,66/forecast',
        // hostname: 'graphical.weather.gov',
        // port: 443,
        // path:'/v1/devices/40003e001447363333343437/volumeElapsed?access_token=da75d772427c03de8c622dfe934592f44d5e23dc',
        // path: '/xml/sample_products/browser_interface/ndfdXMLclient.php?whichClient=NDFDgen&lat=38.99&lon=-77.01&listLatLon=&lat1=&lon1=&lat2=&lon2=&resolutionSub=&listLat1=&listLon1=&listLat2=&listLon2=&resolutionList=&endPoint1Lat=&endPoint1Lon=&endPoint2Lat=&endPoint2Lon=&listEndPoint1Lat=&listEndPoint1Lon=&listEndPoint2Lat=&listEndPoint2Lon=&zipCodeList=&listZipCodeList=&centerPointLat=&centerPointLon=&distanceLat=&distanceLon=&resolutionSquare=&listCenterPointLat=&listCenterPointLon=&listDistanceLat=&listDistanceLon=&listResolutionSquare=&citiesLevel=&listCitiesLevel=&sector=&gmlListLatLon=&featureType=&requestedTime=&startTime=&endTime=&compType=&propertyName=&product=time-series&begin=2021-01-24T00%3A00%3A00&end=2025-01-24T00%3A00%3A00&Unit=e&maxt=maxt&temp=temp&pop12=pop12&Submit=Submit',
        // path: '/xml/sample_products/browser_interface/ndfdXMLclient.php?whichClient=NDFDgen&lat=' + lat + '&lon=' + lon + '&listLatLon=&lat1=&lon1=&lat2=&lon2=&resolutionSub=&listLat1=&listLon1=&listLat2=&listLon2=&resolutionList=&endPoint1Lat=&endPoint1Lon=&endPoint2Lat=&endPoint2Lon=&listEndPoint1Lat=&listEndPoint1Lon=&listEndPoint2Lat=&listEndPoint2Lon=&zipCodeList=&listZipCodeList=&centerPointLat=&centerPointLon=&distanceLat=&distanceLon=&resolutionSquare=&listCenterPointLat=&listCenterPointLon=&listDistanceLat=&listDistanceLon=&listResolutionSquare=&citiesLevel=&listCitiesLevel=&sector=&gmlListLatLon=&featureType=&requestedTime=&startTime=&endTime=&compType=&propertyName=&product=time-series&begin=' + startDate.toISOString() + '&end=' + endDate.toISOString() + '&Unit=e&maxt=maxt&temp=temp&pop12=pop12&Submit=Submit',
        method: 'GET'
    };

    const request = https.request(options, (response) => {
        console.log('statusCode:', response.statusCode);
        console.log('headers:', response.headers);

        response.on('data', (data) => {
          console.log(data);
          callback(data);
              // parseXml(data, function (err, result){
              //   console.log(JSON.stringify(result));
              //   callback(JSON.stringify(result));
              // });
        });
    });

    request.on('error', (e) => {
        console.error(e);
    });
    request.end();
};

// REMEMBER CRON uses getPrecipChance; returns current precipChance
