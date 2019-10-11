FROM node:10-alpine

WORKDIR /src
COPY package.json package.json
COPY yarn.lock yarn.lock

RUN yarn install --frozen-lockfile

COPY index.js index.js

ENTRYPOINT ["yarn", "start"]