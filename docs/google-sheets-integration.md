# Google Sheets Integration for Feedback Survey

This guide will help you set up Google Sheets to receive feedback survey responses from Witness Interactive.

## Overview

The feedback survey system uses Google Apps Script as a webhook endpoint to send survey data to a Google Sheet. This is a free, serverless solution that requires no backend infrastructure.

## Setup Steps

### 1. Create a New Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Witness Interactive - Feedback Responses"
4. Add these column headers in row 1:
   - A1: `Timestamp`
   - B1: `Session ID`
   - C1: `Mission ID`
   - D1: `Role ID`
   - E1: `Rating`
   - F1: `Liked`
   - G1: `Issues`
   - H1: `Survived`
   - I1: `Death Chance`
   - J1: `Modifiers`
   - K1: `Flags`

### 2. Create Google Apps Script

1. In your Google Sheet, click `Extensions` > `Apps Script`
2. Delete any existing code
3. Paste the following script:

```javascript
function doPost(e) {
  try {
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);
    
    // Get the active spreadsheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Prepare the row data
    const row = [
      new Date(data.timestamp),
      data.sessionId,
      data.missionId,
      data.roleId,
      data.rating || '',
      data.liked || '',
      data.issues || '',
      data.survival.survived ? 'Yes' : 'No',
      Math.round(data.survival.deathChance * 100) + '%',
      data.survival.modifiers.join(', '),
      JSON.stringify(data.flags)
    ];
    
    // Append the row to the sheet
    sheet.appendRow(row);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Feedback recorded'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Click `Save` (disk icon)
5. Name your project "Witness Interactive Feedback Webhook"

### 3. Deploy the Script as a Web App

1. Click `Deploy` > `New deployment`
2. Click the gear icon next to "Select type" and choose `Web app`
3. Configure the deployment:
   - **Description**: "Feedback webhook v1"
   - **Execute as**: Me (your email)
   - **Who has access**: Anyone
4. Click `Deploy`
5. **IMPORTANT**: Copy the Web App URL that appears (it will look like: `https://script.google.com/macros/s/XXXXX/exec`)
6. Click `Done`

### 4. Update Your Feedback Configuration

1. Open `config/feedback-config.js` in your project
2. Update the configuration:

```javascript
export const FEEDBACK_CONFIG = {
  // Transport mode: 'console' for development, 'http' for production
  mode: 'http',
  
  // Google Apps Script webhook URL (paste your URL here)
  endpoint: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID_HERE/exec',
  
  // Survey frequency: 1 = every completion, 2 = every other completion, etc.
  surveyFrequency: 1
};
```

3. Replace `YOUR_SCRIPT_ID_HERE` with your actual Web App URL
4. Commit and push the changes to GitHub

### 5. Test the Integration

1. Play through a complete mission on your live site
2. Fill out the feedback survey
3. Check your Google Sheet - you should see a new row with the feedback data

## Data Structure

Each feedback submission includes:

- **Timestamp**: When the feedback was submitted
- **Session ID**: Anonymous session identifier
- **Mission ID**: Which mission was played (e.g., "pearl-harbor")
- **Role ID**: Which role was played (e.g., "japanese-aviator")
- **Rating**: 1-5 emoji rating (optional)
- **Liked**: What the player liked (optional)
- **Issues**: What felt broken or confusing (optional)
- **Survived**: Whether the player survived
- **Death Chance**: Probability of death (percentage)
- **Modifiers**: Factors that affected survival
- **Flags**: All choice flags set during gameplay (JSON)

## Privacy & Security

- No personally identifiable information (PII) is collected
- Session IDs are randomly generated and anonymous
- The Google Apps Script URL is public but only accepts POST requests
- Data is stored in your private Google Sheet

## Troubleshooting

### Feedback not appearing in sheet

1. Check that `mode` is set to `'http'` in `feedback-config.js`
2. Verify the endpoint URL is correct
3. Check the Apps Script execution log:
   - Open Apps Script editor
   - Click `Executions` (clock icon on left)
   - Look for errors

### "Authorization required" error

1. Re-deploy the script
2. Make sure "Who has access" is set to "Anyone"
3. Try accessing the URL directly in a browser (you should see an error about GET requests not being supported)

### Data format issues

1. Make sure your sheet has the correct column headers
2. Check that the Apps Script code matches the template above
3. Verify the data structure in the browser console

## Viewing and Analyzing Data

Your Google Sheet now contains all feedback responses. You can:

- Sort by rating to find the best/worst experiences
- Filter by role to see role-specific feedback
- Use pivot tables to analyze patterns
- Export to CSV for further analysis
- Share with your team (use Google Sheets sharing settings)

## Next Steps

- Set up email notifications when new feedback arrives (Google Sheets > Tools > Notification rules)
- Create charts and dashboards to visualize feedback trends
- Use conditional formatting to highlight low ratings or common issues
- Export data periodically for backup

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify the Apps Script execution log
3. Test with `mode: 'console'` to see the data structure
4. Ensure your Google Sheet is not at row limit (10 million rows)
