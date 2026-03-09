/**
 * SceneTransition Tests
 * 
 * Verifies scene transition functionality:
 * - Fade transition animation
 * - Flash transition animation
 * - Instant transition (prefers-reduced-motion)
 * - Input blocking during transitions
 * - EventBus integration
 * - Cleanup on scene transitions
 * 
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 7.1, 8.1
 */

import SceneTransition from './SceneTransition.js';
import EventBus from './EventBus.js';

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
 * Test helper: Assert falsy
 */
function assertFalse(value, message) {
    if (!value) {
        console.log(`✓ ${message}`);
        passedTests++;
        return true;
    } else {
        console.error(`✗ ${message}`);
        console.error(`  Expected falsy value, got: ${value}`);
        failedTests++;
        return false;
    }
}

console.log('\n=== SceneTransition Tests ===\n');

// Test 1: SceneTransition initializes with default config
(() => {
    const eventBus = new EventBus();
    const transition = new SceneTransition(eventBus);
    
    assertEqual(transition.config.defaultType, 'fade', 'Default type is fade');
    assertEqual(transition.config.duration, 500, 'Default duration is 500ms');
    assertEqual(transition.config.respectMotionPrefs, true, 'Respects motion preferences by default');
    assertFalse(transition.isActive(), 'Not active initially');
    
    transition.cleanup();
})();

// Test 2: SceneTransition accepts custom config
(() => {
    const eventBus = new EventBus();
    const transition = new SceneTransition(eventBus, {
        defaultType: 'flash',
        duration: 1000,
        respectMotionPrefs: false
    });
    
    assertEqual(transition.config.defaultType, 'flash', 'Custom type applied');
    assertEqual(transition.config.duration, 1000, 'Custom duration applied');
    assertEqual(transition.config.respectMotionPrefs, false, 'Motion preferences disabled');
    
    transition.cleanup();
})();

// Test 3: transition() marks as active
(() => {
    const eventBus = new EventBus();
    const transition = new SceneTransition(eventBus, { respectMotionPrefs: false });
    
    transition.transition(null, null, 'fade', 500);
    
    assertTrue(transition.isActive(), 'Transition marked as active');
    
    transition.cleanup();
})();

// Test 4: transition() blocks user input
(() => {
    const eventBus = new EventBus();
    const transition = new SceneTransition(eventBus, { respectMotionPrefs: false });
    
    transition.transition(null, null, 'fade', 500);
    
    assertTrue(transition.container.classList.contains('transition-active'), 'Input blocked during transition');
    
    transition.cleanup();
})();

// Test 5: transition() emits transition:start event
(() => {
    const eventBus = new EventBus();
    const transition = new SceneTransition(eventBus, { respectMotionPrefs: false });
    
    let startEventData = null;
    eventBus.on('transition:start', (data) => {
        startEventData = data;
    });
    
    transition.transition(null, null, 'fade', 500);
    
    assertTrue(startEventData !== null, 'transition:start event emitted');
    assertEqual(startEventData.type, 'fade', 'Event includes transition type');
    assertEqual(startEventData.duration, 500, 'Event includes duration');
    
    transition.cleanup();
})();

// Test 6: Fade transition applies correct CSS classes
(() => {
    const eventBus = new EventBus();
    const transition = new SceneTransition(eventBus, { respectMotionPrefs: false });
    
    transition.transition(null, null, 'fade', 500);
    
    // Should start with fade-out
    setTimeout(() => {
        assertTrue(
            transition.container.classList.contains('scene-transition-fade-out'),
            'Fade-out class applied initially'
        );
        
        transition.cleanup();
    }, 50);
})();

// Test 7: Flash transition applies correct CSS class
(() => {
    const eventBus = new EventBus();
    const transition = new SceneTransition(eventBus, { respectMotionPrefs: false });
    
    transition.transition(null, null, 'flash', 500);
    
    setTimeout(() => {
        assertTrue(
            transition.container.classList.contains('scene-transition-flash'),
            'Flash class applied'
        );
        
        transition.cleanup();
    }, 50);
})();

// Test 8: Instant transition (type: none) completes immediately
(() => {
    const eventBus = new EventBus();
    const transition = new SceneTransition(eventBus);
    
    let completed = false;
    eventBus.on('transition:complete', () => {
        completed = true;
    });
    
    transition.transition(null, null, 'none', 500);
    
    setTimeout(() => {
        assertTrue(completed, 'Instant transition completes immediately');
        assertFalse(transition.isActive(), 'Not active after instant transition');
    }, 10);
})();

