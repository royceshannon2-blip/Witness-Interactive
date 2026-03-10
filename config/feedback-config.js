/**
 * feedback-config.js - Configuration for feedback transport
 *
 * Supported transport types:
 * - "googleSheets": Send to Google Sheets via Apps Script Web App
 * - "email": Send via webhook/backend endpoint
 * - "console": Log to console only (development/testing)
 */

export const FEEDBACK_CONFIG = {
  // Transport type: "googleSheets" | "email" | "console"
  transportType: 'console',

  // Endpoint URL for Google Sheets Apps Script or email webhook
  // Example Google Sheets: 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec'
  endpointUrl: '',

  // Optional auth token or API key
  authToken: '',

  // Session tracking - show survey after every N completions
  surveyFrequency: 1,

  // Timeout for network requests (ms)
  requestTimeout: 5000
};
