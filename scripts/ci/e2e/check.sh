###############################################################################
# Automatically download and play last CI failed E2E test video.

#!/bin/bash

# Exit when any command fails:
set -e

# TODO Download the latest failed workflow run `test-results` articfact.
# i.e.: https://github.com/betagouv/tell-me/actions/runs/2508627750
# Use https://api.github.com/repos/betagouv/tell-me/actions/runs

rm -Rf ./test-results && unzip ./test-results.zip -d ./test-results
vlc ./test-results/*/video.webm
