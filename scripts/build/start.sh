#!/bin/bash

# Exit when any command fails:
set -e

# Load .env file
if [ -f "./.env" ]; then
  export $(egrep -v '^(#|EDDSA_PRIVATE_KEY|NEXT_PUBLIC_EDDSA_PUBLIC_KEY)' ./.env | xargs) > /dev/null
fi

pnpm run db:migrate
pnpm run db:seed
pnpm exec next start
