#!/bin/bash

# Exit when any command fails:
set -e

npx nexauth init
# https://devcenter.heroku.com/articles/platform-api-reference#config-vars-update
curl -n -X PATCH "https://api.heroku.com/apps/${HEROKU_APP_NAME}/config-vars" \
  -d '{
    "EDDSA_PRIVATE_KEY": "$(npx dotenv -p EDDSA_PRIVATE_KEY)",
    "NEXT_PUBLIC_EDDSA_PUBLIC_KEY": "$(npx dotenv -p NEXT_PUBLIC_EDDSA_PUBLIC_KEY)"
  }' \
  -H "Content-Type: application/json" \
  -H "Accept: application/vnd.heroku+json; version=3"
