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
import AnalyticsTracker from './engine/AnalyticsTracker.js';
import ResultsCard from './engine/ResultsCard.js';
import MissionRegistry from './content/MissionRegistry.js';
import TypewriterEffect from './engine/TypewriterEffect.js';
import SceneTransition from './engine/SceneTransition.js';
import AtmosphericEffects from './engine/AtmosphericEffects.js';
import TimedChoiceSystem from './engine/TimedChoiceSystem.js';
import AmbientSoundManager from './engine/AmbientSoundManager.js';

// Content imports
import pearlHarborMission from './content/missions/pearl-harbor/mission.js';
import uiContent from './content/ui-content.js';

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
    
    // 8. Initialize AnalyticsTracker (session tracking)
    const analyticsTracker = new AnalyticsTracker(eventBus);
    console.log('✓ AnalyticsTracker initialized');
    
    // 9. Initialize ResultsCard (shareable outcome card generator)
    const resultsCard = new ResultsCard(eventBus, analyticsTracker, missionRegistry);
    console.log('✓ ResultsCard initialized');
    
    // 10. Initialize TypewriterEffect (character-by-character text reveal)
    const typewriterEffect = new TypewriterEffect(eventBus, {
        defaultSpeed: 30,        // milliseconds per character
        skipOnClick: true,       // allow click to complete
        respectMotionPrefs: true // check prefers-reduced-motion
    });
    console.log('✓ TypewriterEffect initialized');
    
    // 11. Initialize SceneTransition (smooth transitions between scenes)
    const sceneTransition = new SceneTransition(eventBus, {
        defaultType: 'fade',     // transition type: fade, flash, none
        duration: 500,           // total transition duration in ms
        respectMotionPrefs: true // check prefers-reduced-motion
    });
    console.log('✓ SceneTransition initialized');
    
    // 12. Initialize AtmosphericEffects (CSS-based visual effects)
    const atmosphericEffects = new AtmosphericEffects(eventBus, {
        defaultDuration: 2000,   // default effect duration in ms
        respectMotionPrefs: true // check prefers-reduced-motion
    });
    console.log('✓ AtmosphericEffects initialized');
    
    // 13. Initialize TimedChoiceSystem (countdown timer for urgent decisions)
    const timedChoiceSystem = new TimedChoiceSystem(eventBus, {
        warningThreshold: 3000,  // show warning at 3 seconds remaining
        pulseInterval: 500       // pulse animation interval
    });
    console.log('✓ TimedChoiceSystem initialized');
    
    // 14. Initialize AmbientSoundManager (background audio system)
    const ambientSoundManager = new AmbientSoundManager(eventBus, {
        defaultVolume: 0.6,           // default volume level (0.0-1.0)
        crossfadeDuration: 1000,      // crossfade duration in ms
        preloadOnStart: true,         // preload audio files on start
        audioPath: './audio/ambient/'  // path to audio files
    });
    console.log('✓ AmbientSoundManager initialized');
    
    // 15. Initialize UIController (handles all DOM rendering)
    // Pass components object with interactive polish features
    const components = {
        typewriterEffect,
        sceneTransition,
        atmosphericEffects,
        timedChoiceSystem,
        ambientSoundManager
    };
    const uiController = new UIController(
        eventBus, 
        timelineSelector, 
        missionRegistry, 
        consequenceSystem, 
        resultsCard, 
        uiContent,
        components
    );
    console.log('✓ UIController initialized');
    
    // 16. Set up role:selected handler to load scenes into SceneStateMachine
    eventBus.on('role:selected', (data) => {
        const { missionId, roleId } = data;
        const mission = missionRegistry.getMission(missionId);
        
        if (!mission) {
            console.error(`main.js: Mission "${missionId}" not found`);
            return;
        }
        
        const role = mission.roles.find(r => r.id === roleId);
        
        if (!role) {
            console.error(`main.js: Role "${roleId}" not found in mission "${missionId}"`);
            return;
        }
        
        // Load the role's scenes into the SceneStateMachine
        sceneStateMachine.loadRole(missionId, roleId, role.scenes);
        console.log(`✓ Loaded role "${roleId}" with ${role.scenes.length} scenes`);
    });
    
    // 17. Set up choice:made handler to transition scenes
    eventBus.on('choice:made', (data) => {
        const { nextSceneId, consequences } = data;
        
        // ConsequenceSystem will handle setting flags
        // SceneStateMachine will handle scene transition
        sceneStateMachine.transitionTo(nextSceneId);
        
        console.log(`✓ Transitioning to scene "${nextSceneId}"`, consequences);
    });
    
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
                lowerKey.includes('resultscard') ||
                lowerKey.includes('typewriter') ||
                lowerKey.includes('scenetransition') ||
                lowerKey.includes('atmospheric') ||
                lowerKey.includes('timedchoice') ||
                lowerKey.includes('ambientsound') ||
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
        // 18. Emit game:start event (UIController will show landing screen)
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
