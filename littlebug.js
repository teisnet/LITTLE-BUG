var port = "/dev/ttyACM0";
var baudrate = 115200;

var SerialPort = require("serialport").SerialPort
var serialPort = new SerialPort(port, { baudrate: baudrate }, false); // this is the openImmediately flag [default is true]

var littlebug = {};


serialPort.open(function (error) {
  if ( error ) {
    console.log('LITTLEBUG: failed to open serial connection to controller: using ' + error);
  } else {
    console.log('LITTLEBUG: Serial connection established.');
    serialPort.on('data', function(data) {
      console.log('LITTLEBUG RECIEVED: ' + data);
    });
  }
});


littlebug.send = function(data) {
  console.log("LITTLEBUG: SENDING: " + data);  
  serialPort.write(data, function(err, results) {
     if (err) {
      console.log('LITTLEBUG ERROR: ' + err);  
      return;
     }
     console.log('LITTLEBUG SEND RESULT: ' + results);
   });
}



module.exports = littlebug;

