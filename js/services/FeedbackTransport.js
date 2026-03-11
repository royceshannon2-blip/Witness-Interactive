/**
 * FeedbackTransport - Abstraction layer for sending feedback data
 *
 * Supports multiple transport strategies:
 * - Google Sheets (via Apps Script Web App)
 * - Email webhook
 * - Console logging (development)
 *
 * CORS note: Apps Script Web Apps deployed with "Anyone" access
 * accept cross-origin JSON POST requests without preflight issues
 * when the deployment is configured correctly. This file sends
 * standard JSON — no FormData, no no-cors mode.
 */

import { FEEDBACK_CONFIG } from '../../config/feedback-config.js';

class FeedbackTransport {
  /**
   * Send feedback payload to configured endpoint
   * @param {object} payload - Feedback data
   * @returns {Promise<boolean>} - True on success, false on failure
   */
  async send(payload) {
    const { transportType, endpointUrl, authToken, requestTimeout } = FEEDBACK_CONFIG;

    try {
      switch (transportType) {
        case 'googleSheets':
          return await this._sendToGoogleSheets(payload, endpointUrl, requestTimeout);

        case 'email':
          return await this._sendToEmail(payload, endpointUrl, authToken, requestTimeout);

        case 'console':
        default:
          return this._logToConsole(payload);
      }
    } catch (error) {
      console.error('[FeedbackTransport] Send failed:', error);
      return false;
    }
  }

  /**
   * Send to Google Sheets via Apps Script Web App
   * Uses standard JSON POST — Apps Script reads from e.postData.contents
   */
  async _sendToGoogleSheets(payload, endpointUrl, timeout) {
    if (!endpointUrl) {
      console.warn('[FeedbackTransport] Google Sheets endpoint not configured — falling back to console');
      return this._logToConsole(payload);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout || 8000);

    try {
      const response = await fetch(endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain' // text/plain avoids CORS preflight; Apps Script reads it fine
        },
        body: JSON.stringify(payload),
        signal: controller.signal
        // No mode: 'no-cors' — we need to read the response to confirm success
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error('[FeedbackTransport] Apps Script returned HTTP error:', response.status);
        return false;
      }

      const result = await response.json();

      if (result.status === 'success') {
        console.log('[FeedbackTransport] Feedback recorded in Google Sheets ✓');
        return true;
      } else {
        console.error('[FeedbackTransport] Apps Script error:', result.message);
        return false;
      }

    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        console.error('[FeedbackTransport] Request timed out');
      } else {
        console.error('[FeedbackTransport] Network error:', error.message);
      }
      return false;
    }
  }

  /**
   * Send to email webhook
   */
  async _sendToEmail(payload, endpointUrl, authToken, timeout) {
    if (!endpointUrl) {
      console.warn('[FeedbackTransport] Email endpoint not configured — falling back to console');
      return this._logToConsole(payload);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout || 8000);

    try {
      const response = await fetch(endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken && { 'Authorization': `Bearer ${authToken}` })
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.error('[FeedbackTransport] Email webhook error:', response.status);
        return false;
      }

      console.log('[FeedbackTransport] Feedback sent via email webhook ✓');
      return true;

    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        console.error('[FeedbackTransport] Request timed out');
      } else {
        console.error('[FeedbackTransport] Network error:', error.message);
      }
      return false;
    }
  }

  /**
   * Log to console (development / fallback mode)
   */
  _logToConsole(payload) {
    console.log('[FeedbackTransport] Feedback payload (console mode):');
    console.log(JSON.stringify(payload, null, 2));
    return true;
  }
}

export default FeedbackTransport;
