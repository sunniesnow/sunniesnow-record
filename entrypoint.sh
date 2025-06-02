#!/usr/bin/env bash

if [ -z "$SUNNIESNOW_OUTPUT" ]; then
	for arg in "$@"; do
		if [ "$arg" = "--output" ] || [ "${arg#--output=}" != "$arg" ]; then
			has_output=1
			break
		fi
	done
	if [ -z "$has_output" ]; then
		export SUNNIESNOW_OUTPUT="/data/output.mkv"
	fi
fi

xvfb-run node cli.mjs "$@"
