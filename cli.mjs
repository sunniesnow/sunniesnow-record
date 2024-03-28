#!/usr/bin/env node

import minimist from 'minimist';

import Sunniesnow from './sunniesnow.mjs';
import Record from './record.mjs';

const keys = Object.keys(Record.DEFAULT_SETTINGS);
const parsedOptions = minimist(process.argv.slice(2));
const options = {};
if (parsedOptions._.length > 0) {
	process.stderr.write(`Unknown options: ${parsedOptions._.join(' ')}\n`);
	process.exit(1);
}
delete parsedOptions._;
for (const key of keys) {
	const slugKey = Sunniesnow.Utils.camelToSlug(key);
	if (Object.hasOwn(parsedOptions, slugKey)) {
		options[key] = parsedOptions[slugKey];
		if (typeof Record.DEFAULT_SETTINGS[key] === 'number') {
			options[key] = Number(options[key]);
			if (isNaN(options[key])) {
				process.stderr.write(`Invalid number for ${slugKey}\n`);
				process.exit(1);
			}
		} else if (typeof Record.DEFAULT_SETTINGS[key] === 'boolean') {
			if (options[key] === 'true') {
				options[key] = true;
			} else if (options[key] === 'false') {
				options[key] = false;
			} else {
				process.stderr.write(`Invalid boolean for ${slugKey}\n`);
				process.exit(1);
			}
		}
		delete parsedOptions[slugKey];
	}
}
if (Object.keys(parsedOptions).length > 0) {
	process.stderr.write(`Unknown options: ${Object.keys(parsedOptions).join(', ')}\n`);
	process.exit(1);
}
await Record.run(options);
