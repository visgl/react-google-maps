#!/usr/bin/env bash

#rootDir=`readlink -f "$(dirname $0)/.."`
rootDir="$(cd -P "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

for d in `find ${rootDir}/examples -type d -depth 1` ; do
  echo ">>> updating example '$(basename $d)'"
  (
    cd $d
    npm --no-progress --no-audit --no-fund --silent update
    to_update=`npm outdated --json | jq -r 'to_entries[] | select(.value.wanted != .value.latest) | .key'`

    for pkg in $to_update ; do
      echo "    - update package ${pkg}"
      npm --no-progress --silent install $pkg@latest
    done
  )

done
