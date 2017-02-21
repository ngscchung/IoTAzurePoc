 'use strict';

 var clientFromConnectionString = require('azure-iot-device-mqtt').clientFromConnectionString;
 var Message = require('azure-iot-device').Message;

 var azureKeys = require('../azureKeys.js');
 var connectionString = azureKeys.first_device_connectionString;
 

 var client = clientFromConnectionString(connectionString);

 function printResultFor(op) {
   return function printResult(err, res) {
     if (err) console.log(op + ' error: ' + err.toString());
     if (res) console.log(op + ' status: ' + res.constructor.name);
   };
 }

  var connectCallback = function (err) {
   if (err) {
     console.log('Could not connect: ' + err);
   } else {
     console.log('Client connected');

     // Create a message and send it to the IoT Hub every second
     setInterval(function(){
        
        var dataArray = []
        for (var i = 0; i < 3; i++){
            var windSpeed = 10 + (Math.random() * 4);
            var data1 = { deviceId: 'ngscFirstNodeDevice', windSpeed: windSpeed, dataArray: true };
            dataArray.push(data1);
        }
         //var data = JSON.stringify({ deviceId: 'ngscFirstNodeDevice', windSpeed: windSpeed });
         var data = JSON.stringify(dataArray);
         var message = new Message(data);
         console.log("Sending message: " + message.getData());
         client.sendEvent(message, printResultFor('send'));
     }, 10000);
   }
 };

 client.open(connectCallback);


