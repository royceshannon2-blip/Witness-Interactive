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
  transportType: 'googleSheets',

  // Endpoint URL for Google Sheets Apps Script or email webhook
  endpointUrl: 'https://script.google.com/macros/s/AKfycbxjn-L3-qQNwBCCF_2BWwkEexJ-SS_KXjvE2LdZ9PRlymPScVQKZy36z_i9AK5ezb33/exec',

  // Optional auth token or API key
  authToken: '',

  // Session tracking - show survey after every N completions
  surveyFrequency: 1,

  // Timeout for network requests (ms)
  requestTimeout: 5000
};
