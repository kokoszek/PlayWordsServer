const { DataSource } = require("typeorm");
const ormconfig = require('../ormconfig');

console.log('ormcofngi: ', ormconfig);

const ds = new DataSource(ormconfig);

module.exports = {
  DataSource: ds
}

// AppDataSource.initialize()
//   .then(() => {
//     console.log("Data Source has been initialized!")
//   })
//   .catch((err) => {
//     console.error("Error during Data Source initialization", err)
//   })
