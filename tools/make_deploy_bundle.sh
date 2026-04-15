#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

mkdir -p dist
ts=$(date +%Y%m%d-%H%M%S)
out="dist/hermetic-knowledge-${ts}.tar.gz"

tar -czf "$out" \
  data/catalog \
  data/knowledge \
  tools/build_top100_knowledge.py \
  tools/validate_knowledge.py \
  reports/knowledge_report.md

echo "Bundle created: $out"
