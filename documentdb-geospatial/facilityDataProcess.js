var fs = require('fs');
var gracefulFs = require('graceful-fs');
gracefulFs.gracefulify(fs);

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

var data = {};
readFiles('D:/Desktop/GPS_DCD/Geofence/Geofence_data/', function(filename, content) {
  data[filename] = content;
  console.log(filename);
  var locCode = filename.substring(0, filename.indexOf("."));
  console.log(locCode);
  console.log(content);
  var polygon = content.split(";").filter(function(val){
      if(val.indexOf(":") < 0){
          return false;
        } 
        return true;
    }).map(function(val){
        console.log(val); 
        // return val;

        var pointArr = val.split(':').map(function(pointVal){
            return Number(pointVal);
        });
        return pointArr;
    }
  );
  
//   console.log(points);
}, function(err) {
  throw err;
});
