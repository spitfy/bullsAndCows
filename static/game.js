var socket = io();
let socketId;

socket.on('connect', function() {
    socketId = socket.id;
    console.log(socket.id);
});

const sendBtn = document.getElementById('sendBtn');
const setBtn = document.getElementById('setBtn');
const resetBtn = document.getElementById('resetBtn');
const guessNum = document.getElementById('guessNum');
const myNum = document.getElementById('myNum');
const guessNumbers = document.getElementById('guessNumbers');
const myNumbers = document.getElementById('myNumbers');

guessNum.oninput = function () {
    if (this.value.length > 4) {
        this.value = this.value.slice(0,4);
    }
}
myNum.oninput = function () {
    if (this.value.length > 4) {
        this.value = this.value.slice(0,4);
    }
}
resetBtn.addEventListener('click', function() {
    socket.emit('restart', true);
});
sendBtn.addEventListener('click', function() {
    if (checkUnique(guessNum.value.split(''))) {
        socket.emit('request', guessNum.value);
        guessNum.value = '';
        guessNum.classList.remove('warning');
    } else {
        guessNum.classList.add('warning');
    }
});
setBtn.addEventListener('click', function() {
    if (checkUnique(myNum.value.split(''))) {
        socket.emit('init', myNum.value);
        setBtn.disabled = true;
        myNum.disabled = true;
        myNum.classList.remove('warning');
    } else {
        myNum.classList.add('warning');
    }
});
socket.on('response', function(data) {
    if (data.start) { console.log(data);
        if (data.id != socketId) {
            sendBtn.disabled = true;
        }
        return;
    }
    if (data.id == socketId) {
        guessNumbers.innerHTML += data.num + ' - ' + ((+data.bulls + +data.cows) > 0 ? data.bulls + 'Б ' + data.cows + 'К' : 'пусто') + '<br/>';

        if (!data.win) {
            sendBtn.disabled = true;
        } else {
            sendBtn.disabled = false;
        }
        if (data.bulls == 4) {
            guessNumbers.innerHTML += 'Победа!<br/>';
            resetBtn.style.display = 'block';
        }
    } else {
        myNumbers.innerHTML += data.num + ' - ' + ((+data.bulls + +data.cows) > 0 ? data.bulls + 'Б ' + data.cows + 'К' : 'пусто') + '<br/>';
        sendBtn.disabled = false;

        if (data.bulls == 4) {
            myNumbers.innerHTML += 'Поражение!<br/>';
        }
    }
});
socket.on('reset', function() {
    resetBtn.style.display = 'none';
    setBtn.disabled = false;
    myNum.disabled = false;
    guessNumbers.innerHTML = '';
    myNumbers.innerHTML = '';
    myNum.value = '';
});

const checkUnique = (array) => {
    var unique = array.filter((value, index, self) => {
        return self.indexOf(value) === index;
    });
    return array.length === unique.length;
}
