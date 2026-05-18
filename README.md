# Claude Code

This repository contains my personalized configuration, memory system, and automation scripts for **Claude Code** by using Nvidia NIM models.

## Setup Instructions

To set up this workspace on a new machine, follow these steps:

1. **Run the setup script** to symlink all configurations to `~/.claude/` and make the scripts executable:
   ```bash
   ./scripts/setup.sh
   ```

2. **Reload your shell** to apply the new `claude-config` alias:
   ```bash
   source ~/.bashrc
   ```

3. **Configure NVIDIA NIM API Key (Optional)**
   If you are using NIM-hosted models (via the LiteLLM proxy), copy the environment template and add your API key:
   ```bash
   cp .env.example .env
   # Edit .env and add your NVIDIA_NIM_API_KEY
   ```

4. **Start the LiteLLM Proxy (Optional)**
   Run the restart script to spin up the LiteLLM container with the latest `config.yaml`:
   ```bash
   ./scripts/restart-litellm.sh
   ```

## Documentation Reference

- **[Zayaan's Guide](config/zayaan_guide.md)**: A complete workflow reference detailing all custom scripts, slash commands, and workflow patterns.
- **[MCP Guide](config/mcp-guide.md)**: Details on configuring Model Context Protocol servers.
- **[Memory Index](config/MEMORY.md)**: A map of all persistent memories regarding projects and feedback.
- **[Claude Instructions](config/CLAUDE.md)**: System instructions and code quality guidelines for the AI.
