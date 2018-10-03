// server.js

const express = require('express');
const SocketServer = require('ws').Server;
const WebSocket = require('ws');

const uuidv4 = require('uuid/v4');

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
    // Make the express server serve static assets (html, javascript, css) from the /public folder
    .use(express.static('public'))
    .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });


// Broadcast to all function
wss.broadcast = (data) => {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};


// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (msgData) => {
        console.log("msgData = ", msgData);

        const msg = JSON.parse(msgData);
        msg.id = uuidv4();
        console.log("msg with id = ", msg);


        wss.broadcast(JSON.stringify(msg)); // broadcasts to all connected clients
        // ws.send(JSON.stringify(msg));    // only sends back to client
    });


    // Set up a callback for when a client closes the socket. This usually means they closed their browser.
    ws.on('close', () => console.log('Client disconnected'));
});





// uuidv4();


// exampleSocket.onmessage = function(event) {
//   var f = document.getElementById("chatbox").contentDocument;
//   var text = "";
//   var msg = JSON.parse(event.data);
//   var time = new Date(msg.date);
//   var timeStr = time.toLocaleTimeString();

//   switch(msg.type) {
//     case "id":
//       clientID = msg.id;
//       setUsername();
//       break;
//     case "username":
//       text = "<b>User <em>" + msg.name + "</em> signed in at " + timeStr + "</b><br>";
//       break;
//     case "message":
//       text = "(" + timeStr + ") <b>" + msg.name + "</b>: " + msg.text + "<br>";
//       break;
//     case "rejectusername":
//       text = "<b>Your username has been set to <em>" + msg.name + "</em> because the name you chose is in use.</b><br>"
//       break;
//     case "userlist":
//       var ul = "";
//       for (i=0; i < msg.users.length; i++) {
//         ul += msg.users[i] + "<br>";
//       }
//       document.getElementById("userlistbox").innerHTML = ul;
//       break;
//   }

//   if (text.length) {
//     f.write(text);
//     document.getElementById("chatbox").contentWindow.scrollByPages(1);
//   }
// };