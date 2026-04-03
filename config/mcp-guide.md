# MCP (Model Context Protocol) Guide

MCP servers connect Claude Code to external tools and data sources.

## What Are MCPs?

MCP servers let you:
- Query databases directly
- Access GitHub/GitLab APIs
- Search documentation indexes
- Connect to custom APIs
- Access file systems beyond your project

## Installing MCP Servers

### Basic Setup

1. Create the MCP config file:
```bash
mkdir -p ~/.claude
nano ~/.claude/mcp_servers.json
```

2. Add server configurations:
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/dir"],
      "env": {}
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "ghp_your-token-here"
      }
    }
  }
}
```

3. Restart Claude Code

## Available MCP Servers

### Official Servers

| Server | Install Command | Use Case |
|--------|-----------------|----------|
| **filesystem** | `npx -y @modelcontextprotocol/server-filesystem /path` | Access specific directories |
| **github** | `npx -y @modelcontextprotocol/server-github` | GitHub API access |
| **sqlite** | `npx -y @modelcontextprotocol/server-sqlite` | Query SQLite databases |
| **postgres** | `npx -y @modelcontextprotocol/server-postgres` | PostgreSQL access |
| **brave** | `npx -y @modelcontextprotocol/server-brave-search` | Web search |
| **memory** | `npx -y @modelcontextprotocol/server-memory` | Enhanced memory system |

### Community Servers

| Server | Install Command | Use Case |
|--------|-----------------|----------|
| **aws** | `npx -y @modelcontextprotocol/server-aws` | AWS services |
| **git** | `npx -y @modelcontextprotocol/server-git` | Git operations |
| **puppeteer** | `npx -y @modelcontextprotocol/server-puppeteer` | Browser automation |
| **google-maps** | `npx -y @modelcontextprotocol/server-google-maps` | Maps API |

## Setup Examples

### Example 1: File System Access

**Use Case:** Let me search and read files outside your current project.

```json
{
  "mcpServers": {
    "shared-files": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/home/zayaan/shared", "/home/zayaan/projects"],
      "env": {}
    }
  }
}
```

**Then ask:**
- "Search for all Python files in my shared directories"
- "Read the config from my shared configs folder"

---

### Example 2: GitHub Integration

**Use Case:** Let me fetch PRs, issues, and repo data.

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

**Setup:**
```bash
export GITHUB_TOKEN="ghp_your-token-here"
# Add to ~/.bashrc for persistence
```

**Then ask:**
- "Fetch PR #42 from ZayaanB/Claude-Code"
- "What issues are open in my repo?"
- "Create a new issue about documentation"

---

### Example 3: SQLite Database

**Use Case:** Query your project databases.

```json
{
  "mcpServers": {
    "sqlite": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sqlite", "/path/to/database.db"],
      "env": {}
    }
  }
}
```

**Then ask:**
- "What tables are in this database?"
- "Show me all users created this week"
- "Write a query to find duplicate emails"

---

### Example 4: PostgreSQL

**Use Case:** Connect to a Postgres database.

```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "postgresql://user:pass@localhost:5432/dbname"
      }
    }
  }
}
```

**Then ask:**
- "List all tables in my database"
- "What's the schema for the users table?"
- "Write a query to find slow API endpoints"

---

### Example 5: Brave Search (Web Search)

**Use Case:** Real-time web search for research.

```json
{
  "mcpServers": {
    "brave": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-brave-search"],
      "env": {
        "BRAVE_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

**Then ask:**
- "Search for latest React 19 features"
- "Find documentation on Python async patterns"
- "What's new in TypeScript 5.4?"

---

### Example 6: Git Repository

**Use Case:** Git operations without shell commands.

```json
{
  "mcpServers": {
    "git": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-git"],
      "env": {}
    }
  }
}
```

**Then ask:**
- "Show me the git log for this repo"
- "What files changed in the last commit?"
- "Show me the diff for main.py"

---

## Custom MCP Server

Create your own MCP server for custom tools:

```javascript
// my-mcp-server.js
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server({
  name: "my-custom-server",
  version: "1.0.0"
}, {
  capabilities: {
    tools: {}
  }
});

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [{
      name: "myTool",
      description: "Does something custom",
      inputSchema: { type: "object", properties: {} }
    }]
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "myTool") {
    return { content: [{ type: "text", text: "Result!" }] };
  }
  throw new Error("Unknown tool");
});

const transport = new StdioServerTransport();
await server.connect(transport);
```

**Then configure:**
```json
{
  "mcpServers": {
    "custom": {
      "command": "node",
      "args": ["/path/to/my-mcp-server.js"],
      "env": {}
    }
  }
}
```

---

## Troubleshooting

### Server Not Starting
```bash
# Check if npx is working
npx -y @modelcontextprotocol/server-filesystem --help

# Check logs
# MCP servers log to stderr, check your terminal
```

### Permission Errors
```bash
# Ensure scripts are executable
chmod +x /path/to/server.js
```

### Environment Variables
```bash
# Export before starting Claude
export GITHUB_TOKEN="ghp_xxx"
export DATABASE_URL="postgresql://..."
```

---

## When to Use MCPs

| Scenario | Use MCP? | Alternative |
|----------|----------|-------------|
| Query a database | ✅ Yes | Shell commands (less secure) |
| Access GitHub API | ✅ Yes | `/review-pr` (limited) |
| Search the web | ✅ Yes | `WebSearch` tool (built-in) |
| Read local files | ❌ No | `Read` tool (faster) |
| Run shell commands | ❌ No | `Bash` tool (built-in) |

---

## Quick Start Checklist

1. **Install Node.js** (if not already):
   ```bash
   node --version  # Should be 18+
   ```

2. **Create config file**:
   ```bash
   nano ~/.claude/mcp_servers.json
   ```

3. **Add one server to test**:
   ```json
   {
     "mcpServers": {
       "filesystem": {
         "command": "npx",
         "args": ["-y", "@modelcontextprotocol/server-filesystem", "~"],
         "env": {}
       }
     }
   }
   ```

4. **Restart Claude Code**

5. **Test**:
   - "List files in my home directory"

6. **Add more servers as needed**

---

## Security Notes

⚠️ **Be careful with:**
- API keys in config files (use environment variables)
- File system access (only expose necessary directories)
- Database credentials (use read-only where possible)

⚠️ **Best practices:**
- Store secrets in environment variables, not config
- Use read-only database connections when possible
- Limit file system access to specific directories
- Review MCP server code before running

---

*For more information, see the official docs: https://modelcontextprotocol.io*
