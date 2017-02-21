var fs = require('fs');
var gracefulFs = require('graceful-fs');
gracefulFs.gracefulify(fs);

var config = require("../azureKeys.js");
var documentClient = require("documentdb").DocumentClient;
var client = new documentClient(config.endpoint, { "masterKey": config.primaryKey });

var databaseUrl = "dbs/" + config.database.id;
var collectionUrl = databaseUrl + "/colls/" + config.facility_collection.id;

function readFiles(dirname, onFileContent, onError) {
  fs.readdir(dirname, function(err, filenames) {
    if (err) {
      onError(err);
      return;
    }
    filenames.forEach(function(filename) {
      fs.readFile(dirname + filename, 'utf-8', function(err, content) {
        if (err) {
          onError(err);
          return;
        }
        onFileContent(filename, content);
      });
    });
  });
}

// var dataPath = 'D:/Desktop/GPS_DCD/Geofence/Geofence_data/';
var dataPath = '/Users/User/Work/Geofence_data/';

var data = {};
readFiles(dataPath, function(filename, content) {
  data[filename] = content;
  // console.log(filename);
  var facilityCode = filename.substring(0, filename.indexOf("."));
  // console.log(facilityCode);
  // console.log(content);
  var polygon = content.split(";").filter(function(val){
      if(val.indexOf(":") < 0){
          return false;
        } 
        return true;
    }).map(function(val){
        // console.log(val); 
        // return val;

        var pointArr = val.split(':').map(function(pointVal){
            return Number(pointVal);
            // return pointVal;
        });
        return pointArr.reverse();
    }
  );

  polygon.push(polygon[0]);
  
  var facilityGeo = {
    facilityCode: facilityCode,
    location: {
      type: "Polygon",
      coordinates: polygon
    }
  };
  console.log(JSON.stringify(facilityGeo));
  client.createDocument(collectionUrl, facilityGeo, (err, created) => {
                        if (err) {
                          throw err;
                        }
                        else {
                          console.log("Document Created! " + facilityGeo.facilityCode);
                        }
                    });
  

}, function(err) {
  throw err;
});
