var express = require("express");
const bodyParser = require("body-parser");
const WebSocket = require("ws");
const server = express();

const PORT = 8080;
const SOCKET_PORT = 3000;
const wss = new WebSocket.Server({ port: SOCKET_PORT });

var clientCount = 0;
var clients = new Map();
var serverside_chatbox = [];

function getUniqueID() {
  return clientCount++;
}

// WebSocket event handling
wss.on("connection", (ws) => {
  // socket representing client
  ws.id = getUniqueID();
  clients.set(ws.id, ws);
  console.log("Client " + ws.id + " connected.");

  ws.send(JSON.stringify({ request: "set_id", data: { id: ws.id } }));
  ws.send(JSON.stringify({ request: "set_chatbox", data: serverside_chatbox }));

  ws.on("message", (data) => {
    console.log("Client " + ws.id + " sent: " + data.toString());
    messageData = { id: ws.id, message: data.toString() };
    serverside_chatbox.push(messageData);
    clients.forEach(function (value, key, map) {
      value.send(
        JSON.stringify({
          request: "chat_message",
          data: messageData,
        })
      );
    });
  });

  // Event listener for client disconnection
  ws.on("close", () => {
    clients.delete(ws.id);
    console.log("Client ", ws.id, " disconnected.");
  });
});

server.use(express.static("public"));
server.use(bodyParser.urlencoded({ extended: true }));

server.listen(PORT, (err) => {
  if (err) console.log(err);
  console.log("Listening successfully to port ", PORT);
});

function clicked() {
  console.log("button was clicked");
}
