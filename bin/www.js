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
    socket.emit('news', { hello: 'world' });
    socket.on('rover', function (data) {
        console.log(data);
    });
    
    socket.on('', function (data) {
        console.log(data);
    });
});