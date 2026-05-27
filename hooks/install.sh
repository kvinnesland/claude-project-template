#!/bin/sh
#
# Install git hooks from the hooks/ directory.
# Run once after cloning: sh hooks/install.sh

set -e

HOOKS_DIR=".git/hooks"

if [ ! -d "$HOOKS_DIR" ]; then
  echo "ERROR: .git/hooks not found. Run this script from the repository root."
  exit 1
fi

cp hooks/commit-msg "$HOOKS_DIR/commit-msg"
chmod +x "$HOOKS_DIR/commit-msg"

echo "OK: commit-msg hook installed."
echo "    Every commit must now reference a CR (e.g. 'Add login endpoint (CR-001)')."
echo "    Exempt prefixes: Merge / Revert / INFRA:"
