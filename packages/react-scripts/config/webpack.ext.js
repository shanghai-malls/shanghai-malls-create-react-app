'use strict';
const path = require('path');
const paths = require('./paths');
const webpackPath = require(paths.appPackageJson).webpack;

module.exports = function (config) {
  if (webpackPath) {
    let applyWebpack = require(path.resolve(process.cwd(), webpackPath));
    applyWebpack(config);
  }
  config.applyDevServer = config.applyDevServer || function(devServer) {
    console.log("devServer:",devServer);
  }
};