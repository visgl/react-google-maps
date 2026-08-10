#!/usr/bin/env bash

rootDir="$(cd -P "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo ">>> installing all workspace dependencies"
npm --prefix "$rootDir" install --silent
