#!/bin/sh
# restore_empty_files.sh
# Recursively scan Git-tracked files and restore empty ones from remote

set -e

# Configuration
LOG_FILE="restore_empty_files.log"
DRY_RUN=false
REMOTE="origin"
DEFAULT_BRANCH=""

# Parse arguments
while [ $# -gt 0 ]; do
    case "$1" in
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --remote=*)
            REMOTE="${1#*=}"
            shift
            ;;
        --help)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  --dry-run          Show what would be restored without making changes"
            echo "  --remote=NAME      Use specified remote (default: origin)"
            echo "  --help             Show this help message"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Initialize log file
timestamp() {
    date '+%Y-%m-%d %H:%M:%S'
}

log_message() {
    echo "[$(timestamp)] $1" | tee -a "$LOG_FILE"
}

# Check if we're in a Git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "Error: Not a Git repository"
    exit 1
fi

# Determine default branch
if [ -z "$DEFAULT_BRANCH" ]; then
    DEFAULT_BRANCH=$(git remote show "$REMOTE" 2>/dev/null | grep 'HEAD branch' | cut -d' ' -f5)
    if [ -z "$DEFAULT_BRANCH" ]; then
        echo "Warning: Could not determine default branch, trying 'main'"
        DEFAULT_BRANCH="main"
    fi
fi

REMOTE_BRANCH="$REMOTE/$DEFAULT_BRANCH"

log_message "========================================="
log_message "Starting empty file restoration"
log_message "Remote: $REMOTE"
log_message "Branch: $DEFAULT_BRANCH"
log_message "Dry run: $DRY_RUN"
log_message "========================================="

# Fetch latest from remote
log_message "Fetching latest from $REMOTE..."
if ! git fetch "$REMOTE" "$DEFAULT_BRANCH" 2>&1 | tee -a "$LOG_FILE"; then
    log_message "ERROR: Failed to fetch from remote"
    exit 1
fi

# Get list of all tracked files
TRACKED_FILES=$(git ls-files)

# Counters
TOTAL_FILES=0
EMPTY_FILES=0
RESTORED_FILES=0
FAILED_FILES=0

# Process each tracked file
echo "$TRACKED_FILES" | while IFS= read -r file; do
    TOTAL_FILES=$((TOTAL_FILES + 1))
    
    # Skip if file doesn't exist (deleted but still tracked)
    if [ ! -f "$file" ]; then
        continue
    fi
    
    # Check if file is empty (0 bytes or only whitespace)
    if [ ! -s "$file" ]; then
        IS_EMPTY=true
    else
        # Check if file contains only whitespace
        if ! grep -q '[^[:space:]]' "$file" 2>/dev/null; then
            IS_EMPTY=true
        else
            IS_EMPTY=false
        fi
    fi
    
    if [ "$IS_EMPTY" = true ]; then
        EMPTY_FILES=$((EMPTY_FILES + 1))
        log_message "EMPTY: $file"
        
        # Check if file exists in remote branch
        if git cat-file -e "$REMOTE_BRANCH:$file" 2>/dev/null; then
            if [ "$DRY_RUN" = true ]; then
                log_message "  [DRY-RUN] Would restore from $REMOTE_BRANCH"
                RESTORED_FILES=$((RESTORED_FILES + 1))
            else
                # Restore file from remote
                if git show "$REMOTE_BRANCH:$file" > "$file" 2>>"$LOG_FILE"; then
                    log_message "  SUCCESS: Restored from $REMOTE_BRANCH"
                    RESTORED_FILES=$((RESTORED_FILES + 1))
                else
                    log_message "  ERROR: Failed to restore $file"
                    FAILED_FILES=$((FAILED_FILES + 1))
                fi
            fi
        else
            log_message "  SKIP: File not found in $REMOTE_BRANCH (may be new)"
        fi
    fi
done

# Summary
log_message "========================================="
log_message "Restoration complete"
log_message "Total tracked files: $TOTAL_FILES"
log_message "Empty files found: $EMPTY_FILES"
log_message "Files restored: $RESTORED_FILES"
log_message "Failed restorations: $FAILED_FILES"
log_message "========================================="

if [ "$DRY_RUN" = true ]; then
    echo ""
    echo "This was a dry run. No files were modified."
    echo "Run without --dry-run to actually restore files."
fi

echo ""
echo "Full log saved to: $LOG_FILE"
