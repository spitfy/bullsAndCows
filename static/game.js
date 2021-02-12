var socket = io();
let socketId;
socket.on('connect', function() {
    socketId = socket.id;
    console.log(socket.id);
});


var movement = {
    up: false,
    down: false,
    left: false,
    right: false
}
const sendBtn = document.getElementById('sendBtn');
const setBtn = document.getElementById('setBtn');
const guessNum = document.getElementById('guessNum');
const myNum = document.getElementById('myNum');
const guessNumbers = document.getElementById('guessNumbers');
const myNumbers = document.getElementById('myNumbers');
let number;
sendBtn.addEventListener('click', function() {
    if (checkUnique(guessNum.value.split(''))) {
        socket.emit('request', guessNum.value);
        guessNum.classList.remove('warning');
    } else {
        guessNum.classList.add('warning');
    }
});
setBtn.addEventListener('click', function() {
    if (checkUnique(myNum.value.split(''))) {
        socket.emit('init', myNum.value);
        setBtn.setAttribute('disabled', true);
        myNum.setAttribute('disabled', true);
        myNum.classList.remove('warning');
    } else {
        myNum.classList.add('warning');
    }
});

socket.on('response', function(data) {
    console.log(data);
    if (data.id == socketId) {
        guessNumbers.innerHTML += data.num + ' - ' + ((+data.bulls + +data.cows) > 0 ? data.bulls + 'Б ' + data.cows + 'К' : 'пусто') + '<br/>';
    } else {
        myNumbers.innerHTML += data.num + ' - ' + ((+data.bulls + +data.cows) > 0 ? data.bulls + 'Б ' + data.cows + 'К' : 'пусто') + '<br/>';
    }
});

const checkUnique = (array) => {
    var unique = array.filter((value, index, self) => {
        return self.indexOf(value) === index;
    });
    return array.length === unique.length;
}


socket.emit('new player');
setInterval(function() {
    socket.emit('movement', movement);
}, 1000 / 60);