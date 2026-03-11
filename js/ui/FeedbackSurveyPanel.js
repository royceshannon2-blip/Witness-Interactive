/**
 * FeedbackSurveyPanel - Post-mission feedback survey UI
 *
 * Displays a lightweight survey after mission completion to gather
 * player feedback and correlate it with gameplay decisions.
 */

import FeedbackTransport from '../services/FeedbackTransport.js';
import FeedbackSessionStore from '../services/FeedbackSessionStore.js';
import { FEEDBACK_CONFIG } from '../../config/feedback-config.js';

class FeedbackSurveyPanel {
  constructor(eventBus, consequenceSystem) {
    this.eventBus = eventBus;
    this.consequenceSystem = consequenceSystem;
    this.transport = new FeedbackTransport();
    this.sessionStore = new FeedbackSessionStore();
    
    this.panel = null;
    this.isVisible = false;
    
    // Generate anonymous session ID
    this.sessionId = this._generateSessionId();
    
    // Listen for game completion
    this.eventBus.on('game:complete', this._handleGameComplete.bind(this));
  }

  /**
   * Handle game completion event
   */
  _handleGameComplete(data) {
    const { missionId, roleId } = data;
    
    // Record completion
    this.sessionStore.recordCompletion(missionId, roleId);
    
    // Check if survey should be shown
    if (!this.sessionStore.shouldShowSurvey(missionId, roleId, FEEDBACK_CONFIG.surveyFrequency)) {
      console.log('[FeedbackSurvey] Skipping survey based on frequency settings');
      return;
    }
    
    // Show survey after a brief delay to let outcome screen render
    setTimeout(() => {
      this.show(missionId, roleId);
    }, 1500);
  }

  /**
   * Show the feedback survey
   */
  show(missionId, roleId) {
    if (this.isVisible) return;
    
    this.currentMissionId = missionId;
    this.currentRoleId = roleId;
    
    this.panel = this._createPanel();
    document.body.appendChild(this.panel);
    this.isVisible = true;
    
    // Mark as shown
    this.sessionStore.markSurveyShown(missionId, roleId);
    
    // Fade in
    requestAnimationFrame(() => {
      this.panel.classList.add('visible');
    });
  }

  /**
   * Create the survey panel DOM
   */
  _createPanel() {
    const panel = document.createElement('div');
    panel.className = 'feedback-survey-panel';
    panel.innerHTML = `
      <div class="feedback-survey-content">
        <h2 class="feedback-survey-title">Mission complete. Help us improve your next run.</h2>
        <p class="feedback-survey-subtitle">Takes 10 seconds, no login needed.</p>
        
        <div class="feedback-survey-form">
          <!-- Q1: Rating -->
          <div class="feedback-question">
            <label class="feedback-label">How was your experience?</label>
            <div class="feedback-rating">
              <button class="rating-btn" data-rating="1" aria-label="Very poor">😞</button>
              <button class="rating-btn" data-rating="2" aria-label="Poor">😕</button>
              <button class="rating-btn" data-rating="3" aria-label="Okay">😐</button>
              <button class="rating-btn" data-rating="4" aria-label="Good">🙂</button>
              <button class="rating-btn" data-rating="5" aria-label="Excellent">😄</button>
            </div>
          </div>
          
          <!-- Q2: What did you like -->
          <div class="feedback-question">
            <label class="feedback-label" for="feedback-liked">What did you like most or learn here?</label>
            <textarea 
              id="feedback-liked" 
              class="feedback-textarea" 
              placeholder="Optional: Share what stood out to you..."
              maxlength="500"
              rows="3"
            ></textarea>
          </div>
          
          <!-- Q3: What felt broken -->
          <div class="feedback-question">
            <label class="feedback-label" for="feedback-issues">What felt confusing, slow, or broken?</label>
            <textarea 
              id="feedback-issues" 
              class="feedback-textarea" 
              placeholder="Optional: Help us fix bugs and improve UX..."
              maxlength="500"
              rows="3"
            ></textarea>
          </div>
          
          <div class="feedback-actions">
            <button class="feedback-btn feedback-btn-primary">Send Feedback</button>
            <button class="feedback-btn feedback-btn-secondary">Skip for now</button>
          </div>
        </div>
      </div>
    `;
    
    // Attach event listeners
    this._attachEventListeners(panel);
    
    return panel;
  }

