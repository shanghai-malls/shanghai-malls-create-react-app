'use strict';
const path = require('path');
const paths = require('./paths');
const webpackPath = require(paths.appPackageJson).webpack;
const env = require('./env')('');
const checkRequiredFiles = require('react-dev-utils/checkRequiredFiles');
let applyConfig = {};
if (webpackPath) {
	applyConfig = require(path.resolve(process.cwd(), webpackPath));
}
function addPolyfills(input){
	if (!checkRequiredFiles([paths.appHtml, ...input])) {
		process.exit(1);
	}
	let entry = [require.resolve('./polyfills')];
	if (env.raw.NODE_ENV === 'development') {
		entry.push(require.resolve('./polyfills'), require.resolve('react-dev-utils/webpackHotDevClient'), require.resolve('react-error-overlay'));
		input.forEach(file => {
			if(!entry.find(file1=>file1 === file)) {
				entry.push(file);
			}
		})
	}
	return entry;
}

let applyWebpack = function (config) {
	if (applyConfig.applyWebpack) {
		applyConfig.applyWebpack(config);
		if (config.output.path !== paths.appBuild) {
			paths.appBuild = config.output.path;
		}
	}
	if(config.entry instanceof Array) {
		config.entry = addPolyfills(config.entry)
	} else if(config.entry instanceof String) {
		config.entry = addPolyfills([config.entry])
	} else if(typeof config.entry === 'object') {
		for(let key in config.entry) {
			let value = config.entry[key];
			if(config.entry instanceof String) {
				value = [value];
			}
			config.entry[key] = addPolyfills(value);
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