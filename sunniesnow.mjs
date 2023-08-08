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

function patchedFetch(url, options) {
	options = Object.assign({}, options);
	options.headers = Object.assign({}, options.headers);
	options.headers['Origin'] = 'https://sunniesnow.github.io';
	return fetch(url, options);
}
PIXI.settings.ADAPTER.fetch = patchedFetch;
PIXI.NodeAdapter.fetch = patchedFetch;
const Sunniesnow = {};
const context = vm.createContext(Object.create(globalThis, Object.getOwnPropertyDescriptors({
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
})));

const dir = path.dirname(url.fileURLToPath(import.meta.url));
const head = fs.readFileSync(path.join(dir, 'game/_head.html')).toString();
for (const [_, js] of head.matchAll(/<script src="(js\/.+?)"><\/script>/g)) {
	const filename = path.resolve(path.join(dir, 'game', js));
	const script = new vm.Script(fs.readFileSync(filename).toString(), {filename});
	script.runInContext(context);
}
Sunniesnow.PixiPatches.apply();

await PIXI.Assets.init();

export default Sunniesnow;