  /**
   * Attach event listeners to panel elements
   */
  _attachEventListeners(panel) {
    // Rating buttons
    const ratingBtns = panel.querySelectorAll('.rating-btn');
    ratingBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        ratingBtns.forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        this.selectedRating = parseInt(btn.dataset.rating);
      });
    });
    
    // Primary button - send feedback
    const primaryBtn = panel.querySelector('.feedback-btn-primary');
    primaryBtn.addEventListener('click', () => {
      this._submitFeedback();
    });
    
    // Secondary button - skip
    const secondaryBtn = panel.querySelector('.feedback-btn-secondary');
    secondaryBtn.addEventListener('click', () => {
      this.hide();
    });
  }

  /**
   * Submit feedback
   */
  async _submitFeedback() {
    const panel = this.panel;
    const likedText = panel.querySelector('#feedback-liked').value.trim();
    const issuesText = panel.querySelector('#feedback-issues').value.trim();

    // Get survival and outcome data
    // Guard: determineSurvival may not exist if ConsequenceSystem isn't wired yet
    let survivalResult = { survived: null, deathChance: null, modifiers: [] };
    let flags = {};
    try {
      survivalResult = this.consequenceSystem.determineSurvival(this.currentRoleId);
      flags = this.consequenceSystem.getAllFlags();
    } catch (err) {
      console.warn('[FeedbackSurvey] Could not read consequence data:', err.message);
    }

    // Build payload
    const payload = {
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      missionId: this.currentMissionId,
      roleId: this.currentRoleId,
      flags,
      survival: {
        survived: survivalResult.survived,
        deathChance: survivalResult.deathChance,
        modifiers: survivalResult.modifiers || []
      },
      rating: this.selectedRating || null,
      liked: likedText || null,
      issues: issuesText || null
    };

    // Show loading state
    const primaryBtn = panel.querySelector('.feedback-btn-primary');
    primaryBtn.textContent = 'Sending...';
    primaryBtn.disabled = true;

    // Send and capture result + any debug info
    let success = false;
    let debugMessage = '';
    try {
      success = await this.transport.send(payload);
      debugMessage = success ? 'Transport returned true' : 'Transport returned false';
    } catch (err) {
      debugMessage = 'Transport threw: ' + err.message;
    }

    this._showThankYou(success, debugMessage, payload);
  }

  /**
   * Show thank you message with visible debug status
   * @param {boolean} success - Whether transport succeeded
   * @param {string} debugMessage - Debug info to display
   * @param {object} payload - The payload that was sent (shown on failure)
   */
  _showThankYou(success = true, debugMessage = '', payload = {}) {
    const content = this.panel.querySelector('.feedback-survey-content');

    // Status indicator — visible without DevTools
    const statusColor = success ? '#4caf50' : '#e53935';
    const statusIcon  = success ? '✓' : '✗';
    const statusText  = success ? 'Sent to Google Sheets' : 'Send failed — see details below';

    // Show payload summary on failure so you can see what was attempted
    const debugBlock = !success ? `
      <details style="margin-top:12px; text-align:left;">
        <summary style="cursor:pointer; font-size:12px; color:#aaa;">Debug info (tap to expand)</summary>
        <p style="font-size:11px; color:#e53935; margin:6px 0;">${debugMessage}</p>
        <pre style="font-size:10px; color:#aaa; white-space:pre-wrap; word-break:break-all; max-height:120px; overflow-y:auto;">${JSON.stringify(payload, null, 2)}</pre>
      </details>
    ` : '';

    content.innerHTML = `
      <div class="feedback-thank-you" style="text-align:center; padding: 16px;">
        <div style="font-size: 48px; margin-bottom: 8px;">${statusIcon}</div>
        <h2 class="feedback-survey-title" style="color:${statusColor};">${statusText}</h2>
        <p class="feedback-survey-subtitle">
          ${success
            ? 'Thanks for helping improve the game!'
            : 'Transport issue — check debug info below and report to dev.'}
        </p>
        ${debugBlock}
        <button class="feedback-btn feedback-btn-primary" style="margin-top:16px;">Continue</button>
      </div>
    `;

    const continueBtn = content.querySelector('.feedback-btn-primary');
    continueBtn.addEventListener('click', () => { this.hide(); });

    // Auto-hide after 5s on success, stay open on failure so you can read debug info
    if (success) {
      setTimeout(() => { this.hide(); }, 5000);
    }
  }

  /**
   * Hide the panel
   */
  hide() {
    if (!this.panel || !this.isVisible) return;
    
    this.panel.classList.remove('visible');
    
    setTimeout(() => {
      if (this.panel && this.panel.parentNode) {
        this.panel.parentNode.removeChild(this.panel);
      }
      this.panel = null;
      this.isVisible = false;
      this.selectedRating = null;
    }, 300);
  }

  /**
   * Generate anonymous session ID
   */
  _generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export default FeedbackSurveyPanel;
