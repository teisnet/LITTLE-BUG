var buttonElements = { WALK: "walkButton", DANCE: "danceButton", STOP: "restButton" };

var colors = {
	rover: "gray",			//"#0088FF",
	overflowArrow: "#FF0000",	//"#FFFF00",
	walkArrow: "black",		//"#FF0088"
	walkOuter: "#000000",
	background: "#000000"
}


var socket = io.connect();

var sendCommandCount = 0;
var lastCommandTime = new Date();

function sendCommand(command) {
	var currentTime = new Date();
	// TODO: Force new command types (eg. STOP)
	if (currentTime - lastCommandTime > 50) {
		socket.emit("bot", command);
		log("Sending " + command + "(" + sendCommandCount++ + ")");
		lastCommandTime = currentTime;
	}
}

var walkExp = /^DX-?\d*Y-?\d*A\d*\*!$/i;

var recieveCommandCount = 0;

socket.on("bot", function (command) {
	log("Recieving " + command + "(" + recieveCommandCount++ +")");
	//console.log("Command: " + command);
	//console.log("WalkMatch: " + command.match(walkExp));
	/// /^$DX-?\d*Y-?\d*A\d*\*!$/i
	if (command.match(/^!D\*/i)) {
		//console.log("Command: STOP");
		if (mode !== "STOP")
			setStop(true);
	} else if (command.match(/^!W/i)) {
		var walkMatch = command.match(/^!WX(-?\d*)Y(-?\d*)A(-?\d*)\*/i);
		if (walkMatch) {
			//console.log("WALK: X = " + walkMatch[1] + ", Y = " + walkMatch[2] + ", A = " + walkMatch[3]);
			if (mode !== "WALK")
				setWalk();
			walk_x = walkMatch[1];
			walk_y = walkMatch[2];
			walk_r = 0.1 * walkMatch[3];
			redraw();
		}
	} else if (command.match(/^!D/i)) {
		var danceMatch = command.match(/^!DA(-?\d*)B(-?\d*)C(-?\d*)\*/i);
		if (danceMatch) {
			if (mode !== "DANCE")
				setDance();
			//console.log("DANCE: A = " + danceMatch[1] + ", B = " + danceMatch[2] + ", C = " + danceMatch[3]);
			orient_yaw = Number(danceMatch[1]);
			orient_pitch = Number(danceMatch[2]);
			orient_roll = Number(danceMatch[3]);
			redraw();
		}
	}
	
});

function log(message) {
	document.getElementById("info").innerHTML =	 message;
}

function setSelected(mode) {
	// Remove the 'selected' from previous selected button.
	for (var key in buttonElements) {
		if (!buttonElements.hasOwnProperty(key)) { continue; }
		var removeSelectedElement = buttonElements[key];
		document.getElementById(removeSelectedElement).className = document.getElementById(removeSelectedElement).className.replace(/(?:^|\s)selected(?!\S)/g , ''); // Remove class 'selected' from the classes of the element.
	}
	
	// Set the 'selected' class on the button element.
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

var resizeCount = 0;
function resize(ctx, width, height) {
	console.log("Resize count = " + resizeCount++);
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
