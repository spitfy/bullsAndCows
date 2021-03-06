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
let isFirst = true;
let win = false;
io.on('connection', function(socket) {
    //console.log('socket.id', socket.id);
    socket.on('init', function(num) {
        players[socket.id] = {
            num: num
        };
        if (!isFirst) return;
        io.sockets.emit('response', {id: socket.id, start: true});
        isFirst = false;
    });

    socket.on('request', function(data) {
        const letters = data.split('');
        let guess;
        let cows = 0;
        let bulls = 0;
        for (let player in players) {
            if (player == socket.id) continue;
            guess = players[player].num.split('');
            for (let i = 0; i < letters.length; i++) {
                if (guess.includes(letters[i])) {
                    cows++;
                }
                if (guess[i] == letters[i]) {
                    bulls++;
                }
            }
            cows = cows - bulls;
            if (bulls === 4) {
                win = true;
            }
        }
        const response = {
            id: socket.id,
            cows: cows,
            bulls: bulls,
            num: data,
            win: win
        };
        io.sockets.emit('response', response);
    });
    socket.on('restart', function() {
        for (let player in players) {
            players[player] = {
                num: 0
            };
        }
        io.sockets.emit('reset', {id: socket.id, start: true});
        isFirst = true;
    });
});
/*
setInterval(function() {
    io.sockets.emit('response', request);
}, 1000);

 */