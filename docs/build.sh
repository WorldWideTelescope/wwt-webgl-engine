#! /usr/bin/env bash
# Copyright 2020 the .NET Foundation
# Licensed under the MIT License

# A short helper to automate building of our hacky hybrid docs.

set -euo pipefail
cd "$(dirname "$0")"
zola build
rm -rf public/apiref
cd ..
npm run doc
