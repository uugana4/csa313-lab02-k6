#!/usr/bin/env bash
# 5 / 30 / 100 VU түвшин тус бүрийг ТУСАД НЬ ажиллуулж, бүтэн гаралтыг results/-д хадгална.
# Хэрэглээ:
#   bash scripts/run-levels.sh                      # test.k6.io, results/run-05vu.txt ...
#   bash scripts/run-levels.sh local http://localhost:3000   # results/local-05vu.txt ...
#   ENDPOINT=/slow bash scripts/run-levels.sh slow http://localhost:3000
set -e
PREFIX="${1:-run}"
TARGET="${2:-https://test.k6.io}"
mkdir -p results
k6 version | tee results/k6-version.txt
for vu in 5 30 100; do
  n=$(printf "%02d" "$vu")
  echo "=== $vu VU ($PREFIX) ==="
  k6 run -e TARGET="$TARGET" -e ENDPOINT="${ENDPOINT:-/}" \
    --vus "$vu" --duration 1m script.js | tee "results/${PREFIX}-${n}vu.txt"
done
echo "Дууслаа. Хүснэгт: python3 scripts/make-table.py $PREFIX"
