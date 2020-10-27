//
//      CLIENT
//

//VARIABLES
var socket = io();
const $message = document.getElementById("message");

// FUNCTIONS
const sendmsg = (data) => {
  $message.appendChild(newItem(data));
};
const newItem = (content) => {
  const item = document.createElement("li");
  item.innerText = content;
  return item;
};

// SOCKET.IO
//welcome message recivied by the server
socket.on("Welcome", (data) => {
  newItem(data);
  console.log(data);
  sendmsg(data);
});
//When message from server received
socket.on("StoC", (data) => {
  newItem(data);
  console.log(data);
  sendmsg(data);
});

//EVENT HANDLERS
//Submit
$("form").submit(function (e) {
  e.preventDefault(); // prevents page reloading
  socket.emit("CtoS", $("#m").val());
  $("#m").val("");
  return false;
});
