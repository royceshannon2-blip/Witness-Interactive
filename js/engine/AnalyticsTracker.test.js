/**
 * AnalyticsTracker Tests
 * 
 * Verifies session tracking functionality:
 * - Session initialization and ID generation
 * - Action logging for all player events
 * - Session summary generation
 * - JSON export functionality
 * - EventBus integration
 * 
 * Requirements: 26.1, 26.2, 26.3, 26.4
 */

import EventBus from './EventBus.js';
import AnalyticsTracker from './AnalyticsTracker.js';

// Test suite
const tests = [];
let passedTests = 0;
let failedTests = 0;

/**
 * Test helper: Assert equality
 */
function assertEqual(actual, expected, message) {
    if (actual === expected) {
        console.log(`✓ ${message}`);
        passedTests++;
        return true;
    } else {
        console.error(`✗ ${message}`);
        console.error(`  Expected: ${expected}`);
        console.error(`  Actual: ${actual}`);
        failedTests++;
        return false;
    }
}

/**
 * Test helper: Assert truthy
 */
function assertTrue(value, message) {
    if (value) {
        console.log(`✓ ${message}`);
        passedTests++;
        return true;
    } else {
        console.error(`✗ ${message}`);
        console.error(`  Expected truthy value, got: ${value}`);
        failedTests++;
        return false;
    }
}

/**
 * Test helper: Assert object has property
 */
function assertHasProperty(obj, property, message) {
    if (obj && obj.hasOwnProperty(property)) {
        console.log(`✓ ${message}`);
        passedTests++;
        return true;
    } else {
        console.error(`✗ ${message}`);
        console.error(`  Object missing property: ${property}`);
        failedTests++;
        return false;
    }
}

console.log('\n=== AnalyticsTracker Tests ===\n');

// Test 1: AnalyticsTracker initializes correctly
(() => {
    const eventBus = new EventBus();
    const tracker = new AnalyticsTracker(eventBus);
    
    assertTrue(tracker !== null, 'AnalyticsTracker instance created');
    assertTrue(tracker.eventBus === eventBus, 'EventBus reference stored');
})();

// Test 2: startSession() creates session with unique ID
(() => {
    const eventBus = new EventBus();
    const tracker = new AnalyticsTracker(eventBus);
    
    tracker.startSession();
    const summary = tracker.getSessionSummary();
    
    assertTrue(summary !== null, 'Session summary exists after startSession()');
    assertTrue(summary.sessionId.startsWith('session_'), 'Session ID has correct prefix');
    assertTrue(summary.startTime !== null, 'Session has start time');
})();

// Test 3: Session ID is unique across multiple sessions
(() => {
    const eventBus = new EventBus();
    const tracker1 = new AnalyticsTracker(eventBus);
    const tracker2 = new AnalyticsTracker(eventBus);
    
    tracker1.startSession();
    tracker2.startSession();
    
    const id1 = tracker1.getSessionSummary().sessionId;
    const id2 = tracker2.getSessionSummary().sessionId;
    
    assertTrue(id1 !== id2, 'Session IDs are unique');
})();

// Test 4: logAction() records actions correctly
(() => {
    const eventBus = new EventBus();
    const tracker = new AnalyticsTracker(eventBus);
    
    tracker.startSession();
    tracker.logAction('test_action', { testData: 'value' });
    
    const summary = tracker.getSessionSummary();
    assertEqual(summary.totalActions, 1, 'Action count incremented');
})();

// Test 5: EventBus integration - mission:selected event
(() => {
    const eventBus = new EventBus();
    const tracker = new AnalyticsTracker(eventBus);
    
    tracker.startSession();
    eventBus.emit('mission:selected', 'pearl-harbor');
    
    const summary = tracker.getSessionSummary();
    assertEqual(summary.missionId, 'pearl-harbor', 'Mission ID tracked from event');
})();

// Test 6: EventBus integration - role:selected event
(() => {
    const eventBus = new EventBus();
    const tracker = new AnalyticsTracker(eventBus);
    
    tracker.startSession();
    eventBus.emit('role:selected', 'japanese-aviator');
    
    const summary = tracker.getSessionSummary();
    assertEqual(summary.roleId, 'japanese-aviator', 'Role ID tracked from event');
})();

// Test 7: EventBus integration - choice:made event
(() => {
    const eventBus = new EventBus();
    const tracker = new AnalyticsTracker(eventBus);
    
    tracker.startSession();
    eventBus.emit('choice:made', {
        sceneId: 'scene-01',
        choiceId: 'choice-a',
        consequences: { flag1: true }
    });
    
    const summary = tracker.getSessionSummary();
    assertEqual(summary.totalChoices, 1, 'Choice count incremented');
    assertTrue(summary.consequenceFlags.flag1 === true, 'Consequence flag tracked');
})();

