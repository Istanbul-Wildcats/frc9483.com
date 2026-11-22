#!/bin/zsh
# Lighthouse over all subpages, all categories, mobile + desktop.
# Usage: zsh scripts/lighthouse-scan.sh
set -u
OUT="lighthouse-reports"
mkdir -p "$OUT"
PAGES=(about sponsors shop awards robots robots/enigma resources gallery contact join)
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

for p in $PAGES; do
  slug="${p//\//-}"
  for mode in mobile desktop; do
    if [[ $mode == desktop ]]; then
      extra=(--preset=desktop)
    else
      extra=()
    fi
    echo "== $mode /tr/$p =="
    npx -y lighthouse "http://localhost:3000/tr/$p" \
      --output=json --output=html \
      --output-path="$OUT/${slug}-${mode}" \
      --chrome-flags="--headless=new --user-data-dir=$(mktemp -d)" \
      --quiet "${extra[@]}" 2>/dev/null
    # Extract category scores for the summary
    python3 - "$OUT/${slug}-${mode}.report.json" "$mode" "$p" <<'PY'
import json,sys
try:
    d=json.load(open(sys.argv[1]))
    cats={k:int(v["score"]*100) for k,v in d["categories"].items() if v["score"] is not None}
    print(f"{sys.argv[2]}/{sys.argv[3]}: "+" ".join(f"{k}={v}" for k,v in cats.items()))
except Exception as e:
    print(f"{sys.argv[2]}/{sys.argv[3]}: FAILED {e}")
PY
  done
done
