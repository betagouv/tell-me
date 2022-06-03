#!/bin/bash

# Exit when any command fails:
set -e

if [ "${NODE_ENV}" != "production" ] || [ -n "${CI}" ]; then
  exit 0
fi

# Remove all but essential dependencies to drastically reduce Scalingo container, speeding up shipping step
echo "info  - Deleting useless dependencies directories…"
find ./node_modules \
  ! -path ./node_modules \
  ! -name '.prisma' \
  ! -name 'next' \
  ! -name 'react' \
  ! -name 'react-dom' \
  -maxdepth 1 \
  -type d \
  -exec rm -Rf {} +
echo "event - Useless dependencies directories deleted."
echo ""

echo "info  - Dependencies left:"
ls -a ./node_modules
echo ""

echo "info  - Root directories list:"
ls -a .
echo ""

echo "info  - Directories sizes:"
du -hs .[^.]* * | sort -hr
echo ""
