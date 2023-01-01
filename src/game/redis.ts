const Redis = require("ioredis");
export const redis = new Redis(6379, process.env.REDIS_HOST);
redis.on("error", (err) => {
  console.log("redis error occured: ", err);
});
