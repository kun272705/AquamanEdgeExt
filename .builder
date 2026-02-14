
build_js() {

  if [ -f "$1" ]; then

    echo "$1 -> $2"
    npx rollup -i "$1" -o "${2/%.js/.combined.js}" --failAfterWarnings
    npx babel "${2/%.js/.combined.js}" -o "${2/%.js/.polyfilled.js}"
    npx rollup -p node-resolve -p commonjs -i "${2/%.js/.polyfilled.js}" -o "${2/%.js/.bundled.js}" --failAfterWarnings
    npx terser "${2/%.js/.bundled.js}" -o "${2/%.js/.compressed.js}" -c -m
    cp "${2/%.js/.compressed.js}" "$2"
    rm -rf ${2/%.js/.*.js}
  fi
}
