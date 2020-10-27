//
//      CLIENT
//
var socket = io();
const $message = document.getElementById("message");
const sendmsg = (data) => {
  $message.appendChild(newItem(data));
};
const newItem = (content) => {
  const item = document.createElement("li");
  item.innerText = content;
  return item;
};

// //compteur
// socket.on("hello", (counter) => {
//   $events.appendChild(newItem(`hello - ${counter}`));
// });

socket.on("Welcome", (data) => {
  newItem(data);
  console.log(data);
  sendmsg(data);
});

socket.on("StoC", (data) => {
  newItem(data);
  console.log(data);
  sendmsg(data);
});

$("form").submit(function (e) {
  e.preventDefault(); // prevents page reloading
  socket.emit("CtoS", $("#m").val());
  $("#m").val("");
  return false;
});
