# Empty File Restoration Tool

This tool recursively scans your Git repository for empty tracked files and restores them from the remote GitHub repository's default branch.

## Files

- `restore_empty_files.sh` - POSIX-compatible shell script (macOS/Linux/Git Bash)
- `restore_empty_files.bat` - Windows batch script (CMD)
- `restore_empty_files.log` - Generated log file with detailed operation history

## What It Does

1. Scans all Git-tracked files in the repository
2. Identifies files that are empty (0 bytes or only whitespace/newlines)
3. Restores empty files from the remote repository's default branch
4. Logs all actions with timestamps

## Usage

### Linux/macOS/Git Bash

```bash
# Dry run (see what would be restored without making changes)
./restore_empty_files.sh --dry-run

# Actually restore empty files
./restore_empty_files.sh

# Use a different remote
./restore_empty_files.sh --remote=upstream

# Show help
./restore_empty_files.sh --help
```

### Windows (CMD)

```cmd
REM Dry run
restore_empty_files.bat --dry-run

REM Actually restore empty files
restore_empty_files.bat

REM Show help
restore_empty_files.bat --help
```

## Options

- `--dry-run` - Report what would be restored without making any changes
- `--remote=NAME` - Use specified remote instead of 'origin' (shell script only)
- `--help` - Display usage information

## How It Works

### Detection

A file is considered "empty" if:
- It has 0 bytes, OR
- It contains only whitespace characters (spaces, tabs, newlines)

### Restoration Process

1. Fetches latest changes from remote repository
2. For each empty tracked file:
   - Checks if the file exists in the remote branch
   - If found, restores the content using `git show`
   - If not found, skips (may be a new file)
3. Logs every action with timestamp

### Logging

All operations are logged to `restore_empty_files.log` with:
- Timestamp for each action
- File path
- Whether file was empty
- Whether restoration succeeded or failed
- Summary statistics

## Example Output

```
[2026-03-14 10:30:15] =========================================
[2026-03-14 10:30:15] Starting empty file restoration
[2026-03-14 10:30:15] Remote: origin
[2026-03-14 10:30:15] Branch: main
[2026-03-14 10:30:15] Dry run: false
[2026-03-14 10:30:15] =========================================
[2026-03-14 10:30:16] Fetching latest from origin...
[2026-03-14 10:30:18] EMPTY: js/content/missions/rwanda/mission.js
[2026-03-14 10:30:18]   SUCCESS: Restored from origin/main
[2026-03-14 10:30:18] EMPTY: docs/new-file.md
[2026-03-14 10:30:18]   SKIP: File not found in origin/main (may be new)
[2026-03-14 10:30:18] =========================================
[2026-03-14 10:30:18] Restoration complete
[2026-03-14 10:30:18] Total tracked files: 245
[2026-03-14 10:30:18] Empty files found: 2
[2026-03-14 10:30:18] Files restored: 1
[2026-03-14 10:30:18] Failed restorations: 0
[2026-03-14 10:30:18] =========================================
```

## Safety Features

- **Dry run mode**: Test before making changes
- **Detailed logging**: Every action is recorded
- **Git-based**: Only restores from tracked remote files
- **Error handling**: Continues processing even if individual files fail
- **Respects .gitignore**: Only processes Git-tracked files

## Requirements

- Git repository with configured remote
- Git command-line tools installed
- Network access to fetch from remote
- Read/write permissions on repository files

## Troubleshooting

### "Not a Git repository"
Run the script from within your Git repository root directory.

### "Could not determine default branch"
The script will try 'main' as fallback. You can specify a different remote with `--remote=NAME`.

### "Failed to fetch from remote"
Check your network connection and ensure the remote is configured correctly:
```bash
git remote -v
```

### Files not being restored
- Check if the file exists in the remote branch
- Verify the file is actually tracked by Git: `git ls-files | grep filename`
- Review the log file for specific error messages

## Notes

- The shell script is POSIX-compatible and should work on most Unix-like systems
- The batch script is designed for Windows CMD (not PowerShell)
- Both scripts respect Git's tracking - only tracked files are processed
- New files (not yet in remote) are skipped with a log message
- The script does NOT commit changes - you can review and commit manually
