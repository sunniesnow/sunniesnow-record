# currently not working: https://github.com/stackgl/headless-gl/issues/283
{ pkgs ? import <nixpkgs> {} }: with pkgs; mkShell {
	packages = [
		cairo gcc pango pkg-config libjpeg librsvg
		xorg.libXi libGLU glew giflib alsa-lib xvfb-run
	];
	shellHook = ''
		export LD_LIBRARY_PATH=${lib.makeLibraryPath [
			cairo pango libjpeg librsvg xorg.libXi libGLU glew giflib alsa-lib
		]}
	'';
}
