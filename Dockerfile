FROM node:16-alpine

ARG NODE_ENV

ENV NODE_ENV=$NODE_ENV

WORKDIR /app

COPY . .

RUN yarn --production --pure-lockfile

ENTRYPOINT [ "yarn", "start" ]
