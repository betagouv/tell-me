#!/bin/bash

# Exit when any command fails:
set -e

# Load .env file
export $(egrep -v '^(#|RSA_PRIVATE_KEY|NEXT_PUBLIC_RSA_PUBLIC_KEY)' ./.env | xargs) > /dev/null

if [ "${IS_DOCKER}" != "true" ]; then
  exit 0
fi

yarn prisma generate
yarn db:migrate
yarn db:migrate:legacy
