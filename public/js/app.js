window.addEventListener("load", () => {
  const $loginForm = document.getElementById("loginForm");
  const $nameInput = document.getElementById("nameInput");
  const $messageInput = document.getElementById("messageInput");
  const $messageForm = document.getElementById("messageForm");
  const $messagesContainer = document.getElementById("messagesContainer");
  const $onlineList = document.getElementById("onlineList");
  const $leaveBtn = document.getElementById("leaveBtn");
  const $typing = document.getElementById("typing");
  $leaveBtn.classList.add("hidden");
  // socket is the global object used to listen on incoming messages
  // and send (emit) ones to the server.
  let socket;
  let userId;
  let typing = false;
  let timeout = undefined;
  let globUser;
  function login(name) {
    // Create a socket connection
    socket = ioConnect();

    socket.on("connect", () => {
      userId = socket.id;
    });

    socket.emit("login", name);
  }

  $leaveBtn.addEventListener("click", function (event) {
    event.preventDefault();
    document.location.replace(document.location.origin);
  });

  // Login
  $loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    // Login with `name`
    let name = $nameInput.value;
    globUser = name;
    login(name);
    // Remove the login form and
    // show the chat message form
    $loginForm.remove();
    $messageForm.classList.remove("hidden");
    $leaveBtn.classList.remove("hidden");
  });

  // Send Message
  $messageForm.addEventListener("submit", function (event) {
    event.preventDefault();
    let message = $messageInput.value;
    $messageInput.value = "";
    // Send
    socket.emit("msg", message);
    typingTimeout();
  });

  function ioConnect() {
    socket = io();
    window.onunload = () => socket.close();

    //add to online liste of connected users
    //need fix server side
    //doesnt show previous connected
    socket.on("logged", (data) => {
      addToShowOnline(data);
    });

    //is the user typing
    $messageInput.addEventListener("keypress", function (event) {
      if ($messageInput.which != 13 && $messageInput != "") {
        typing = true;
        socket.emit("isTyping", { user: globUser, typing: true });
        clearTimeout(timeout);
        timeout = setTimeout(typingTimeout, 3000);
      } else {
        clearTimeout(timeout);
        typingTimeout();
      }
    });

    socket.on("isTyping", (data) => {
      if (data.typing == true) $typing.innerHTML = `${data.user} is typing...`;
      else $typing.innerHTML = "";
    });

    // Recieve Message
    socket.on("msg", (data) => {
      if (data.from.id && data.from.id === userId) {
        say("me", data.message);
      } else {
        say(data.from.name, data.message, data.from.isServer);
      }
    });

    socket.on("disconnected", function (user) {
      $(`#` + user.id).remove();
    });

    return socket;
  }

  function say(name, message, isFromServer = false) {
    if (isFromServer) {
      $messagesContainer.innerHTML += `<div class="chat-message server-notification">
        ${message}
      </div>`;
    } else {
      $messagesContainer.innerHTML += `<div class="chat-message">
        <span style="color: red; font-weight: bold;">${name}:</span> ${message}
      </div>`;
    }

    // Scroll down to last message
    $messagesContainer.scrollTop = $messagesContainer.scrollHeight;
  }

  function addToShowOnline(user) {
    $onlineList.innerHTML +=
      `<li class="list-group-item" id="` + user.id + `">${user.name}</li>`;
  }
  function debug() {
    console.log("debug");
  }
  function typingTimeout() {
    typing = false;
    socket.emit("isTyping", { user: globUser, typing: false });
  }
});
