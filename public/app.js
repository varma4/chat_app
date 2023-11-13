const socket = io()


let roomName = ""
let userName = ""

function createRoom() 
{
    roomName = document.getElementById("room_name").value.toLowerCase()
    userName = document.getElementById("user_name").value.toLowerCase()
    console.log(roomName, userName);

    if (roomName.trim() !== '' && userName !== '') {
        document.getElementById('detailsRoom').style.display = 'none';
        document.getElementById('chat-room').style.display = 'flex';
        socket.emit('joinRoom', roomName, userName);
    }
}

function sendMessage() 
{
    const message = document.getElementById("message_input").value
    if (message !== '') {
        socket.emit('sendMessage', { room: roomName, userName, message });
        document.getElementById('message_input').value = '';
    }
}

function showMessage(message) 
{
    const ul = document.getElementById("messages")
    const li = document.createElement('li')
    li.className = message.userName === userName ? 'right-message' : 'left-message';
    li.appendChild(document.createTextNode(`${message.userName}: ${message.message}`));
    ul.appendChild(li)
}

socket.on('message', (message) => {
    showMessage(message);
});
