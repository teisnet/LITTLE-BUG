var buttonElements = { WALK: "walkButton", DANCE: "danceButton", STOP: "restButton" };

var colors = {
	rover: "gray",			//"#0088FF",
	overflowArrow: "#FF0000",	//"#FFFF00",
	walkArrow: "black",		//"#FF0088"
	walkOuter: "#000000",
	background: "#000000"
}





var socket = io.connect();

function sendCommand(command) {
	socket.emit("rover", command);
	log(command);
}

function log(message) {
	document.getElementById("info").innerHTML =	 message;
}

function setSelected(mode) {
	
	for (var key in buttonElements) {
		if (!buttonElements.hasOwnProperty(key)) { continue; }
		var removeSelectedElement = buttonElements[key];
		document.getElementById(removeSelectedElement).className = document.getElementById(removeSelectedElement).className.replace(/(?:^|\s)selected(?!\S)/g , ''); // Remove class 'selected' from the classes of the element.
	}
	
	document.getElementById(buttonElements[mode]).className += " selected";
}

function hexagon(ctx, x, y, radius) {
	var sides = 6;
	var startAngle = 0;
	var anticlockwise = false;
	
	if (sides < 3) return;
	
	var a = (Math.PI * 2) / sides;
	a = anticlockwise?-a:a;
	ctx.save();
	ctx.translate(x, y);
	ctx.rotate(startAngle);
	ctx.moveTo(radius, 0);
	for (var i = 1; i < sides; i++) {
		ctx.lineTo(radius * Math.cos(a * i), radius * Math.sin(a * i));
	}
	ctx.closePath();
	ctx.restore();
}

var n = 0;

function resize(ctx, width, height) {
	if (window.devicePixelRatio === 2) {
		// Retina displays goes here

		// Double canvas size
		canvasElement.width = width * 2;
		canvasElement.height = height * 2;
		
		// Scale everything drawn to canvas
		ctx.scale(2, 2);
		
		// Set css with and height attributes
		canvasElement.style.width = width + "px";
		canvasElement.style.height = height + "px";
		//log("Resize2: " + width + " x " + height + ", " + n++);
	} else {
		ctx.canvas.width = width;
		ctx.canvas.height = height;
		
		//log("Resize1: " + width + " x " + height + ", " + n++);
	}
	
	ctx.translate(0.5, 0.5); // Should make sharp graphics?
	
}
