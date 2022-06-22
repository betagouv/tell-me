#!/bin/bash

# Exit when any command fails:
set -e

export NEXT_PUBLIC_IS_DEMO="true"

pnpm run dev:docker
pnpm run build
pnpm run start
