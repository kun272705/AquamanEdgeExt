#!/usr/bin/env bash

set -euo pipefail

source .builder.sh

npm install

mkdir -p tgt/

cp src/manifest.json tgt/
cp -r src/_locales/ -t tgt/
cp -r src/images/ -t tgt/

build_js src/background.js tgt/background.js

mkdir -p tgt/agents/

for dir in src/agents/*/; do

  build_js "${dir}content.js" "${dir/src/tgt}content.js"
done

echo -e "\nDone"
