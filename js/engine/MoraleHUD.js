/**
 * MoraleHUD - Psychology Score Display Component
 * 
 * Renders and animates four psychology score bars in the UI:
 * - Morale (State of Mind)
 * - Loyalty (Duty Rating)
 * - Awareness (Humanity)
 * - Composure (Under Pressure)
 * 
 * Shows delta animations after choices, manages visibility during gameplay.
 * 
 * Requirements: Psychology System, Responsive Design, Accessibility
 */

class MoraleHUD {
  constructor(eventBus, hudLabels) {
    this.eventBus = eventBus;
    this.hudLabels = hudLabels;
    
    this.hudElement = null;
    this.barElements = {};
    this.isVisible = false;
    
    // Bind event handlers
    this.handleScoresUpdated = this.handleScoresUpdated.bind(this);
    this.handleChoicesShown = this.handleChoicesShown.bind(this);
    this.handleNarrativeStarted = this.handleNarrativeStarted.bind(this);
    this.handleGradeCalculated = this.handleGradeCalculated.bind(this);
    
    // Subscribe to events
    this.eventBus.on('psychology:scores-updated', this.handleScoresUpdated);
    this.eventBus.on('scene:choices-shown', this.handleChoicesShown);
    this.eventBus.on('scene:narrative-started', this.handleNarrativeStarted);
    this.eventBus.on('psychology:grade-calculated', this.handleGradeCalculated);
  }

  /**
   * Create and inject HUD element into DOM
   * Sets all bars to 50
   */
  init() {
    // Create HUD container
    this.hudElement = document.createElement('div');
    this.hudElement.className = 'morale-hud';
    this.hudElement.setAttribute('role', 'status');
    this.hudElement.setAttribute('aria-live', 'polite');
    this.hudElement.setAttribute('aria-label', 'Psychology scores');
    
    // Create score bars
    const scores = ['morale', 'loyalty', 'awareness', 'composure'];
    scores.forEach(score => {
      const barContainer = document.createElement('div');
      barContainer.className = 'morale-hud__bar-container';
      
      const label = document.createElement('div');
      label.className = 'morale-hud__label';
      label.textContent = this.hudLabels[score];
      
      const barWrapper = document.createElement('div');
      barWrapper.className = 'morale-hud__bar-wrapper';
      
      const bar = document.createElement('div');
      bar.className = `morale-hud__bar morale-hud__bar--${score}`;
      bar.style.width = '50%';
      bar.setAttribute('role', 'progressbar');
      bar.setAttribute('aria-valuenow', '50');
      bar.setAttribute('aria-valuemin', '0');
      bar.setAttribute('aria-valuemax', '100');
      bar.setAttribute('aria-label', `${this.hudLabels[score]}: 50`);
      
      const value = document.createElement('div');
      value.className = 'morale-hud__value';
      value.textContent = '50';
      
      const deltaPopup = document.createElement('div');
      deltaPopup.className = 'morale-hud__delta';
      deltaPopup.setAttribute('aria-hidden', 'true');
      
      barWrapper.appendChild(bar);
      barContainer.appendChild(label);
      barContainer.appendChild(barWrapper);
      barContainer.appendChild(value);
      barContainer.appendChild(deltaPopup);
      
      this.hudElement.appendChild(barContainer);
      
      this.barElements[score] = {
        bar,
        value,
        deltaPopup,
        container: barContainer
      };
    });
    
    // Inject into DOM
    document.body.appendChild(this.hudElement);
    
    // Start hidden
    this.hide();
  }

  /**
   * Update bar fill widths with CSS transition animation
   * Show delta popup (+N or -N) next to each changed bar
   * @param {Object} scores - Current score snapshot
   * @param {Object} effects - Psychology effects that were applied
   */
  updateDisplay(scores, effects) {
    if (!this.hudElement) return;
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    Object.keys(scores).forEach(scoreKey => {
      const elements = this.barElements[scoreKey];
      if (!elements) return;
      
      const newValue = scores[scoreKey];
      const delta = effects[scoreKey] || 0;
      
      // Update bar width
      elements.bar.style.width = `${newValue}%`;
      elements.bar.setAttribute('aria-valuenow', newValue.toString());
      elements.bar.setAttribute('aria-label', `${this.hudLabels[scoreKey]}: ${newValue}`);
      
      // Update value text
      elements.value.textContent = Math.round(newValue).toString();
      
      // Show delta popup if there was a change
      if (delta !== 0) {
        const deltaText = delta > 0 ? `+${delta}` : delta.toString();
        elements.deltaPopup.textContent = deltaText;
        elements.deltaPopup.className = `morale-hud__delta morale-hud__delta--${delta > 0 ? 'positive' : 'negative'}`;
        
        if (!prefersReducedMotion) {
          elements.deltaPopup.classList.add('morale-hud__delta--visible');
          
          // Flash bar
          if (delta > 0) {
            elements.bar.classList.add('morale-hud__bar--flash-positive');
          } else {
            elements.bar.classList.add('morale-hud__bar--flash-negative');
          }
          
          // Remove flash after animation
          setTimeout(() => {
            elements.bar.classList.remove('morale-hud__bar--flash-positive', 'morale-hud__bar--flash-negative');
          }, 300);
          
          // Fade out delta popup
          setTimeout(() => {
            elements.deltaPopup.classList.remove('morale-hud__delta--visible');
          }, 1500);
        }
      }
    });
  }

