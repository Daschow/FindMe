//
//      SERVER
//

var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
var express = require("express");
app.use("/js", express.static("js"));

//js path
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// io.on("connection", (socket) => {
//   console.log("a user connected");
//   socket.on("disconnect", () => {
//     console.log("user disconnected");
//   });
// });

//local host
http.listen(3000, () => {
  console.log("listening on *:3000");
});

//compteur
io.on("connect", (socket) => {
  let counter = 0;
  setInterval(() => {
    socket.emit("hello", ++counter);
  }, 1000);
});

//server sned message
let msg = "Welcome to FindMe";
io.on("connect", (socket) => {
  socket.emit("Welcome", msg);
});

//Server receive message and console log
io.on("connection", (socket) => {
  socket.on("CtoS", (msg) => {
    console.log("message: " + msg);
    socket.emit("StoC", msg);
  });
});
