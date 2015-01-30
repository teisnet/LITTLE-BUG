var port = "/dev/ttyACM0";
var baudrate = 115200;

var SerialPort = require("serialport").SerialPort
var serialPort = new SerialPort(port, { baudrate: baudrate }, false); // this is the openImmediately flag [default is true]

var littlebug = {};

var isOpen = false;

openSerialPort();

function openSerialPort() {
  serialPort.open(function (error) {
    if ( error ) {
      console.log('LITTLEBUG: failed to open serial connection to controller: using ' + error);
    } else {
      console.log('LITTLEBUG: Serial connection established.');
      isOpen = true;
      serialPort.on('data', function(data) {
        console.log('LITTLEBUG RECIEVED: ' + data);
      });
    }
  });
}



littlebug.send = function(data) {
  if (!isOpen) {
    console.log("Port is closed");
    return;
  }
  
  console.log("LITTLEBUG: SENDING: " + data);  
  serialPort.write(data, function(err, results) {
     if (err || results == -1) {
      console.log('LITTLEBUG ERROR: ' + (err || results) + ", trying to reconnect.");
      isOpen = false;
      serialPort.close(openSerialPort);
      return;
     }
     console.log('LITTLEBUG SEND RESULT: ' + results);
   });
}



module.exports = littlebug;

