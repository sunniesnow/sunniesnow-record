#!/usr/bin/env bash

export SUNNIESNOW_OUTPUT="/data/output.mkv"
xvfb-run node cli.mjs $@
