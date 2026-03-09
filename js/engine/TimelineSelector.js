/**
 * TimelineSelector - Interactive Historical Timeline
 * 
 * Renders an interactive horizontal timeline for mission selection.
 * Displays missions chronologically with Pearl Harbor unlocked and future missions locked.
 * Provides tooltips on hover/tap and handles mission selection.
 * 
 * Requirements: 3A.1, 3A.2, 3A.3, 3A.4, 3A.5, 3A.6, 3A.7, 3A.9, 3A.10
 */

import { HapticFeedback } from './HapticFeedback.js';

class TimelineSelector {
  /**
   * Initialize the TimelineSelector
   * @param {EventBus} eventBus - Event bus for component communication
   * @param {MissionRegistry} missionRegistry - Mission registry for accessing missions
   */
  constructor(eventBus, missionRegistry) {
    this.eventBus = eventBus;
    this.missionRegistry = missionRegistry;
    
    // Initialize haptic feedback
    this.haptics = new HapticFeedback();
    
    // Track current tooltip state
    this.currentTooltip = null;
  }

  /**
   * Render the timeline with all missions
   * @param {HTMLElement} containerElement - Container to render timeline into
   */
  render(containerElement) {
    if (!containerElement) {
      console.error('TimelineSelector.render: Container element is required');
      return;
    }

    // Get all missions from registry
    const missions = this.missionRegistry.getAllMissions();
    
    if (missions.length === 0) {
      console.warn('TimelineSelector.render: No missions registered');
      containerElement.innerHTML = '<p class="text-center">No missions available</p>';
      return;
    }

    // Sort missions by historical date
    const sortedMissions = this.sortMissionsByDate(missions);

    // Create timeline structure
    const timelineHTML = this.createTimelineHTML(sortedMissions);
    containerElement.innerHTML = timelineHTML;

    // Attach event listeners after rendering
    this.attachEventListeners(containerElement);
  }

  /**
   * Sort missions by historical date
   * @param {Array} missions - Array of mission objects
   * @returns {Array} Sorted array of missions
   * @private
   */
  sortMissionsByDate(missions) {
    return missions.slice().sort((a, b) => {
      const dateA = new Date(a.historicalDate);
      const dateB = new Date(b.historicalDate);
      return dateA - dateB;
    });
  }

  /**
   * Create timeline HTML structure
   * @param {Array} missions - Sorted array of missions
   * @returns {string} HTML string
   * @private
   */
  createTimelineHTML(missions) {
    const nodesHTML = missions.map((mission, index) => {
      return this.createTimelineNode(mission, index);
    }).join('');

    return `
      <div class="timeline-wrapper">
        <div class="timeline-track">
          ${nodesHTML}
        </div>
      </div>
    `;
  }

  /**
   * Create a single timeline node
   * @param {Object} mission - Mission object
   * @param {number} index - Node index for animation delay
   * @returns {string} HTML string for the node
   * @private
   */
  createTimelineNode(mission, index) {
    const isUnlocked = mission.unlocked === true;
    const nodeClass = isUnlocked ? 'timeline-node unlocked' : 'timeline-node locked';
    const animationDelay = index * 0.1; // Stagger animation by 100ms per node
    const statusText = isUnlocked ? 'Available' : 'Locked';
    const ariaLabel = `${mission.title}, ${this.formatDate(mission.historicalDate)}, ${statusText}`;

    return `
      <button class="${nodeClass}" 
           data-mission-id="${mission.id}"
           data-unlocked="${isUnlocked}"
           style="animation-delay: ${animationDelay}s"
           aria-label="${ariaLabel}">
        <div class="timeline-node-marker" aria-hidden="true">
          ${isUnlocked ? '<span class="node-icon">●</span>' : '<span class="node-icon lock">🔒</span>'}
        </div>
        <div class="timeline-node-label">
          <span class="node-title">${mission.title}</span>
          <span class="node-date">${this.formatDate(mission.historicalDate)}</span>
        </div>
      </button>
    `;
  }

  /**
   * Format ISO date to readable format
   * @param {string} isoDate - ISO format date (YYYY-MM-DD)
   * @returns {string} Formatted date (e.g., "Dec 7, 1941")
   * @private
   */
  formatDate(isoDate) {
    try {
      const date = new Date(isoDate);
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    } catch (error) {
      console.error('TimelineSelector.formatDate: Invalid date format', isoDate);
      return isoDate;
    }
  }

