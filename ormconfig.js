const path = require('path');

const config = {
  "type": "mysql",
  "host": "localhost",
  "port": 3306,
  "username": "app",
  "password": "password",
  "database": "playwords",
  entities: [path.join(__dirname, 'src', '**', '*.entity.ts')],
  "migrationsTableName": "typeorm_migrations",
  "migrations": ["./migrations/*.ts"],
}

module.exports = config;
