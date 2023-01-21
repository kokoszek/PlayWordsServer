require("dotenv").config();
const path = require("path");
require("reflect-metadata");

const detectTSNode = require("detect-ts-node");

console.log("detectTSNode: ", detectTSNode);
console.log("__dirname: ", __dirname);

console.log("mysql host : ", process.env.MYSQL_HOST);

const config = {
  "type": "mysql",
  "host": process.env.MYSQL_HOST,
  "port": 3306,
  "username": process.env.MYSQL_USERNAME,
  "password": process.env.MYSQL_PASSWORD,
  "database": process.env.MYSQL_DBNAME,
  "entities": [
    detectTSNode ?
      path.join(__dirname, "src", "**", "*.entity.ts") :
      path.join(__dirname, "dist", "**", "*.entity.js")
  ],
  "migrationsTableName": "typeorm_migrations",
  "migrations": [
    detectTSNode ? "./migrations/*.ts" : ""
  ],
  "subscribers": [
    path.join(__dirname, "dist", "**", "*.subscriber.js")
  ],
  logging: true
};

module.exports = config;
