# Phase 1 Checkpoint - Manual Testing Instructions

## Overview

Phase 1 implements the core interactive polish features:
- TypewriterEffect (character-by-character text reveal)
- SceneTransition (smooth fade/flash between scenes)
- Enhanced Choice Interactions (hover effects, keyboard navigation)

## Testing Instructions

### Step 1: Start Local Server

```bash
python -m http.server 8000
```

Or use any local server of your choice.

### Step 2: Open Test Page

Navigate to: `http://localhost:8000/test-phase1-checkpoint.html`

### Step 3: Run All Tests

**Test 1: TypewriterEffect**
1. Click "Start Typewriter Test"
2. Watch text appear character-by-character
3. Click "Skip Animation" mid-animation
4. Verify text appears instantly
5. Status should show "PASS"

**Test 2: SceneTransition**
1. Click "Test Fade Transition"
2. Watch screen fade out and back in
3. Click "Test Flash Transition"
4. Watch screen flash white
5. Status should show "PASS"

**Test 3: Enhanced Choice Interactions**
1. Hover over choice buttons
2. Verify scale and shadow effects
3. Press Tab to navigate between buttons
4. Press Enter to select
5. On mobile, tap buttons to see active state
6. Status should show "PASS" after clicking any button

**Test 4: Prefers-Reduced-Motion**
1. Click "Check Motion Preference"
2. Note current setting
3. Open DevTools → Rendering → Emulate "prefers-reduced-motion: reduce"
4. Run Test 1 and Test 2 again
5. Verify animations are instant/minimal
6. Status should show "PASS"

**Test 5: EventBus Integration**
1. Click "Run EventBus Test"
2. Run Test 1 (typewriter)
3. Run Test 2 (transitions)
4. Click "Run EventBus Test" again
5. Verify events were received
6. Status should show "PASS"

**Test 6: No Global Variables**
1. Click "Check Global Variables"
2. Verify no engine globals detected
3. Status should show "PASS"

**Test 7: Mobile Responsiveness**
1. Click "Check Viewport"
2. Note current viewport size
3. Open DevTools → Toggle device toolbar
4. Select iPhone or Android device
5. Test touch interactions on choice buttons
6. Status should show "PASS"

### Step 4: Test Full Game Flow

Navigate to: `http://localhost:8000/index.html`

1. **Landing Screen**
   - Verify update panel appears (if first load)
   - Click "Start Mission"

2. **Mission Selection**
   - Select Pearl Harbor mission
   - Choose any role

3. **Scene 1**
   - Watch typewriter effect reveal narrative
   - Verify choices are disabled during typewriter
   - Click to skip typewriter
   - Verify choices become enabled
   - Hover over choice buttons
   - Make a choice

4. **Scene 2**
   - Watch scene transition (fade)
   - Watch typewriter effect
   - Make a choice

5. **Continue Through All Scenes**
   - Verify typewriter on each scene
   - Verify transitions between scenes
   - Verify choice interactions
   - Complete the mission

6. **Outcome Screen**
   - Verify feedback survey appears
   - Fill out survey (optional)
   - Verify thank you message

### Step 5: Console Check

Open browser console (F12) and verify:
- No errors
- No warnings
- EventBus events logging correctly

### Step 6: Mobile Testing

1. Open DevTools → Toggle device toolbar
2. Select iPhone 13 Pro
3. Run through full game flow
4. Verify:
   - Typewriter works on mobile
   - Transitions work on mobile
   - Touch interactions work
   - No layout issues

### Step 7: Accessibility Testing

1. Enable "prefers-reduced-motion: reduce" in DevTools
2. Run through game flow
3. Verify:
   - Typewriter is instant
   - Transitions are instant
   - No jarring animations

2. Test keyboard navigation:
   - Tab through choice buttons
   - Enter to select
   - Verify focus states visible

## Success Criteria

All tests must pass:
- ✅ Typewriter effect reveals text character-by-character
- ✅ Click-to-skip works
- ✅ Scene transitions are smooth and non-jarring
- ✅ Choice buttons have satisfying hover/click feedback
- ✅ No console errors
- ✅ Works on mobile device
- ✅ Respects prefers-reduced-motion
- ✅ No global variables
- ✅ EventBus integration works

## If Tests Fail

1. Check browser console for errors
2. Verify all files are loaded correctly
3. Check network tab for 404s
4. Review component initialization in main.js
5. Test in different browser

## Proceed to Phase 2

Once all tests pass and you've verified the full game flow works correctly:
1. Mark Task 9.1 as complete in tasks.md
2. Proceed to Phase 2 (Task 4: AtmosphericEffects, Task 2: TimedChoiceSystem)

## Notes

- Phase 1 focuses on core interactive polish
- Phase 2 adds atmospheric effects and timed choices
- Phase 3 adds ambient sound (requires audio files)
- Do not proceed to Phase 2 until Phase 1 is fully tested and working
