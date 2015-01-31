var SerialPortModule = {}

var SerialPort = SerialPortModule.SerialPort = function() {
}

var events = {};
var status = "closed";
var pending = false;

SerialPort.prototype.on = function(event, cb /*data*/){
	events[event] = cb;
}

SerialPort.prototype.open = function(cb /*error*/){
	if (pending) {
		cb("error opening while pending"); // Error
		return;
	}
	status = "open";
	cb();
	setTimeout(function(){
		status = "closed";
		pending = true;
		setTimeout(function(){ pending = false; }, 10000);
	}, 10000);
}

SerialPort.prototype.write = function(data, cb /*err, results*/){
	if (status === "closed") {
		cb("SP is closed");
		return;
	}
	
	res = data ? data.length : 0;
	cb(undefined, res);
	if (events.data) {
		events.data("!D-OK-*");
	}
}

SerialPort.prototype.close = function(cb/*void*/){
	cb();
}

// DISABLED
module.exports = SerialPortModule;
