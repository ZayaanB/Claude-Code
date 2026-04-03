#!/bin/bash
# Setup script for Claude Code configuration
# Run this on a new machine after cloning the repo

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_DIR="$(dirname "$SCRIPT_DIR")"

echo "=== Claude Code Setup ==="
echo "Base directory: $BASE_DIR"

# Check if running from correct location
if [ ! -d "$BASE_DIR/config" ]; then
    echo "Error: Please run this script from the cloned repo root"
    exit 1
fi

# Create symlinks in ~/.claude
echo "Creating symlinks in ~/.claude/..."
mkdir -p ~/.claude

# Remove existing files/symlinks if they exist
for item in settings.json keybindings.json memory MEMORY.md; do
    if [ -e "~/.claude/$item" ]; then
        echo "  Removing existing ~/.claude/$item"
        rm -f "~/.claude/$item"
    fi
done

# Create symlinks
ln -s "$BASE_DIR/config/settings.json" ~/.claude/settings.json
ln -s "$BASE_DIR/config/keybindings.json" ~/.claude/keybindings.json
ln -s "$BASE_DIR/config/memory" ~/.claude/memory
ln -s "$BASE_DIR/config/MEMORY.md" ~/.claude/MEMORY.md

echo "  ✓ Symlinks created"

# Add alias to bashrc
echo "Adding alias to ~/.bashrc..."
if ! grep -q "claude-config" ~/.bashrc 2>/dev/null; then
    echo 'alias claude-config="~/claude_ai/scripts"' >> ~/.bashrc
    echo "  ✓ Alias added"
else
    echo "  ℹ Alias already exists"
fi

# Make all scripts executable
echo "Making scripts executable..."
chmod +x "$SCRIPT_DIR"/*.sh
echo "  ✓ Scripts ready"

# Check for required tools
echo ""
echo "=== Checking dependencies ==="
for cmd in git python node; do
    if command -v "$cmd" &> /dev/null; then
        echo "  ✓ $cmd installed"
    else
        echo "  ⚠ $cmd not found (may not be needed)"
    fi
done

echo ""
echo "=== Setup Complete! ==="
echo ""
echo "Quick commands:"
echo "  claude-config new-project <name> <type>  - Create a new project"
echo "  claude-config git-commit-smart           - Smart git commit"
echo ""
echo "Available project types: python, ml, typescript, cpp"
echo ""
echo "Reload your shell or run: source ~/.bashrc"
