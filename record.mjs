import mime from 'mime';

import fs from 'fs';
import path from 'path';
import child_process from 'child_process';
import module from 'module';

import Sunniesnow from './sunniesnow.mjs';

const require = module.createRequire(import.meta.url);

const audioBufferToWav = require('audiobuffer-to-wav');

Sunniesnow.Record = class Record {

	static DEFAULT_GAME_SETTINGS = {
		levelFile: 'upload',
		levelFileOnline: '',
		levelFileUpload: null,

		musicSelect: '',
		chartSelect: '',

		judgementWindows: 'loose',
		noteHitSize: 3,
		offset: 0,
		noEarlyDrag: false,
		directionInsensitiveFlick: false,
		lockingHold: false,

		speed: 2,
		noteSize: 1,
		noEarlyDrag: false,
		directionInsensitiveFlick: false,
		lockingHold: false,
		background: 'online',
		backgroundOnline: 'default.svg',
		backgroundFromLevel: '',
		backgroundUpload: null,
		backgroundBlur: 100,
		backgroundBrightness: 0.5,
		fx: 'default',
		fxOnline: '',
		fxUpload: null,
		skin: 'default',
		skinOnline: '',
		skinUpload: null,
		hudTopCenter: 'combo',
		hudTopLeft: 'title',
		hudTopRight: 'score',
		doubleLineTap: true,
		doubleLineHold: false,
		doubleLineDrag: false,
		doubleLineFlick: false,
		hideFxInFront: false,
		hideFxPerfect: false,
		hideFxHoldStart: false,
		touchEffects: false,
		reverseNoteOrder: false,
		hideTipPoints: false,

		se: 'default',
		seOnline: '',
		seUpload: null,
		volumeSe: 1,
		volumeMusic: 1,
		seWithMusic: true,
		delay: 0,

		autoplay: true,
		chartOffset: 0,
		gameSpeed: 1,
		horizontalFlip: false,
		verticalFlip: false,
		start: 0,
		end: 1,
		resumePreparationTime: 1,
		beginningPreparationTime: 1,
		notesPriorityOverPause: false,

		enableKeyboard: true,
		keyboardWholeScreen: false,
		excludeKeys: [],
		pauseKeys: [],
		keyboardPause: false,
		enableMouse: true,
		mouseWholeScreen: false,
		excludeButtons: [],
		pauseButtons: [],
		mousePause: true,
		enableTouchscreen: true,
		touchscreenWholeScreen: false,
		touchPause: true,

		width: 1920,
		height: 1080,
		fullscreenOnStart: true,
		floatAsFullscreen: false,
		plugin: [],
		pluginOnline: [],
		pluginUpload: [],
		renderer: 'webgl',
		antialias: true,
		powerPreference: 'default',
		debug: false,
		suppressWarnings: false
	}

	static DEFAULT_SETTINGS = {
		levelFile: 'upload',
		levelFileOnline: '',
		levelFileUpload: null,
		musicSelect: '',
		chartSelect: '',
		speed: 2,
		noteSize: 1,
		background: 'online',
		backgroundOnline: 'default.svg',
		backgroundFromLevel: '',
		backgroundUpload: null,
		backgroundBlur: 100,
		backgroundBrightness: 0.5,
		fx: 'default',
		fxOnline: '',
		fxUpload: null,
		skin: 'default',
		skinOnline: '',
		skinUpload: null,
		hudTopCenter: 'combo',
		hudTopLeft: 'title',
		hudTopRight: 'score',
		doubleLineTap: true,
		doubleLineHold: false,
		doubleLineDrag: false,
		doubleLineFlick: false,
		hideFxInFront: false,
		hideFxPerfect: false,
		hideFxHoldStart: false,
		reverseNoteOrder: false,
		hideTipPoints: false,
		se: 'default',
		seOnline: '',
		seUpload: null,
		volumeSe: 1,
		volumeMusic: 1,
		delay: 0,
		chartOffset: 0,
		gameSpeed: 1,
		horizontalFlip: false,
		verticalFlip: false,
		start: 0,
		end: 1,
		beginningPreparationTime: 1,
		width: 1920,
		height: 1080,
		plugin: [],
		pluginOnline: [],
		pluginUpload: [],

		help: false,
		fps: 60,
		quiet: false,
		suppressWarnings: false,
		tempDir: '/tmp',
		output: 'output.mkv',
		resultsDuration: 1,
		waitForMusic: false
	}

	static HELP_MESSAGE = `Usage: sunniesnow-record [options]

--help                print this message
--fps=60              frame rate of the output video
--quiet               do not print anything to stdout
--suppress-warnings   do not print warnings to stderr
--temp-dir=/tmp       directory to store temporary files
--output=output.mkv   output file name
--results-duration=1  duration of the results screen in seconds
--wait-for-music      do not end the video until music finishes

See https://sunniesnow.github.io/game/help/ about following options:
--level-file
--level-file-online
--level-file-upload
--music-select
--chart-select
--speed
--note-size
--background
--background-online
--background-from-level
--background-upload
--background-blur
--background-brightness
--fx
--fx-online
--fx-upload
--skin
--skin-online
--skin-upload
--hud-top-center
--hud-top-left
--hud-top-right
--double-line-tap
--double-line-hold
--double-line-drag
--double-line-flick
--hide-fx-in-front
--hide-fx-perfect
--hide-fx-hold-start
--reverse-note-order
--hide-tip-points
--se
--se-online
--se-upload
--volume-se
--volume-music
--delay
--chart-offset
--game-speed
--horizontal-flip
--vertical-flip
--start
--end
--beginning-preparation-time
--width
--height
--plugin
--plugin-online
--plugin-upload`

	static toBlob(obj) {
		if (typeof obj === 'string') {
			return new Blob([fs.readFileSync(obj)], {type: mime.getType(obj)});
		}
		if (obj instanceof Array) {
			return obj.map(this.toBlob.bind(this));
		}
		if (obj instanceof Blob) {
			return obj;
		}
		return new Blob([obj]);
	}

	static replaceWithBlob(options) {
		for (const key in options) {
			if (key.endsWith('Upload')) {
				options[key] = this.toBlob(options[key]);
			}
		}
	}

	constructor(options) {
		options = Object.assign({}, this.constructor.DEFAULT_SETTINGS, options);

		this.quiet = options.quiet;
		delete options.quiet;

		this.suppressWarnings = options.suppressWarnings;
		delete options.suppressWarnings;

		this.fps = options.fps;
		delete options.fps;

		this.width = options.width;
		this.height = options.height;

		this.resultsDuration = options.resultsDuration;
		delete options.resultsDuration;

		this.tempDir = options.tempDir;
		delete options.tempDir;

		this.output = options.output;
		delete options.output;

		this.waitForMusic = options.waitForMusic;
		delete options.waitForMusic;

		this.constructor.replaceWithBlob(options);

		this.gameSettings = options;
	}

	async createVideoGeneratingFfmpeg() {
		this.videoGeneratingFfmpeg = child_process.spawn('ffmpeg', [
			// video input
			'-f', 'rawvideo',
			'-pixel_format', 'rgba',
			'-framerate', this.fps.toString(),
			'-video_size', `${this.width}x${this.height}`,
			'-i', 'pipe:0',
			// output
			'-y',
			'-vf', 'vflip',
			path.join(this.tempDir, 'video.mkv')
		], {stdio: ['pipe', 'inherit', 'inherit']});
		this.videoPipe = this.videoGeneratingFfmpeg.stdin;
		this.tempPixels = new Uint8Array(this.width * this.height * 4);
	}

	print(string) {
		if (!this.quiet) {
			process.stdout.write(string);
		}
	}

	reprint(string) {
		if (!this.quiet) {
			process.stdout.clearLine();
			process.stdout.cursorTo(0);
			process.stdout.write(string);
		}
	}

	println(string) {
		if (!this.quiet) {
			process.stdout.write(string + '\n');
		}
	}

	async load() {
		this.println('Loading...')
		fs.mkdirSync(this.tempDir, {recursive: true});
		Sunniesnow.game = new Sunniesnow.Game();
		Sunniesnow.game.settings = Object.assign({}, this.constructor.DEFAULT_GAME_SETTINGS, this.gameSettings);
		Sunniesnow.game.start();
		await Sunniesnow.Loader.loadChart();
		Sunniesnow.Loader.load();
		await Sunniesnow.Utils.until(() => {
			Sunniesnow.Loader.updateLoading();
			return Sunniesnow.Loader.loadingComplete;
		});
		Sunniesnow.game.initLevel();
		Sunniesnow.game.initScene();
		Sunniesnow.game.app.ticker.add(Sunniesnow.game.mainTicker.bind(Sunniesnow.game));
		this.createVideoGeneratingFfmpeg();
	}

	async screenshot() {
		const gl = Sunniesnow.game.canvas._gl;
		gl.readPixels(0, 0, this.width, this.height, gl.RGBA, gl.UNSIGNED_BYTE, this.tempPixels);
		await new Promise(resolve => this.videoPipe.write(this.tempPixels, resolve));
	}

	async exportAudio() {
		this.println('Exporting audio...');
		const audioBuffer = await Sunniesnow.Audio.context.startRendering();
		fs.writeFileSync(
			path.join(this.tempDir, 'audio.wav'),
			Buffer.from(audioBufferToWav(audioBuffer))
		);
	}

	async runFfmpeg() {
		this.println('Combining video and audio...');
		this.ffmpeg = child_process.spawn('ffmpeg', [
			'-i', path.join(this.tempDir, 'video.mkv'),
			'-i', path.join(this.tempDir, 'audio.wav'),
			'-y',
			'-nostdin',
			'-map', '0:v',
			'-map', '1:a',
			'-c:v', 'copy',
			'-shortest',
			this.output
		], {stdio: 'inherit'});
		await new Promise(resolve => this.ffmpeg.on('exit', resolve));
	}

	async end() {
		this.println('');
		this.println('Waiting for FFmpeg to finish eating the video...')
		await new Promise(resolve => this.videoPipe.end(resolve));
		await new Promise(resolve => this.videoGeneratingFfmpeg.on('exit', resolve));
	}

	async run() {
		await this.load();
		let frameCount = 0;
		let firstResultFrame;
		while (true) {
			let breakCondition = !!firstResultFrame;
			breakCondition &&= (frameCount - firstResultFrame) / this.fps > this.resultsDuration
			breakCondition &&= !this.waitForMusic || Sunniesnow.Music.finished
			if (breakCondition) {
				break;
			}
			const currentTime = frameCount / this.fps;
			//this.reprint(`Rendering ${currentTime.toFixed(2)}s...`)
			Sunniesnow.Audio.currentTime = currentTime;
			Sunniesnow.game.app.ticker.update(currentTime * 1000);
			await this.screenshot();
			if (Sunniesnow.game.level.finished && !firstResultFrame) {
				firstResultFrame = frameCount;
			}
			frameCount++;
		}
		await this.end();
		await this.exportAudio();
		await this.runFfmpeg();
		this.println('Done!');
	}

	static async run(options) {
		if (options.help) {
			console.log(this.HELP_MESSAGE);
			process.exit();
		}
		Sunniesnow.record = new this(options);
		await Sunniesnow.record.run();
		process.exit();
	}
};
export default Sunniesnow.Record;
