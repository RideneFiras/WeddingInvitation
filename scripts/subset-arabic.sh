#!/usr/bin/env bash
# Regenerates the self-hosted Arabic font files. Requires: pip install fonttools brotli
#   public/fonts/amiri-ar.woff2, aref-ar.woff2   trimmed full faces (Arabic invitations)
#   app/fonts-local/*.woff2                        tiny subsets for the Arabic shown in French mode
# Run after changing the Arabic names in site.config.ts:  scripts/subset-arabic.sh "الاسم و الاسم"
set -euo pipefail
NAMES="${1:-الاسم و الاسم}"
TMP="$(mktemp -d)"
B=https://raw.githubusercontent.com/google/fonts/main/ofl
curl -sfL -o "$TMP/Amiri.ttf" "$B/amiri/Amiri-Regular.ttf"
curl -sfL -o "$TMP/Aref.ttf" "$B/arefruqaa/ArefRuqaa-Regular.ttf"

# Core Arabic + the extra letters used in Tunisian / Maghrebi names (ٱ پ چ ڤ ڨ ک گ ی)
EXTRA="U+0671,U+067E,U+0686,U+06A4,U+06A8,U+06A9,U+06AF,U+06CC"
AR="U+060C,U+061B,U+061F,U+0621-063A,U+0640-0652,U+0660-066C,U+0670,$EXTRA,U+200C-200F"
pyftsubset "$TMP/Amiri.ttf" --unicodes="U+0020-007E,U+00A0,U+00AB,U+00B7,U+00BB,$AR,U+2013-2014,U+2018-201D,U+2026" \
  --layout-features='*' --flavor=woff2 --output-file=public/fonts/amiri-ar.woff2
pyftsubset "$TMP/Aref.ttf" --unicodes="U+0020,U+00A0,$AR" --layout-features='*' --flavor=woff2 --output-file=public/fonts/aref-ar.woff2

pyftsubset "$TMP/Amiri.ttf" --text="العربية" --layout-features='*' --flavor=woff2 --output-file=app/fonts-local/amiri-label.woff2
pyftsubset "$TMP/Aref.ttf" --text="$NAMES" --layout-features='*' --flavor=woff2 --output-file=app/fonts-local/aref-names.woff2
echo "Arabic fonts written to public/fonts/ and app/fonts-local/"