// Test 9: prefers-reduced-motion forces instant transition
(() => {
    const eventBus = new EventBus();
    const transition = new SceneTransition(eventBus, { respectMotionPrefs: true });
    transition.prefersReducedMotion = true; // Override for testing
    
    let completed = false;
    eventBus.on('transition:complete', () => {
        completed = true;
    });
    
    transition.transition(null, null, 'fade', 500);
    
    setTimeout(() => {
        assertTrue(completed, 'Reduced motion forces instant transition');
        assertFalse(transition.isActive(), 'Not active after reduced motion transition');
    }, 10);
})();

// Test 10: transition() emits transition:complete event
(() => {
    const eventBus = new EventBus();
    const transition = new SceneTransition(eventBus);
    
    let completed = false;
    eventBus.on('transition:complete', () => {
        completed = true;
    });
    
    transition.transition(null, null, 'none', 500);
    
    setTimeout(() => {
        assertTrue(completed, 'transition:complete event emitted');
    }, 10);
})();

// Test 11: complete() unblocks user input
(() => {
    const eventBus = new EventBus();
    const transition = new SceneTransition(eventBus, { respectMotionPrefs: false });
    
    transition.transition(null, null, 'fade', 500);
    assertTrue(transition.container.classList.contains('transition-active'), 'Input blocked initially');
    
    setTimeout(() => {
        transition.complete();
        assertFalse(
            transition.container.classList.contains('transition-active'),
            'Input unblocked after completion'
        );
    }, 10);
})();

// Test 12: complete() removes all transition classes
(() => {
    const eventBus = new EventBus();
    const transition = new SceneTransition(eventBus, { respectMotionPrefs: false });
    
    transition.transition(null, null, 'fade', 500);
    
    setTimeout(() => {
        transition.complete();
        
        assertFalse(
            transition.container.classList.contains('scene-transition-fade-out'),
            'Fade-out class removed'
        );
        assertFalse(
            transition.container.classList.contains('scene-transition-fade-in'),
            'Fade-in class removed'
        );
        assertFalse(
            transition.container.classList.contains('scene-transition-flash'),
            'Flash class removed'
        );
    }, 10);
})();

// Test 13: complete() marks as inactive
(() => {
    const eventBus = new EventBus();
    const transition = new SceneTransition(eventBus, { respectMotionPrefs: false });
    
    transition.transition(null, null, 'fade', 500);
    assertTrue(transition.isActive(), 'Active during transition');
    
    setTimeout(() => {
        transition.complete();
        assertFalse(transition.isActive(), 'Inactive after completion');
    }, 10);
})();

// Test 14: cleanup() cancels timeout
(() => {
    const eventBus = new EventBus();
    const transition = new SceneTransition(eventBus, { respectMotionPrefs: false });
    
    transition.transition(null, null, 'fade', 500);
    assertTrue(transition.timeoutId !== null, 'Timeout ID stored');
    
    transition.cleanup();
    
    assertEqual(transition.timeoutId, null, 'Timeout cancelled');
    assertFalse(transition.isActive(), 'Inactive after cleanup');
})();

// Test 15: cleanup() removes all classes
(() => {
    const eventBus = new EventBus();
    const transition = new SceneTransition(eventBus, { respectMotionPrefs: false });
    
    transition.transition(null, null, 'fade', 500);
    
    setTimeout(() => {
        transition.cleanup();
        
        assertFalse(
            transition.container.classList.contains('scene-transition-fade-out'),
            'Fade-out class removed by cleanup'
        );
        assertFalse(
            transition.container.classList.contains('transition-active'),
            'Input blocking removed by cleanup'
        );
    }, 10);
})();

// Test 16: Multiple transition() calls cleanup previous transition
(() => {
    const eventBus = new EventBus();
    const transition = new SceneTransition(eventBus, { respectMotionPrefs: false });
    
    transition.transition(null, null, 'fade', 500);
    const firstTimeoutId = transition.timeoutId;
    
    setTimeout(() => {
        transition.transition(null, null, 'flash', 500);
        
        assertTrue(transition.timeoutId !== firstTimeoutId, 'New timeout started');
        assertTrue(transition.isActive(), 'New transition active');
        
        transition.cleanup();
    }, 10);
})();

// Test 17: EventBus integration - scene:transition event triggers transition
(() => {
    const eventBus = new EventBus();
    const transition = new SceneTransition(eventBus, { respectMotionPrefs: false });
    
    let startEventReceived = false;
    eventBus.on('transition:start', () => {
        startEventReceived = true;
    });
    
    // Emit scene:transition event
    eventBus.emit('scene:transition', { transitionType: 'fade' });
    
    setTimeout(() => {
        assertTrue(startEventReceived, 'Transition triggered by scene:transition event');
        assertTrue(transition.isActive(), 'Transition active after event');
        
        transition.cleanup();
    }, 10);
})();

