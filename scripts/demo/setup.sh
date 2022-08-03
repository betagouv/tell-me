#!/bin/bash

# Exit when any command fails:
set -e

export NEXT_PUBLIC_IS_DEMO="true"

pnpm dev:docker
pnpm build
pnpm start
