#!/usr/bin/env bash

set -euo pipefail

rootDir="$(cd -P "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
examplesRoot="${rootDir}/examples"
tscBinary="${rootDir}/node_modules/.bin/tsc"

for d in "${examplesRoot}"/*/; do
  if [[ ! -d "${d}" ]]; then
    continue
  fi

  configPath="${d}tsconfig.json"

  if [[ ! -f "${configPath}" ]]; then
    continue
  fi

  echo "== ${configPath#"${rootDir}/"} =="
  "${tscBinary}" -p "${configPath}" --noEmit
done
