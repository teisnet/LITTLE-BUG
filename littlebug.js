var port = "/dev/ttyACM0";
var baudrate = 115200;

var SerialPort = require("serialport").SerialPort
var serialPort = new SerialPort(port, { baudrate: baudrate }, false); // this is the openImmediately flag [default is true]

var errors = {
  serialOpenError: {err: "SERIAL_WRITE_ERROR", message: "Failed to open serial connection to controller"},
  serialWriteError: {err: "SERIAL_WRITE_ERROR", message: "Serial connection write to controller failed"}
  
  
}
var littlebug = {
  io: null,
  error: null
};

var isOpen = false;

openSerialPort();

serialPort.on('data', function(data) {
    //console.log('LITTLEBUG RECIEVED: ' + data);
  });
      
function openSerialPort() {
  serialPort.open(function (error) {
    if ( error ) {
      console.error('Failed to open serial connection to controller. ' + error);
      setError(errors.serialOpenError);
      setTimeout(function(){ openSerialPort() }, 4000);
    } else {
      setError(null);
      console.log('Serial connection established.');
      isOpen = true;
    }
  });
}



littlebug.send = function(data) {
  if (!isOpen) {
    console.error("Serial connection is closed. Cannot send " + data);
    return;
  }
  
  //console.log("LITTLEBUG: SENDING: " + data); 
  serialPort.write(data, function(err, results) {
     if (err || results == -1) {
      setError(errors.serialWriteError);
      console.error('Serial write error ' + (err || results) + ", trying to reconnect.");
      isOpen = false;
      serialPort.close(openSerialPort);
      return;
     }
     //console.log('LITTLEBUG SEND RESULT: ' + results);
   });
}


function setError(error) {
  if (error === littlebug.error) {
    return;
  }
  
  littlebug.error = error;
  
 if (littlebug.io) {
   littlebug.io.emit("boterror", error ? error.message : undefined);
 }
}

module.exports = littlebug;

