# MCP Usage Rules

## GitHub MCP Configuration
- owner: royceshannon2-blip
- repo: Witness-Interactive
- branch: main

Never use "RoyceWilliams510" as the owner. The correct owner is always "royceshannon2-blip".

## CRITICAL: GitHub MCP Push Rules

⚠️ **NEVER use `mcp_github_push_files` for routine commits or bulk updates!**

**Why:** The `push_files` tool creates a NEW commit containing ONLY the files you specify. Any files not included will be DELETED from the repository. This caused a critical incident in March 2026 where 15 files were accidentally pushed as empty.

**ALWAYS use standard Git commands instead:**
```bash
git add <files>
git commit -m "message"
git push origin main
```

**Only use GitHub MCP tools for:**
- Creating new repositories
- Creating single isolated files
- Targeted updates to specific files when you need to bypass local git
- Reading repository information

**NEVER use GitHub MCP tools for:**
- Routine commits with multiple files
- Bulk updates
- Any commit that modifies existing files
- Pushing changes that affect the application code

## Other MCP Usage
- Use Fetch MCP to verify historical facts before writing any scene content
- Use Playwright MCP to test full game flow after any engine change
- Commit format: type(scope): description
- Never commit broken or incomplete code to main

## Git Hooks Protection
The repository has pre-commit and pre-push hooks that check for empty files and commits. See `GIT_HOOKS_GUIDE.md` for details.