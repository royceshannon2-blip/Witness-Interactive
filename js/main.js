/**
 * Main Application Entry Point
 * 
 * Initializes all game systems and coordinates component communication via EventBus.
 * No global variables — all components are instantiated and wired together here.
 * 
 * Requirements: All
 */

import EventBus from './engine/EventBus.js';
import LoadingStateHandler from './engine/LoadingStateHandler.js';
import ConsequenceSystem from './engine/ConsequenceSystem.js';
import SceneStateMachine from './engine/SceneStateMachine.js';
import MissionRegistry from './content/MissionRegistry.js';
import TimelineSelector from './engine/TimelineSelector.js';
import AnalyticsTracker from './engine/AnalyticsTracker.js';
import ResultsCard from './engine/ResultsCard.js';
import TypewriterEffect from './engine/TypewriterEffect.js';
import SceneTransition from './engine/SceneTransition.js';
import AtmosphericEffects from './engine/AtmosphericEffects.js';
import TimedChoiceSystem from './engine/TimedChoiceSystem.js';
import AmbientSoundManager from './engine/AmbientSoundManager.js';
import NarratorAudioManager from './engine/NarratorAudioManager.js';
import UIController from './engine/UIController.js';
import FeedbackSurveyPanel from './ui/FeedbackSurveyPanel.js';
import UpdateNotesPanel from './ui/UpdateNotesPanel.js';
import uiContent from './content/ui-content.js';

