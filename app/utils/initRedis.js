const redisDB = require("redis");
const redisClient = redisDB.createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});
redisClient.connect();
redisClient.on("connect", () => {
  console.log("connect to redis");
});
redisClient.on("ready", () => {
  console.log("connected to redis and ready to use");
});
redisClient.on("error", (err) => {
  console.log("RedisError : " + err.message);
});
redisClient.on("end", () => {
  console.log("disconnected from redis");
});

module.exports = { redisClient };
