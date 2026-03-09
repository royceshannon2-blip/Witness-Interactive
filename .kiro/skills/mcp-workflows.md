# MCP Server Usage Instructions

## Overview
Three MCP servers are enabled for this project: GitHub, Fetch, and Playwright.
Use them proactively — don't wait to be asked. Each server has a specific
role in the development workflow.

---

## GitHub MCP

### When to Use
- Committing completed features or content files
- Creating branches for new missions or major features
- Pushing changes to trigger GitHub Pages deployment
- Checking repository state before making structural changes

### Commit Message Standards
Always follow this format:
```
type(scope): short description

types: feat, fix, content, docs, style, refactor
scopes: engine, pearl-harbor, ui, docs, architecture

Examples:
feat(engine): add consequence flag tracking system
content(pearl-harbor): complete Japanese aviator role scenes
fix(ui): correct timeline selector mobile scroll behavior
docs: update CONTRIBUTING.md with mission template
style(ui): refine cinematic dark theme CSS variables
```

### Branching Rules
- `main` — always deployable, GitHub Pages serves this branch
- `dev` — active development branch, merge to main when stable
- `mission/[name]` — new mission content branches (e.g. mission/d-day)
- Never commit directly to main during active development
- Always verify GitHub Pages is serving correctly after merging to main

### When NOT to Use GitHub MCP
- Do not commit incomplete or broken code
- Do not commit directly to main if dev branch exists
- Do not push API keys, tokens, or .env files — .gitignore handles this
- Do not commit node_modules or .kiro/cache directories

---

## Fetch MCP

### When to Use
- Retrieving historical facts to verify scene accuracy
- Pulling AP curriculum documentation from College Board
- Fetching public domain historical photographs descriptions
- Researching specific Pearl Harbor details not covered in skills files
- Finding primary source quotes for the Historical Ripple timeline

### Approved Sources to Fetch From
These are high-quality, historically reliable sources:
- `https://www.nps.gov/valr/` — National Park Service USS Arizona Memorial
- `https://www.history.navy.mil/` — Naval History and Heritage Command
- `https://apstudents.collegeboard.org/` — AP curriculum standards
- `https://www.archives.gov/` — National Archives primary sources
- `https://encyclopedia.densho.org/` — Japanese American internment records
- Wikipedia for general orientation only — always verify with primary source

### How to Use Fetch Results
- Cross-reference fetched content against historical-accuracy.md skill
- Flag any conflicts between fetched data and skill file with a comment
- Never paste fetched content directly into game files — always paraphrase
  and adapt to the game writing standards in game-writing.md skill
- Cite the source in a code comment when a specific fact comes from a fetch

### When NOT to Use Fetch MCP
- Do not fetch from unreliable or non-academic sources
- Do not fetch copyrighted images or media for direct use
- Do not use fetch to pull JavaScript libraries or frameworks —
  the project has zero external dependencies by design

---

## Playwright MCP

### When to Use
- Verifying scene transitions work correctly after building new scenes
- Testing the full game flow from landing screen to knowledge checkpoint
- Checking mobile responsive layout at different viewport sizes
- Verifying GitHub Pages deployment rendered correctly after a push
- Testing all three roles play through without errors
- Checking that locked mission nodes show "Coming Soon" correctly
- Verifying CSS animations and atmospheric effects trigger on correct scenes

### Standard Test Sequences to Run
Run these in order after any significant change:

**1. Full flow test (run after any engine change):**
- Load index.html
- Verify landing screen renders
- Click through to timeline selector
- Select Pearl Harbor mission
- Select each role one at a time
- Play through all scenes making different choices
- Verify outcome screen reflects choices made
- Verify historical ripple timeline animates correctly
- Complete knowledge checkpoint and verify scoring

**2. Responsive test (run after any CSS change):**
- Test at 320px width (smallest mobile)
- Test at 768px width (tablet)
- Test at 1280px width (desktop)
- Verify timeline selector scrolls horizontally on mobile
- Verify all text is readable at all sizes
- Verify touch targets are large enough on mobile

**3. Architecture test (run after adding new content):**
- Verify no console errors on load
- Verify all ES6 module imports resolve correctly
- Verify new scenes appear in correct sequence
- Verify consequence flags are being set correctly
- Verify knowledge checkpoint questions match the role played

**4. GitHub Pages test (run after every push to main):**
- Fetch the live GitHub Pages URL
- Verify the page loads without 404 errors
- Verify all JS modules load correctly via HTTPS
- Verify CSS loads and dark theme renders correctly
- Check browser console for any CORS or module errors

### Reporting Playwright Results
When a test fails, report:
- Which test sequence failed
- Which specific step failed
- What was expected vs. what was found
- Whether it is a content issue, engine issue, or CSS issue
- Suggested fix before asking the developer to intervene

### When NOT to Use Playwright MCP
- Do not run full test suites during active mid-feature development
- Do not use Playwright to test incomplete scenes or placeholder content
- Wait until a feature is complete before running verification tests

---

## Combined MCP Workflows

### Adding a New Scene (most common task)
1. **Fetch** any historical details needed for accuracy
2. Write the scene following game-writing.md and historical-accuracy.md skills
3. Verify AP theme tags are present per ap-curriculum.md skill
4. **Playwright** — run a quick scene transition test to verify it renders
5. **GitHub** — commit with message `content(pearl-harbor): add [scene name]`

### Completing a Full Role
1. Write all scenes using Fetch for historical verification
2. **Playwright** — run full flow test for that role
3. Fix any issues found
4. **Playwright** — run responsive test
5. **GitHub** — commit with message `feat(pearl-harbor): complete [role name] role`
6. **GitHub** — push to dev branch

### Deploying to GitHub Pages
1. Ensure all tests pass on dev branch
2. **Playwright** — run full flow test one final time
3. **GitHub** — merge dev to main
4. **Playwright** — run GitHub Pages test against live URL
5. Verify deployment is live and functional

---

## MCP Error Handling

### If GitHub MCP fails
- Check token permissions include repo scope
- Verify remote origin URL is correct
- Fall back to manual git commands in terminal

### If Fetch MCP fails
- Check the URL is publicly accessible
- Try an alternative approved source
- Fall back to historical-accuracy.md skill file for known facts

### If Playwright MCP fails
- Check index.html opens correctly in browser manually
- Verify file paths are all relative, not absolute
- Check browser console for module loading errors
- Verify no syntax errors in recently modified JS files