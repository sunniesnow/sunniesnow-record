# sunniesnow-record

A CLI tool to generate a video for a
[Sunniesnow](https://github.com/sunniesnow/sunniesnow) chart.

## Installation

First, install [FFmpeg](https://ffmpeg.org/) (6.1 or later)
and [Node.js](https://nodejs.org/) (20.6 or later).

> [!NOTE]
> The version of FFmpeg must not be 6.0
> because of a known bug in that version.
>
> The version of Node.js most not be between 20.0 and 20.5 (inclusive)
> because of a known bug in those versions.

Then, run the following command:

```shell
npm install -g sunniesnow-record
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

There is also a command to generate a cover image:

```shell
sunniesnow-cover-gen --help
```

## Docker image

You can also use the Docker image to run this tool.
To do this, run the following command:

```shell
docker run -v ./output:/data -i -t ulysseszhan/sunniesnow-record --level-file online --level-file-online sunniesnow-sample
```

This command will generate a video at `output/output.mkv`.

## Troubleshoot

Note that you can use the [Docker image](#docker-image)
if there are issues that you cannot resolve.

### `git@github.com: Permission denied (publickey)`

You need to generate an SSH keypair:

```shell
ssh-keygen
```

### Font rendering issues

If only English characters are rendered incorrectly,
this is due to a [bug in node-canvas](https://github.com/Automattic/node-canvas/issues/2332).
To work around this, rebuild node-canvas from source:

```shell
env --chdir=$(npm root -g)/sunniesnow-record npm rebuild canvas --build-from-source
```

For other font rendering issues, you can also try rebuilding node-canvas from source.
However, sometimes the issues are hard to fix.
It is known that the font rendering behaviors are different
for different versions of pangocairo and other dependencies.

### `No module named 'distutils'` with Python 3.12 or later

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

### Cannot open `Utils.js` when installing from Git source

If you installed this package from Git source (e.g. `npm i github:sunniesnow/sunniesnow-record`),
you may see an error message like this when using this package:

```plain
Error: ENOENT: no such file or directory, open '.../node_modules/sunniesnow-record/game/js/utils/Utils.js'
```

This is due to an [npm bug](https://github.com/npm/cli/issues/2774).
To work around this, clone this repo recursively,
and use the local file system as the package source.

### Antialias does not work

[Known bug](https://github.com/stackgl/headless-gl/issues/282).

### `‘uintptr_t’ does not name a type`

[Known bug](https://github.com/pixijs/node/issues/18).

### The video only shows a static image, but audio is fine

Known bug in FFmpeg 6.0. Use FFmpeg 6.1 or later.

### Stuck at loading `Background` or `ResultProfile` on Windows

This may happen when the background or avatar is an SVG.
This is a known issue caused by
[a bug](https://github.com/Automattic/node-canvas/issues/1211)
and [another bug](https://github.com/pixijs/node/issues/14).
To work around this, use another image format.

## License

[AGPL-3.0](https://www.gnu.org/licenses/agpl-3.0.html).
