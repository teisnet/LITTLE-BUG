var width = -1; //window.innerWidth;
var height = -1; //window.innerHeight;
var dragging = false;
var mode = "STOP";

var fullWidth = -1;
var fullHeight = -1;

var canvasElement = document.getElementById("rover-canvas");
//canvasElement.width = width;
//canvasElement.height = height;

//log("Window: width = " + width + ", height = " + height);

var ctx = canvasElement.getContext("2d");
var q = 0;

resize(ctx, window.innerWidth, window.innerHeight);

function redraw() {
	// Background
    //ctx.fillStyle = colors.background;
	//ctx.fillRect(0, 0, canvasElement.width, canvasElement.height);
	ctx.clearRect(0 , 0 , canvasElement.width , canvasElement.height);
	
	//width = window.innerWidth;
	//height = window.innerHeight;

	//if (fullWidth != window.innerWidth || fullHeight != window.innerHeight) {
		fullWidth = window.innerWidth;
		fullHeight = window.innerHeight;
		resize(ctx, fullWidth, fullHeight);
		width = fullWidth;
		height = - 50 + fullHeight; // - 100;
		//height = fullHeight;
		//log(window.devicePixelRatio);
	//}


	//ctx.translate(0.5, 0.5); // Should make sharp graphics

    ctx.lineWidth = 30;
    if (mode == "WALK") {
        ctx.strokeStyle = colors.overflowArrow;
        ctx.beginPath();
        if (walk_r > 0) {
            ctx.arc(width / 2, height / 2, 40, -Math.PI / 2,
                                     -Math.PI / 2 + (walk_r / 50), false);
        }
        else {
            ctx.arc(width / 2, height / 2, 40, -Math.PI / 2 + (walk_r / 50),
                                     -Math.PI / 2, false);
        }
        //ctx.closePath();
        ctx.stroke();
    }
	ctx.lineWidth = 15;

    ctx.fillStyle = colors.rover;
	ctx.beginPath();
    // ctx.arc(width / 2, height / 2, 20, 0, Math.PI * 2, true);
    // ctx.closePath();
	hexagon(ctx, width / 2, height / 2, 40);
	ctx.fill();
	
	if (mode === "WALK" || mode === "DANCE") {
		
		var xPos = 0, yPos = 0;
		if (mode === "WALK") {
			xPos = width / 2 - walk_x / 40;
			yPos = height / 2 - walk_y / 40;
		} else if (mode === "DANCE") {
			xPos = width / 2 + orient_roll;
			yPos = height / 2 - orient_pitch;
		}
		
		// LINE
		ctx.strokeStyle = colors.walkArrow;
		ctx.beginPath();
		ctx.moveTo(width / 2, height / 2);
		ctx.lineTo(xPos, yPos);
		ctx.stroke();
		
		// CIRCLE
		var radius = 10;
		ctx.beginPath();
		ctx.arc(xPos, yPos, radius, 0, 2 * Math.PI, false);
		ctx.fillStyle = colors.rover;
		ctx.fill();
		ctx.lineWidth = 5;
		ctx.strokeStyle = colors.background;
		ctx.stroke();
	}
}

redraw();


canvasElement.addEventListener('mousemove', move_event, false);
canvasElement.addEventListener('mousedown', down_event, false);
canvasElement.addEventListener('mouseup', up_event, false);
canvasElement.addEventListener('touchend', up_event, false);
canvasElement.addEventListener('touchstart', touch_move_event, false);
canvasElement.addEventListener('touchmove', touch_move_event, false);
window.addEventListener('deviceorientation', orient_event, false);

function setWalk() {
	mode = "WALK";
	setSelected(mode);
    redraw();
}

function setDance() {
	mode = "DANCE";
	setSelected(mode);
    redraw();
}

function setStop() {
	mode = "STOP";
	setSelected(mode);
	//T/ socket.send("!D*\0");
	sendCommand("!D*\0");
    redraw();
}



function get_appropriate_ws_url() {
    var pcol;
    var u = document.URL;
    
    /*
	 * We open the websocket encrypted if this page came on an
	 * https:// url itself, otherwise unencrypted
	 */

	if (u.substring(0, 5) == "https") {
        pcol = "wss://";
        u = u.substr(8);
    } else {
        pcol = "ws://";
        if (u.substring(0, 4) == "http")
            u = u.substr(7);
    }
    
    u = u.split('/');
    
    return pcol + u[0];
}


//T var socket = new WebSocket(get_appropriate_ws_url(), "controller");

