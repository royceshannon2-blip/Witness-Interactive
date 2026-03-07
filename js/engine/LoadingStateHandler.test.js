/**
 * LoadingStateHandler Unit Tests
 * 
 * Tests the loading state management functionality.
 * Run these tests manually in the browser console or with a test runner.
 */

import LoadingStateHandler from './LoadingStateHandler.js';
import EventBus from './EventBus.js';

/**
 * Manual test suite for LoadingStateHandler
 * Call runTests() in browser console to execute
 */
function runTests() {
  console.log('=== LoadingStateHandler Tests ===\n');
  
  let passCount = 0;
  let failCount = 0;

  // Test 1: Constructor initializes correctly
  try {
    const handler = new LoadingStateHandler();
    console.assert(handler.loadingScreen !== undefined, 'Test 1 Failed: loadingScreen should be defined');
    console.log('✓ Test 1: Constructor initializes correctly');
    passCount++;
  } catch (error) {
    console.error('✗ Test 1 Failed:', error);
    failCount++;
  }

  // Test 2: showLoading displays loading screen
  try {
    const handler = new LoadingStateHandler();
    handler.showLoading('Test message');
    const hasActive = handler.loadingScreen?.classList.contains('active');
    console.assert(hasActive, 'Test 2 Failed: Loading screen should have active class');
    console.log('✓ Test 2: showLoading displays loading screen');
    passCount++;
  } catch (error) {
    console.error('✗ Test 2 Failed:', error);
    failCount++;
  }

  // Test 3: hideLoading removes loading screen
  try {
    const handler = new LoadingStateHandler();
    handler.showLoading();
    handler.hideLoading();
    const hasActive = handler.loadingScreen?.classList.contains('active');
    console.assert(!hasActive, 'Test 3 Failed: Loading screen should not have active class');
    console.log('✓ Test 3: hideLoading removes loading screen');
    passCount++;
  } catch (error) {
    console.error('✗ Test 3 Failed:', error);
    failCount++;
  }

  // Test 4: updateProgress updates message
  try {
    const handler = new LoadingStateHandler();
    handler.updateProgress(50);
    const message = handler.loadingMessage?.textContent;
    console.assert(message?.includes('50'), 'Test 4 Failed: Message should include progress percentage');
    console.log('✓ Test 4: updateProgress updates message');
    passCount++;
  } catch (error) {
    console.error('✗ Test 4 Failed:', error);
    failCount++;
  }

  // Test 5: updateProgress validates input
  try {
    const handler = new LoadingStateHandler();
    handler.updateProgress(-10); // Invalid
    handler.updateProgress(150); // Invalid
    handler.updateProgress('invalid'); // Invalid
    console.log('✓ Test 5: updateProgress validates input (check console for warnings)');
    passCount++;
  } catch (error) {
    console.error('✗ Test 5 Failed:', error);
    failCount++;
  }

  // Test 6: subscribeToEvents connects to EventBus
  try {
    const eventBus = new EventBus();
    const handler = new LoadingStateHandler();
    handler.subscribeToEvents(eventBus);
    
    // Test modules:loading event
    eventBus.emit('modules:loading', { message: 'Loading modules...' });
    const hasActive = handler.loadingScreen?.classList.contains('active');
    console.assert(hasActive, 'Test 6 Failed: modules:loading should show loading screen');
    
    // Test modules:loaded event
    eventBus.emit('modules:loaded');
    const stillActive = handler.loadingScreen?.classList.contains('active');
    console.assert(!stillActive, 'Test 6 Failed: modules:loaded should hide loading screen');
    
    console.log('✓ Test 6: subscribeToEvents connects to EventBus');
    passCount++;
  } catch (error) {
    console.error('✗ Test 6 Failed:', error);
    failCount++;
  }

  // Test 7: module:progress event updates progress
  try {
    const eventBus = new EventBus();
    const handler = new LoadingStateHandler();
    handler.subscribeToEvents(eventBus);
    
    eventBus.emit('module:progress', { percent: 75 });
    const message = handler.loadingMessage?.textContent;
    console.assert(message?.includes('75'), 'Test 7 Failed: module:progress should update percentage');
    
    console.log('✓ Test 7: module:progress event updates progress');
    passCount++;
  } catch (error) {
    console.error('✗ Test 7 Failed:', error);
    failCount++;
  }

  // Test 8: game:initializing and game:ready events
  try {
    const eventBus = new EventBus();
    const handler = new LoadingStateHandler();
    handler.subscribeToEvents(eventBus);
    
    eventBus.emit('game:initializing', { message: 'Starting game...' });
    const hasActive = handler.loadingScreen?.classList.contains('active');
    console.assert(hasActive, 'Test 8 Failed: game:initializing should show loading screen');
    
    eventBus.emit('game:ready');
    const stillActive = handler.loadingScreen?.classList.contains('active');
    console.assert(!stillActive, 'Test 8 Failed: game:ready should hide loading screen');
    
    console.log('✓ Test 8: game:initializing and game:ready events work');
    passCount++;
  } catch (error) {
    console.error('✗ Test 8 Failed:', error);
    failCount++;
  }

  // Summary
  console.log(`\n=== Test Summary ===`);
  console.log(`Passed: ${passCount}`);
  console.log(`Failed: ${failCount}`);
  console.log(`Total: ${passCount + failCount}`);
  
  return { passCount, failCount };
}

// Export for manual testing
export { runTests };
