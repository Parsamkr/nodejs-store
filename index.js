const Application = require("./app/server");

const DB_URI = process.env.DB_URI || "mongodb://localhost:27017/StoreDB";
const PORT = process.env.APPLICATION_PORT || 5000;

new Application(PORT, DB_URI);
