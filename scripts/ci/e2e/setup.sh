#!/bin/bash

# Exit when any command fails:
set -e

if [ ! -f "./.env" ]; then
  cp ./.env.example ./.env
fi

# https://betagouv.github.io/nexauth/#/initialize?id=development
pnpm exec nexauth init
