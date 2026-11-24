#!/usr/bin/env bash
# Rebuild planner data from DiabloTools/d4data.
# Usage: tools/refresh-data.sh <d4data clone> <branch> <live|ptr>
#   e.g. tools/refresh-data.sh ../d4data master live    (after S16 goes live)
#        tools/refresh-data.sh ../d4data 3.3_ptr ptr
set -e
SRC=${1:?d4data clone}; BR=${2:?branch}; LABEL=${3:?live or ptr}
HERE=$(cd "$(dirname "$0")/.." && pwd)
cd "$SRC"
git sparse-checkout set --no-cone '/json/base/meta/Affix/*' '/json/base/meta/Aspect/*' '/json/base/meta/Item/*' \
  '/json/base/meta/Power/*' '/json/base/meta/SkillKit/*' '/json/base/meta/SetItemBonus/*' '/json/base/meta/Paragon*/*' \
  '/json/base/meta/PlayerClass/*' '/json/base/meta/Recipe/*' '/json/base/meta/MercenaryClass/*' '/json/base/meta/Global/*' \
  '/json/base/meta/GameBalance/*' '/json/base/meta/Monster*/*' '/json/base/meta/Actor/*' '/json/enUS_Text/meta/StringList/*' \
  '/json/buildVersion.txt' '/json/gb/*' '/buildVersion.txt'
git fetch -q origin "$BR" && git checkout -q -B "$BR" "origin/$BR"
cd "$HERE"
OUT=$(mktemp -d)
node tools/extract.js "$SRC/json" "$OUT" "$LABEL"
cp "$OUT"/*-"$LABEL".js data/
echo "Wrote data/*-$LABEL.js. Next: retire matching ops in data/s16-patch.js (check PATCH_MISS), bump ?v= in index.html, rescore the library."
