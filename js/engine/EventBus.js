/**
 * EventBus - Lightweight Pub/Sub System
 * 
 * Provides decoupled communication between components.
 * Components can publish events and subscribe to events without direct dependencies.
 * 
 * Events used in the game:
 * - game:start - Game initialization complete
 * - mission:selected - Player chose a mission (data: missionId)
 * - role:selected - Player chose a role (data: roleId)
 * - scene:transition - Moving to new scene (data: sceneId)
 * - choice:made - Player made a decision (data: choiceId, consequences)
 * - game:complete - Narrative sequence finished
 * - checkpoint:complete - Knowledge questions answered
 * 
 * Requirements: 14.1, 14.2, 14.3, 14.4, 19.1, 19.2
 */

class EventBus {
  constructor() {
    // Map of event names to arrays of callback functions
    // No global variables - all state contained in instance
    this.events = new Map();
  }

  /**
   * Subscribe to an event
   * @param {string} eventName - Name of the event to listen for
   * @param {Function} callback - Function to call when event is emitted
   */
  on(eventName, callback) {
    if (typeof eventName !== 'string') {
      console.error('EventBus.on: eventName must be a string');
      return;
    }
    
    if (typeof callback !== 'function') {
      console.error('EventBus.on: callback must be a function');
      return;
    }

    // Get existing callbacks for this event, or create new array
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }
    
    this.events.get(eventName).push(callback);
  }

  /**
   * Unsubscribe from an event
   * @param {string} eventName - Name of the event to stop listening for
   * @param {Function} callback - The specific callback function to remove
   */
  off(eventName, callback) {
    if (!this.events.has(eventName)) {
      return; // No subscribers for this event
    }

    const callbacks = this.events.get(eventName);
    const index = callbacks.indexOf(callback);
    
    if (index !== -1) {
      callbacks.splice(index, 1);
    }

    // Clean up empty event arrays
    if (callbacks.length === 0) {
      this.events.delete(eventName);
    }
  }

  /**
   * Publish an event with optional data
   * @param {string} eventName - Name of the event to emit
   * @param {*} data - Optional data to pass to subscribers
   */
  emit(eventName, data) {
    if (!this.events.has(eventName)) {
      return; // No subscribers, silently continue (no error)
    }

    const callbacks = this.events.get(eventName);
    
    // Invoke all callbacks for this event
    // If a callback throws an error, catch it and continue with other callbacks
    callbacks.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`EventBus: Error in callback for event "${eventName}":`, error);
      }
    });
  }
}

// ES6 module export - no global variables
export default EventBus;
