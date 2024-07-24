# syntax=docker/dockerfile:1
FROM node:20-bullseye

RUN apt-get -y update && apt-get -y upgrade
RUN apt-get install -y libasound2-dev ffmpeg
RUN apt-get install -y python-is-python3
# nodejs npm
RUN apt-get install -y build-essential pkg-config
RUN apt-get install -y libxi-dev libglu1-mesa-dev libglew-dev xvfb
RUN apt-get install -y libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

WORKDIR /app
COPY . .
RUN npm ci --build-from-source

VOLUME [ "/data" ]

ENTRYPOINT [ "./entrypoint.sh" ]
