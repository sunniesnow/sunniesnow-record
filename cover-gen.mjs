import fs from 'fs';

import Sunniesnow from './sunniesnow.mjs';
import DEFAULT_GAME_SETTINGS from './default-settings.mjs'

Sunniesnow.CoverGen = class CoverGen {

	static DEFAULT_SETTINGS = {
		levelFile: 'upload',
		levelFileOnline: '',
		levelFileUpload: null,
		chartSelect: '',
		background: 'from-level',
		backgroundOnline: 'default.svg',
		backgroundFromLevel: '',
		backgroundUpload: null,
		backgroundBlur: 100,
		backgroundBrightness: 0.5,
		skin: 'default',
		skinOnline: '',
		skinUpload: null,
		nickname: 'New Poet',
		avatar: 'online',
		avatarOnline: 'default.svg',
		avatarUpload: null,
		avatarGravatar: '',
		width: 1920,
		height: 1080,
		avoidDownloadingFonts: false,
		plugin: [],
		pluginOnline: [],
		pluginUpload: [],

		help: false,
		quiet: false,
		suppressWarnings: false,
		tempDir: process.env.TMPDIR || process.env.TEMP || '/tmp',
		coverThemeImageX: null,
		coverThemeImageY: null,
		coverThemeImageWidth: null,
		output: process.env.SUNNIESNOW_OUTPUT || 'output.png',
		clean: false,
	}

	static HELP_MESSAGE = `Usage: sunniesnow-cover-gen [options]

--help=false              print this message
--quiet=false             do not print anything to stdout
--suppress-warnings       do not print warnings to stderr
--temp-dir=$TMPDIR        directory to store temporary files
--cover-theme-image-x     x coordinate of the center of the cropped theme image
--cover-theme-image-y     y coordinate of the center of the cropped theme image
--cover-theme-image-width width of the cropped theme image
--output=output.png       output file name
--clean=false             do not use assets downloaded before

See https://sunniesnow.github.io/game/help about following options:
--level-file
--level-file-online
--level-file-upload
--chart-select
--background
--background-online
--background-from-level
--background-upload
--background-blur
--background-brightness
--skin
--skin-online
--skin-upload
--nickname
--avatar
--avatar-online
--avatar-upload
--avatar-gravatar
--width
--height
--avoid-downloading-fonts
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

		this.tempDir = options.tempDir;
		delete options.tempDir;

		this.coverThemeImageX = options.coverThemeImageX;
		delete options.coverThemeImageX;

		this.coverThemeImageY = options.coverThemeImageY;
		delete options.coverThemeImageY;

		this.coverThemeImageWidth = options.coverThemeImageWidth;
		delete options.coverThemeImageWidth;

		this.output = options.output;
		delete options.output;

		this.clean = options.clean;
		delete options.clean;

		this.constructor.replaceWithBlob(options);

		this.gameSettings = options;
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
		Sunniesnow.game.settings = Object.assign({}, DEFAULT_GAME_SETTINGS, this.gameSettings);
		await Sunniesnow.Loader.loadChart();
		Sunniesnow.Loader.load();
		await Sunniesnow.Utils.until(time => {
			Sunniesnow.game.app?.ticker?.update(time);
			return Sunniesnow.game.scene && !(Sunniesnow.game.scene instanceof Sunniesnow.SceneLoading);
		});
	}

	async run() {
		await this.load();
		const dataUrl = await Sunniesnow.CoverGenerator.generate();
		const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
		fs.writeFileSync(this.output, base64Data, 'base64');
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
export default Sunniesnow.CoverGen;
