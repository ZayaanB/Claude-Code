# Zayaan's Claude Code Guide

Complete workflow reference for your personalized setup.

---

## Built-in Skills (Type these directly)

| Command | When to Use |
|---------|-------------|
| `/commit -m "msg"` | Creating git commits |
| `/review-pr 123` | Reviewing pull requests |
| `/model` | Switch models (Haiku/Sonnet/Opus) |
| `/fast` | Fast mode for simple tasks |
| `/help` | See all commands |
| `/loop 5m` | Run something every 5 minutes |
| `/schedule` | Set up cron jobs |

---

## Agent System - Deep Dive

Agents are specialized sub-processes that handle complex, multi-step tasks autonomously.

### Agent Types

| Agent | Subagent Type | Best For |
|-------|---------------|----------|
| **General-Purpose** | `general-purpose` | Complex tasks, research, multi-step workflows |
| **Explore** | `Explore` | Codebase navigation, finding patterns, understanding architecture |
| **Plan** | `Plan` | Designing implementation plans, architectural decisions |
| **claude-code-guide** | `claude-code-guide` | Questions about Claude Code, CLI, API, SDK |
| **statusline-setup** | `statusline-setup` | Configuring status line settings |

### How Agents Work

1. **Spawn**: I launch a sub-agent with a specific task
2. **Autonomous Execution**: The agent works independently with its own tool access
3. **Return Result**: Single consolidated response when done

### When to Use Agents

| Scenario | Recommended Agent |
|----------|-------------------|
| "Search for all authentication patterns in this codebase" | Explore |
| "Design a plan for adding user authentication" | Plan |
| "Research how to implement OAuth" | General-Purpose |
| "How do I configure hooks in settings.json?" | claude-code-guide |
| "Fix this bug across multiple files" | General-Purpose |

### Agent Usage Examples

#### Example 1: Codebase Exploration
```
You: "Find all places where database queries are made"
Me: Spawns Explore agent with task: "Search for database query patterns"
Result: Returns list of files, functions, and query patterns found
```

#### Example 2: Complex Refactoring
```
You: "Refactor the authentication module to use JWT"
Me: Spawns General-Purpose agent with full context
Result: Agent plans changes, makes edits, reports back
```

#### Example 3: Architecture Planning
```
You: "How should I structure a microservices architecture?"
Me: Spawns Plan agent
Result: Returns step-by-step implementation plan with trade-offs
```

#### Example 4: Parallel Research
```
You: "Research React Server Components, Next.js App Router, and TanStack Query"
Me: Spawns 3 Explore agents in parallel
Result: Consolidated research from all three agents
```

### Agent Parameters

- **description**: Short summary (3-5 words) of what the agent will do
- **subagent_type**: Which specialized agent to use
- **isolation**: `"worktree"` for isolated git worktree (clean environment)
- **run_in_background**: `true` to run without blocking your workflow
- **model**: Override model for this agent (sonnet, opus, haiku)

### Background Agents

```
You: "Search for all API endpoints while I continue working"
Me: Spawns agent with run_in_background: true
Result: You get notified when it completes, no waiting
```

### When NOT to Use Agents

- Simple file reads (use Read tool directly)
- Single file searches (use Glob/Grep directly)
- Quick edits (use Edit directly)
- Agents add overhead - use for complex, multi-step tasks only

---

## Custom Scripts

| Script | Command | Use Case |
|--------|---------|----------|
| `new-project.sh` | `claude-config new-project myapp python` | Scaffold projects |
| `git-commit-smart.sh` | `claude-config git-commit-smart` | Smart git commits |
| `status-update.sh` | `~/claude_ai/scripts/status-update.sh` | Generate status updates |
| `draft-email.sh` | `~/claude_ai/scripts/draft-email.sh` | Draft emails |
| `setup.sh` | `~/claude_ai/scripts/setup.sh` | Setup on new machine |

---

