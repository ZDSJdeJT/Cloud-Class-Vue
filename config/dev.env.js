'use strict';
const merge = require('webpack-merge');
const prodEnv = require('./prod.env');
const packageJson = require('./../package.json');

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  SERVER_API_URL: '\'\'',
  BUILD_TIMESTAMP: `'${new Date().getTime()}'`,
  VERSION: `'${packageJson.version}'`,
});
