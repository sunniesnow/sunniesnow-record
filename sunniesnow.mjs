import * as PIXI from '@pixi/node';
import JSZip from 'jszip';
import { marked } from 'marked';
import * as DOMPurify from 'dompurify';
import mime from 'mime';
import { AudioContext, OfflineAudioContext } from 'node-web-audio-api';
import audioDecode from 'audio-decode';

import path from 'path';
import fs from 'fs';
import vm from 'vm';
import module from 'module';
import url from 'url';

const dir = path.dirname(url.fileURLToPath(import.meta.url));
function patchedFetch(fetchUrl, options) {
	let isFile = false;
	try {
		if (new URL(fetchUrl).protocol === 'file:') {
			isFile = true;
			fetchUrl = url.fileURLToPath(fetchUrl);
		}
	} catch (e) {
		isFile = true;
		// use this regex to fuck Windows
		const relativePath = path.resolve("/game", fetchUrl).replace(/^\w:\\/, "");
		fetchUrl = path.join(dir, relativePath);
	}
	if (isFile) {
		return new Promise((resolve, reject) => {
			fs.readFile(fetchUrl, (err, data) => {
				if (err) {
					reject(err);
				} else {
					resolve(new Response(data));
				}
			});
		});
	} else {
		options = Object.assign({}, options);
		options.headers = Object.assign({}, options.headers);
		options.headers['Origin'] = 'https://sunniesnow.github.io';
		return fetch(fetchUrl, options);
	}
}
PIXI.settings.ADAPTER.fetch = patchedFetch;
PIXI.NodeAdapter.fetch = patchedFetch;
const Sunniesnow = {};

const polyfill = {
	Sunniesnow,
	PIXI,
	JSZip,
	marked,
	DOMPurify,
	mime,
	AudioContext,
	OfflineAudioContext,
	audioDecode,
	fetch: patchedFetch,
	require: module.createRequire(import.meta.url)
};
const context = vm.createContext(Object.create(globalThis, Object.getOwnPropertyDescriptors(polyfill)));
function runScript(filename) {
	filename = path.resolve(dir, filename);
	const script = new vm.Script(fs.readFileSync(filename).toString(), {filename});
	script.runInContext(context);
}
runScript('game/js/utils/Utils.js');
runScript('game/js/ScriptsLoader.js');
Sunniesnow.ScriptsLoader.setPolyfill(polyfill);
await Sunniesnow.ScriptsLoader.runSiteScripts();
Sunniesnow.Patches.apply();

await PIXI.Assets.init({skipDetections: true}); // https://github.com/pixijs/node/issues/6

export default Sunniesnow;
