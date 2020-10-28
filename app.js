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

const favicon = require("express-favicon");

app.use(favicon(__dirname + "/public/img/favicon-pirate.png"));

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

app.get("/profil", (req, res) => {
  res.render("profil");
});

// users is a key-value pairs of socket.id -> user name
let users = {};
io.on("connection", function (socket) {
  // Every socket connection has a unique ID
  console.log("new connection: " + socket.id);

  // User Logged in
  socket.on("login", (username) => {
    // Map socket.id to the name
    console.dir(username);
    const userData = { id: socket.id, name: username };
    socket.emit("logged", userData);
    socket.broadcast.emit("logged", userData);

    for (let k in users) {
      socket.emit("logged", users[k]);
    }

    users[socket.id] = userData;

    // Broadcast to everyone else (except the sender).
    // Say that the user has logged in.
    socket.broadcast.emit("msg", {
      from: { name: "server", isServer: true},
      message: `${username} logged in.`,
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
  });

  // Disconnected
  socket.on("disconnect", function () {
    // Remove the socket.id -> name mapping of this user
    socket.broadcast.emit("disconnected", users[socket.id]);

    //leaves the room
    if (users[socket.id] !== undefined) {
      socket.broadcast.emit("msg", {
        from: {name: "server", isServer: true},
        message: `${users[socket.id].name} logged out.`,
      });
    }
    console.log("disconnect: " + users[socket.id]);
    delete users[socket.id];
  });
});
