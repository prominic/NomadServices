#!/usr/bin/env bash
# ============================================================
# create-dev-artifact.sh
#
# Build the Jekyll site fresh and package the deployable files
# from _site/ into nomad-services-artifact.zip in this
# directory. Any existing zip with that name is removed first.
#
# Items included in the archive (edit INCLUDE below to change
# what gets packaged):
#     assets/
#     index.html
#     sitemap.xml
#     robots.txt
#
# Requires: bundle (Ruby), zip
# ============================================================

set -euo pipefail

# Items in _site/ to ship. Edit this list to add/remove files.
INCLUDE=(assets index.html sitemap.xml robots.txt)

# Resolve the script's own directory so we run from there regardless
# of where the user invoked us from.
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

ZIP_NAME="nomad-services-artifact.zip"
ZIP_PATH="$SCRIPT_DIR/$ZIP_NAME"

if [[ -f "$ZIP_PATH" ]]; then
  echo "Removing existing $ZIP_NAME"
  rm -f "$ZIP_PATH"
fi

# Sanity check - zip is required and is not always installed on
# Windows Git Bash. apt/yum/brew install zip if missing.
if ! command -v zip >/dev/null 2>&1; then
  echo "Error: 'zip' command not found in PATH." >&2
  echo "  Install with: apt-get install zip / brew install zip / yum install zip" >&2
  exit 1
fi

echo
echo "=== Cleaning previous build ==="
bundle exec jekyll clean

echo
echo "=== Building Jekyll site ==="
bundle exec jekyll build

echo
echo "=== Rewriting asset paths in index.html for portable deployment ==="
# Jekyll emits absolute asset references (href="/assets/...",
# src="/assets/..."). Strip the leading slash so they resolve relative
# to wherever index.html ends up being served from. -i.bak is for cross
# -platform portability (BSD sed on macOS requires the suffix argument;
# GNU sed accepts it too). We delete the .bak right after.
sed -i.bak 's|="/assets/|="assets/|g' _site/index.html
rm -f _site/index.html.bak

# Filter the include list to entries that actually exist in _site/.
# Missing items are skipped with a note rather than failing the build.
EXISTING=()
for item in "${INCLUDE[@]}"; do
  if [[ -e "_site/$item" ]]; then
    EXISTING+=("$item")
  else
    echo "  (skipping ${item} - not present in _site/)"
  fi
done

if [[ ${#EXISTING[@]} -eq 0 ]]; then
  echo "Nothing to archive - _site is empty or items missing." >&2
  exit 1
fi

echo
echo "=== Creating archive: $ZIP_NAME ==="
# Run zip from inside _site so paths in the archive are relative
# (assets/..., index.html, etc.) rather than _site/assets/...
( cd _site && zip -r "$ZIP_PATH" "${EXISTING[@]}" )

echo
echo "Done: $ZIP_NAME"
echo "Upload the contents of this zip to the web server's document root."
