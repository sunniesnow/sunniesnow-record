#!/usr/bin/env node

import minimist from 'minimist';

import Sunniesnow from './sunniesnow.mjs';
import Record from './record.mjs';

const keys = Object.keys(Record.DEFAULT_SETTINGS);
const parsedOptions = minimist(process.argv.slice(2));
const options = {};
for (const key of keys) {
	const slugKey = Sunniesnow.Utils.camelToSlug(key);
	if (Object.hasOwn(parsedOptions, slugKey)) {
		options[key] = parsedOptions[slugKey];
		delete parsedOptions[slugKey];
	}
}
delete parsedOptions._;
if (Object.keys(parsedOptions).length > 0) {
	process.stderr.write(`Unknown options: ${Object.keys(parsedOptions).join(', ')}\n`);
	process.exit(1);
}
await Record.run(options);
