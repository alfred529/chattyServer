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

    let usersConnected = {
      type: "userCount",
      content: wss.clients.size
    }
    wss.broadcast(JSON.stringify(usersConnected));



    ws.on('message', (msgData) => {

        const msg = JSON.parse(msgData);
        msg.id = uuidv4();

        switch (msg.type) {
            case "postMessage":

                msg.type = "incomingMessage";
                wss.broadcast(JSON.stringify(msg)); // broadcasts to all connected clients
                // ws.send(JSON.stringify(msg));    // only sends back to client

                break;
            case "postNotification":

                msg.type = "incomingNotification";
                wss.broadcast(JSON.stringify(msg)); // broadcasts to all connected clients

                break;
            default:
                // show an error in the console if the message type is unknown
                throw new Error("Unknown event type " + msg.type);
        }



    });


    // Set up a callback for when a client closes the socket. This usually means they closed their browser.
    ws.on('close', (ws) => {

      usersConnected = {
        type: "userCount",
        content: wss.clients.size
      }
      wss.broadcast(JSON.stringify(usersConnected));

    });
});