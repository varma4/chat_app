const express = require(`express`);
const app = express();
const http = require("http");
const socketIO = require(`socket.io`);

const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

io.on("connection", (socket) => {
  let userName;
  socket.on("join", (name) => {
    userName = name;
    // io.emit("join", userName);
    // Notify other users when someone joins with their name

    console.log(name, userName);
  });

  socket.on("chatMessage", (data) => {
    // Broadcast the message along with the user name
    io.emit("message", { userName: data.userName, message: data.message });
  });

  socket.on("disconnect", () => {
    // Notify other users when someone leaves with their name
    if (userName) {
      io.emit("message", `${userName} has left the chat.`);
    }
  });
});

server.listen(3000, () => {
  console.log(`up and running on port 3000`);
});
