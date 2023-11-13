

const socket = io();
let roomName = "";
let userName = "";


const storedRooms = JSON.parse(sessionStorage.getItem("storedRooms")) || [];

// Function to update the room list
function updateRoomList(rooms) {
  const roomList = document.getElementById("room-list");
  roomList.innerHTML = "";

  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.style.listStyle = "none";
    li.style.background = "lightblue";
    li.style.padding = "5px";
    li.style.margin = "5px";
    li.style.borderRadius = "10px";
    li.style.textAlign = "center";

    const roomInfo = `${room.room} (Users: ${room.userCount})`;
    li.appendChild(document.createTextNode(roomInfo));

    li.addEventListener("click", () => {
      document.getElementById("room_name").value = room.room;
    });

    roomList.appendChild(li);
  });
}






socket.on("updateRoomList", (rooms) => {
  updateRoomList(rooms);
});

function createRoom() {
  roomName = document.getElementById("room_name").value.toLowerCase();
  userName = document.getElementById("user_name").value.toLowerCase();
  console.log(roomName, userName);

  if (roomName.trim() !== "" && userName !== "") {
    storedRooms.push(roomName);
    sessionStorage.setItem("storedRooms", JSON.stringify(storedRooms));

    document.getElementById("detailsRoom").style.display = "none";
    document.getElementById("chat-room").style.display = "flex";
    document.getElementById('active-rooms').style.display = "none";
    socket.emit("joinRoom", roomName, userName);
  }
}

function sendMessage() {
  const message = document.getElementById("message_input").value;
  if (message !== "") {
    socket.emit("sendMessage", { room: roomName, userName, message });
    document.getElementById("message_input").value = "";
  }
}

function showMessage(message) {
  const ul = document.getElementById("messages");
  const li = document.createElement("li");
  li.className =
    message.userName === userName ? "right-message" : "left-message";
  li.appendChild(
    document.createTextNode(`${message.userName}: ${message.message}`)
  );
  ul.appendChild(li);
  ul.scrollTop = ul.scrollHeight;
}

socket.on("message", (message) => {
  showMessage(message);
});

