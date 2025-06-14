#!/usr/bin/env bash
set -euo pipefail
DATE_MDY=$(date -u +%m%d%Y)
DATE_DMY=$(date -u +%d%m%Y)
mkdir -p "docs/$DATE_MDY"

# Find the markdown file for today in the new or old naming scheme
MD_FILE=$(ls *-${DATE_DMY}.md 2>/dev/null | head -n 1 || true)
if [ -z "$MD_FILE" ]; then
    MD_FILE="${DATE_MDY}.md"
fi

marp --html --output "docs/$DATE_MDY/index.html" "$MD_FILE"
python scripts/update_index.py
