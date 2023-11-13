


const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
app.use(cors());

app.use(express.static('public'));

const activeRooms = new Set();

function updateRoomList(socket) {
    socket.emit('updateRoomList', [...activeRooms]);
  }
  

io.on('connection', (socket) => {
  // Send the current list of active rooms to the newly connected user
  updateRoomList(socket);

  socket.on('joinRoom', (room, userName) => {
    socket.join(room);
    activeRooms.add(room);
    io.to(room).emit('message', { userName: 'System', message: `${userName} joined the room` });

    updateRoomList(socket);
  });

  socket.on('sendMessage', (data) => {
    io.to(data.room).emit('message', { userName: data.userName, message: data.message });
  });

});

const port = 3000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
