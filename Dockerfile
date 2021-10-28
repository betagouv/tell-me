FROM node:16-alpine

ARG NEXT_PUBLIC_RSA_PUBLIC_KEY
ARG NODE_ENV=production

ENV DEBUG=false
ENV NEXT_PUBLIC_RSA_PUBLIC_KEY=$NEXT_PUBLIC_RSA_PUBLIC_KEY
ENV NEXT_PUBLIC_NODE_ENV=$NODE_ENV
ENV NODE_ENV=$NODE_ENV

EXPOSE 3000

WORKDIR /app

COPY . .

RUN yarn --production --pure-lockfile
RUN yarn build

ENTRYPOINT [ "yarn", "start" ]
