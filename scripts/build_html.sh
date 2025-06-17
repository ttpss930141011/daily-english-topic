#!/usr/bin/env bash
set -euo pipefail
DATE_MDY=$(date -u +%m%d%Y)
DATE_DMY=$(date -u +%d%m%Y)
mkdir -p "docs/$DATE_MDY"

# Find the markdown file for today in the new directory structure
# Try Title-DDMMYYYY.md format in posts directory
MD_FILE=$(ls posts/*-${DATE_DMY}.md 2>/dev/null | head -n 1 || true)
# Fallback to root directory (legacy)
if [ -z "$MD_FILE" ]; then
    MD_FILE=$(ls *-${DATE_DMY}.md 2>/dev/null | head -n 1 || true)
fi
# Final fallback to legacy MMDDYYYY.md format
if [ -z "$MD_FILE" ]; then
    MD_FILE="${DATE_MDY}.md"
fi

echo "Using markdown file: $MD_FILE"
marp --html --output "docs/$DATE_MDY/index.html" "$MD_FILE"

# Enhance slides with interactive features (if available)
if [ -f "scripts/enhance_slides.py" ]; then
    echo "Enhancing slides with interactive features..."
    python scripts/enhance_slides.py
fi

# Use animated index updater if available, otherwise fall back to simple version
if [ -f "scripts/update_index_animated.py" ]; then
    echo "Using animated index updater..."
    python scripts/update_index_animated.py
else
    python scripts/update_index.py
fi
