# sunniesnow-record

A CLI tool to generate a video for a
[Sunniesnow](https://github.com/sunniesnow/sunniesnow) chart.

## Installation

First, install [FFmpeg](https://ffmpeg.org/) (6.1 or later)
and [Node.js](https://nodejs.org/) (20.6 or later).

> [!NOTE]
> On Windows, the version of FFmpeg should be at least 6.1
> because this tool cannot generate correct videos with older versions due to a bug
> in those versions.
>
> The version of Node.js should be at least 20.6.0
> because this tool cannot run with older versions due to a bug in those versions.

Then, run the following command:

```shell
npm install -g sunniesnow-record --legacy-peer-deps
```

## Usage

Run the following command to get help:

```shell
sunniesnow-record --help
```

Here is a usage example:

```shell
sunniesnow-record --level-file online --level-file-online sunniesnow-sample --output test.mkv
```

## Troubleshoot

### `No module named 'distutils'` on Python 3.12 or later

You may see an error message about `ModuleNotFoundError: No module named 'distutils'`
reported by node-gyp.
This happens when your Python version is 3.12 or later. You need to run

```shell
pip install setuptools
```

Replace `pip` with `python3 -m pip` if necessary.

### Error messages about `canvas.node` or `webgl.node`

If you see error messages about `canvas.node` or `webgl.node`,
you may need to rebuild the native modules.
To do this, install the following dependencies first:

```shell
apt install build-essential pkg-config libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev libxi-dev libglu1-mesa-dev libglew-dev
```

and then run the following command (it may take several minutes):

```shell
env --chdir=$(npm root -g)/sunniesnow-record npm rebuild canvas gl --build-from-source
```

If you have troubles building them, see
[development instructions for headless-gl](https://github.com/stackgl/headless-gl#how-should-i-set-up-a-development-environment-for-headless-gl)
and
[compiling instructions for node-canvas](https://github.com/Automattic/node-canvas#compiling).

### `no such file or directory` when installed from Git source

If you installed this package from Git source (e.g. `npm i github:sunniesnow/sunniesnow-record`),
you may see an error message like this when using this package:

```plain
Error: ENOENT: no such file or directory, open '.../node_modules/sunniesnow-record/game/js/utils/Utils.js'
```

This is due to an [npm bug](https://github.com/npm/cli/issues/2774).
To work around this, clone this repo recursively,
and use the local file system as the package source.

## License

[GPLv3](https://www.gnu.org/licenses/gpl-3.0.en.html).
