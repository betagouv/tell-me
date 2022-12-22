FROM node:16-alpine

# https://github.com/prisma/prisma/issues/16834#issuecomment-1355195025
RUN apk add --update --no-cache openssl1.1-compat

# Mandatory arguments
ARG CI=true
ARG DATABASE_URL
ARG EDDSA_PRIVATE_KEY
ARG NEXT_PUBLIC_EDDSA_PUBLIC_KEY

ENV CI=$CI
ENV DATABASE_URL=$DATABASE_URL
ENV EDDSA_PRIVATE_KEY=$EDDSA_PRIVATE_KEY
ENV NEXT_PUBLIC_EDDSA_PUBLIC_KEY=$NEXT_PUBLIC_EDDSA_PUBLIC_KEY
ENV NEXT_PUBLIC_NODE_ENV=production
ENV NODE_ENV=production

EXPOSE 3000

WORKDIR /app

COPY . .

# https://pnpm.io/installation#using-corepack
RUN corepack enable
RUN corepack prepare pnpm@7.9.0 --activate

RUN pnpm i --frozen-lockfile --prod=false
RUN pnpm build

ENTRYPOINT [ "pnpm", "start" ]
