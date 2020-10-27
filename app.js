//
//      SERVER
//

//VARIABLES
var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
var express = require("express");
app.use("/js", express.static("js"));

//js path authorisation
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

//localhost
http.listen(3000, () => {
  console.log("listening on *:3000");
});

//server send welcome message
let msg = "Welcome to FindMe";
io.on("connect", (socket) => {
  socket.emit("Welcome", msg);
});

//Server receive message send it back and console log
io.on("connection", (socket) => {
  socket.on("CtoS", (msg) => {
    console.log("message: " + msg);
    socket.emit("StoC", msg);
  });
});
