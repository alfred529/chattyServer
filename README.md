Chatty Server
=============

The server used to run chattyApp, a minimal and light dev environment for ReactJS.
ChattyApp can be found at: https://github.com/alfred529/chattyApp

### Usage

Clone the chattyServer, and create your own git repo.

```
git clone https://github.com/alfred529/chattyServer
cd chattyServer
git remote rm origin
git remote add origin [YOUR NEW REPOSITORY]
# Manually update your package.json file
```

Install the dependencies and start the server.

```
npm install
npm node server.js
```

### Dependencies

* express "4.16.3",
* uuid "^3.3.2",
* ws "6.0.0"