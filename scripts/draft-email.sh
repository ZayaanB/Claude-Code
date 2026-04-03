#!/bin/bash
# Draft professional emails using Claude

echo "=== Email Drafter ==="
echo "Subject: $1"
echo ""
echo "Enter email context (or press Enter for generic):"
read -r CONTEXT

if [ -z "$CONTEXT" ]; then
    CONTEXT="professional update"
fi

echo ""
echo "Generating email draft..."
echo ""
echo "Subject: $1"
echo ""
echo "TODO: Write email body based on context: $CONTEXT"
echo ""
echo "Tip: Copy this into your email client and customize"
