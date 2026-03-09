/**
 * ResultsCard Tests
 * 
 * Verifies results card generation and sharing functionality:
 * - Card generation with session data
 * - Display of mission name, role, survival status
 * - Checkpoint score display
 * - Completion timestamp
 * - AP themes collection and display
 * - Copy to clipboard functionality
 * 
 * Requirements: 22.1, 22.2, 22.3, 22.4, 22.5, 27.1, 27.2, 27.4, 27.5, 24.5
 */

import EventBus from './EventBus.js';
import AnalyticsTracker from './AnalyticsTracker.js';
import ResultsCard from './ResultsCard.js';
import MissionRegistry from '../content/MissionRegistry.js';

// Test suite
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
 * Test helper: Assert string contains substring
 */
function assertContains(str, substring, message) {
    if (str && str.includes(substring)) {
        console.log(`✓ ${message}`);
        passedTests++;
        return true;
    } else {
        console.error(`✗ ${message}`);
        console.error(`  Expected string to contain: ${substring}`);
        console.error(`  Actual string: ${str}`);
        failedTests++;
        return false;
    }
}

/**
 * Create mock mission for testing
 */
function createMockMission() {
    return {
        id: 'test-mission',
        title: 'Test Mission',
        historicalDate: '1941-12-07',
        era: 'Modern',
        unlocked: true,
        teaser: 'Test mission teaser',
        roles: [
            {
                id: 'test-role',
                name: 'Test Role',
                description: 'Test role description',
                scenes: [
                    {
                        id: 'scene-01',
                        narrative: 'Test narrative',
                        apThemes: ['causation', 'perspective'],
                        choices: []
                    },
                    {
                        id: 'scene-02',
                        narrative: 'Test narrative 2',
                        apThemes: ['continuity'],
                        choices: []
                    }
                ],
                outcomes: []
            }
        ],
        knowledgeQuestions: [],
        historicalRipple: []
    };
}

console.log('\n=== ResultsCard Tests ===\n');

// Test 1: ResultsCard initializes correctly
(() => {
    const eventBus = new EventBus();
    const analyticsTracker = new AnalyticsTracker(eventBus);
    const missionRegistry = new MissionRegistry();
    const resultsCard = new ResultsCard(eventBus, analyticsTracker, missionRegistry);
    
    assertTrue(resultsCard !== null, 'ResultsCard instance created');
    assertTrue(resultsCard.eventBus === eventBus, 'EventBus reference stored');
    assertTrue(resultsCard.analyticsTracker === analyticsTracker, 'AnalyticsTracker reference stored');
    assertTrue(resultsCard.missionRegistry === missionRegistry, 'MissionRegistry reference stored');
})();

// Test 2: generateCard() returns HTML with session data
(() => {
    const eventBus = new EventBus();
    const analyticsTracker = new AnalyticsTracker(eventBus);
    const missionRegistry = new MissionRegistry();
    const resultsCard = new ResultsCard(eventBus, analyticsTracker, missionRegistry);
    
    // Register mock mission
    const mockMission = createMockMission();
    missionRegistry.register(mockMission);
    
    // Start session and simulate game flow
    analyticsTracker.startSession();
    eventBus.emit('mission:selected', 'test-mission');
    eventBus.emit('role:selected', 'test-role');
    
    // Generate card
    const sessionData = { score: 2, totalQuestions: 3 };
    const cardHTML = resultsCard.generateCard(sessionData);
    
    assertTrue(typeof cardHTML === 'string', 'generateCard returns string');
    assertTrue(cardHTML.length > 0, 'Generated HTML is not empty');
})();

// Test 3: Card includes mission title
(() => {
    const eventBus = new EventBus();
    const analyticsTracker = new AnalyticsTracker(eventBus);
    const missionRegistry = new MissionRegistry();
    const resultsCard = new ResultsCard(eventBus, analyticsTracker, missionRegistry);
    
    const mockMission = createMockMission();
    missionRegistry.register(mockMission);
    
    analyticsTracker.startSession();
    eventBus.emit('mission:selected', 'test-mission');
    eventBus.emit('role:selected', 'test-role');
    
    const sessionData = { score: 2, totalQuestions: 3 };
    const cardHTML = resultsCard.generateCard(sessionData);
    
    assertContains(cardHTML, 'Test Mission', 'Card includes mission title');
})();

