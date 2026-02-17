#!/usr/bin/env bash

set -euo pipefail

source .builder.sh

npm install

mkdir -p tgt/

cp -r src/manifest.json src/_locales/ src/icons/ tgt/

build_js src/service-worker.js tgt/service-worker.js

for dir in src/agents/*/; do

  build_js "${dir}content-script.js" "${dir/src/tgt}content-script.js"
done

echo -e "\nDone"