try {
    socket.onopen = function () {
  
    }
    
    socket.onmessage = function got_packet(msg) {
    // msg.data contains text
    }
    
    socket.onclose = function () {
  
    }
} catch (exception) {
    alert('<p>Error' + exception);
}

var orient_yaw = 0;
var orient_pitch = 0;
var orient_roll = 0;
var orient_factor = 0.15;

function orient_event(ev) {
    var new_yaw = Math.round(ev.alpha * 5);
    //new_yaw = 0;
    var new_pitch = -Math.round(ev.beta * 3);
    var new_roll = Math.round(ev.gamma * 5);
    
    if (new_yaw > 280) new_yaw = 280; if (new_yaw < -280) new_yaw = -280;
    if (new_pitch > 54) new_pitch = 54; if (new_pitch < -54) new_pitch = -54;
    if (new_roll > 100) new_roll = 100; if (new_roll < -100) new_roll = -100;
    
    orient_yaw += orient_factor * (new_yaw - orient_yaw);
    orient_pitch += orient_factor * (new_pitch - orient_pitch);
    orient_roll += orient_factor * (new_roll - orient_roll);
    
    orient_yaw = Math.round(orient_yaw);
    orient_pitch = Math.round(orient_pitch);
    orient_roll = Math.round(orient_roll);
    
    if (!dragging && mode == "DANCE") {
		//T/ socket.send("!DA" + orient_yaw + "B" + orient_pitch + "C" + orient_roll + "*\0");
		sendCommand("!DA" + orient_yaw + "B" + orient_pitch + "C" + orient_roll + "*\0");
    }
    redraw();
  //else 
  //  socket.send("!DX" + move_x + "Y" + move_y + "Z" + -orient_pitch*10+ "*\0");
}

var move_x = 0;
var move_y = 0;
var move_z = 0;

var walk_x = 0;
var walk_y = 0;
var walk_r = 0;

var move_factor = 0.2;

function touched_at(_x, _y) {
    switch (mode) {
        case "DANCE":
            if (dragging) {
                var new_x = Math.round(-(_x - width / 2) * 10);
                var new_y = Math.round(-(_y - height / 2) * 10);
                if (isNaN(new_x) || isNaN(new_y)) return;
                
                if (new_x > 1200) new_x = 1200; if (new_x < -1200) new_x = -1200;
                if (new_y > 1200) new_y = 1200; if (new_y < -1200) new_y = -1200;
                
                move_x += move_factor * (new_x - move_x);
                move_y += move_factor * (new_y - move_y);
                move_x = Math.round(move_x);
                move_y = Math.round(move_y);
                
                //T/ socket.send("!DX" + move_x + "Y" + move_y + "Z" + -orient_pitch * 10 + "*\0");
				sendCommand("!DX" + move_x + "Y" + move_y + "Z" + -orient_pitch * 10 + "*\0");
            }
            break;
        case "WALK":
            if (dragging) {
                if (_y - height / 2 < -100) {
                    // interpret as rotation
                    walk_r = -Math.round(-(_x - width / 2));
                    if (walk_r > 60) walk_r = 60;
                    if (walk_r < -60) walk_r = -60;
                    walk_x = 0;
                    walk_y = 0;
					//walk_r *= 10;
                } else {
                    var dX = Math.round(-(_x - width / 2) * 40);
                    var dY = Math.round(-(_y - height / 2) * 40);
                    if (isNaN(dX) || isNaN(dY)) return;
                    
                    if (dX > 3000) dX = 3000; if (dX < -3000) dX = -3000;
                    if (dY > 3000) dY = 3000; if (dY < -3000) dY = -3000;
                    
                    walk_x = Math.round(dX * 4 / 3);
                    walk_y = Math.round(dY * 4 / 3);
                    walk_r = 0;
                }
                
				//T/ socket.send("!WX" + walk_x + "Y" + walk_y + "A" + (walk_r * 10) + "*\0");
				sendCommand("!WX" + walk_x + "Y" + walk_y + "A" + (walk_r * 10) + "*\0");
                redraw();
            }
    }
}

function touch_move_event(ev) {
    dragging = true;
    var touch = ev.touches[0];
    touched_at(touch.pageX, touch.pageY);
}
function move_event(ev) {
    //if(!isNaN(ev.touches[0].pageX))
    //  touched_at(ev.touches[0].pageX, ev.touches[0].pageY);
    //else
    touched_at(ev.offsetX, ev.offsetY);
}
function down_event(ev) {
    dragging = true;
    move_event(ev);
}
function up_event(ev) {
    dragging = false;
}