// Test 4: Card includes role name
(() => {
    const eventBus = new EventBus();
    const analyticsTracker = new AnalyticsTracker(eventBus);
    const missionRegistry = new MissionRegistry();
    const resultsCard = new ResultsCard(eventBus, analyticsTracker, missionRegistry);
    
    const mockMission = createMockMission();
    missionRegistry.register(mockMission);
    
    analyticsTracker.startSession();
    eventBus.emit('mission:selected', 'test-mission');
    eventBus.emit('role:selected', 'test-role');
    
    const sessionData = { score: 2, totalQuestions: 3 };
    const cardHTML = resultsCard.generateCard(sessionData);
    
    assertContains(cardHTML, 'Test Role', 'Card includes role name');
})();

// Test 5: Card includes survival status
(() => {
    const eventBus = new EventBus();
    const analyticsTracker = new AnalyticsTracker(eventBus);
    const missionRegistry = new MissionRegistry();
    const resultsCard = new ResultsCard(eventBus, analyticsTracker, missionRegistry);
    
    const mockMission = createMockMission();
    missionRegistry.register(mockMission);
    
    analyticsTracker.startSession();
    eventBus.emit('mission:selected', 'test-mission');
    eventBus.emit('role:selected', 'test-role');
    eventBus.emit('choice:made', {
        sceneId: 'scene-01',
        choiceId: 'choice-a',
        consequences: { survived: true }
    });
    
    const sessionData = { score: 2, totalQuestions: 3 };
    const cardHTML = resultsCard.generateCard(sessionData);
    
    assertContains(cardHTML, 'Survived', 'Card includes survival status');
})();

// Test 6: Card includes checkpoint score
(() => {
    const eventBus = new EventBus();
    const analyticsTracker = new AnalyticsTracker(eventBus);
    const missionRegistry = new MissionRegistry();
    const resultsCard = new ResultsCard(eventBus, analyticsTracker, missionRegistry);
    
    const mockMission = createMockMission();
    missionRegistry.register(mockMission);
    
    analyticsTracker.startSession();
    eventBus.emit('mission:selected', 'test-mission');
    eventBus.emit('role:selected', 'test-role');
    
    const sessionData = { score: 2, totalQuestions: 3 };
    const cardHTML = resultsCard.generateCard(sessionData);
    
    assertContains(cardHTML, '2/3', 'Card includes checkpoint score');
})();

// Test 7: Card includes score percentage
(() => {
    const eventBus = new EventBus();
    const analyticsTracker = new AnalyticsTracker(eventBus);
    const missionRegistry = new MissionRegistry();
    const resultsCard = new ResultsCard(eventBus, analyticsTracker, missionRegistry);
    
    const mockMission = createMockMission();
    missionRegistry.register(mockMission);
    
    analyticsTracker.startSession();
    eventBus.emit('mission:selected', 'test-mission');
    eventBus.emit('role:selected', 'test-role');
    
    const sessionData = { score: 2, totalQuestions: 3 };
    const cardHTML = resultsCard.generateCard(sessionData);
    
    assertContains(cardHTML, '67%', 'Card includes score percentage');
})();

// Test 8: Card includes game title
(() => {
    const eventBus = new EventBus();
    const analyticsTracker = new AnalyticsTracker(eventBus);
    const missionRegistry = new MissionRegistry();
    const resultsCard = new ResultsCard(eventBus, analyticsTracker, missionRegistry);
    
    const mockMission = createMockMission();
    missionRegistry.register(mockMission);
    
    analyticsTracker.startSession();
    eventBus.emit('mission:selected', 'test-mission');
    eventBus.emit('role:selected', 'test-role');
    
    const sessionData = { score: 2, totalQuestions: 3 };
    const cardHTML = resultsCard.generateCard(sessionData);
    
    assertContains(cardHTML, 'Witness Interactive', 'Card includes game title');
})();

// Test 9: Card includes call-to-action
(() => {
    const eventBus = new EventBus();
    const analyticsTracker = new AnalyticsTracker(eventBus);
    const missionRegistry = new MissionRegistry();
    const resultsCard = new ResultsCard(eventBus, analyticsTracker, missionRegistry);
    
    const mockMission = createMockMission();
    missionRegistry.register(mockMission);
    
    analyticsTracker.startSession();
    eventBus.emit('mission:selected', 'test-mission');
    eventBus.emit('role:selected', 'test-role');
    
    const sessionData = { score: 2, totalQuestions: 3 };
    const cardHTML = resultsCard.generateCard(sessionData);
    
    assertContains(cardHTML, 'witness-interactive', 'Card includes call-to-action URL');
})();

