#!/bin/bash

# Exit when any command fails:
set -e

npx playwright install

# https://betagouv.github.io/nexauth/#/initialize?id=development
yarn nexauth init
