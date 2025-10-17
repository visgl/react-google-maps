#!/usr/bin/env bash

examplesRoot="$(cd -P "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"/examples

for d in $examplesRoot/*/; do
  # Skip the template directory
  if [ "$(basename $d)" = "_template" ]; then
    continue
  fi

  echo ">>> building example '$(basename $d)'"
  cd $d
  npm run build

  if [ ! $? ] ; then
    echo "\n\nBUILD FAILED!\n\n";

    exit 1
  fi
done