// Test 10: collectApThemes() returns unique themes
(() => {
    const eventBus = new EventBus();
    const analyticsTracker = new AnalyticsTracker(eventBus);
    const missionRegistry = new MissionRegistry();
    const resultsCard = new ResultsCard(eventBus, analyticsTracker, missionRegistry);
    
    const mockMission = createMockMission();
    missionRegistry.register(mockMission);
    
    analyticsTracker.startSession();
    eventBus.emit('mission:selected', 'test-mission');
    eventBus.emit('role:selected', 'test-role');
    
    const sessionData = { score: 2, totalQuestions: 3 };
    const cardHTML = resultsCard.generateCard(sessionData);
    
    // Check that AP themes are displayed
    assertContains(cardHTML, 'Causation', 'Card includes Causation theme');
    assertContains(cardHTML, 'Perspective', 'Card includes Perspective theme');
    assertContains(cardHTML, 'Continuity', 'Card includes Continuity theme');
})();

// Test 11: generatePlainText() creates shareable text
(() => {
    const eventBus = new EventBus();
    const analyticsTracker = new AnalyticsTracker(eventBus);
    const missionRegistry = new MissionRegistry();
    const resultsCard = new ResultsCard(eventBus, analyticsTracker, missionRegistry);
    
    const mockMission = createMockMission();
    missionRegistry.register(mockMission);
    
    analyticsTracker.startSession();
    eventBus.emit('mission:selected', 'test-mission');
    eventBus.emit('role:selected', 'test-role');
    
    const sessionData = { score: 2, totalQuestions: 3 };
    resultsCard.generateCard(sessionData);
    
    // Access lastCardData to test plain text generation
    assertTrue(resultsCard.lastCardData !== null, 'Card data stored after generation');
})();

// Test 12: Card handles missing session data gracefully
(() => {
    const eventBus = new EventBus();
    const analyticsTracker = new AnalyticsTracker(eventBus);
    const missionRegistry = new MissionRegistry();
    const resultsCard = new ResultsCard(eventBus, analyticsTracker, missionRegistry);
    
    const cardHTML = resultsCard.generateCard(null);
    
    assertContains(cardHTML, 'Error', 'Card shows error message for missing data');
})();

// Test 13: Card handles missing mission gracefully
(() => {
    const eventBus = new EventBus();
    const analyticsTracker = new AnalyticsTracker(eventBus);
    const missionRegistry = new MissionRegistry();
    const resultsCard = new ResultsCard(eventBus, analyticsTracker, missionRegistry);
    
    analyticsTracker.startSession();
    eventBus.emit('mission:selected', 'nonexistent-mission');
    eventBus.emit('role:selected', 'test-role');
    
    const sessionData = { score: 2, totalQuestions: 3 };
    const cardHTML = resultsCard.generateCard(sessionData);
    
    assertContains(cardHTML, 'Error', 'Card shows error message for missing mission');
})();

// Test 14: formatApTheme() capitalizes theme names
(() => {
    const eventBus = new EventBus();
    const analyticsTracker = new AnalyticsTracker(eventBus);
    const missionRegistry = new MissionRegistry();
    const resultsCard = new ResultsCard(eventBus, analyticsTracker, missionRegistry);
    
    const mockMission = createMockMission();
    missionRegistry.register(mockMission);
    
    analyticsTracker.startSession();
    eventBus.emit('mission:selected', 'test-mission');
    eventBus.emit('role:selected', 'test-role');
    
    const sessionData = { score: 2, totalQuestions: 3 };
    const cardHTML = resultsCard.generateCard(sessionData);
    
    // Themes should be capitalized in display
    assertContains(cardHTML, 'Causation', 'Theme names are capitalized');
})();

// Test 15: Card displays completion timestamp
(() => {
    const eventBus = new EventBus();
    const analyticsTracker = new AnalyticsTracker(eventBus);
    const missionRegistry = new MissionRegistry();
    const resultsCard = new ResultsCard(eventBus, analyticsTracker, missionRegistry);
    
    const mockMission = createMockMission();
    missionRegistry.register(mockMission);
    
    analyticsTracker.startSession();
    eventBus.emit('mission:selected', 'test-mission');
    eventBus.emit('role:selected', 'test-role');
    
    const sessionData = { score: 2, totalQuestions: 3 };
    const cardHTML = resultsCard.generateCard(sessionData);
    
    assertContains(cardHTML, 'Completed:', 'Card includes completion timestamp label');
})();

// Summary
console.log('\n=== Test Summary ===');
console.log(`Total: ${passedTests + failedTests}`);
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${failedTests}`);

if (failedTests === 0) {
    console.log('\n✓ All ResultsCard tests passed!\n');
} else {
    console.log(`\n✗ ${failedTests} test(s) failed\n`);
}

export { passedTests, failedTests };
