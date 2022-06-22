#!/bin/bash

# Exit when any command fails:
set -e

rm -Rf ./test-results/demo-Demo-CHROME-DESKTOP ./docs/_media/demo.gif ./docs/_media/demo.webm
pnpm exec playwright test -c ./scripts/demo/playwright.config.ts
mv ./test-results/demo-Demo-CHROME-DESKTOP/video.webm ./docs/_media/demo.webm
ffmpeg -i ./docs/_media/demo.webm -pix_fmt rgb8 ./docs/_media/demo.gif
