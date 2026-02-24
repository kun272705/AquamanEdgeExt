#!/usr/bin/env bash

set -euo pipefail

source .builder.sh

npm install

mkdir -p tgt/

cp src/manifest.json tgt/
cp -r src/_locales/ -t tgt/
cp -r src/icons/ -t tgt/

build_js src/service-worker.js tgt/service-worker.js

mkdir -p tgt/agents/

for dir in src/agents/*/; do

  build_js "${dir}content-script.js" "${dir/src/tgt}content-script.js"
done

echo -e "\nDone"
