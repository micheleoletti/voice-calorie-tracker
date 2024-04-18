FROM node:21-bullseye

RUN apt-get update && apt-get install -y ffmpeg

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm ci

COPY . .

CMD npx nodemon
