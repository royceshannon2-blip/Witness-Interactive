/**
 * FeedbackTransport - Abstraction layer for sending feedback data
 *
 * Supports multiple transport strategies:
 * - Google Sheets (via Apps Script Web App)
 * - Email webhook
 * - Console logging (development)
 */

import { FEEDBACK_CONFIG } from '../../config/feedback-config.js';

class FeedbackTransport {
  /**
   * Send feedback payload to configured endpoint
   * @param {object} payload - Feedback data
   * @returns {Promise<boolean>} - Success status
   */
  async send(payload) {
    const { transportType, endpointUrl, authToken, requestTimeout } = FEEDBACK_CONFIG;

    try {
      switch (transportType) {
        case 'googleSheets':
          return await this._sendToGoogleSheets(payload, endpointUrl, authToken, requestTimeout);
        
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
   */
  async _sendToGoogleSheets(payload, endpointUrl, authToken, timeout) {
  if (!endpointUrl) {
    console.warn('[FeedbackTransport] Google Sheets endpoint not configured');
    return this._logToConsole(payload);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    // CORS fix: Apps Script requires form-encoded body with no-cors mode
    // JSON + POST triggers a preflight that Apps Script cannot handle
    const formData = new FormData();
    formData.append('payload', JSON.stringify(payload));

    const response = await fetch(endpointUrl, {
      method: 'POST',
      body: formData,
      mode: 'no-cors',  // Bypasses preflight — required for Apps Script
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    // no-cors returns an opaque response — you can't read status
    // If fetch didn't throw, assume success
    console.log('[FeedbackTransport] Sent to Google Sheets (opaque response)');
    return true;

  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      console.error('[FeedbackTransport] Request timeout');
    } else {
      console.error('[FeedbackTransport] Network error:', error);
    }
    return false;
  }
}

  /**
   * Send to email webhook
   */
  async _sendToEmail(payload, endpointUrl, authToken, timeout) {
    if (!endpointUrl) {
      console.warn('[FeedbackTransport] Email endpoint not configured');
      return this._logToConsole(payload);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

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
        console.error('[FeedbackTransport] Email webhook response not OK:', response.status);
        return false;
      }

      console.log('[FeedbackTransport] Successfully sent via email webhook');
      return true;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        console.error('[FeedbackTransport] Request timeout');
      } else {
        console.error('[FeedbackTransport] Network error:', error);
      }
      return false;
    }
  }

  /**
   * Log to console (development mode)
   */
  _logToConsole(payload) {
    console.log('[FeedbackTransport] Feedback payload (console mode):');
    console.log(JSON.stringify(payload, null, 2));
    return true;
  }
}

export default FeedbackTransport;
