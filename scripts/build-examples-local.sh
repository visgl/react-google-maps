#!/usr/bin/env bash

set -euo pipefail

rootDir="$(cd -P "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
examplesRoot="${rootDir}/examples"

for d in "${examplesRoot}"/*/; do
  if [[ ! -d "${d}" ]]; then
    continue
  fi

  if [[ "$(basename "${d}")" == "_template" ]]; then
    continue
  fi

  packageJson="${d}package.json"

  if [[ ! -f "${packageJson}" ]]; then
    continue
  fi

  if ! grep -q '"build-local"' "${packageJson}"; then
    continue
  fi

  if ! grep -q 'vite.config.local.js' "${packageJson}"; then
    continue
  fi

  echo ">>> building example locally '$(basename "${d}")'"
  (
    cd "${d}"
    npm run build-local
  )
done
