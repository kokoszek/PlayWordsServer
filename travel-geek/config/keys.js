if (process.env.NODE_ENV === 'production') {
  console.log('running on production');
  module.exports = require('./prod');
} else if (process.env.NODE_ENV === 'ci') {
  module.exports = require('./ci');
} else {
  module.exports = require('./dev');
}
