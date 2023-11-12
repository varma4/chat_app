const express = require(`express`)
const http = require('http')
const socketIO = require("socket.io")

const app = express()
const server = http.createServer(app)
const io = socketIO(server)

app.use(express.static('public'))

//io is for all the clients
io.on('connection', (socket) =>{
    socket.on('joinRoom', (room, userName) => {
        socket.join(room)
        // socket.emit('message', room)
        // io.to(room).emit('message', `${userName}  has joined`)
        io.to(room).emit('message', {userName: userName, message: "joined"})
    })

    socket.on('sendMessage', (data) => {
        io.to(data.room).emit('message', { userName: data.userName, message: data.message })
    })

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
    

} )



const port = 3000

server.listen(port, () => {
    console.log(`up and running on port ${port}`);
})

