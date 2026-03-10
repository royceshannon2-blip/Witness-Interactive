# Feedback and Updates System Documentation

This document explains the post-mission feedback survey and pre-game "What's New" panel systems.

## Overview

Two tightly integrated UX systems enhance player engagement and provide valuable feedback:

1. **Post-Mission Feedback Survey** - Collects player feedback after mission completion
2. **Pre-Game Update Panel** - Shows latest changes when the game loads

## Post-Mission Feedback Survey

### How It Works

The feedback survey is triggered automatically after a mission is completed:

1. When `SceneStateMachine` emits `game:complete` event
2. After the outcome screen is displayed (1.5 second delay)
3. Survey appears as an overlay above all other UI elements

### What Data Is Collected

The survey captures comprehensive gameplay and feedback data:

**Gameplay Data:**
- `missionId` - Which mission was completed
- `roleId` - Which role was played
- `flags` - All consequence flags from player decisions
- `survival` - Survival result including:
  - `survived` - Boolean survival status
  - `deathChance` - Calculated death probability
  - `modifiers` - All factors that affected survival

**Survey Responses:**
- `rating` - 1-5 scale (emoji faces from sad to happy)
- `liked` - Free text: "What did you like most or learn here?"
- `issues` - Free text: "What felt confusing, slow, or broken?"

**Session Data:**
- `sessionId` - Anonymous session identifier
- `timestamp` - ISO 8601 timestamp

### Configuration

Edit `config/feedback-config.js` to configure the feedback system:

```javascript
export const FEEDBACK_CONFIG = {
  // Transport type: "googleSheets" | "email" | "console"
  transportType: 'console',
  
  // Endpoint URL for Google Sheets or email webhook
  endpointUrl: '',
  
  // Optional auth token
  authToken: '',
  
  // Show survey every N completions (1 = every time)
  surveyFrequency: 1,
  
  // Network request timeout (ms)
  requestTimeout: 5000
};
```

### Transport Strategies

**Console Mode (Development):**
- Logs feedback to browser console
- No network requests
- Default mode

**Google Sheets Mode:**
1. Create a Google Sheet for feedback data
2. Create a Google Apps Script Web App:
   ```javascript
   function doPost(e) {
     const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
     const data = JSON.parse(e.postData.contents);
     
     sheet.appendRow([
       data.timestamp,
       data.sessionId,
       data.missionId,
       data.roleId,
       data.rating,
       data.liked,
       data.issues,
       JSON.stringify(data.flags),
       JSON.stringify(data.survival)
     ]);
     
     return ContentService.createTextOutput(JSON.stringify({success: true}))
       .setMimeType(ContentService.MimeType.JSON);
   }
   ```
3. Deploy as Web App and copy the URL
4. Set `transportType: 'googleSheets'` and `endpointUrl: 'YOUR_URL'`

**Email Mode:**
- Configure a webhook endpoint that sends email
- Set `transportType: 'email'` and `endpointUrl: 'YOUR_WEBHOOK_URL'`

### Frequency Control

The survey frequency is controlled per mission/role combination:

- First completion: Always shows
- Subsequent completions: Shows every N times (configurable)
- Tracked per browser session only (no persistence)

### UI Customization

Survey styles are in `css/feedback-survey.css`. Key classes:

- `.feedback-survey-panel` - Overlay container
- `.feedback-rating` - Emoji rating buttons
- `.feedback-textarea` - Text input fields
- `.feedback-btn-primary` - Send button
- `.feedback-btn-secondary` - Skip button

## Pre-Game Update Panel

### How It Works

The "What's New" panel displays before the first mission starts:

1. Shows automatically after game initialization
2. Displays once per browser session
3. Must be dismissed before game starts
4. Reads content from `config/update-notes.json`

### Update Notes Format

Edit `config/update-notes.json` to change what's displayed:

```json
{
  "version": "1.3.0",
  "date": "2026-03-10",
  "new": [
    "Post-mission feedback system to help improve your experience",
    "What's New panel shows latest updates when you start"
  ],
  "fixed": [
    "Scene transitions now flow more smoothly",
    "Audio no longer overlaps between scenes"
  ]
}
```

