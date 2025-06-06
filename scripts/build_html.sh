#!/usr/bin/env bash
set -euo pipefail
DATE=$(date -u +%m%d%Y)
mkdir -p "docs/$DATE"
marp --html --output "docs/$DATE/index.html" "$DATE.md"
