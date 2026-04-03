# Automated Workflow Setup

## Current Hooks (Sound Alerts)

Your `settings.json` already has sound notifications for tool use.

## Recommended Additional Hooks

### 1. Auto-Run Tests on Write

Add to `settings.json` hooks to run tests when you write test files:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "if [[ \"$file\" == *\"test\"* ]]; then pytest \"$file\" 2>/dev/null || true; fi"
          }
        ]
      }
    ]
  }
}
```

### 2. Git Auto-Status

Run `git status` after any file change in a repo:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit",
        "hooks": [
          {
            "type": "command",
            "command": "git status --short 2>/dev/null || true"
          }
        ]
      }
    ]
  }
}
```

## Custom Commands You Can Use

### Quick Project Setup
```bash
~/claude_ai/scripts/new-project.sh my-app python
~/claude_ai/scripts/new-project.sh my-ml-project ml
```

### Smart Git Commit
```bash
~/claude_ai/scripts/git-commit-smart.sh
```

## MCP Server Integration (Advanced)

MCP (Model Context Protocol) servers let Claude connect to external tools:

### Example: File System MCP
```yaml
# ~/.claude/mcp-servers.yaml
mcpServers:
  filesystem:
    command: npx
    args:
      - -y
      - @modelcontextprotocol/server-filesystem
      - /home/zayaan/projects
```

### Example: GitHub MCP
```yaml
mcpServers:
  github:
    command: npx
    args:
      - -y
      - @modelcontextprotocol/server-github
    env:
      GITHUB_TOKEN: $GITHUB_TOKEN
```

## To Enable MCP

1. Install Node.js if not already installed
2. Create `~/.claude/mcp-servers.yaml`
3. Add server configurations
4. Restart Claude Code

## Productivity Tips

1. **Use templates** - `~/claude_ai/templates/` has project starters
2. **Learn the shortcuts** - Check `/help` for all commands
3. **Use agents** - I can spawn sub-agents for parallel work
4. **Save memories** - Tell me to remember important preferences
5. **Use /fast mode** - Faster responses for simple tasks