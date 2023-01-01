import { redis } from "./redis";

const sem = require("semaphore")(10);

module.exports = {
  sem
};
