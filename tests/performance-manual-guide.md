# Manual Performance Testing Guide
## Task 10.3: Performance Testing - Manual Verification

This guide provides step-by-step instructions for manually testing performance metrics that cannot be reliably automated.

---

## Prerequisites

- Local server running (`python -m http.server 8000`)
- Chrome or Firefox browser
- DevTools open (F12)

---

## Test 1: Baseline FPS - No Effects

**Objective:** Measure baseline FPS without any animations

### Steps:
1. Open http://localhost:8000 in Chrome
2. Open DevTools (F12) → Performance tab
3. Click "Record" (circle icon)
4. Wait on the timeline selector screen for 3 seconds
5. Stop recording
6. Check FPS graph (should be solid green at 60 FPS)

### Expected Result:
- ✅ FPS: 60 (solid green line)
- ✅ No dropped frames
- ✅ No long tasks on main thread

---

## Test 2: FPS During Typewriter Effect

**Objective:** Measure FPS while text is being revealed character-by-character

### Steps:
1. Start game, select Pearl Harbor → American Sailor
2. Open DevTools → Performance tab
3. Click Record
4. Watch the typewriter effect reveal the first scene text
5. Stop recording after text completes
6. Analyze FPS graph

### Expected Result:
- ✅ FPS: ≥55 average (target 60)
- ✅ Smooth animation, no stuttering
- ✅ Text reveals at consistent speed

---

## Test 3: FPS During Scene Transitions

**Objective:** Measure FPS during fade transitions between scenes

### Steps:
1. Start game, select a role
2. Open DevTools → Performance tab
3. Click Record
4. Make a choice to trigger scene transition
5. Stop recording after transition completes
6. Analyze FPS during the 500ms transition

### Expected Result:
- ✅ FPS: ≥55 during transition
- ✅ Smooth fade effect
- ✅ No visual stuttering

---

## Test 4: FPS During Timed Choice Countdown

**Objective:** Measure FPS while timer is counting down

### Steps:
1. Start game, select American Sailor (has most timed choices)
2. Navigate to Scene 2 (first timed choice)
3. Open DevTools → Performance tab
4. Click Record
5. Watch the timer count down for 5 seconds
6. Stop recording
7. Analyze FPS graph

### Expected Result:
- ✅ FPS: ≥55 average
- ✅ Smooth countdown animation
- ✅ Timer updates consistently

---

## Test 5: FPS During Atmospheric Effects

**Objective:** Measure FPS with various atmospheric effects active

### Steps for Each Effect:

#### Smoke Effect
1. Open browser console
2. Run: `document.body.classList.add('effect-smoke')`
3. Open DevTools → Performance tab
4. Record for 3 seconds
5. Check FPS graph

#### Fire Effect
1. Run: `document.body.classList.add('effect-fire')`
2. Record for 3 seconds
3. Check FPS

#### Shake Effect
1. Run: `document.body.classList.add('effect-shake')`
2. Record for 1 second
3. Check FPS

#### Explosion Effect
1. Run: `document.body.classList.add('effect-explosion')`
2. Record for 2 seconds
3. Check FPS

### Expected Results:
- ✅ All effects: FPS ≥55 average
- ✅ Smooth animations
- ✅ No frame drops

---

## Test 6: FPS with Multiple Simultaneous Effects

**Objective:** Measure FPS when multiple effects run at once

### Steps:
1. Open browser console
2. Run: `document.body.classList.add('effect-smoke', 'effect-fire', 'effect-shake')`
3. Open DevTools → Performance tab
4. Record for 3 seconds
5. Analyze FPS graph

### Expected Result:
- ✅ FPS: ≥50 average (more lenient for multiple effects)
- ✅ Acceptable performance
- ✅ No severe stuttering

---

## Test 7: Mobile Performance - iOS Safari

**Objective:** Test performance on actual iOS device

### Steps:
1. Connect iPhone via USB to Mac
2. Enable Web Inspector in iPhone Settings → Safari → Advanced
3. Open http://[your-ip]:8000 on iPhone
4. On Mac: Safari → Develop → [Your iPhone] → [Page]
5. Use Web Inspector to profile performance
6. Play through first 3 scenes
7. Monitor FPS in Timeline

### Expected Result:
- ✅ FPS: ≥50 average on mobile
- ✅ Smooth gameplay
- ✅ No significant lag

---

## Test 8: Mobile Performance - Android Chrome

**Objective:** Test performance on actual Android device

### Steps:
1. Enable USB Debugging on Android device
2. Connect via USB
3. Open chrome://inspect in desktop Chrome
4. Click "Inspect" on your device's page
5. Use DevTools Performance tab
6. Play through first 3 scenes
7. Monitor FPS

### Expected Result:
- ✅ FPS: ≥50 average on mobile
- ✅ Smooth gameplay
- ✅ Responsive touch interactions

---

## Test 9: Memory Usage Over Time

**Objective:** Detect memory leaks during extended gameplay

### Steps:
1. Open DevTools → Memory tab
2. Take heap snapshot (baseline)
3. Play through entire American Sailor role (5 scenes)
4. Take another heap snapshot
5. Compare memory usage

### Expected Result:
- ✅ Memory growth: <20MB over full playthrough
- ✅ No continuous memory growth
- ✅ Objects are properly garbage collected

---

## Test 10: Long Session Performance

**Objective:** Ensure performance doesn't degrade over time

### Steps:
1. Open DevTools → Performance tab
2. Start recording
3. Play through 2 complete roles (10 scenes total)
4. Stop recording
5. Analyze FPS graph over time

### Expected Result:
- ✅ FPS remains consistent throughout
- ✅ No performance degradation
- ✅ Memory usage stable

---

## Performance Metrics Reference

### FPS Targets

| Platform | Target FPS | Acceptable FPS | Failing FPS |
|----------|------------|----------------|-------------|
| Desktop | 60 | 55 | <50 |
| Mobile | 60 | 50 | <45 |

### Memory Targets

| Metric | Target | Acceptable | Concerning |
|--------|--------|------------|------------|
| Initial Load | <30MB | <50MB | >50MB |
| Per Scene | +2MB | +5MB | +10MB |
| Full Playthrough | +10MB | +20MB | +30MB |

---

## Troubleshooting Performance Issues

### If FPS < 50:

1. **Check CPU throttling**: Disable in DevTools Performance settings
2. **Check browser extensions**: Disable all extensions
3. **Check system resources**: Close other applications
4. **Check effect complexity**: Reduce particle counts in CSS

### If Memory Growing:

1. **Check event listeners**: Ensure proper cleanup
2. **Check DOM nodes**: Ensure old scenes are removed
3. **Check timers**: Ensure all intervals/timeouts are cleared
4. **Check audio**: Ensure audio elements are properly destroyed

---

## Reporting Results

After completing manual tests, document:

1. ✅ Which tests passed
2. ❌ Which tests failed
3. 📊 Actual FPS measurements
4. 📊 Memory usage measurements
5. 🐛 Any performance issues discovered
6. 💡 Optimization recommendations

---

## Quick Test Checklist

- [ ] Baseline FPS (no effects)
- [ ] Typewriter effect FPS
- [ ] Scene transition FPS
- [ ] Timed choice countdown FPS
- [ ] Atmospheric effects FPS (smoke, fire, shake, explosion)
- [ ] Multiple simultaneous effects FPS
- [ ] iOS Safari mobile performance
- [ ] Android Chrome mobile performance
- [ ] Memory usage over time
- [ ] Long session performance

---

**Status:** Manual testing guide complete
**Next Step:** Execute manual tests and document results
