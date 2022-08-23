const path = require('path');

const detectTSNode = require("detect-ts-node");

console.log('detectTSNode: ', detectTSNode);
console.log('entities path: ', path.join(__dirname, 'src', '**', '*.entity.ts'));

const config = {
  "type": "mysql",
  "host": "localhost",
  "port": 3306,
  "username": "app",
  "password": "password",
  "database": "playwords",
  "entities": [
      path.join(__dirname, 'src', '**', '*.entity.ts')
  ],
  "migrationsTableName": "typeorm_migrations",
  "migrations": [
    "./dist/migrations/*.js"
  ],
}

module.exports = config;
