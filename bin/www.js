#!/usr/bin/env node
var debug = require('debug')('EARTH ROWER NODEJS');
var app = require('../app');

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});


// Socket.io
var io = require('socket.io')(server);

io.on('connection', function (socket) {
    socket.on('bot', function (data) {
		console.log(data);
		socket.volatile.broadcast.emit('bot', data);
    });
});