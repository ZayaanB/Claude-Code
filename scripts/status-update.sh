#!/bin/bash
# Generate a weekly status update

echo "=== Weekly Status Update Generator ==="
echo ""
echo "Week of: $(date +%Y-%m-%d)"
echo ""
echo "What did you accomplish this week?"
read -r ACCOMPLISHMENTS

echo ""
echo "What are your goals for next week?"
read -r GOALS

echo ""
echo "Any blockers or concerns?"
read -r BLOCKERS

echo ""
echo "=== Generated Status Update ==="
echo ""
echo "**Week of $(date +%Y-%m-%d)**"
echo ""
echo "**Accomplished:**"
echo "$ACCOMPLISHMENTS"
echo ""
echo "**Next Week:**"
echo "$GOALS"
echo ""
echo "**Blockers:**"
echo "$BLOCKERS"
echo ""