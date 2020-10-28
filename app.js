const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const path = require("path");
const logger = require("morgan");
const bodyParser = require("body-parser");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  formatMessage,
} = require("./utils/users");

app.use("/public/js", express.static("js"));
app.use("/public/css", express.static("css"));
app.use(express.static(__dirname + "/public"));
const port = process.env.PORT || 3000;
app.set("port", port);

http.listen(port, () => {
  console.log("listening on port " + port);
});

// view engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// middleware
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.get("/", (req, res) => {
  res.render("chat");
});

app.get("/login", (req, res) => {
  res.render("login");
});

// users is a key-value pairs of socket.id -> user name
let users = {};
let me;
io.on("connection", function (socket) {
  // Every socket connection has a unique ID
  console.log("new connection: " + socket.id);

  for (let k in users) {
    console.log("this is the loop " + users[k]);
    socket.broadcast.emit("logged", users[k]);
  }

  // User Logged in
  socket.on("login", (user) => {
    // Map socket.id to the name
    console.dir(user);
    me = user;
    me.id = socket.id;
    user.id = users[socket.id];
    users[me.id] = me;

    socket.emit("logged", user);

    // Broadcast to everyone else (except the sender).
    // Say that the user has logged in.
    socket.broadcast.emit("msg", {
      from: "server",
      message: `${user} logged in.`,
    });
  });

  // Message Recieved
  socket.on("msg", (message) => {
    // Broadcast to everyone else (except the sender)
    socket.broadcast.emit("msg", {
      from: users[socket.id],
      message: message,
    });
    // Send back the same message to the sender
    socket.emit("msg", {
      from: users[socket.id],
      message: message,
    });
    // You could just do: io.emit('msg', ...)
    // which will send the message to all, including
    // the sender.
  });

  // Disconnected
  socket.on("disconnect", function () {
    // Remove the socket.id -> name mapping of this user
    socket.broadcast.emit("disconnected", users);
    //leaves the room
    socket.broadcast.emit("msg", {
      from: "server",
      message: `${users[socket.id]} logged out.`,
    });

    console.log("disconnect: " + users[socket.id]);
    delete users[socket.id];
    // io.emit('disconnect', socket.id)
  });
});
