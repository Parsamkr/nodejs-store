const { NamespaceSocketHandler } = require("./namespace.socket");

module.exports = {
  socketHandler: (io) => {
    const handler = new NamespaceSocketHandler(io);
    handler.initConnection();
  },
};
