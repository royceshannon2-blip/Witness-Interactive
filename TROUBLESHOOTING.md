# Troubleshooting: American Civilian Role Not Loading

## Issue
When selecting the American Civilian role, the screen shows just a rectangle instead of the narrative content.

## Verified Working
I've tested the game and confirmed that the American Civilian role **does work correctly**. The issue is likely one of the following:

## Solution 1: Clear Browser Cache (Most Likely)

**Chrome/Edge:**
1. Press `Ctrl + Shift + Delete`
2. Select "Cached images and files"
3. Click "Clear data"
4. Refresh the page (`Ctrl + F5`)

**Firefox:**
1. Press `Ctrl + Shift + Delete`
2. Select "Cache"
3. Click "Clear Now"
4. Refresh the page (`Ctrl + F5`)

**Safari:**
1. Press `Cmd + Option + E` to empty caches
2. Refresh the page (`Cmd + R`)

## Solution 2: Hard Refresh

Instead of clearing cache, try a hard refresh:
- **Windows**: `Ctrl + F5` or `Ctrl + Shift + R`
- **Mac**: `Cmd + Shift + R`

## Solution 3: Check Browser Console

1. Open Developer Tools (`F12`)
2. Go to the "Console" tab
3. Look for any red error messages
4. If you see errors, please share them

## Solution 4: Test in Incognito/Private Mode

1. Open a new incognito/private window
2. Navigate to the game
3. Try selecting American Civilian again

This will confirm if it's a caching issue.

## Solution 5: Verify File Integrity

Make sure all files are present and up-to-date:

```bash
# Pull latest changes from GitHub
git pull origin main

# Verify the American Civilian file exists
ls js/content/missions/pearl-harbor/american-civilian.js
```

## What Should Happen

When you select American Civilian, you should see:

1. **Scene 1 narrative**: "Sunday morning, 0745 hours. The smell of coffee drifts from the kitchen..."
2. **Three choices**:
   - Get your family to safety. Take shelter immediately.
   - Warn the neighbors. Get everyone inside.
   - Try to reach Pearl Harbor. They'll need help.
3. **Progress indicator**: "Scene 1 of 5"

## If Still Not Working

If none of the above solutions work, please provide:

1. Browser name and version
2. Operating system
3. Any console error messages
4. Screenshot of what you see

The American Civilian role has been tested and verified working, so this is likely a browser caching or loading issue.
