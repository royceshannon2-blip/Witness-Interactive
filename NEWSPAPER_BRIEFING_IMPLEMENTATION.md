# Newspaper Briefing System - Implementation Complete

## Overview

Implemented a historical newspaper briefing system that displays before Rwanda mission Scene 01. Each role sees five pages of historical context from 1933 to April 1994, followed by an identity card reveal showing their character's name and background.

## Architecture

### Engine Layer (Logic Only)
- `js/engine/MissionBriefing.js` - Briefing display engine with typewriter effects
  - `hasBriefing(missionId)` - Returns true for missions with briefings
  - `show(missionId, roleId, onComplete)` - Displays briefing and calls callback when complete
  - Typewriter animation system for sequential text reveal
  - Identity card typing effects
  - Full-screen newspaper overlay with period-accurate styling

### Content Layer (Data Only)
- `js/content/missions/rwanda/briefing-content.js` - All briefing text content
  - `BRIEFING_PAGES` - Five historical pages per role (tutsi, hutu, un)
  - `BRIEFING_CARDS` - Identity card data per role
  - `BRIEFING_FINALS` - Final text before entering mission

### Integration
- `js/main.js` - Updated role:selected handler to intercept and show briefing
  - Checks `missionBriefing.hasBriefing(missionId)` before proceeding
  - Pearl Harbor and other missions skip briefing (backward compatible)
  - Rwanda mission shows briefing, then loads Scene 01

## Historical Content

### Tutsi Survivor (Immaculée Uwimana)
1. **1933** - Belgium divides Rwanda by blood (identity cards)
2. **1990** - Civil war erupts, RTLM radio begins broadcasting
3. **Jan 1994** - Dallaire's genocide fax ignored by UN
4. **Apr 6, 1994** - President's plane shot down, roadblocks appear
5. **Apr 7-Jul 4** - 800,000 dead in 100 days

### Hutu Moderate (Augustin Bizimungu)
1. **1933** - Colonial identity cards create hierarchy
2. **1990-1994** - Hutu Power arms militias, moderates watched
3. **Jan 1994** - UN warned but takes no action
4. **Apr 6, 1994** - Moderate Hutu politicians killed first
5. **Apr 7-Jul 4** - Hutu who sheltered Tutsi also killed

### UN Peacekeeper (Capt. Marcus Webb)
1. **Aug 1993** - UNAMIR authorized with "observe only" mandate
2. **Jan 1994** - Dallaire's genocide fax describes 40,000 militia
3. **Apr 7, 1994** - Ten Belgian peacekeepers murdered, force reduced 90%
4. **Apr 7, 1994** - Foreign nationals evacuated, Rwandans left behind
5. **Apr 7-Jul 4** - 800,000 dead while world watched

## Visual Design

### Newspaper Aesthetic
- Period-accurate French newspaper masthead: "La Gazette de Kigali"
- Sepia-toned paper background (#faf8f2)
- Georgia/Times New Roman serif fonts
- Column rules and decorative elements
- Ticker bar for key facts
- Alert/urgent headline colors for escalating events

### Identity Cards
- Rwandan government card format (Tutsi/Hutu)
- UN personnel ID format (Peacekeeper)
- Ethnic designation color-coded (Tutsi: red, Hutu: green, UN: blue)
- Official stamps and French text
- Character names revealed: Immaculée, Augustin, Marcus

### Typewriter Effects
- Sequential page typing (dateline → headline → deck → body → ticker)
- Variable speeds: headlines slower (11-15ms), body faster (7ms)
- Blinking cursor animation
- Identity card values typed one by one
- Final text reveal before "Enter the mission →" button

## User Flow

1. Player selects Rwanda mission and role
2. Briefing overlay appears (full-screen, z-index 9999)
3. Five newspaper pages type out sequentially
4. "Continue →" button appears after each page completes
5. Final page shows "See your identity card —" button
6. Identity card section reveals with typed values
7. Character note explains significance of the card
8. Final text: "Your name is [Character]. [Situation]."
9. "Enter the mission →" button loads Scene 01
10. Briefing overlay removed, game proceeds normally

## Technical Details

### Performance
- Minimal DOM manipulation (single overlay append)
- CSS animations for cursor blink
- Efficient typewriter using setInterval
- Cleanup on completion (removes overlay)

### Accessibility
- Semantic HTML structure
- High contrast text on paper background
- Large touch targets for mobile (buttons full-width)
- Respects reduced-motion preferences (instant display if needed)

### Mobile Responsive
- Max-width 580px for readability
- Padding and scrolling for small screens
- Touch-friendly button sizes
- Readable font sizes (0.58rem - 2.2rem)

## Testing

### Manual Test File
- `test-rwanda-briefing.html` - Standalone test for all three roles
- Tests typewriter effects, page transitions, identity cards
- Verifies callback fires correctly

### Integration Points
- EventBus: No events emitted (self-contained)
- SceneStateMachine: Callback triggers loadRole()
- ConsequenceSystem: No interaction (briefing is pre-game)
- UIController: No interaction (briefing manages own DOM)

## Version Update

- Version: 1.5.2 → 1.5.3
- Update notes: "Added historical newspaper briefing before Rwanda mission begins"
- Date: 2026-03-13

## Files Created/Modified

### Created
- `js/engine/MissionBriefing.js` (engine logic)
- `js/content/missions/rwanda/briefing-content.js` (content data)
- `test-rwanda-briefing.html` (test file)
- `NEWSPAPER_BRIEFING_IMPLEMENTATION.md` (this document)

### Modified
- `js/main.js` (integrated briefing into role:selected handler)
- `config/version.js` (bumped to 1.5.3)
- `config/update-notes.json` (added feature notes)

## Future Enhancements

### Potential Additions
- Skip button for returning players
- Audio: typewriter sound effects
- Audio: period-appropriate background music
- Localization: Kinyarwanda/French translations
- Pearl Harbor briefing (if desired)
- Other missions: Vietnam, Bosnia, etc.

### Architecture Notes
- To add briefing to Pearl Harbor:
  1. Create `js/content/missions/pearl-harbor/briefing-content.js`
  2. Update `MissionBriefing.hasBriefing()` to include 'pearl-harbor'
  3. Import Pearl Harbor content in MissionBriefing.js
- Content is completely separate from engine logic
- Easy to add new missions without changing engine code

## Success Criteria

✅ Briefing displays before Rwanda Scene 01
✅ Pearl Harbor unaffected (no briefing)
✅ Architecture rules followed (engine/content separation)
✅ No syntax errors
✅ Version and update notes updated
✅ Committed to GitHub
✅ Test file created
✅ Documentation complete

## Educational Value

The briefing system provides critical historical context that:
- Explains the 60-year history of ethnic identity cards
- Documents the genocide's planning and international failures
- Personalizes the experience with character names
- Prepares students for the moral complexity ahead
- Aligns with AP History curriculum (causation, continuity, perspective)

Students now understand WHY the genocide happened before experiencing WHAT happened.
