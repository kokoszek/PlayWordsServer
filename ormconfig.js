const path = require('path');

const detectTSNode = require("detect-ts-node");

console.log('detectTSNode: ', detectTSNode);

const config = {
  "type": "mysql",
  "host": "localhost",
  "port": 3306,
  "username": "app",
  "password": "password",
  "database": "playwords",
  "entities": [path.join(__dirname, 'dist', '**', '*.entity.js')],
  "migrationsTableName": "typeorm_migrations",
  "migrations": [
    detectTSNode ? "./migrations/*.ts" : "./migrations/*.js"
  ],
}

module.exports = config;
