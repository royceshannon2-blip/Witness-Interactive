# Mission Briefing System - Integration Complete

## Architecture-Compliant Implementation

The MissionBriefing system has been integrated following strict architecture rules:

### Files Created/Modified

1. **js/engine/MissionBriefing.js** (NEW)
   - Pure engine logic - zero content strings
   - Renders newspaper-style briefing pages with typewriter effect
   - Shows identity card with role-specific information
   - Calls completion callback when student clicks "Enter the mission →"

2. **js/content/missions/rwanda/briefing-content.js** (NEW)
   - Pure content data - zero logic
   - Exports `RWANDA_BRIEFINGS` object with briefing data for all three roles
   - Currently has placeholder structure - full historical content needs to be added
   - Structure: pages array, card object, final string

3. **js/content/missions/rwanda/mission.js** (MODIFIED)
   - Imports briefing content
   - Adds `briefings` property mapping role IDs to briefing data

4. **js/main.js** (MODIFIED)
   - Imports MissionBriefing component
   - Initializes MissionBriefing with EventBus
   - Updates role:selected handler to check for briefing data
   - Shows briefing before loading scenes if data exists
   - Pearl Harbor unaffected - no briefing data, proceeds directly to scenes

### How It Works

1. User selects Rwanda mission and chooses a role
2. `role:selected` event fires in main.js
3. Handler checks if `mission.briefings[roleId]` exists
4. If yes: `missionBriefing.show(briefingData, proceed)`
5. If no: `proceed()` immediately (Pearl Harbor behavior)
6. Briefing displays 5 newspaper pages with typewriter animation
7. Shows identity card with role-specific details
8. Student clicks "Enter the mission →"
9. Briefing removes itself and calls `proceed()`
10. `proceed()` loads scenes into SceneStateMachine as before

### Content Structure

Each briefing needs:

```javascript
{
  pages: [
    {
      vol: 'Vol. LXI — No. 96',
      date: 'Kigali, Rwanda — April 6, 1994',
      price: 'Cinq francs',
      hSize: 'sz-lg',  // sz-lg, sz-xl, sz-xxl
      hClass: 'alert', // '', 'alert', 'urgent'
      h: 'Headline text',
      deck: 'Subheadline text',
      body: 'Article body with \\n\\n for paragraphs',
      ticker: 'Bottom ticker text or null'
    }
    // ... 5 pages total
  ],
  card: {
    title: 'REPUBLIQUE RWANDAISE — CARTE D\'IDENTITÉ',
    rows: [
      ['Label', 'Value'],
      ['Ethnie', 'TUTSI', 'tutsi'] // third param is CSS class
    ],
    stamp: 'Délivré 1992 · En vigueur',
    note: 'Explanatory note about the card'
  },
  final: 'Your name is <strong>Name</strong>. Final context sentence.'
}
```

### Next Steps

The briefing content file (`js/content/missions/rwanda/briefing-content.js`) currently has placeholder structure. To complete:

1. Copy the full historical content from your original files
2. Paste into the appropriate role sections in briefing-content.js
3. Ensure all 5 pages, card data, and final text are present for each role

### Testing

To test the briefing system:

1. Open index.html in browser
2. Select Rwanda Genocide mission
3. Choose any role (Tutsi Survivor, Hutu Moderate, or UN Peacekeeper)
4. Briefing should display with typewriter animation
5. Click through all 5 newspaper pages
6. View identity card
7. Click "Enter the mission →"
8. Scene 01 should load normally

Pearl Harbor should work exactly as before - no briefing, straight to scenes.

### Architecture Compliance

✅ Engine files contain logic only, zero content strings
✅ Content files contain data only, zero logic  
✅ EventBus used for all communication
✅ No global variables - ES6 modules only
✅ No frameworks or build tools
✅ Loose coupling via callbacks
✅ CSS embedded in component (inline styles for self-contained overlay)

### Performance

- Briefing overlay is created on-demand and removed after use
- No memory leaks - cleanup removes all DOM elements
- Typewriter animation uses setInterval (cleared properly)
- No impact on Pearl Harbor or other missions without briefings