## Essential Workflow Patterns

| Task | How to Ask Me |
|------|---------------|
| **Git** | "Create a commit with these changes" |
| **Testing** | "Run tests and fix any failures" |
| **Debugging** | "Debug this error: [paste]" |
| **Code Review** | "/review-pr 42" then "What issues do you see?" |
| **Research** | "Research [topic]" or "Find all usages of X" |
| **Status Update** | "Draft a weekly status update about [feature]" |
| **Email** | "Draft a professional email to [person] about [topic]" |

---

## Model Selection Guide

| Model | Use When |
|-------|----------|
| **Haiku** | Quick questions, code search, simple edits |
| **Sonnet** | Most coding, debugging, refactoring (default) |
| **Opus** | Architecture, complex reasoning, planning |

---

## Task Management

I can track your work using the task system:

### Creating Tasks
```
You: "Break this down into tasks"
Me: Creates tasks with TaskCreate tool
```

### Task States
- `pending` - Not started
- `in_progress` - Currently working on
- `completed` - Finished

### Task Dependencies
- `blocks` - Tasks that depend on this one
- `blockedBy` - Tasks that must complete first

---

## Memory System

Memories persist across sessions in `config/memory/`.

### Types
| Type | Purpose |
|------|---------|
| `user` | Your role, goals, preferences |
| `feedback` | How I should approach work |
| `project` | Ongoing work, deadlines |
| `reference` | External resources, links |

### How to Use
```
You: "Remember that I prefer async/await over promises"
Me: Saves to feedback_preferences.md
```

### Viewing Memories
Check `config/memory/` for all saved memories.

---

## Planning Mode

For complex tasks, I use EnterPlanMode to:
1. Explore the codebase thoroughly
2. Understand existing patterns
3. Design implementation approach
4. Get your approval before coding

### When Plan Mode Triggers
- New feature implementation
- Multiple valid approaches exist
- Multi-file changes
- Architectural decisions
- Unclear requirements

---

## Workflow Checklist

### Starting a New Task
- [ ] Read relevant files first
- [ ] Clarify requirements if unclear
- [ ] Use Plan mode for complex tasks
- [ ] Break into tasks with TaskCreate

### During Development
- [ ] Test frequently
- [ ] Ask for clarification on errors
- [ ] Save important learnings to memory
- [ ] Use `/fast` for quick iterations

### Finishing Up
- [ ] Run tests
- [ ] Create commit with descriptive message
- [ ] Update memory with what was learned
- [ ] Document decisions in CLAUDE.md

---

## Email/Communication Templates

### Status Update
```
**Week of [date]**

**Accomplished:**
- [list]

**Next Week:**
- [goals]

**Blockers:**
- [any issues]
```

### Bug Report
```
**Title:** [clear description]

**Steps to reproduce:**
1. 
2. 

**Expected behavior:**

**Actual behavior:**

**Environment:**
```

---

## Quick Reference: All Commands

### Slash Commands
- `/help` - Show help
- `/model` - Switch model
- `/fast` - Toggle fast mode
- `/clear` - Clear conversation
- `/compact` - Compress context
- `/commit` - Create git commit
- `/review-pr` - Review pull request
- `/loop` - Run recurring task
- `/schedule` - Manage scheduled agents

### Natural Language Commands
- "Create a task for X"
- "Remember that..."
- "Plan how to..."
- "Search for..."
- "Debug this..."

---

## File Locations

```
~/claude_ai/
├── config/
│   ├── settings.json       # Main config with hooks
│   ├── keybindings.json    # Keyboard shortcuts
│   ├── MEMORY.md           # Memory index
│   ├── zayaan_guide.md     # This file
│   └── memory/
│       ├── user_role.md
│       ├── feedback_preferences.md
│       ├── project_active.md
│       └── reference_resources.md
├── scripts/
│   ├── new-project.sh
│   ├── git-commit-smart.sh
│   ├── status-update.sh
│   ├── draft-email.sh
│   └── setup.sh
├── templates/
│   ├── python-project/
│   ├── ml-project/
│   ├── typescript-project/
│   └── cpp-project/
├── docs/
│   ├── workflow-skills-guide.md
│   └── github-sync-explained.md
├── CLAUDE.md               # Project instructions
└── .gitignore              # Git ignore rules
```

