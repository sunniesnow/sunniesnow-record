{ pkgs ? import <nixpkgs> {} }: with pkgs; mkShell {
	packages = [
		cairo gcc pango pkg-config libjpeg librsvg
		xorg.libXi libGLU glew giflib alsa-lib xvfb-run ffmpeg
		nodejs_24
	];
	shellHook = ''
		export LD_LIBRARY_PATH=${lib.makeLibraryPath ([
			cairo pango libjpeg librsvg libGLU glew giflib alsa-lib libGL freetype glib acl attr gmp
			zlib libuv openssl icu glibc libgcc fontconfig fribidi libthai libffi pcre2 bzip2 brotli
			dav1d libxml2 libuuid libselinux expat libdatrie graphite2 harfbuzz
		] ++ (with xorg; [
			libXi libX11 libXext libXrender libxcb libXau libXdmcp
		]))}
	'';
}
