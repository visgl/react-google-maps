#!/usr/bin/env bash

examplesRoot="$(cd -P "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"/examples
cd $examplesRoot

for d in */; do
  echo ">>> installing example '$(basename $d)'"
  cd $examplesRoot/$d
  npm i --silent
done

