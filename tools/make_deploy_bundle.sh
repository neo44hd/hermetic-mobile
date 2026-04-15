#!/usr/bin/env bash
set -e
cd "$(dirname "$0")/.."

ts=$(date +%Y%m%d-%H%M%S)
out="dist/hermetic-knowledge-${ts}.tar.gz"

tar -czf "$out" \
  README.md \
  docs \
  core \
  data/catalog \
  data/knowledge \
  tools/build_top100_knowledge.py \
  tools/validate_knowledge.py

echo "Bundle created: $out"
