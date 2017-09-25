'use strict';
const path = require('path');
const paths = require('./paths');
const webpackPath = require(paths.appPackageJson).webpack;

let applyConfig = {};
if (webpackPath) {
	applyConfig = require(path.resolve(process.cwd(), webpackPath));
}
let applyWebpack = function (config) {
	if (applyConfig.applyWebpack) {
		applyConfig.applyWebpack(config);
		if (config.output.path !== paths.appBuild) {
			paths.appBuild = config.output.path;
		}
	}
	for (let i = 2; i < process.argv.length; i++) {
		let output = '--output-path=';
		let indexOf = process.argv[i].indexOf(output);
		if (indexOf !== -1) {
			let dist = process.argv[i].substring(indexOf + output.length);
			if (dist) {
				paths.appBuild = config.output.path = path.resolve(process.cwd(), dist);
			}
		}
	}
};
let applyDevServer = applyConfig.applyDevServer || function (devServer) {
	console.log("webpack devServer config:", devServer);
};

module.exports = {
	applyWebpack, applyDevServer
};