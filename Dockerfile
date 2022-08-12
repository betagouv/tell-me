FROM node:16-alpine

# Mandatory arguments
ARG DATABASE_URL
ARG EDDSA_PRIVATE_KEY
ARG NEXT_PUBLIC_EDDSA_PUBLIC_KEY

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

RUN pnpm i --frozen-lockfile
RUN pnpm build

ENTRYPOINT [ "pnp", "start" ]