**Fields:**
- `version` - Version number (displayed in header)
- `date` - Release date (for internal tracking)
- `new` - Array of new features (plain language)
- `fixed` - Array of bug fixes (player-focused benefits)

### Writing Update Notes

**Good Examples:**
- ✅ "More intense ship explosions"
- ✅ "Smoother scene transitions"
- ✅ "Less screen flicker when ships are hit"

**Bad Examples:**
- ❌ "Refactored AtmosphericEffects.js"
- ❌ "Fixed bug #127"
- ❌ "Updated z-index values"

Write for non-technical players. Focus on tangible benefits, not implementation details.

### Version Management

The version number is stored in two places:

1. `config/version.js` - JavaScript export for code
2. `config/update-notes.json` - Display version for UI

Keep these synchronized when releasing updates.

### UI Customization

Update panel styles are in `css/update-notes.css`. Key classes:

- `.update-notes-panel` - Overlay container
- `.update-notes-version` - Version badge
- `.update-notes-section` - New/Fixed sections
- `.update-notes-btn` - Start Mission button

## Architecture Integration

### Event Flow

```
game:complete (SceneStateMachine)
    ↓
FeedbackSurveyPanel listens
    ↓
Check frequency settings
    ↓
Show survey overlay
    ↓
Collect responses
    ↓
Send via FeedbackTransport
    ↓
Show thank you message
```

### Module Structure

```
js/
  ui/
    FeedbackSurveyPanel.js    - Survey UI and logic
    UpdateNotesPanel.js       - Update panel UI
  services/
    FeedbackTransport.js      - Network abstraction
    FeedbackSessionStore.js   - Frequency tracking
config/
  feedback-config.js          - Feedback settings
  update-notes.json           - Update content
  version.js                  - Version constant
css/
  feedback-survey.css         - Survey styles
  update-notes.css            - Update panel styles
```

### EventBus Integration

Both systems use EventBus for loose coupling:

- `game:complete` - Triggers feedback survey
- `game:start` - Update panel shows before this
- No direct component dependencies

## Maintenance

### When Adding New Features

1. Update `config/update-notes.json` with new version
2. Add bullet points in plain language
3. Update `config/version.js` to match
4. Test that update panel displays correctly

### When Refactoring Mission Flow

If you change how missions complete:

1. Ensure `game:complete` event still fires
2. Verify `missionId` and `roleId` are in event data
3. Test that feedback survey appears after outcome screen
4. Check that all gameplay data is captured correctly

### When Adding New Roles/Missions

The feedback system automatically captures:

- New mission IDs
- New role IDs
- All consequence flags
- Survival calculations

No code changes needed - just ensure ConsequenceSystem has survival logic for new roles.

## Testing

### Manual Testing

**Feedback Survey:**
1. Complete any mission/role
2. Verify survey appears after outcome screen
3. Fill out all fields and submit
4. Check console for payload (in console mode)
5. Verify thank you message appears

**Update Panel:**
1. Refresh the page
2. Verify panel appears before landing screen
3. Click "Start Mission"
4. Verify panel dismisses and game starts
5. Refresh again - panel should not reappear

### Automated Testing

Add to your test suite:

```javascript
// Test feedback survey appears
await page.waitForSelector('.feedback-survey-panel');

// Test update panel appears
await page.waitForSelector('.update-notes-panel');
```

## Troubleshooting

**Survey not appearing:**
- Check console for `game:complete` event
- Verify `surveyFrequency` setting
- Check if already shown this session

**Update panel not appearing:**
- Check `config/update-notes.json` loads correctly
- Verify no JavaScript errors in console
- Check if already shown this session

**Data not sending:**
- Check `transportType` in config
- Verify `endpointUrl` is correct
- Check network tab for failed requests
- Review CORS settings on endpoint

## Future Enhancements

Potential improvements (not in MVP):

- localStorage persistence for "don't show again"
- A/B testing different survey questions
- Analytics dashboard for feedback data
- Automatic version detection from git tags
- Multi-language support for update notes
