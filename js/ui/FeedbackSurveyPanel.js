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
    const survivalResult = this.consequenceSystem.determineSurvival(this.currentRoleId);
    const flags = this.consequenceSystem.getAllFlags();
    
    // Build payload
    const payload = {
      sessionId: this.sessionId,
      timestamp: new Date().toISOString(),
      missionId: this.currentMissionId,
      roleId: this.currentRoleId,
      
      // Gameplay data
      flags: flags,
      survival: {
        survived: survivalResult.survived,
        deathChance: survivalResult.deathChance,
        modifiers: survivalResult.modifiers
      },
      
      // Survey responses
      rating: this.selectedRating || null,
      liked: likedText || null,
      issues: issuesText || null
    };
    
    // Show loading state
    const primaryBtn = panel.querySelector('.feedback-btn-primary');
    const originalText = primaryBtn.textContent;
    primaryBtn.textContent = 'Sending...';
    primaryBtn.disabled = true;
    
    // Send feedback
    const success = await this.transport.send(payload);
    
    // Show thank you message regardless of success (fail silently)
    this._showThankYou();
  }

  /**
   * Show thank you message and hide panel
   */
  _showThankYou() {
    const content = this.panel.querySelector('.feedback-survey-content');
    content.innerHTML = `
      <div class="feedback-thank-you">
        <h2 class="feedback-survey-title">Thanks for helping improve the game!</h2>
        <p class="feedback-survey-subtitle">Your feedback helps us create better historical experiences.</p>
        <button class="feedback-btn feedback-btn-primary">Continue</button>
      </div>
    `;
    
    const continueBtn = content.querySelector('.feedback-btn-primary');
    continueBtn.addEventListener('click', () => {
      this.hide();
    });
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      this.hide();
    }, 3000);
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
