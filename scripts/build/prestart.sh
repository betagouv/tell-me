#!/bin/bash

# Exit when any command fails:
set -e

# Load .env file
if [ -f "./.env" ]; then
  export $(egrep -v '^#' ./.env | xargs) > /dev/null
fi

yarn prisma generate
yarn db:migrate
