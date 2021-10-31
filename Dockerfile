FROM node:16-alpine

# Mandatory arguments
ARG NEXT_PUBLIC_RSA_PUBLIC_KEY

# Optional arguments
ARG DEBUG=false
ARG NODE_ENV=production

ENV DEBUG=$DEBUG
ENV NEXT_PUBLIC_RSA_PUBLIC_KEY=$NEXT_PUBLIC_RSA_PUBLIC_KEY
ENV NEXT_PUBLIC_NODE_ENV=$NODE_ENV
ENV NODE_ENV=$NODE_ENV

EXPOSE 3000

WORKDIR /app

COPY . .

RUN yarn --frozen-lockfile --production
RUN yarn build

ENTRYPOINT [ "yarn", "start" ]