---

## GitHub Sync

**Remember:** Pushing to GitHub does NOT auto-sync.

```bash
# On Machine A (after changes)
git add .
git commit -m "Update config"
git push

# On Machine B (to get changes)
git pull
```

See `docs/github-sync-explained.md` for full details.

---

## MCP (Model Context Protocol) - External Integrations

MCP servers connect Claude to databases, APIs, and external tools.

### Quick Start
```bash
# Install Node.js if needed
node --version  # Need 18+

# Create config
nano ~/.claude/mcp_servers.json

# Add server (example: filesystem)
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path"],
      "env": {}
    }
  }
}

# Restart Claude Code
```

### Available Servers

| Server | Command | Use Case |
|--------|---------|----------|
| **filesystem** | `npx -y @modelcontextprotocol/server-filesystem /path` | Access specific directories |
| **github** | `npx -y @modelcontextprotocol/server-github` | GitHub API (needs GITHUB_TOKEN) |
| **sqlite** | `npx -y @modelcontextprotocol/server-sqlite db.db` | Query SQLite databases |
| **postgres** | `npx -y @modelcontextprotocol/server-postgres` | PostgreSQL (needs DATABASE_URL) |
| **brave** | `npx -y @modelcontextprotocol/server-brave-search` | Web search (needs API key) |
| **git** | `npx -y @modelcontextprotocol/server-git` | Git operations |

### Examples

**GitHub Integration:**
```bash
export GITHUB_TOKEN="ghp_your-token"
```
Then ask: "Fetch PR #42 from ZayaanB/Claude-Code"

**Database Query:**
```json
{
  "mcpServers": {
    "sqlite": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sqlite", "/path/to/db.db"]
    }
  }
}
```
Then ask: "What tables are in this database?"

**See full guide:** `config/mcp-guide.md` for detailed setup, examples, and security notes.

---

## Response Speed - What to Expect

### Fast Responses (No Tool Calls)
| Request Type | Example | Expected Speed |
|--------------|---------|----------------|
| Concept explanations | "What is polymorphism?" | Instant |
| Quick opinions | "Which approach is better?" | Instant |
| Simple yes/no | "Is this a security issue?" | Instant |

### Medium Speed (1-3 Tool Calls)
| Request Type | Example | Expected Speed |
|--------------|---------|----------------|
| Read one file | "What's in config.json?" | 1-3 seconds |
| Simple search | "Find 'auth' in src/" | 2-5 seconds |
| Single edit | "Fix this typo" | 2-5 seconds |

### Slower (Deep Work - Intentional)
| Request Type | Example | Expected Speed |
|--------------|---------|----------------|
| Codebase exploration | "Find all auth patterns" | 10-30 seconds (Explore agent) |
| Multi-file refactoring | "Refactor auth module" | 30-60 seconds (General agent) |
| Architecture planning | "Design microservices" | 30-60 seconds (Plan agent) |
| Complex debugging | "Fix this bug across files" | 30-60 seconds |

### How I Decide
- **Simple questions** → Direct answer, no tools
- **Need file content** → Read tool, then answer
- **Broad search** → Spawn Explore agent (background)
- **Complex task** → Spawn Plan/General agent with full context

### Tips for Faster Responses
1. Use `/fast` for quick iterations
2. Be specific: "Read config.json" vs "Find my config"
3. For deep work, say "Take your time to research this"
4. Use `/model haiku` for fastest responses

---

*Last updated: 2026-04-02*
*Generated for: Zayaan (CS student, Software/AI Engineering track)*
