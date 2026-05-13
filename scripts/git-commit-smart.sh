#!/bin/bash
# Analyze changes and suggest a git commit message.

set -e

# Display diff summary.
echo "=== Changes to commit ==="
git diff --cached --stat

echo ""
echo "=== Suggested commit message based on changes ==="

# Count added, modified, and deleted files.
ADDED=$(git diff --cached --name-status | grep -c "^A" || true)
MODIFIED=$(git diff --cached --name-status | grep -c "^M" || true)
DELETED=$(git diff --cached --name-status | grep -c "^D" || true)

echo "Added: $ADDED, Modified: $MODIFIED, Deleted: $DELETED files"
echo ""
echo "Enter commit message (or press Enter to use auto-generated):"
read -r MESSAGE

if [ -z "$MESSAGE" ]; then
    # Auto-generate commit message.
    if [ "$ADDED" -gt 0 ] && [ "$MODIFIED" -eq 0 ] && [ "$DELETED" -eq 0 ]; then
        MESSAGE="Add new files"
    elif [ "$MODIFIED" -gt 0 ]; then
        MESSAGE="Update modified files"
    else
        MESSAGE="Update code"
    fi
fi

git commit -m "$MESSAGE"
echo "Committed: $MESSAGE"