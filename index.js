const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 3030;

app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
var number = 0;
io.on("connection", function(socket) {
  number++;
  io.emit("GET_ONLINE", { number });
  socket.on("LOGIN", function() {
    socket.emit("LOGIN", { id: socket.id });
  });
  socket.on("disconnect", function() {
    number--;
    socket.broadcast.emit("DISCONNECTED", { id: socket.id, number });
    console.log("user disconnectd");
  });
  socket.on("SEND_MESSAGE", function(data) {
    io.emit("SERVER_SEND_MESSAGE", data);
  });
  socket.on("TYPING", function(data) {
    io.emit("TYPING", data);
  });
});

http.listen(port, () => {
  console.log(`Server open port ${port}`);
});
