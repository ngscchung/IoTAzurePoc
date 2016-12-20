 'use strict';
//var crypto = require('crypto');

var azureKeys = require('../azureKeys.js');

var resourceUri = "IoTPOCGateway.azure-devices.net/devices";
//one of the keys of the registryRead policy, can't add new device !?
// var signingKey = azureKeys.iothub_registryRead_key;
// var policyName = "registryRead";

//one of the keys of the service policy, can't add new device
// var signingKey = azureKeys.iothub_service_key;
// var policyName = "service";

//one of the keys of the registryReadWrite policy
var signingKey = azureKeys.iothub_registryReadWrite_key;
var policyName = "registryReadWrite";

// one of the keys of the iothubowner policy
// var signingKey = azureKeys.iothub_iothubowner_key
// var policyName = "iothubowner";

var expiresInMins = 15;
var common = require('../common.js');

var token = common.generateSasToken(resourceUri, signingKey, policyName, expiresInMins);
console.log(token);

var unirest = require('unirest');

var data = JSON.stringify({deviceId: 'ngscSecondDevice'});


//Add "Second Device"
unirest.put('https://IoTPOCGateway.azure-devices.net/devices/ngscSecondDevice?api-version=2016-02-03')
.header('Content-Type','application/json')
.header('Authorization', token)
.send(data)
.end(function (response) {
  console.log(response.body);
});

//Get "Second Device" information (Device Id, Keys, Status... etc)
unirest.get('https://IoTPOCGateway.azure-devices.net/devices/ngscSecondDevice?api-version=2016-02-03')
.header('Content-Type','application/json')
.header('Authorization', token)
.end(function (response) {
  console.log(response.body);
});

