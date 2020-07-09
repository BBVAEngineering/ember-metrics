/* jshint node: true */
'use strict';

const Funnel = require('broccoli-funnel');
const path = require('path');

function normalize(name) {
	if (typeof name === 'string') {
		name = path.basename(name, '.js');

		return name.replace(/([a-z](?=[A-Z]))/g, '$1-').toLowerCase();
	}

	return undefined;
}

function uniqueStrings(arr) {
	const out = [];
	const dict = {};

	for (let i = 0; i < arr.length; i++) {
		const obj = arr[i];

		if (typeof obj === 'string' && !dict[obj]) {
			out.push(obj);
			dict[obj] = true;
		}
	}

	return out;
}

function getEach(arr, propName) {
	const out = [];

	for (let i = 0; i < arr.length; i++) {
		const obj = arr[i];

		if (typeof obj === 'object' && obj[propName]) {
			out.push(obj[propName]);
		}
	}

	return out;
}

module.exports = {
	name: 'ember-metrics',

	included(app, parentAddon) {
		this._super.included.apply(this, arguments);

		let target = parentAddon || app;

		// allow addon to be nested - see: https://github.com/ember-cli/ember-cli/issues/3718
		if (target.app) {
			target = target.app;
		}

		const config = target.project.config(target.env) || {};
		const addonConfig = config[this.name] || {};
		let discovered = ['base'];

		if (addonConfig.includeAdapters) {
			discovered = discovered.concat(addonConfig.includeAdapters);
		}

		if (config.metricsAdapters) {
			discovered = discovered.concat(getEach(config.metricsAdapters, 'name'));
		}

		this.whitelisted = uniqueStrings(discovered.map(normalize));
	},

	treeForAddon() {
		// see: https://github.com/ember-cli/ember-cli/issues/4463
		const tree = this._super.treeForAddon.apply(this, arguments);

		return this.filterAdapters(tree, new RegExp(`^(?:modules/)?${ this.name }/metrics-adapters/`, 'i'));
	},

	filterAdapters(tree, regex) {
		const whitelisted = this.whitelisted;

		return new Funnel(tree, {
			exclude: [function(name) {
				return regex.test(name) && whitelisted.indexOf(path.basename(name, '.js')) === -1;
			}]
		});
	}
};
