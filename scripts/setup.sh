#!/bin/bash
# Main setup script for Claude Code.
# Run once after cloning the repository.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_DIR="$(dirname "$SCRIPT_DIR")"

echo "=== Claude Code Setup ==="
echo "Base directory: $BASE_DIR"

# Ensure script is run from the repository root.
if [ ! -d "$BASE_DIR/config" ]; then
    echo "Error: Please run this script from the cloned repo root"
    exit 1
fi

# Set up ~/.claude configuration directory.
echo "Creating symlinks in ~/.claude/..."
mkdir -p ~/.claude

# Remove existing configurations to ensure a clean setup.
for item in settings.json keybindings.json memory MEMORY.md; do
    if [ -e "$HOME/.claude/$item" ]; then
        echo "  Removing existing ~/.claude/$item"
        rm -rf "$HOME/.claude/$item"
    fi
done

# Symlink custom configurations.
ln -s "$BASE_DIR/config/settings.json" ~/.claude/settings.json
ln -s "$BASE_DIR/config/keybindings.json" ~/.claude/keybindings.json
ln -s "$BASE_DIR/config/memory" ~/.claude/memory
ln -s "$BASE_DIR/config/MEMORY.md" ~/.claude/MEMORY.md

echo "  ✓ Symlinks created"

# Add convenience alias to ~/.bashrc.
echo "Adding alias to ~/.bashrc..."
if ! grep -q "claude-config" ~/.bashrc 2>/dev/null; then
    echo 'alias claude-config="~/claude_ai/scripts"' >> ~/.bashrc
    echo "  ✓ Alias added"
else
    echo "  ℹ Alias already exists"
fi

# Ensure scripts are executable.
echo "Making scripts executable..."
chmod +x "$SCRIPT_DIR"/*.sh
echo "  ✓ Scripts ready"


echo "=== Setup Complete! ==="
echo "Reload your shell or run: source ~/.bashrc"