// Test 18: EventBus integration - custom transition type from event data
(() => {
    const eventBus = new EventBus();
    const transition = new SceneTransition(eventBus, { respectMotionPrefs: false });
    
    let transitionType = null;
    eventBus.on('transition:start', (data) => {
        transitionType = data.type;
    });
    
    // Emit scene:transition with custom type
    eventBus.emit('scene:transition', { transitionType: 'flash' });
    
    setTimeout(() => {
        assertEqual(transitionType, 'flash', 'Custom transition type from event data');
        
        transition.cleanup();
    }, 10);
})();

// Test 19: EventBus integration - custom duration from event data
(() => {
    const eventBus = new EventBus();
    const transition = new SceneTransition(eventBus, { respectMotionPrefs: false });
    
    let transitionDuration = null;
    eventBus.on('transition:start', (data) => {
        transitionDuration = data.duration;
    });
    
    // Emit scene:transition with custom duration
    eventBus.emit('scene:transition', { transitionDuration: 1000 });
    
    setTimeout(() => {
        assertEqual(transitionDuration, 1000, 'Custom duration from event data');
        
        transition.cleanup();
    }, 10);
})();

// Test 20: Unknown transition type falls back to instant
(() => {
    const eventBus = new EventBus();
    const transition = new SceneTransition(eventBus);
    
    let completed = false;
    eventBus.on('transition:complete', () => {
        completed = true;
    });
    
    transition.transition(null, null, 'unknown-type', 500);
    
    setTimeout(() => {
        assertTrue(completed, 'Unknown type falls back to instant transition');
        assertFalse(transition.isActive(), 'Not active after fallback');
    }, 10);
})();

// Test 21: isActive() returns correct state
(() => {
    const eventBus = new EventBus();
    const transition = new SceneTransition(eventBus, { respectMotionPrefs: false });
    
    assertFalse(transition.isActive(), 'Not active initially');
    
    transition.transition(null, null, 'fade', 500);
    assertTrue(transition.isActive(), 'Active during transition');
    
    setTimeout(() => {
        transition.complete();
        assertFalse(transition.isActive(), 'Not active after completion');
    }, 10);
})();

// Test 22: Fade transition switches from fade-out to fade-in
(() => {
    const eventBus = new EventBus();
    const transition = new SceneTransition(eventBus, { respectMotionPrefs: false });
    
    transition.transition(null, null, 'fade', 500);
    
    // Check fade-out initially
    setTimeout(() => {
        assertTrue(
            transition.container.classList.contains('scene-transition-fade-out'),
            'Fade-out class present initially'
        );
        
        // Check fade-in after half duration
        setTimeout(() => {
            assertFalse(
                transition.container.classList.contains('scene-transition-fade-out'),
                'Fade-out class removed'
            );
            assertTrue(
                transition.container.classList.contains('scene-transition-fade-in'),
                'Fade-in class added'
            );
            
            transition.cleanup();
        }, 300); // After half duration (250ms) + buffer
    }, 50);
})();

// Test 23: Fade transition completes and cleans up
(() => {
    const eventBus = new EventBus();
    const transition = new SceneTransition(eventBus, { respectMotionPrefs: false });
    
    let completed = false;
    eventBus.on('transition:complete', () => {
        completed = true;
    });
    
    transition.transition(null, null, 'fade', 500);
    
    // Wait for full duration
    setTimeout(() => {
        assertTrue(completed, 'Fade transition completes');
        assertFalse(transition.isActive(), 'Not active after fade completion');
        assertFalse(
            transition.container.classList.contains('scene-transition-fade-in'),
            'Fade-in class removed after completion'
        );
    }, 600); // Full duration + buffer
})();

// Test 24: Flash transition completes and cleans up
(() => {
    const eventBus = new EventBus();
    const transition = new SceneTransition(eventBus, { respectMotionPrefs: false });
    
    let completed = false;
    eventBus.on('transition:complete', () => {
        completed = true;
    });
    
    transition.transition(null, null, 'flash', 500);
    
    // Wait for full duration
    setTimeout(() => {
        assertTrue(completed, 'Flash transition completes');
        assertFalse(transition.isActive(), 'Not active after flash completion');
        assertFalse(
            transition.container.classList.contains('scene-transition-flash'),
            'Flash class removed after completion'
        );
    }, 600); // Full duration + buffer
})();

// Wait for all async tests to complete before showing summary
setTimeout(() => {
    console.log('\n=== Test Summary ===');
    console.log(`Total: ${passedTests + failedTests}`);
    console.log(`Passed: ${passedTests}`);
    console.log(`Failed: ${failedTests}`);

    if (failedTests === 0) {
        console.log('\n✓ All SceneTransition tests passed!\n');
    } else {
        console.log(`\n✗ ${failedTests} test(s) failed\n`);
    }
}, 1000); // Wait 1000ms for all async tests to complete (including fade/flash tests)

export { passedTests, failedTests };
