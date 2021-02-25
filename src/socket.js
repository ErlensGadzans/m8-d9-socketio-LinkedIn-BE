const socketio = require("socket.io");

//CONNECTING SOCKETJS TO SERVERJS
const createSocketServer = (server) => {
  const io = socketio(server);
  //event when socket connect to server
  io.on("connection", (socket) => {
    console.log(`New socket connection -> ${socket.id}`); //every connection has uniq ID. Regenirated for every connection

    socket.on("message", () => {});
  });
};

module.exports = createSocketServer;
