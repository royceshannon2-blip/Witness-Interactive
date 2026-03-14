# Git Hooks Guide - Witness Interactive

This repository uses Git hooks to prevent common issues that can break the application.

## Installed Hooks

### 1. Pre-commit Hook (`.git/hooks/pre-commit`)
**Purpose:** Catches empty or incomplete files BEFORE they're committed locally.

**What it checks:**
- Empty files (0 bytes)
- Suspiciously small JS files (<500 bytes, except config files)
- Missing export statements in JS modules
- Files that appear truncated or incomplete

**When it runs:** Every time you run `git commit`

**How to bypass (NOT recommended):**
```bash
git commit --no-verify
```

### 2. Pre-push Hook (`.git/hooks/pre-push`)
**Purpose:** Prevents pushing empty commits or commits with empty files to GitHub.

**What it checks:**
- Empty commits (commits with no actual changes)
- Empty files in commits being pushed
- Suspiciously small JS files
- Missing exports in module files

**When it runs:** Every time you run `git push`

**How to bypass (NOT recommended):**
```bash
git push --no-verify
```

## Why These Hooks Exist

### The Problem
In March 2026, we had an incident where 15 critical files were accidentally pushed to GitHub as empty (0 bytes):
- `js/engine/UIController.js`
- `js/engine/AtmosphericEffects.js`
- All three Pearl Harbor mission content files
- Config files
- CSS files
- Audio files

This broke the live application and required emergency restoration from Git history.

### Root Cause
The issue was caused by using the GitHub MCP `push_files` tool incorrectly. This tool creates a NEW commit with ONLY the files you specify, effectively deleting any files not included in the push.

### The Solution
1. **Always use standard Git commands** for routine work:
   ```bash
   git add <files>
   git commit -m "message"
   git push origin main
   ```

2. **Never use `mcp_github_push_files`** for bulk updates or routine commits

3. **Let the hooks catch issues** before they reach GitHub

## Hook Maintenance

### Installing Hooks on a Fresh Clone
The hooks are stored in `.git/hooks/` which is NOT tracked by Git. After cloning:

```bash
# The hooks should already be there, but if not:
cp pre-commit .git/hooks/
cp pre-push .git/hooks/
chmod +x .git/hooks/pre-commit
chmod +x .git/hooks/pre-push
```

### Updating Hooks
If you need to modify the hooks:

1. Edit the files in `.git/hooks/`
2. Test thoroughly with intentionally broken commits
3. Document changes in this file
4. Share updated hooks with the team

### Testing the Hooks

**Test pre-commit:**
```bash
# Create an empty file
touch test-empty.js
git add test-empty.js
git commit -m "test"
# Should be blocked
```

**Test pre-push:**
```bash
# Create an empty commit
git commit --allow-empty -m "empty test"
git push origin main
# Should be blocked
```

## Best Practices

### DO:
✅ Use `git add`, `git commit`, `git push` for all routine work
✅ Let the hooks run and catch issues
✅ Fix issues the hooks identify before bypassing
✅ Review warnings even if the hook allows the push

### DON'T:
❌ Use `--no-verify` to bypass hooks without understanding why
❌ Use GitHub MCP `push_files` for routine commits
❌ Commit empty or incomplete files
❌ Push commits that have no actual changes

## Troubleshooting

### "Hook blocked my commit but the file isn't empty"
- Check the file size: `ls -lh <file>`
- Check for BOM or encoding issues
- Verify the file has actual content: `cat <file>`

### "I need to push urgently and the hook is blocking me"
1. **First, understand WHY it's blocking**
2. Fix the actual issue if possible
3. Only use `--no-verify` if you're certain the files are correct
4. Document why you bypassed the hook in your commit message

### "Hook isn't running"
- Verify hooks are executable: `ls -l .git/hooks/`
- Check Git config: `git config core.hooksPath`
- Ensure you're using Git Bash on Windows (not CMD)

## Emergency Recovery

If empty files make it to GitHub despite the hooks:

1. **Don't panic** - the content is in Git history
2. Use the restoration script: `bash restore_empty_files.sh`
3. Or manually restore from Git history:
   ```bash
   git log --all --full-history -- <file>
   git show <commit-sha>:<file> > <file>
   ```
4. Commit and push the restored files
5. Investigate how the hooks were bypassed

## Related Files
- `.git/hooks/pre-commit` - Pre-commit hook script
- `.git/hooks/pre-push` - Pre-push hook script
- `restore_empty_files.sh` - Emergency restoration script
- `RESTORE_EMPTY_FILES_README.md` - Restoration script documentation
- `.kiro/steering/mcp-usage.md` - Guidelines for GitHub MCP usage
