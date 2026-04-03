# How GitHub Syncing Works (and Doesn't)

## The Misconception

**Pushing to GitHub does NOT automatically sync your files.** It's a common misunderstanding.

## What Actually Happens

| Action | What It Does |
|--------|--------------|
| `git push` | Uploads your files to GitHub's servers (like saving to cloud storage) |
| `git pull` | Downloads files FROM GitHub to your current machine |
| "Automatic sync" | ❌ **Does NOT happen** - you must manually pull on each machine |

## Analogy

Think of GitHub like **email**:
- You send an email (push) → it sits on the server
- The recipient must open their inbox and download it (pull)
- It doesn't magically appear on their device

## How to Actually Sync

### Option 1: Manual Git (Most Common)
```bash
# On Machine A (make changes)
git add .
git commit -m "Update config"
git push

# On Machine B (get changes)
git pull
```

### Option 2: Auto-Pull Script (Semi-Automatic)
Create a script that runs `git pull` periodically:
```bash
# ~/bin/sync-claude.sh
cd ~/claude_ai
git pull
```

Then run it whenever you switch machines.

### Option 3: Real-Time Sync (Advanced)
Use tools like:
- **GNU Stow** - manages symlinks from a central repo
- **chezmoi** - dotfile manager with encryption
- **Dropbox/Syncthing** - actual real-time file sync

## Recommended Setup for You

```bash
# 1. Your ~/claude_ai is already a git repo
cd ~/claude_ai
git init
git add .
git commit -m "Initial Claude Code config"
git remote add origin <your-github-repo-url>
git push -u origin main

# 2. On a new machine:
git clone <your-github-repo-url> ~/claude_ai
# Then recreate symlinks if needed

# 3. When switching machines:
# Always run: git pull
```

## Important Warnings

⚠️ **Merge conflicts** - Editing the same file on two machines = conflict
⚠️ **Secrets** - Never commit API keys (use `.gitignore` and env vars)
⚠️ **Machine-specific paths** - Some configs may not work on all machines

## Best Practice

Keep your config repo **declarative**:
- Store templates, scripts, and configs
- Use symlinks for runtime files
- Document setup steps in a `SETUP.md` file
- Pull before starting work on any machine