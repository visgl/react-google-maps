#!/usr/bin/env bash

rootDir="$(cd -P "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

for d in `find "${rootDir}/examples" -type d -depth 1` ; do
  echo ">>> installing example '$(basename $d)'"
  (
    cd $d
    npm ci --silent
  )

done
