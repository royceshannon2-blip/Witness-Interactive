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
import NarratorAudioManager from './engine/NarratorAudioManager.js';
import MissionBriefing from './engine/MissionBriefing.js';

// UI imports
import FeedbackSurveyPanel from './ui/FeedbackSurveyPanel.js';
import UpdateNotesPanel from './ui/UpdateNotesPanel.js';

// Content imports
import pearlHarborMission from './content/missions/pearl-harbor/mission.js';
import rwandaMission from './content/missions/rwanda/mission.js';
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
    
    // 4.5. Initialize MissionBriefing (newspaper-style mission briefings)
    const missionBriefing = new MissionBriefing(eventBus);
    console.log('✓ MissionBriefing initialized');
    
    // 5. Initialize MissionRegistry (mission catalog)
    const missionRegistry = new MissionRegistry();
    console.log('✓ MissionRegistry initialized');
    
    // 6. Load Pearl Harbor mission
    missionRegistry.register(pearlHarborMission);
    console.log('✓ Pearl Harbor mission loaded');
    
    // 7. Load Rwanda Genocide mission
    missionRegistry.register(rwandaMission);
    console.log('✓ Rwanda Genocide mission loaded');
    
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
    
    // 14. Create shared AudioContext for all audio playback
    // CRITICAL: Create in suspended state, will be resumed after user gesture
    // Audio unlock does NOT block game initialization - game starts immediately
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    console.log('[Audio] AudioContext created, state:', audioContext.state);
    
    // 15. Initialize AmbientSoundManager (background audio system)
    const ambientSoundManager = new AmbientSoundManager(eventBus, audioContext, {
        defaultVolume: 0.4,           // 40% volume as specified
        crossfadeDuration: 1500,      // 1.5 seconds crossfade
        audioPath: 'audio/ambient/'   // path to audio files (no leading slash)
    });
    console.log('✓ AmbientSoundManager initialized');
    
    // 16. Initialize NarratorAudioManager (narrator voice playback)
    const narratorAudioManager = new NarratorAudioManager(eventBus, audioContext, {
        narratorVolume: 1.0,          // 100% volume for narrator
        radioVolume: 0.8,             // 80% volume for radio clips
        audioPath: 'audio/narration/' // path to narration files (no leading slash)
    });
    console.log('✓ NarratorAudioManager initialized');
    
    // 16. Initialize UIController (handles all DOM rendering)
    // Pass components object with interactive polish features
    const components = {
        typewriterEffect,
        sceneTransition,
        atmosphericEffects,
        timedChoiceSystem,
        ambientSoundManager,
        narratorAudioManager
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
    
    // 17. Initialize FeedbackSurveyPanel (post-mission feedback)
    const feedbackSurveyPanel = new FeedbackSurveyPanel(eventBus, consequenceSystem);
    console.log('✓ FeedbackSurveyPanel initialized');
    
    // 18. Initialize UpdateNotesPanel (pre-game "What's New")
    const updateNotesPanel = new UpdateNotesPanel();
    console.log('✓ UpdateNotesPanel initialized');
    
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
        
        // Stop all audio from previous role
        if (ambientSoundManager) {
            ambientSoundManager.stopAll();
        }
        if (narratorAudioManager) {
            narratorAudioManager.stopAll();
        }
        
        // Set current role in ConsequenceSystem for survival calculation
        consequenceSystem.setCurrentRole(roleId);
        
        // Reset consequence flags for new role playthrough
        consequenceSystem.reset();
        
        // Define proceed function to load role scenes
        const proceed = () => {
            sceneStateMachine.loadRole(missionId, roleId, role.scenes);
            console.log(`✓ Loaded role "${roleId}" with ${role.scenes.length} scenes`);
        };
        
        // Show briefing if available, otherwise proceed directly
        missionBriefing.hasBriefing(missionId)
            ? missionBriefing.show(missionId, roleId, proceed)
            : proceed();
    });

    // Dev cheat code: Ctrl+Shift+K auto-advances scene
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'K') {
            console.log('[Dev] Auto-advancing scene');
            document.querySelector('.choice-button')?.click();
        }
    });
    
    // Dev cheat code: Ctrl+Shift+6 skips typewriter animation instantly
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === '^') {
            if (typewriterEffect.isActive()) {
                console.log('[Dev] Typewriter skipped');
                typewriterEffect.skipToEnd();
            }
        }
    });
    
    // 17. Set up choice:made handler to transition scenes
    eventBus.on('choice:made', (data) => {
        const { nextSceneId, consequences } = data;
        
        // ConsequenceSystem will handle setting flags
        // SceneStateMachine will handle scene transition
        sceneStateMachine.transitionTo(nextSceneId);
        
        console.log(`✓ Transitioning to scene "${nextSceneId}"`, consequences);
    });
    
    // 18. Set up role:complete handler to trigger outcome generation
    eventBus.on('role:complete', (data) => {
        const { missionId, roleId } = data;
        
        // Emit scene:terminal to trigger outcome generation
        eventBus.emit('scene:terminal', {
            missionId,
            roleId,
            role: roleId
        });
        
        console.log(`✓ Role complete: ${roleId} in ${missionId}`);
    });
    
    // Update loading progress
    eventBus.emit('module:progress', { percent: 80 });
    
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
    
    // Setup audio unlock - runs opportunistically, does NOT block game initialization
    // Audio plays when it can - if AudioContext is suspended, sounds are queued
    const unlockAudio = async () => {
        try {
            if (audioContext.state === 'suspended') {
                await audioContext.resume();
                console.log('[Audio] AudioContext resumed, state:', audioContext.state);
            }
            
            // Emit event to notify audio managers
            eventBus.emit('audio:unlocked');
            
            // Remove listeners after first successful unlock
            document.removeEventListener('click', unlockAudio);
            document.removeEventListener('touchstart', unlockAudio);
            document.removeEventListener('keydown', unlockAudio);
        } catch (err) {
            console.warn('[Audio] AudioContext resume failed:', err.message);
        }
    };
    
    document.addEventListener('click', unlockAudio, { passive: true });
    document.addEventListener('touchstart', unlockAudio, { passive: true });
    document.addEventListener('keydown', unlockAudio);
    
    // Test hooks - allows Playwright to unlock audio and check game state
    // Only available on localhost for testing
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.__unlockAudioForTesting = async () => {
            if (audioContext.state === 'suspended') {
                await audioContext.resume();
                eventBus.emit('audio:unlocked');
                console.log('[Audio] Audio unlocked via test hook');
            }
        };
        
        window.__getGameState = () => {
            return {
                audioContextState: audioContext ? audioContext.state : 'none',
                currentScene: window.__currentScene || null,
                initialized: window.__gameInitialized || false
            };
        };
    }
    
    // Handle browser navigation - cleanup on page unload
    const handlePageUnload = () => {
        console.log('[Cleanup] Page unload detected - stopping all audio and effects');
        
        // Stop all audio
        if (ambientSoundManager) {
            ambientSoundManager.stopAll();
        }
        if (narratorAudioManager) {
            narratorAudioManager.stopAll();
        }
        
        // Clear all effects
        if (atmosphericEffects) {
            atmosphericEffects.clearAllEffects();
        }
    };
    
    window.addEventListener('beforeunload', handlePageUnload);
    window.addEventListener('pagehide', handlePageUnload);
    
    // Small delay to show loading animation, then transition to landing screen
    setTimeout(async () => {
        // Show "What's New" panel before game starts
        await updateNotesPanel.show();
        
        // 19. Emit game:start event (UIController will show landing screen)
        eventBus.emit('game:start');
        console.log('✓ Game started - landing screen displayed');
        
        // Hide loading screen
        eventBus.emit('game:ready');
        
        // Mark game as initialized for tests
        window.__gameInitialized = true;
        
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
