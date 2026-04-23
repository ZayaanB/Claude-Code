---
name: Claude Harness Project
description: Personal Claude Code configuration, memory system, and VS Code extension project
type: project
---

## Location
- **Primary:** `/home/zayaan/claude_ai` (symlinked to `~/claude_ai`)
- **Config:** `~/claude_ai/config/`
- **Claude memory:** `~/.claude/projects/-home-zayaan-claude-ai/` (for this workspace)

## Folder Structure

| Path | Contents |
|------|----------|
| `config/` | Core configuration - CLAUDE.md, settings.json, MEMORY.md, zayaan_guide.md, mcp-guide.md |
| `config/memory/` | Persistent memories: user_role.md, feedback_preferences.md, project_active.md, reference_resources.md |
| `scripts/` | Utility scripts: new-project.sh, git-commit-smart.sh, status-update.sh, draft-email.sh |
| `docs/` | Documentation: workflow-skills-guide.md, github-sync-explained.md, automated-workflow.md |
| `srccode/` | (empty - intended for source code storage) |
| `context-sync/` | VS Code extension: ContextSync - collaborative AI context sharing via Obsidian/OneDrive |

## Purposes

1. **Claude Code Harness:** Personalized configuration, hooks, keybindings, and memory system
2. **ContextSync Extension:** VS Code extension for team AI context sharing (TypeScript, publishes to marketplace)
3. **Workflow Automation:** Scripts for project scaffolding, git commits, status updates

## Sources of Information

| File | Purpose |
|------|---------|
| `config/CLAUDE.md` | Communication style, response speed rules, code quality guidelines |
| `config/zayaan_guide.md` | Complete workflow reference, custom skills, commands |
| `config/mcp-guide.md` | MCP server setup for external integrations |
| `config/MEMORY.md` | Index of all memory files |
| `config/settings.json` | Model preference (haiku), hooks (sound notifications), custom statusline |

## Style Choices

- **Ask before acting:** Use AskUserQuestion to confirm understanding
- **Educational:** Explain reasoning, not just solutions; tailor to first-year CS level
- **Collaborative:** Discuss options before coding
- **Simple questions** → Direct answer without tool calls
- **File content** → Read tool, then answer
- **Complex tasks** → Spawn agents (Explore/Plan/general-purpose)

## Rules

1. Read files before editing or suggesting changes
2. Use specialized tools (Read, Edit) instead of shell commands when available
3. Mark tasks complete as finished
4. Save important learnings to memory system
5. Include file:line_number references when discussing code
6. Prioritize correct, secure code over clever solutions
7. Follow existing patterns when present

## Key Commands

| Need | Use |
|------|-----|
| New project | `claude-config new-project <name> <type>` (python, ml, typescript, cpp) |
| Smart commit | `claude-config git-commit-smart` |
| Status update | `claude-config status-update` |

## GitHub Sync Note

Pushing to GitHub does NOT auto-sync across machines. Manual `git pull` required on each machine.
