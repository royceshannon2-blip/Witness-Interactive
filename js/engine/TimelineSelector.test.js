/**
 * TimelineSelector Tests
 * 
 * Tests for the TimelineSelector component that renders the interactive
 * historical timeline for mission selection.
 * 
 * Requirements: 3A.1, 3A.2, 3A.3, 3A.4, 3A.5, 3A.6, 3A.7, 3A.9, 3A.10
 */

import EventBus from './EventBus.js';
import MissionRegistry from '../content/MissionRegistry.js';
import TimelineSelector from './TimelineSelector.js';

// Test suite
console.log('\n=== TimelineSelector Tests ===\n');

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`✓ ${testName}`);
    testsPassed++;
  } else {
    console.error(`✗ ${testName}`);
    testsFailed++;
  }
}

// Test 1: TimelineSelector instantiation
try {
  const eventBus = new EventBus();
  const missionRegistry = new MissionRegistry();
  const timelineSelector = new TimelineSelector(eventBus, missionRegistry);
  
  assert(
    timelineSelector !== null && timelineSelector !== undefined,
    'TimelineSelector instantiates successfully'
  );
  
  assert(
    timelineSelector.eventBus === eventBus,
    'TimelineSelector stores EventBus reference'
  );
  
  assert(
    timelineSelector.missionRegistry === missionRegistry,
    'TimelineSelector stores MissionRegistry reference'
  );
} catch (error) {
  console.error('✗ TimelineSelector instantiation failed:', error);
  testsFailed += 3;
}

// Test 2: Timeline rendering with missions
try {
  const eventBus = new EventBus();
  const missionRegistry = new MissionRegistry();
  const timelineSelector = new TimelineSelector(eventBus, missionRegistry);
  
  // Register test missions
  missionRegistry.register({
    id: 'test-mission-1',
    title: 'Test Mission 1',
    historicalDate: '1941-12-07',
    era: 'Modern',
    unlocked: true,
    teaser: 'Test teaser 1',
    roles: []
  });
  
  missionRegistry.register({
    id: 'test-mission-2',
    title: 'Test Mission 2',
    historicalDate: '1945-08-06',
    era: 'Modern',
    unlocked: false,
    teaser: 'Test teaser 2',
    roles: []
  });
  
  // Create container
  const container = document.createElement('div');
  container.id = 'test-timeline-container';
  document.body.appendChild(container);
  
  // Render timeline
  timelineSelector.render(container);
  
  assert(
    container.querySelector('.timeline-wrapper') !== null,
    'Timeline wrapper is rendered'
  );
  
  assert(
    container.querySelector('.timeline-track') !== null,
    'Timeline track is rendered'
  );
  
  const nodes = container.querySelectorAll('.timeline-node');
  assert(
    nodes.length === 2,
    'Correct number of timeline nodes rendered'
  );
  
  const unlockedNodes = container.querySelectorAll('.timeline-node.unlocked');
  assert(
    unlockedNodes.length === 1,
    'Unlocked mission node has correct class'
  );
  
  const lockedNodes = container.querySelectorAll('.timeline-node.locked');
  assert(
    lockedNodes.length === 1,
    'Locked mission node has correct class'
  );
  
  // Cleanup
  document.body.removeChild(container);
} catch (error) {
  console.error('✗ Timeline rendering test failed:', error);
  testsFailed += 6;
}

// Test 3: Mission click handling
try {
  const eventBus = new EventBus();
  const missionRegistry = new MissionRegistry();
  const timelineSelector = new TimelineSelector(eventBus, missionRegistry);
  
  let missionSelectedEmitted = false;
  let selectedMissionId = null;
  
  eventBus.on('mission:selected', (data) => {
    missionSelectedEmitted = true;
    selectedMissionId = data.missionId;
  });
  
  // Test unlocked mission click
  timelineSelector.onNodeClick('test-mission', true);
  
  assert(
    missionSelectedEmitted === true,
    'Clicking unlocked mission emits mission:selected event'
  );
  
  assert(
    selectedMissionId === 'test-mission',
    'mission:selected event contains correct missionId'
  );
} catch (error) {
  console.error('✗ Mission click handling test failed:', error);
  testsFailed += 2;
}