(async function initializeGame() {
    console.log('Witness Interactive: Pearl Harbor - Initializing...');
    
    // 1. Create EventBus (central communication hub)
    const eventBus = new EventBus();
    console.log('✓ EventBus initialized');
    
    // 2. Initialize LoadingStateHandler
    const loadingStateHandler = new LoadingStateHandler(eventBus);
    console.log('✓ LoadingStateHandler initialized');
    
    // Show loading screen
    eventBus.emit('loading:start');
    
    // Update loading progress
    eventBus.emit('module:progress', { percent: 10 });
    
    // 3. Initialize ConsequenceSystem (tracks player choices and flags)
    const consequenceSystem = new ConsequenceSystem(eventBus);
    console.log('✓ ConsequenceSystem initialized');
    
    // Update loading progress
    eventBus.emit('module:progress', { percent: 20 });
    
    // 4. Initialize SceneStateMachine (manages scene transitions)
    const sceneStateMachine = new SceneStateMachine(eventBus);
    console.log('✓ SceneStateMachine initialized');
    
    // Update loading progress
    eventBus.emit('module:progress', { percent: 30 });
    
    // 5. Initialize MissionRegistry (loads mission data)
    const missionRegistry = new MissionRegistry(eventBus);
    console.log('✓ MissionRegistry initialized');
    
    // Load Pearl Harbor mission
    try {
        await missionRegistry.loadMission('pearl-harbor');
        console.log('✓ Pearl Harbor mission loaded');
    } catch (error) {
        console.error('Failed to load Pearl Harbor mission:', error);
    }
    
    // Load Rwanda Genocide mission
    try {
        await missionRegistry.loadMission('rwanda-genocide');
        console.log('✓ Rwanda Genocide mission loaded');
    } catch (error) {
        console.error('Failed to load Rwanda Genocide mission:', error);
    }
    
    // Update loading progress
    eventBus.emit('module:progress', { percent: 40 });
    
    // 6. Initialize TimelineSelector (mission selection UI)
    const timelineSelector = new TimelineSelector(eventBus, missionRegistry);
    console.log('✓ TimelineSelector initialized');
    
    // Update loading progress
    eventBus.emit('module:progress', { percent: 45 });
    
    // 7. Initialize AnalyticsTracker (tracks player behavior)
    const analyticsTracker = new AnalyticsTracker(eventBus);
    console.log('✓ AnalyticsTracker initialized');
    
    // Update loading progress
    eventBus.emit('module:progress', { percent: 50 });
    
    // 8. Initialize ResultsCard (displays outcome screen)
    const resultsCard = new ResultsCard(eventBus, consequenceSystem);
    console.log('✓ ResultsCard initialized');
    
    // Update loading progress
    eventBus.emit('module:progress', { percent: 55 });
    
    // 9. Initialize TypewriterEffect (animated text reveal)
    const typewriterEffect = new TypewriterEffect(eventBus);
    console.log('✓ TypewriterEffect initialized');
    
    // Update loading progress
    eventBus.emit('module:progress', { percent: 60 });
    
    // 10. Initialize SceneTransition (visual transitions between scenes)
    const sceneTransition = new SceneTransition(eventBus);
    console.log('✓ SceneTransition initialized');
    
    // Update loading progress
    eventBus.emit('module:progress', { percent: 62 });
    
    // 11. Initialize AtmosphericEffects (visual effects like smoke, fire)
    const atmosphericEffects = new AtmosphericEffects(eventBus);
    console.log('✓ AtmosphericEffects initialized');
    
    // Update loading progress
    eventBus.emit('module:progress', { percent: 64 });
    
    // 12. Initialize TimedChoiceSystem (countdown timers for choices)
    const timedChoiceSystem = new TimedChoiceSystem(eventBus);
    console.log('✓ TimedChoiceSystem initialized');
    
    // Update loading progress
    eventBus.emit('module:progress', { percent: 66 });
    
    // 13. Initialize AmbientSoundManager (background audio)
    const ambientSoundManager = new AmbientSoundManager(eventBus);
    console.log('✓ AmbientSoundManager initialized');
    
    // Update loading progress
    eventBus.emit('module:progress', { percent: 68 });
    
    // 14. Initialize NarratorAudioManager (narration audio)
    const narratorAudioManager = new NarratorAudioManager(eventBus);
    console.log('✓ NarratorAudioManager initialized');
    
    // Update loading progress
    eventBus.emit('module:progress', { percent: 70 });
    
    // 15. Initialize UIController (main UI orchestrator)
    const uiController = new UIController(eventBus, uiContent);
    console.log('✓ UIController initialized');
    
    // Update loading progress
    eventBus.emit('module:progress', { percent: 72 });
    
    // 15.1 Initialize FeedbackSurveyPanel (post-mission feedback)
    const feedbackSurveyPanel = new FeedbackSurveyPanel(eventBus, consequenceSystem);
    console.log('✓ FeedbackSurveyPanel initialized');
    
    // Update loading progress
    eventBus.emit('module:progress', { percent: 74 });
    
    // 15.2 Initialize UpdateNotesPanel (version update notifications)
    const updateNotesPanel = new UpdateNotesPanel(eventBus);
    console.log('✓ UpdateNotesPanel initialized');
    
    // Update loading progress
    eventBus.emit('module:progress', { percent: 76 });
    
    // 16. Set up role:selected handler to load scenes into SceneStateMachine
    eventBus.on('role:selected', (data) => {
        const { missionId, roleId } = data;
        const mission = missionRegistry.getMission(missionId);
        
        if (!mission) {
            console.error(`Mission ${missionId} not found`);
            return;
        }
        
        const role = mission.roles.find(r => r.id === roleId);
        if (!role) {
            console.error(`Role ${roleId} not found in mission ${missionId}`);
            return;
        }
        
        // Load role scenes into SceneStateMachine
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
                lowerKey.includes('narratoraudio') ||
                lowerKey.includes('feedbacksurvey') ||
                lowerKey.includes('updatenotes')) &&
               !key.startsWith('webkit') &&
               !key.startsWith('chrome');
    });
    
    if (suspiciousGlobals.length === 0) {
        console.log('✓ No global variables detected from engine components');
    } else {
        console.warn('⚠ Potential global variable leaks:', suspiciousGlobals);
    }
    
    // Update loading progress
    eventBus.emit('module:progress', { percent: 90 });
    
    // Emit game:start to show landing screen
    eventBus.emit('game:start');
    console.log('✓ Game started - landing screen displayed');
    
    // Complete loading
    eventBus.emit('loading:complete');
    eventBus.emit('module:progress', { percent: 100 });
    
    console.log('=== Application Bootstrap Complete ===');
    console.log('All components initialized successfully.');
    console.log('Pearl Harbor mission loaded and ready to play.');
    console.log('Navigate to landing screen to begin.');
    
    // Dev keyboard shortcut: Ctrl+Shift+K to auto-advance scenes
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'K') {
            console.log('[Dev] Auto-advancing scene');
            document.querySelector('.choice-button')?.click();
        }
    });
})();
