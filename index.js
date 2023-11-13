const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
app.use(cors());

app.use(express.static('public'));

const activeRooms = new Map(); // Map to store users in each room

function updateRoomList(socket) {
  const roomData = Array.from(activeRooms.entries()).map(([room, users]) => ({
    room,
    userCount: users.size
  }));

  socket.emit('updateRoomList', roomData);
}

io.on('connection', (socket) => {
  // Send the current list of active rooms to the newly connected user
  updateRoomList(socket);

  socket.on('joinRoom', (room, userName) => {
    socket.join(room);

    if (!activeRooms.has(room)) {
      activeRooms.set(room, new Set());
    }

    activeRooms.get(room).add(socket.id);

    io.to(room).emit('message', { userName: 'System', message: `${userName} joined the room` });

    updateRoomList(socket);
  });

  socket.on('sendMessage', (data) => {
    io.to(data.room).emit('message', { userName: data.userName, message: data.message });
  });

  

  socket.on('disconnect', () => {
    // Remove the disconnected user from the activeRooms map
    activeRooms.forEach((users, room) => {
      if (users.has(socket.id)) {
        users.delete(socket.id);

        if (users.size === 0) {
          // If no users left in the room, remove the room
          activeRooms.delete(room);
          io.to(room).emit('message', { userName: 'System', message: 'No users left in the room. The room has been closed.' });
        } else {
          io.to(room).emit('message', { userName: 'System', message: 'A user left the room' });
        }

        updateRoomList(socket);
      }
    });
  });
});

const port = 3000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
