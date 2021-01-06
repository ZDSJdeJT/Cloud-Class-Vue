'use strict';
const packageJson = require('./../package.json');

module.exports = {
  NODE_ENV: '"production"',
  SERVER_API_URL: '""',
  BUILD_TIMESTAMP: `'${new Date().getTime()}'`,
  VERSION: `'${packageJson.version}'`,
};
