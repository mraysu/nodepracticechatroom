console.log("Client-side running");

window.addEventListener("DOMContentLoaded", function (e) {
  console.log("DOM Loaded");
  const button = document.getElementById("button");
  const inputField = document.getElementById("message");
  const chatbox = document.getElementById("chatbox");
  let chat_messages = [];

  // Socket representing server
  socket = new WebSocket("ws://localhost:3000/");

  socket.addEventListener("open", () => {
    console.log("connected to web server");
  });

  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.request === "set_id") {
      socket.id = message.data.id;
      console.log("assigned id: ", socket.id);
    }
    if (message.request === "set_chatbox") {
      chat_messages = message.data;
      console.log("Chatbox synched with server");
    }
    if (message.request === "chat_message") {
      console.log(
        "Client " + message.data.id + " sent: " + message.data.message
      );
      chat_messages.push(message.data);
    }

    let innerHTML = "";
    chat_messages.forEach((value) => {
      innerHTML += "<p> Client " + value.id + ": " + value.message;
    });
    chatbox.innerHTML = innerHTML;
  });

  button.addEventListener("click", function (e) {
    const message = inputField.value;
    console.log("Button was clicked. Sent: ", message);
    inputField.value = "";
    socket.send(message);
    //chatbox.innerHTML = message;
  });
});
