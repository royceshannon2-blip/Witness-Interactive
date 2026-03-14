---
name: mcp-workflows
description: Commit code to GitHub, test the live game with Playwright, verify historical facts with Fetch, or deploy to GitHub Pages. Use when asked to commit, push, test, deploy, or research sources for Witness Interactive.
---

# MCP Workflows Skill

## GitHub MCP — Committing Code
**Owner always:** `royceshannon2-blip` (never "RoyceWilliams510" or any other owner)
**Repo:** `Witness-Interactive`
**Branch:** `main`

### Commit message format
```
type(scope): description

types:  feat, fix, content, docs, style, refactor, audio, animations
scopes: engine, pearl-harbor, rwanda, ui, docs, architecture, audio, animations

Examples:
feat(engine): add AnimationSystem module
content(rwanda): complete tutsi-survivor role scenes
fix(engine): resolve role:complete infinite loop
audio(rwanda): wire narrator audio to hutu-moderate scenes
animations(rwanda): implement identity-card-flip animation
```

### Before committing
1. Verify no file is empty (pre-commit hook blocks empty commits)
2. Verify all JS files are UTF-8 without BOM
3. Verify all line endings are LF not CRLF
4. Verify any modified scene files have `nextScene: "outcome"` on all final choices (never `nextScene: null`)
5. Verify `apThemes[]` exists on every scene object

### After committing
Use Playwright MCP to verify GitHub Pages is serving correctly at:
`https://royceshannon2-blip.github.io/Witness-Interactive`

## Fetch MCP — Historical Research
Before writing any scene with specific historical claims, use Fetch MCP to verify:
- Casualty figures from reliable sources (National Park Service for Pearl Harbor, UN/HRW for Rwanda)
- Dates and timelines
- Names of real historical figures
- Institutional mandates (UNAMIR Chapter VI restrictions, gacaca jurisdiction rules)

## Playwright MCP — Testing
After any engine change, test the full game flow:
1. Load the landing screen
2. Select a mission
3. Select a role
4. Play through at least one complete path (all scenes to outcome)
5. Verify outcome screen renders
6. Verify knowledge checkpoint loads and scores correctly
7. Check browser console for errors — zero errors required before committing

## GitHub Pages Deployment
Deployment is automatic on push to main. No build step.
If GitHub Pages shows a 404, check:
- Pages source is set to main branch, / (root)
- No absolute paths in HTML/JS (must be relative)
- index.html is present at repo root
