#!/usr/bin/env bash

examplesRoot="$(cd -P "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"/examples

for d in */; do
  echo ">>> building example '$(basename $d)'"
  cd $examplesRoot/$d
  npm run build

  if [ ! $? ] ; then
    echo "\n\nBUILD FAILED!\n\n";

    exit 1
  fi
done

