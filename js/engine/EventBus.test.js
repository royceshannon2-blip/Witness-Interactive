/**
 * EventBus Manual Test
 * 
 * Simple test to verify EventBus functionality.
 * Run this in the browser console or as a Node.js module.
 */

import EventBus from './EventBus.js';

// Test 1: Basic pub/sub
console.log('Test 1: Basic pub/sub');
const bus = new EventBus();
let testValue = 0;

bus.on('test:event', (data) => {
  testValue = data;
  console.log('✓ Received event with data:', data);
});

bus.emit('test:event', 42);
console.assert(testValue === 42, 'Test 1 failed: testValue should be 42');

// Test 2: Multiple subscribers
console.log('\nTest 2: Multiple subscribers');
let count1 = 0;
let count2 = 0;

const callback1 = () => { count1++; };
const callback2 = () => { count2++; };

bus.on('multi:event', callback1);
bus.on('multi:event', callback2);

bus.emit('multi:event');
console.assert(count1 === 1 && count2 === 1, 'Test 2 failed: both callbacks should be called');
console.log('✓ Both callbacks invoked');

// Test 3: Unsubscribe
console.log('\nTest 3: Unsubscribe');
bus.off('multi:event', callback1);
bus.emit('multi:event');
console.assert(count1 === 1 && count2 === 2, 'Test 3 failed: only callback2 should be called');
console.log('✓ Unsubscribe works correctly');

// Test 4: No subscribers (should not error)
console.log('\nTest 4: Emit with no subscribers');
bus.emit('nonexistent:event', { test: 'data' });
console.log('✓ No error when emitting to event with no subscribers');

// Test 5: Error handling in callbacks
console.log('\nTest 5: Error handling in callbacks');
let errorCallbackRan = false;
let successCallbackRan = false;

bus.on('error:event', () => {
  throw new Error('Intentional error');
});

bus.on('error:event', () => {
  successCallbackRan = true;
});

bus.emit('error:event');
console.assert(successCallbackRan, 'Test 5 failed: second callback should run despite first callback error');
console.log('✓ Error in one callback does not prevent other callbacks from running');

// Test 6: Game-specific events
console.log('\nTest 6: Game-specific events');
let missionId = null;
let roleId = null;

bus.on('mission:selected', (data) => {
  missionId = data;
});

bus.on('role:selected', (data) => {
  roleId = data;
});

bus.emit('mission:selected', 'pearl-harbor');
bus.emit('role:selected', 'japanese-aviator');

console.assert(missionId === 'pearl-harbor', 'Test 6 failed: mission should be pearl-harbor');
console.assert(roleId === 'japanese-aviator', 'Test 6 failed: role should be japanese-aviator');
console.log('✓ Game-specific events work correctly');

console.log('\n✅ All EventBus tests passed!');