  /**
   * Show the HUD
   */
  show() {
    if (!this.hudElement) return;
    this.hudElement.classList.add('morale-hud--visible');
    this.isVisible = true;
  }

  /**
   * Hide the HUD
   */
  hide() {
    if (!this.hudElement) return;
    this.hudElement.classList.remove('morale-hud--visible');
    this.isVisible = false;
  }

  /**
   * Show final grade and archetype in expanded overlay
   * @param {Object} grade - Grade result object
   * @param {Object} archetype - Archetype result object
   */
  showFinalResults(grade, archetype) {
    if (!this.hudElement) return;
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'morale-hud__final-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-labelledby', 'final-grade-heading');
    
    const content = document.createElement('div');
    content.className = 'morale-hud__final-content';
    
    // Grade section
    const gradeSection = document.createElement('div');
    gradeSection.className = 'morale-hud__final-grade';
    
    const gradeHeading = document.createElement('h2');
    gradeHeading.id = 'final-grade-heading';
    gradeHeading.textContent = this.hudLabels.gradeHeader;
    
    const gradeLetter = document.createElement('div');
    gradeLetter.className = 'morale-hud__grade-letter';
    gradeLetter.textContent = grade.letter;
    
    const gradeLabel = document.createElement('div');
    gradeLabel.className = 'morale-hud__grade-label';
    gradeLabel.textContent = grade.label;
    
    const gradeDesc = document.createElement('p');
    gradeDesc.className = 'morale-hud__grade-description';
    gradeDesc.textContent = grade.description;
    
    gradeSection.appendChild(gradeHeading);
    gradeSection.appendChild(gradeLetter);
    gradeSection.appendChild(gradeLabel);
    gradeSection.appendChild(gradeDesc);
    
    // Archetype section
    const archetypeSection = document.createElement('div');
    archetypeSection.className = 'morale-hud__final-archetype';
    
    const archetypeHeading = document.createElement('h3');
    archetypeHeading.textContent = this.hudLabels.archetypeHeader;
    
    const archetypeName = document.createElement('div');
    archetypeName.className = 'morale-hud__archetype-name';
    archetypeName.textContent = archetype.name;
    
    const archetypeDesc = document.createElement('p');
    archetypeDesc.className = 'morale-hud__archetype-description';
    archetypeDesc.textContent = archetype.description;
    
    archetypeSection.appendChild(archetypeHeading);
    archetypeSection.appendChild(archetypeName);
    archetypeSection.appendChild(archetypeDesc);
    
    content.appendChild(gradeSection);
    content.appendChild(archetypeSection);
    overlay.appendChild(content);
    
    this.hudElement.appendChild(overlay);
    
    // Fade in
    setTimeout(() => {
      overlay.classList.add('morale-hud__final-overlay--visible');
    }, 100);
  }

  /**
   * Remove HUD from DOM
   * Call on role restart
   */
  destroy() {
    if (this.hudElement && this.hudElement.parentNode) {
      this.hudElement.parentNode.removeChild(this.hudElement);
    }
    this.hudElement = null;
    this.barElements = {};
    
    // Unsubscribe from events
    this.eventBus.off('psychology:scores-updated', this.handleScoresUpdated);
    this.eventBus.off('scene:choices-shown', this.handleChoicesShown);
    this.eventBus.off('scene:narrative-started', this.handleNarrativeStarted);
    this.eventBus.off('psychology:grade-calculated', this.handleGradeCalculated);
  }

  // Event handlers
  
  handleScoresUpdated(data) {
    this.updateDisplay(data.scores, data.effects);
  }

  handleChoicesShown() {
    this.show();
  }

  handleNarrativeStarted() {
    this.hide();
  }

  handleGradeCalculated(data) {
    this.showFinalResults(data.grade, data.archetype);
  }
}

export default MoraleHUD;