// Test 8: Multiple choices tracked correctly
(() => {
    const eventBus = new EventBus();
    const tracker = new AnalyticsTracker(eventBus);
    
    tracker.startSession();
    eventBus.emit('choice:made', {
        sceneId: 'scene-01',
        choiceId: 'choice-a',
        consequences: { flag1: true }
    });
    eventBus.emit('choice:made', {
        sceneId: 'scene-02',
        choiceId: 'choice-b',
        consequences: { flag2: 5 }
    });
    
    const summary = tracker.getSessionSummary();
    assertEqual(summary.totalChoices, 2, 'Multiple choices tracked');
    assertTrue(summary.consequenceFlags.flag1 === true, 'First flag tracked');
    assertTrue(summary.consequenceFlags.flag2 === 5, 'Second flag tracked');
})();

// Test 9: checkpoint:complete event tracked
(() => {
    const eventBus = new EventBus();
    const tracker = new AnalyticsTracker(eventBus);
    
    tracker.startSession();
    eventBus.emit('checkpoint:complete', {
        score: 2,
        totalQuestions: 3,
        answers: [
            { questionId: 'q1', selectedAnswer: 'a', correct: true },
            { questionId: 'q2', selectedAnswer: 'b', correct: true },
            { questionId: 'q3', selectedAnswer: 'c', correct: false }
        ]
    });
    
    const summary = tracker.getSessionSummary();
    assertEqual(summary.checkpointScore, 2, 'Checkpoint score tracked');
})();

// Test 10: getSessionSummary() returns complete summary
(() => {
    const eventBus = new EventBus();
    const tracker = new AnalyticsTracker(eventBus);
    
    tracker.startSession();
    eventBus.emit('mission:selected', 'pearl-harbor');
    eventBus.emit('role:selected', 'american-sailor');
    eventBus.emit('choice:made', {
        sceneId: 'scene-01',
        choiceId: 'choice-a',
        consequences: { survived: true }
    });
    
    const summary = tracker.getSessionSummary();
    
    assertHasProperty(summary, 'sessionId', 'Summary has sessionId');
    assertHasProperty(summary, 'startTime', 'Summary has startTime');
    assertHasProperty(summary, 'missionId', 'Summary has missionId');
    assertHasProperty(summary, 'roleId', 'Summary has roleId');
    assertHasProperty(summary, 'totalChoices', 'Summary has totalChoices');
    assertHasProperty(summary, 'consequenceFlags', 'Summary has consequenceFlags');
    assertHasProperty(summary, 'totalActions', 'Summary has totalActions');
})();

// Test 11: exportSession() returns valid JSON
(() => {
    const eventBus = new EventBus();
    const tracker = new AnalyticsTracker(eventBus);
    
    tracker.startSession();
    eventBus.emit('mission:selected', 'pearl-harbor');
    
    const jsonString = tracker.exportSession();
    
    assertTrue(jsonString !== null, 'Export returns non-null value');
    
    // Verify it's valid JSON
    try {
        const parsed = JSON.parse(jsonString);
        assertTrue(parsed.sessionId !== undefined, 'Exported JSON contains sessionId');
        assertTrue(parsed.actions !== undefined, 'Exported JSON contains actions array');
    } catch (e) {
        console.error('✗ Export returns valid JSON');
        console.error(`  JSON parse error: ${e.message}`);
        failedTests++;
    }
})();

// Test 12: Session ends correctly with duration calculation
(() => {
    const eventBus = new EventBus();
    const tracker = new AnalyticsTracker(eventBus);
    
    tracker.startSession();
    
    // Simulate some time passing
    setTimeout(() => {
        eventBus.emit('checkpoint:complete', {
            score: 3,
            totalQuestions: 3,
            answers: []
        });
        
        const summary = tracker.getSessionSummary();
        assertTrue(summary.endTime !== null, 'Session has end time after checkpoint:complete');
        assertTrue(summary.duration !== null, 'Session duration calculated');
    }, 100);
})();

// Test 13: No session data before startSession()
(() => {
    const eventBus = new EventBus();
    const tracker = new AnalyticsTracker(eventBus);
    
    const summary = tracker.getSessionSummary();
    assertEqual(summary, null, 'No session summary before startSession()');
    
    const exported = tracker.exportSession();
    assertEqual(exported, null, 'No export data before startSession()');
})();

// Test 14: game:start event triggers startSession()
(() => {
    const eventBus = new EventBus();
    const tracker = new AnalyticsTracker(eventBus);
    
    eventBus.emit('game:start');
    
    const summary = tracker.getSessionSummary();
    assertTrue(summary !== null, 'Session started automatically on game:start event');
})();

// Test 15: Scene transitions tracked
(() => {
    const eventBus = new EventBus();
    const tracker = new AnalyticsTracker(eventBus);
    
    tracker.startSession();
    eventBus.emit('scene:transition', 'scene-01');
    eventBus.emit('scene:transition', 'scene-02');
    eventBus.emit('scene:transition', 'scene-03');
    
    const summary = tracker.getSessionSummary();
    assertTrue(summary.totalActions >= 3, 'Scene transitions tracked as actions');
})();

// Summary
console.log('\n=== Test Summary ===');
console.log(`Total: ${passedTests + failedTests}`);
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${failedTests}`);

if (failedTests === 0) {
    console.log('\n✓ All AnalyticsTracker tests passed!\n');
} else {
    console.log(`\n✗ ${failedTests} test(s) failed\n`);
}

export { passedTests, failedTests };
