const socketIO = require("socket.io");
const initialSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: "*",
    },
  });
  return io;
};
module.exports = { initialSocket };
