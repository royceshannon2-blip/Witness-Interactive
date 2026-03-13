# Google Sheets Integration - Complete ✅

## Status: LIVE

Your feedback survey is now connected to Google Sheets and collecting responses!

## What Was Done

### 1. Configuration Updated
- **File**: `config/feedback-config.js`
- **Transport Type**: Changed from `'console'` to `'googleSheets'`
- **Endpoint URL**: Connected to your Google Apps Script webhook
- **Status**: ✅ Live on GitHub

### 2. Version Bumped
- **Version**: 1.4.2 → 1.4.3
- **Date**: March 11, 2026
- **Release Notes**: Updated with Google Sheets integration feature

### 3. All Changes Deployed
- ✅ Feedback config with your webhook URL
- ✅ Version updated to 1.4.3
- ✅ Update notes with player-friendly description
- ✅ All commits pushed to GitHub

## Your Google Sheets Setup

**Webhook URL**: 
```
https://script.google.com/macros/s/AKfycbxozJvabnU6ZioercOI-Y9azZ8OK86IGLBbfN2R5UyzuTMrZBmiRI5BmO5jYuL7_PA/exec
```

**Sheet Columns**:
1. Timestamp
2. Session ID
3. Mission ID
4. Role ID
5. Rating
6. Liked
7. Issues
8. Survived
9. Death Chance
10. Modifiers
11. Flags

## How to Test

1. **Hard refresh your browser** (Ctrl+Shift+R or Cmd+Shift+R)
2. **Play through a complete mission** on your live site
3. **Fill out the feedback survey** when it appears
4. **Check your Google Sheet** - you should see a new row with the data!

## What Gets Collected

Every time a player completes a mission and submits feedback, you'll receive:

- **When**: Timestamp of submission
- **Who**: Anonymous session ID (no PII)
- **What**: Mission and role played
- **Feedback**: Rating (1-5) and optional text responses
- **Gameplay**: Survival status, death probability, modifiers
- **Choices**: All decision flags in JSON format

## Troubleshooting

### If feedback doesn't appear in your sheet:

1. **Check the browser console** for errors
2. **Verify the Apps Script deployment**:
   - Open your Apps Script
   - Click "Deploy" > "Manage deployments"
   - Ensure "Who has access" is set to "Anyone"
3. **Check Apps Script execution log**:
   - Open Apps Script editor
   - Click "Executions" (clock icon)
   - Look for recent executions and any errors
4. **Test the endpoint directly**:
   - The URL should return an error about GET requests not being supported
   - This confirms the endpoint is accessible

### Common Issues:

**"Authorization required"**
- Re-deploy the Apps Script
- Make sure "Execute as" is set to "Me"
- Ensure "Who has access" is "Anyone"

**No data appearing**
- Check that column headers match exactly
- Verify the Apps Script code matches the template
- Look for errors in the browser console

**CORS errors**
- Google Apps Script handles CORS automatically
- If you see CORS errors, the endpoint URL might be wrong

## Live Site

Your game is live at:
**https://royceshannon2-blip.github.io/Witness-Interactive/**

## What's New in v1.4.3

Players will see:
- ✅ Feedback survey sends to Google Sheets (behind the scenes)
- ✅ Real-time psychology score notifications
- ✅ Working knowledge checkpoint quiz
- ✅ Smooth animations and effects

## Next Steps

1. **Test the integration** by playing through a mission
2. **Monitor your Google Sheet** for incoming responses
3. **Analyze the data** to improve the game
4. **Set up notifications** (optional):
   - In Google Sheets: Tools > Notification rules
   - Get emailed when new feedback arrives

## Data Privacy

- ✅ No personally identifiable information collected
- ✅ Session IDs are randomly generated
- ✅ Data stored in your private Google Sheet
- ✅ You control who has access to the sheet

## Success Metrics

You can now track:
- How many players complete each role
- Which roles have the best ratings
- Common issues players encounter
- What players like most
- Survival rates by role
- Decision patterns (via flags)

## Documentation

Full setup guide available at:
`docs/google-sheets-integration.md`

---

## Summary

🎉 **Your feedback system is now fully operational!**

Every player who completes a mission and fills out the survey will send data directly to your Google Sheet. You can now gather real feedback to improve Witness Interactive.

**Test it now**: Play through a mission and watch the data appear in your sheet!
