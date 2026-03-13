#!/bin/sh
# Run this once from the root of the Witness-Interactive repo.
# Installs the pre-commit hook and makes it executable.

HOOK_SRC="pre-commit"
HOOK_DEST=".git/hooks/pre-commit"

if [ ! -d ".git" ]; then
  echo "Error: Run this from the root of the git repo (where .git/ lives)."
  exit 1
fi

if [ ! -f "$HOOK_SRC" ]; then
  echo "Error: pre-commit file not found in current directory."
  echo "Place both install-hook.sh and pre-commit in the repo root first."
  exit 1
fi

cp "$HOOK_SRC" "$HOOK_DEST"
chmod +x "$HOOK_DEST"

echo "✓ Hook installed at $HOOK_DEST"
echo "  Every future commit will now be checked for empty files."
echo ""
echo "  To test it manually:"
echo "    .git/hooks/pre-commit"
