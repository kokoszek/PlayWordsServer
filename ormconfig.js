const path = require('path');
require('reflect-metadata');

const detectTSNode = require("detect-ts-node");

console.log('detectTSNode: ', detectTSNode);
console.log('__dirname: ', __dirname);

const config = {
  "type": "mysql",
  "host": "localhost",
  "port": 3306,
  "username": "app",
  "password": "password",
  "database": "playwords",
  "entities": [
    detectTSNode ?
      path.join(__dirname, 'src', '**', '*.entity.ts') :
      path.join(__dirname, 'dist', '**', '*.entity.js')
  ],
  "migrationsTableName": "typeorm_migrations",
  "migrations": [
    "./migrations/*.ts"
  ],
}

module.exports = config;
