
build_js() {

  local input="$1"
  local output="$2"

  if [ -f "$input" ]; then

    echo -e "\n'$input' -> '$output'"

    npx rollup -i "$input" -o "${output/%.js/.combined.js}" --failAfterWarnings

    npx swc "${output/%.js/.combined.js}" -o "${output/%.js/.polyfilled.js}"

    npx rollup -p node-resolve -p commonjs -i "${output/%.js/.polyfilled.js}" -o "${output/%.js/.bundled.js}" --failAfterWarnings

    if [[ $NODE_ENV == "development" ]]; then

      cp "${output/%.js/.bundled.js}" "$output"
    else

      npx terser "${output/%.js/.bundled.js}" -o "${output/%.js/.compressed.js}" -c -m
      cp "${output/%.js/.compressed.js}" "$output"
    fi

    rm "${output/%.js/.combined.js}"
    rm "${output/%.js/.polyfilled.js}"
    rm "${output/%.js/.bundled.js}"
    rm -f "${output/%.js/.compressed.js}"
  fi
}
