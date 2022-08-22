var DataSource = require("typeorm").DataSource;
var ormconfig = require('../ormconfig');
console.log('ormcofngi: ', ormconfig);
var ds = new DataSource(ormconfig);
module.exports = {
    DataSource: ds
};
// AppDataSource.initialize()
//   .then(() => {
//     console.log("Data Source has been initialized!")
//   })
//   .catch((err) => {
//     console.error("Error during Data Source initialization", err)
//   })
