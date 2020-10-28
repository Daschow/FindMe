window.addEventListener("load", () => {
  const $loginForm = document.getElementById("loginForm");
  const $nameInput = document.getElementById("nameInput");
  const $messageInput = document.getElementById("messageInput");
  const $messageForm = document.getElementById("messageForm");
  const $messagesContainer = document.getElementById("messagesContainer");
  const $onlineList = document.getElementById("onlineList");
  const $leaveBtn = document.getElementById("leaveBtn");

  // socket is the global object used to listen on incoming messages
  // and send (emit) ones to the server.
  let socket;
  // username is used to be compared with 'from' in 'msg' events
  let username;
  function login(name) {
    // Create a socket connection
    socket = ioConnect();
    username = name;
    socket.emit("login", name);
  }

  $leaveBtn.addEventListener("click", function (event) {
    event.preventDefault();
    document.location.reload(true);
  });

  // Login
  $loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    // Login with `name`
    let name = $nameInput.value;
    login(name);
    // Remove the login form and
    // show the chat message form
    $loginForm.remove();
    $messageForm.classList.remove("hidden");
  });

  // Send Message
  $messageForm.addEventListener("submit", function (event) {
    event.preventDefault();
    let message = $messageInput.value;
    $messageInput.value = "";
    // Send
    socket.emit("msg", message);
  });

  function ioConnect() {
    let socket = io();
    window.onunload = () => socket.close();

    //add to online liste of connected users
    //need fix server side
    //doesnt show previous connected
    socket.on("logged", (data) => {
      addToShowOnline(data);
    });

    // Recieve Message
    socket.on("msg", (data) => {
      if (data.from != username) {
        say(data.from, data.message);
      } else {
        say("me", data.message);
      }
    });

    socket.on("disconnected", function (user) {
      $(`#` + user.id).remove();
    });

    return socket;
  }

  function say(name, message) {
    $messagesContainer.innerHTML += `<div class="chat-message">
          <span style="color: red; font-weight: bold;">${name}:</span> ${message}
      </div>`;
    // Scroll down to last message
    $messagesContainer.scrollTop = $messagesContainer.scrollHeight;
  }

  function addToShowOnline(Onlineusername) {
    $onlineList.innerHTML +=
      `<p id="` + username.id + `">${Onlineusername}<br></p>`;
  }
  function removeToShowOnline(username) {
    $onlineList.innerHTML += `<p id="` + username.id + `">${username}<br></p>`;
  }
});
