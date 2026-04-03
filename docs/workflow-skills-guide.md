# Essential Workflow Skills Guide

## Built-in Claude Code Skills

### Git Operations
| Command | Description |
|---------|-------------|
| `/commit -m "msg"` | Create a commit with message |
| `/review-pr <number>` | Fetch and review a PR |
| `/model` | Switch between Haiku/Sonnet/Opus |
| `/fast` | Enable faster responses |
| `/help` | Show all commands |

### When to Use Each Model
- **Haiku**: Quick questions, code search, simple edits
- **Sonnet**: Most coding tasks, debugging, refactoring
- **Opus**: Architecture decisions, complex reasoning, planning

## Essential Workflow Patterns

### 1. Git/Version Control
```
# Instead of: git add . && git commit -m "fix"
# Say: "Create a commit with descriptive message for these changes"

# Instead of: gh pr create
# Say: "Create a pull request for this branch with a good description"
```

### 2. Testing/Debugging
```
# Essential patterns:
"Run tests and fix any failures"
"Debug this error: [paste]"
"Add unit tests for this function"
"Explain what this test is checking"
```

### 3. Code Review
```
"/review-pr 42"
"Review this PR for bugs and style issues"
"What would you change in this code?"
```

### 4. Research
```
"Research best practices for [topic]"
"Find all usages of [function] in the codebase"
"Summarize this documentation: [link]"
```

### 5. Communication
```
"Draft a status update about this feature"
"Write a clear commit message"
"Explain this bug to a non-technical stakeholder"
```

## Custom Scripts (in ~/claude_ai/scripts/)

| Script | Command | Purpose |
|--------|---------|---------|
| `new-project.sh` | `claude-config new-project <name> <type>` | Scaffold projects |
| `git-commit-smart.sh` | `claude-config git-commit-smart` | Smart commits |
| `setup.sh` | `claude-config setup` | Setup on new machine |
| `status-update.sh` | `claude-config status-update` | Generate status updates |
| `draft-email.sh` | `claude-config draft-email <subject>` | Email drafts |

## Pro Tips

1. **Be specific**: "Fix the bug in login.py" → "The login.py file throws 'undefined variable' on line 42"
2. **Context matters**: Share relevant files, error messages, expected behavior
3. **Iterate**: "That worked, now also handle the edge case where..."
4. **Use agents**: "Search the codebase for authentication patterns" spawns a sub-agent
5. **Save memories**: "Remember that I prefer async/await over promises"

## Workflow Checklist

### Starting a New Task
- [ ] Read relevant files first
- [ ] Clarify requirements with AskUserQuestion if unclear
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
- [ ] Document any decisions in CLAUDE.md

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

## MCP Integrations (Advanced)

For database access, API calls, or external tools, configure MCP servers in `~/.claude/mcp-servers.yaml`.