FROM node:16-alpine

ARG NODE_ENV=production

ENV NODE_ENV=$NODE_ENV

EXPOSE 3000

WORKDIR /app

COPY . .

RUN yarn --production --pure-lockfile
RUN yarn build

ENTRYPOINT [ "yarn", "start" ]
