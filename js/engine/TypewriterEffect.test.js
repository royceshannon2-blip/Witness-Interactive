/**
 * TypewriterEffect Tests
 * 
 * Verifies character-by-character text reveal functionality:
 * - Text reveals sequentially at configured speed
 * - Click-to-skip functionality
 * - prefers-reduced-motion accessibility
 * - EventBus integration
 * - Cleanup on scene transitions
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 7.1, 8.1
 */

import TypewriterEffect from './TypewriterEffect.js';
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

console.log('\n=== TypewriterEffect Tests ===\n');

// Test 1: TypewriterEffect initializes with default config
(() => {
    const eventBus = new EventBus();
    const typewriter = new TypewriterEffect(eventBus);
    
    assertEqual(typewriter.config.defaultSpeed, 30, 'Default speed is 30ms');
    assertEqual(typewriter.config.skipOnClick, true, 'Skip on click enabled by default');
    assertEqual(typewriter.config.respectMotionPrefs, true, 'Respects motion preferences by default');
    assertFalse(typewriter.isActive(), 'Not active initially');
    
    typewriter.cleanup();
})();

// Test 2: TypewriterEffect accepts custom config
(() => {
    const eventBus = new EventBus();
    const typewriter = new TypewriterEffect(eventBus, {
        defaultSpeed: 50,
        skipOnClick: false,
        respectMotionPrefs: false
    });
    
    assertEqual(typewriter.config.defaultSpeed, 50, 'Custom speed applied');
    assertEqual(typewriter.config.skipOnClick, false, 'Skip on click disabled');
    assertEqual(typewriter.config.respectMotionPrefs, false, 'Motion preferences disabled');
    
    typewriter.cleanup();
})();

// Test 3: revealText marks animation as active
(() => {
    const eventBus = new EventBus();
    const typewriter = new TypewriterEffect(eventBus, { respectMotionPrefs: false });
    const element = document.createElement('div');
    
    typewriter.revealText(element, 'Test text', 30, () => {});
    
    assertTrue(typewriter.isActive(), 'Animation marked as active');
    
    typewriter.cleanup();
})();

// Test 4: revealText clears element content before starting
(() => {
    const eventBus = new EventBus();
    const typewriter = new TypewriterEffect(eventBus, { respectMotionPrefs: false });
    const element = document.createElement('div');
    element.textContent = 'Old content';
    
    typewriter.revealText(element, 'New text', 30, () => {});
    
    assertEqual(element.textContent, '', 'Element content cleared');
    
    typewriter.cleanup();
})();

// Test 5: revealText completes and shows full text
(() => {
    const eventBus = new EventBus();
    const typewriter = new TypewriterEffect(eventBus, { respectMotionPrefs: false });
    const element = document.createElement('div');
    const text = 'Hi';
    
    let completed = false;
    typewriter.revealText(element, text, 5, () => {
        completed = true;
    });
    
    // Wait for animation to complete
    setTimeout(() => {
        assertEqual(element.textContent, text, 'Full text revealed');
        assertTrue(completed, 'Completion callback called');
        assertFalse(typewriter.isActive(), 'Animation no longer active');
    }, 100);
})();

// Test 6: skipToEnd shows full text immediately
(() => {
    const eventBus = new EventBus();
    const typewriter = new TypewriterEffect(eventBus, { respectMotionPrefs: false });
    const element = document.createElement('div');
    const text = 'Long text that would take time';
    
    let completed = false;
    typewriter.revealText(element, text, 30, () => {
        completed = true;
    });
    
    // Skip immediately
    setTimeout(() => {
        typewriter.skipToEnd();
        
        assertEqual(element.textContent, text, 'Full text shown after skip');
        assertTrue(completed, 'Completion callback called after skip');
        assertFalse(typewriter.isActive(), 'Animation inactive after skip');
    }, 10);
})();

// Test 7: skipToEnd emits typewriter:skipped event
(() => {
    const eventBus = new EventBus();
    const typewriter = new TypewriterEffect(eventBus, { respectMotionPrefs: false });
    const element = document.createElement('div');
    
    let skipped = false;
    eventBus.on('typewriter:skipped', () => {
        skipped = true;
    });
    
    typewriter.revealText(element, 'Test', 30, () => {});
    
    setTimeout(() => {
        typewriter.skipToEnd();
        assertTrue(skipped, 'typewriter:skipped event emitted');
    }, 10);
})();

// Test 8: Emits typewriter:complete event on completion
(() => {
    const eventBus = new EventBus();
    const typewriter = new TypewriterEffect(eventBus, { respectMotionPrefs: false });
    const element = document.createElement('div');
    
    let completed = false;
    eventBus.on('typewriter:complete', () => {
        completed = true;
    });
    
    typewriter.revealText(element, 'Hi', 5, () => {});
    
    setTimeout(() => {
        assertTrue(completed, 'typewriter:complete event emitted');
    }, 100);
})();

// Test 9: Cleanup on scene:transition event
(() => {
    const eventBus = new EventBus();
    const typewriter = new TypewriterEffect(eventBus, { respectMotionPrefs: false });
    const element = document.createElement('div');
    
    typewriter.revealText(element, 'Test text', 30, () => {});
    assertTrue(typewriter.isActive(), 'Animation active before transition');
    
    // Emit scene transition
    eventBus.emit('scene:transition');
    
    setTimeout(() => {
        assertFalse(typewriter.isActive(), 'Animation cleaned up after transition');
    }, 10);
})();

// Test 10: skipToEnd does nothing if not active
(() => {
    const eventBus = new EventBus();
    const typewriter = new TypewriterEffect(eventBus);
    
    // Should not throw error
    try {
        typewriter.skipToEnd();
        assertTrue(true, 'skipToEnd safe when not active');
    } catch (error) {
        assertFalse(true, 'skipToEnd should not throw when not active');
    }
})();

// Test 11: isActive returns correct state
(() => {
    const eventBus = new EventBus();
    const typewriter = new TypewriterEffect(eventBus, { respectMotionPrefs: false });
    const element = document.createElement('div');
    
    assertFalse(typewriter.isActive(), 'Not active initially');
    
    typewriter.revealText(element, 'Test', 30, () => {});
    assertTrue(typewriter.isActive(), 'Active during animation');
    
    setTimeout(() => {
        typewriter.skipToEnd();
        assertFalse(typewriter.isActive(), 'Not active after completion');
    }, 10);
})();

// Test 12: Cleanup cancels animation frame
(() => {
    const eventBus = new EventBus();
    const typewriter = new TypewriterEffect(eventBus, { respectMotionPrefs: false });
    const element = document.createElement('div');
    
    typewriter.revealText(element, 'Test text', 30, () => {});
    assertTrue(typewriter.animationId !== null, 'Animation frame ID stored');
    
    typewriter.cleanup();
    
    setTimeout(() => {
        assertEqual(typewriter.animationId, null, 'Animation frame cancelled');
        assertFalse(typewriter.isActive(), 'Animation inactive after cleanup');
    }, 10);
})();

// Summary
console.log('\n=== Test Summary ===');
console.log(`Total: ${passedTests + failedTests}`);
console.log(`Passed: ${passedTests}`);
console.log(`Failed: ${failedTests}`);

if (failedTests === 0) {
    console.log('\n✓ All TypewriterEffect tests passed!\n');
} else {
    console.log(`\n✗ ${failedTests} test(s) failed\n`);
}

export { passedTests, failedTests };
