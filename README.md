# sunniesnow-record

A CLI tool to generate a video for a
[Sunniesnow](https://github.com/sunniesnow/sunniesnow) chart.

## Installation

First, install [FFmpeg](https://ffmpeg.org/)
and [Node.js](https://nodejs.org/).

Then, run the following command:

```shell
npm install -g sunniesnow-record
```

## Usage

Run the following command to get help:

```shell
sunniesnow-record --help
```

Here is a usecase example:

```shell
sunniesnow-record --level-file online --level-file-online sunniesnow-sample --output test.mkv
```

## Troubleshoot

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

If you still have troubles, see
[development instructions for headless-gl](https://github.com/stackgl/headless-gl#how-should-i-set-up-a-development-environment-for-headless-gl)
and
[compiling instructions for node-canvas](https://github.com/Automattic/node-canvas#compiling).

## License

[GPLv3](https://www.gnu.org/licenses/gpl-3.0.en.html).
