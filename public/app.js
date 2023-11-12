// Update your client-side code

const socket = io();
let userName = sessionStorage.getItem('userName');

if (!userName) {
  userName = prompt('Enter your name:');
  sessionStorage.setItem('userName', userName);
}

// Emit the "join" event instead of "chat message"
socket.emit('join', userName);

// const joinedMessage = document.getElementById('joined-message');

// socket.on('welcome', (msg) => {
//   joinedMessage.textContent = msg + ' has joined the chat.';
// });


document.getElementById('form').addEventListener('submit', (e) => {
  e.preventDefault();

  const messageInput = document.getElementById('message');
  const message = messageInput.value.trim();

  if (message !== '') {
    // Send the message along with the user name
    socket.emit('chatMessage', { userName, message });
    messageInput.value = '';
  }
});

socket.on('message', (data) => {

  const messages = document.getElementById('messages');
  const li = document.createElement('li');
  li.className = data.userName === userName ? 'right-message' : 'left-message';
  li.appendChild(document.createTextNode(`${data.userName}: ${data.message}`));
  messages.appendChild(li);

  // Scroll to the bottom when a new message is received
  messages.scrollTop = messages.scrollHeight;
});
