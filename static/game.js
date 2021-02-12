var socket = io();
socket.on('message', function(data) {
    console.log(data);
});
socket.on('response', function(data) {
    console.log(data);
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
const numbers = document.getElementById('numbers');
let number;
sendBtn.addEventListener('click', function() {
    const guess =
    numbers.innerHTML += guessNum.value + '<br/>';
    if (number) {

    }
    socket.emit('request', text.value);
});
setBtn.addEventListener('click', function() {
    setBtn.setAttribute('disabled', true);
    myNum.setAttribute('disabled', true);
    number = myNum.value;
});


socket.emit('new player');
setInterval(function() {
    socket.emit('movement', movement);
}, 1000 / 60);