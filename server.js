// Зависимости
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
var io = socketIO(server);

app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));

// Маршруты
app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, 'index.html'));
});

// Запуск сервера
server.listen(5000, function() {
    console.log('Запускаю сервер на порте 5000');
});


/*setInterval(function() {
    io.sockets.emit('message', JSON.stringify({player: 123, nums: 123}));
}, 1000);
*/
var players = {};
let request;
io.on('connection', function(socket) {
    console.log('socket.id', socket.id);
    socket.on('new player', function() {
        players[socket.id] = {
            x: 300,
            y: 300
        };
    });
    socket.on('request', function(data) {
        request = data;
        console.log(data);
        io.sockets.emit('response', socket.id);
        console.log('socket.id', socket.id);
    });
    socket.on('movement', function(data) {
        var player = players[socket.id] || {};
        if (data.left) {
            player.x -= 5;
        }
        if (data.up) {
            player.y -= 5;
        }
        if (data.right) {
            player.x += 5;
        }
        if (data.down) {
            player.y += 5;
        }
    });
});
setInterval(function() {
    io.sockets.emit('response', request);
}, 1000);