  /**
   * Attach event listeners to timeline nodes
   * @param {HTMLElement} containerElement - Container element
   * @private
   */
  attachEventListeners(containerElement) {
    const nodes = containerElement.querySelectorAll('.timeline-node');

    nodes.forEach(node => {
      const missionId = node.dataset.missionId;
      const isUnlocked = node.dataset.unlocked === 'true';

      // Click handler
      node.addEventListener('click', () => {
        this.onNodeClick(missionId, isUnlocked);
      });

      // Hover handlers for tooltip
      node.addEventListener('mouseenter', (event) => {
        this.showTooltip(missionId, event);
      });

      node.addEventListener('mouseleave', () => {
        this.hideTooltip();
      });

      // Touch handlers for mobile
      node.addEventListener('touchstart', (event) => {
        // Don't prevent default - let click event fire naturally
        this.showTooltip(missionId, event);
      });
      
      node.addEventListener('touchend', () => {
        // Hide tooltip after a delay on mobile
        setTimeout(() => this.hideTooltip(), 2000);
      });

      // Keyboard accessibility - already a button element, no need for tabindex/role
      node.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          this.onNodeClick(missionId, isUnlocked);
        }
      });
    });

    // Hide tooltip when clicking outside
    document.addEventListener('click', (event) => {
      if (!event.target.closest('.timeline-node') && !event.target.closest('.timeline-tooltip')) {
        this.hideTooltip();
      }
    });
  }

  /**
   * Handle timeline node click
   * @param {string} missionId - ID of the clicked mission
   * @param {boolean} isUnlocked - Whether the mission is unlocked
   */
  onNodeClick(missionId, isUnlocked) {
    if (isUnlocked) {
      // Haptic feedback for selection
      this.haptics.medium();
      // Emit mission:selected event for unlocked missions
      this.eventBus.emit('mission:selected', { missionId });
    } else {
      // Haptic feedback for error
      this.haptics.error();
      // Show "Coming Soon" message for locked missions
      this.showComingSoonMessage();
    }
  }

  /**
   * Show tooltip on hover/tap
   * @param {string} missionId - ID of the mission
   * @param {Event} event - Mouse or touch event
   */
  showTooltip(missionId, event) {
    // Get mission data
    const mission = this.missionRegistry.getMission(missionId);
    
    if (!mission) {
      console.error('TimelineSelector.showTooltip: Mission not found', missionId);
      return;
    }

    // Remove existing tooltip if any
    this.hideTooltip();

    // Create tooltip element
    const tooltip = document.createElement('div');
    tooltip.className = 'timeline-tooltip';
    tooltip.setAttribute('role', 'tooltip');
    tooltip.setAttribute('aria-live', 'polite');
    tooltip.innerHTML = `
      <h4>${mission.title}</h4>
      <p class="tooltip-date">${this.formatDate(mission.historicalDate)}</p>
      <p class="tooltip-teaser">${mission.teaser || 'Experience this historical moment'}</p>
      ${mission.unlocked ? '<p class="tooltip-status unlocked">Available Now</p>' : '<p class="tooltip-status locked">Coming Soon</p>'}
    `;

    // Position tooltip
    document.body.appendChild(tooltip);
    this.positionTooltip(tooltip, event);

    // Store reference
    this.currentTooltip = tooltip;
  }

  /**
   * Position tooltip relative to cursor/touch
   * @param {HTMLElement} tooltip - Tooltip element
   * @param {Event} event - Mouse or touch event
   * @private
   */
  positionTooltip(tooltip, event) {
    const x = event.clientX || (event.touches && event.touches[0].clientX) || 0;
    const y = event.clientY || (event.touches && event.touches[0].clientY) || 0;

    // Offset tooltip slightly from cursor
    const offsetX = 15;
    const offsetY = 15;

    tooltip.style.left = `${x + offsetX}px`;
    tooltip.style.top = `${y + offsetY}px`;

    // Ensure tooltip stays within viewport
    const rect = tooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (rect.right > viewportWidth) {
      tooltip.style.left = `${viewportWidth - rect.width - 10}px`;
    }

    if (rect.bottom > viewportHeight) {
      tooltip.style.top = `${y - rect.height - offsetY}px`;
    }
  }

  /**
   * Hide the current tooltip
   * @private
   */
  hideTooltip() {
    if (this.currentTooltip) {
      this.currentTooltip.remove();
      this.currentTooltip = null;
    }
  }

  /**
   * Show "Coming Soon" message for locked missions
   * @private
   */
  showComingSoonMessage() {
    // Create temporary message overlay
    const message = document.createElement('div');
    message.className = 'coming-soon-message';
    message.setAttribute('role', 'dialog');
    message.setAttribute('aria-labelledby', 'coming-soon-title');
    message.setAttribute('aria-modal', 'true');
    message.innerHTML = `
      <div class="message-content">
        <h3 id="coming-soon-title">Coming Soon</h3>
        <p>This mission will be available in a future update.</p>
        <button id="close-message" aria-label="Close coming soon message">Close</button>
      </div>
    `;

    document.body.appendChild(message);

    // Focus the close button for accessibility
    const closeButton = message.querySelector('#close-message');
    closeButton.focus();

    // Add close handler
    closeButton.addEventListener('click', () => {
      message.remove();
    });

    // Close on background click
    message.addEventListener('click', (event) => {
      if (event.target === message) {
        message.remove();
      }
    });

    // Close on Escape key
    const escapeHandler = (event) => {
      if (event.key === 'Escape') {
        message.remove();
        document.removeEventListener('keydown', escapeHandler);
      }
    };
    document.addEventListener('keydown', escapeHandler);
  }
}

// ES6 module export - no global variables
export default TimelineSelector;