// Test 4: Locked mission click handling
try {
  const eventBus = new EventBus();
  const missionRegistry = new MissionRegistry();
  const timelineSelector = new TimelineSelector(eventBus, missionRegistry);
  
  let missionSelectedEmitted = false;
  
  eventBus.on('mission:selected', () => {
    missionSelectedEmitted = true;
  });
  
  // Test locked mission click
  timelineSelector.onNodeClick('locked-mission', false);
  
  assert(
    missionSelectedEmitted === false,
    'Clicking locked mission does not emit mission:selected event'
  );
  
  // Check if coming soon message was created
  const comingSoonMessage = document.querySelector('.coming-soon-message');
  assert(
    comingSoonMessage !== null,
    'Clicking locked mission shows coming soon message'
  );
  
  // Cleanup
  if (comingSoonMessage) {
    comingSoonMessage.remove();
  }
} catch (error) {
  console.error('✗ Locked mission click test failed:', error);
  testsFailed += 2;
}

// Test 5: Date formatting
try {
  const eventBus = new EventBus();
  const missionRegistry = new MissionRegistry();
  const timelineSelector = new TimelineSelector(eventBus, missionRegistry);
  
  const formatted = timelineSelector.formatDate('1941-12-07');
  
  assert(
    formatted.includes('1941') && formatted.includes('Dec'),
    'Date formatting works correctly'
  );
} catch (error) {
  console.error('✗ Date formatting test failed:', error);
  testsFailed++;
}

// Test 6: Mission sorting by date
try {
  const eventBus = new EventBus();
  const missionRegistry = new MissionRegistry();
  const timelineSelector = new TimelineSelector(eventBus, missionRegistry);
  
  const missions = [
    { id: 'm3', historicalDate: '1945-08-06', title: 'Later' },
    { id: 'm1', historicalDate: '1941-12-07', title: 'Earlier' },
    { id: 'm2', historicalDate: '1944-06-06', title: 'Middle' }
  ];
  
  const sorted = timelineSelector.sortMissionsByDate(missions);
  
  assert(
    sorted[0].id === 'm1' && sorted[1].id === 'm2' && sorted[2].id === 'm3',
    'Missions are sorted chronologically by date'
  );
} catch (error) {
  console.error('✗ Mission sorting test failed:', error);
  testsFailed++;
}

// Test 7: Tooltip display
try {
  const eventBus = new EventBus();
  const missionRegistry = new MissionRegistry();
  const timelineSelector = new TimelineSelector(eventBus, missionRegistry);
  
  missionRegistry.register({
    id: 'tooltip-test',
    title: 'Tooltip Test Mission',
    historicalDate: '1941-12-07',
    era: 'Modern',
    unlocked: true,
    teaser: 'This is a test teaser',
    roles: []
  });
  
  // Create mock event
  const mockEvent = {
    clientX: 100,
    clientY: 100
  };
  
  timelineSelector.showTooltip('tooltip-test', mockEvent);
  
  const tooltip = document.querySelector('.timeline-tooltip');
  assert(
    tooltip !== null,
    'Tooltip is created when hovering over mission node'
  );
  
  if (tooltip) {
    assert(
      tooltip.textContent.includes('Tooltip Test Mission'),
      'Tooltip displays mission title'
    );
    
    assert(
      tooltip.textContent.includes('This is a test teaser'),
      'Tooltip displays mission teaser'
    );
    
    // Cleanup
    tooltip.remove();
  } else {
    testsFailed += 2;
  }
} catch (error) {
  console.error('✗ Tooltip display test failed:', error);
  testsFailed += 3;
}

// Test 8: Keyboard accessibility
try {
  const eventBus = new EventBus();
  const missionRegistry = new MissionRegistry();
  const timelineSelector = new TimelineSelector(eventBus, missionRegistry);
  
  missionRegistry.register({
    id: 'keyboard-test',
    title: 'Keyboard Test',
    historicalDate: '1941-12-07',
    era: 'Modern',
    unlocked: true,
    teaser: 'Test',
    roles: []
  });
  
  const container = document.createElement('div');
  document.body.appendChild(container);
  
  timelineSelector.render(container);
  
  const node = container.querySelector('.timeline-node');
  
  assert(
    node.getAttribute('tabindex') === '0',
    'Timeline nodes are keyboard focusable'
  );
  
  assert(
    node.getAttribute('role') === 'button',
    'Timeline nodes have button role for accessibility'
  );
  
  assert(
    node.getAttribute('aria-label') !== null,
    'Timeline nodes have ARIA labels'
  );
  
  // Cleanup
  document.body.removeChild(container);
} catch (error) {
  console.error('✗ Keyboard accessibility test failed:', error);
  testsFailed += 3;
}

// Summary
console.log('\n=== Test Summary ===');
console.log(`Passed: ${testsPassed}`);
console.log(`Failed: ${testsFailed}`);
console.log(`Total: ${testsPassed + testsFailed}`);

if (testsFailed === 0) {
  console.log('\n✓ All TimelineSelector tests passed!\n');
} else {
  console.error(`\n✗ ${testsFailed} test(s) failed\n`);
}

export { testsPassed, testsFailed };
