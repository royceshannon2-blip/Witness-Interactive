/**
 * Witness Interactive: Pearl Harbor
 * Main Application Bootstrap
 * 
 * This is the entry point for the application. It initializes all engine components,
 * loads mission content, and starts the game flow.
 * 
 * Architecture: ES6 modules with explicit imports, no global variables.
 * All components communicate via EventBus for loose coupling.
 * 
 * Task 6.2: Complete application bootstrap
 * Requirements: 3.1, 18.3
 */

// Engine imports
import EventBus from './engine/EventBus.js';
import LoadingStateHandler from './engine/LoadingStateHandler.js';
import ConsequenceSystem from './engine/ConsequenceSystem.js';
import SceneStateMachine from './engine/SceneStateMachine.js';
import UIController from './engine/UIController.js';
import TimelineSelector from './engine/TimelineSelector.js';
import MissionRegistry from './content/MissionRegistry.js';

// Mission content imports
import pearlHarborMission from './content/missions/pearl-harbor/mission.js';

/**
 * Initialize the application
 * Bootstraps all engine components and loads mission content
 */
async function initializeApp() {
    console.log('Witness Interactive: Pearl Harbor - Initializing...');
    
    // 1. Initialize EventBus (central communication hub)
    const eventBus = new EventBus();
    console.log('✓ EventBus initialized');
    
    // 2. Initialize LoadingStateHandler and show loading animation
    const loadingHandler = new LoadingStateHandler();
    loadingHandler.subscribeToEvents(eventBus);
    console.log('✓ LoadingStateHandler initialized');
    
    // Show loading screen
    eventBus.emit('game:initializing', { message: 'Loading game engine...' });
    
    // 3. Initialize ConsequenceSystem (tracks player decisions)
    const consequenceSystem = new ConsequenceSystem(eventBus);
    console.log('✓ ConsequenceSystem initialized');
    
    // 4. Initialize SceneStateMachine (manages scene transitions)
    const sceneStateMachine = new SceneStateMachine(eventBus);
    console.log('✓ SceneStateMachine initialized');
    
    // 5. Initialize MissionRegistry (mission catalog)
    const missionRegistry = new MissionRegistry();
    console.log('✓ MissionRegistry initialized');
    
    // 6. Load Pearl Harbor mission
    missionRegistry.register(pearlHarborMission);
    console.log('✓ Pearl Harbor mission loaded');
    
    // 7. Initialize TimelineSelector (mission selection UI)
    const timelineSelector = new TimelineSelector(eventBus, missionRegistry);
    console.log('✓ TimelineSelector initialized');
    
    // 8. Initialize UIController (handles all DOM rendering)
    const uiController = new UIController(eventBus, timelineSelector, missionRegistry);
    console.log('✓ UIController initialized');
    
    // Update loading progress
    eventBus.emit('module:progress', { percent: 75 });
    
    // Verify no global variables from our engine components
    const suspiciousGlobals = Object.keys(window).filter(key => {
        const lowerKey = key.toLowerCase();
        return (lowerKey.includes('eventbus') || 
                lowerKey.includes('consequence') || 
                lowerKey.includes('scenestatemachine') ||
                lowerKey.includes('uicontroller') ||
                lowerKey.includes('missionregistry') ||
                lowerKey.includes('witness') ||
                (lowerKey.includes('game') && !lowerKey.includes('gamepad')));
    });
    
    if (suspiciousGlobals.length === 0) {
        console.log('✓ No global variables detected from engine components');
    } else {
        console.warn('⚠ Engine global variables detected:', suspiciousGlobals);
    }
    
    // Complete loading
    eventBus.emit('module:progress', { percent: 100 });
    
    // Small delay to show loading animation, then transition to landing screen
    setTimeout(() => {
        // 9. Emit game:start event (UIController will show landing screen)
        eventBus.emit('game:start');
        console.log('✓ Game started - landing screen displayed');
        
        // Hide loading screen
        eventBus.emit('game:ready');
        
        console.log('\n=== Application Bootstrap Complete ===');
        console.log('All components initialized successfully.');
        console.log('Pearl Harbor mission loaded and ready to play.');
        console.log('Navigate to landing screen to begin.');
    }, 800);
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
