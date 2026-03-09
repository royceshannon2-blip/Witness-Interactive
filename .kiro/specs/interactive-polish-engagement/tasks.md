# Implementation Tasks: Interactive Polish & Engagement Features

## Task 1: TypewriterEffect Component

### Task 1.1: Create TypewriterEffect.js
- [x] Create `js/engine/TypewriterEffect.js`
- [x] Implement constructor with EventBus and config parameters
- [x] Implement `revealText(element, text, speed, onComplete)` method
- [x] Implement `skipToEnd()` method for click-to-complete
- [x] Implement `isActive()` method to check animation state
- [x] Check `prefers-reduced-motion` and skip animation if enabled
- [x] Use `requestAnimationFrame` for smooth character reveal
- [x] Store interval ID for cleanup
- [x] Subscribe to `scene:transition` event
- [x] Emit `typewriter:complete` when finished
- [x] Emit `typewriter:skipped` when user skips

### Task 1.2: Write TypewriterEffect tests
- [x] Create `js/engine/TypewriterEffect.test.js`
- [x] Test character-by-character reveal
- [x] Test skip-on-click functionality
- [x] Test prefers-reduced-motion handling
- [-] Test EventBus integration

---

## Task 2: TimedChoiceSystem Component

### Task 2.1: Create TimedChoiceSystem.js
- [x] Create `js/engine/TimedChoiceSystem.js`
- [x] Implement constructor with EventBus and config parameters
- [x] Implement `startTimer(duration, defaultChoiceId, onExpire)` method
- [x] Implement `cancelTimer()` method
- [x] Implement `getRemainingTime()` method
- [x] Use `setInterval` for countdown updates
- [x] Store timer ID for cleanup
- [x] Subscribe to `scene:transition` event to cancel timer
- [x] Subscribe to `choice:made` event to cancel timer
- [x] Emit `timer:started` when countdown begins
- [x] Emit `timer:expired` when time runs out
- [x] Emit `timer:cancelled` when player chooses in time
- [x] Auto-select default choice on expiration

### Task 2.2: Create timer UI rendering
- [x] Add timer display HTML in UIController
- [x] Create circular progress indicator CSS
- [x] Show remaining seconds as text
- [x] Add pulse/flash animation when < 3 seconds remain
- [x] Use red color for urgency
- [x] Respect `prefers-reduced-motion` for pulse effects

### Task 2.3: Write TimedChoiceSystem tests
- [x] Create `js/engine/TimedChoiceSystem.test.js`
- [x] Test timer countdown
- [x] Test auto-select on expiration
- [x] Test timer cancellation on choice
- [x] Test EventBus integration

### Task 2.4: Tag scenes with timed choices
- [x] Review `js/content/missions/pearl-harbor/american-sailor.js`
- [x] Add `timedChoice` configuration to appropriate scenes (focus on combat scenes)
- [x] Specify duration and default choice for each timed scene
- [x] Review `js/content/missions/pearl-harbor/american-civilian.js`
- [x] Add `timedChoice` configuration to 1-2 high-urgency scenes
- [x] Review `js/content/missions/pearl-harbor/japanese-aviator.js`
- [x] Add `timedChoice` configuration to 1-2 combat decision scenes
- [x] **Arizona sailor role should have the most timed choices (4-5 scenes)**

---

## Task 3: AmbientSoundManager Component

### Task 3.1: Create AmbientSoundManager.js
- [x] Create `js/engine/AmbientSoundManager.js`
- [x] Implement constructor with EventBus and config parameters
- [x] Implement `playSound(soundId, loop, volume)` method
- [x] Implement `stopSound(soundId, fadeOut)` method
- [x] Implement `crossfade(fromSoundId, toSoundId, duration)` method
- [x] Implement `toggleMute()` method
- [x] Implement `isMuted()` method
- [x] Use HTML5 `<audio>` elements
- [x] Implement volume ramp for crossfading
- [x] Store mute state in memory
- [x] Subscribe to `scene:transition` event
- [x] Subscribe to `sound:toggle` event
- [x] Emit `sound:playing` when audio starts
- [x] Emit `sound:stopped` when audio ends
- [x] Emit `sound:error` when audio fails to load
- [x] Gracefully handle missing audio files

### Task 3.2: Connect sound toggle button
- [x] Update UIController to wire existing sound toggle button
- [x] Emit `sound:toggle` event on button click
- [x] Update button icon based on mute state
- [x] Enable button (currently disabled)

### Task 3.3: **MANUAL STEP: User provides audio files**
- [x] **USER ACTION REQUIRED**: Create `/audio/ambient/` directory
- [x] **USER ACTION REQUIRED**: Download audio files from freesound.org:
  - Search "ocean waves loop" → save as `ocean-waves.mp3` (sailor role)
  - Search "WWII aircraft engine loop" → save as `aircraft-engines.mp3` (aviator role)
  - Search "air raid siren" → save as `air-raid-siren.mp3` (sailor role ONLY, scene 2+)
  - Search "explosion distant" → save as `explosion-distant.mp3` (all roles)
  - Search "morning birds ambience" → save as `peaceful-morning.mp3` (civilian role scene 1)
  - Search "neighborhood ambience" → save as `neighborhood-ambience.mp3` (civilian role scene 1)
- [x] **USER ACTION REQUIRED**: Ensure all files are public domain/CC0 licensed
- [x] **USER ACTION REQUIRED**: Place files in `/audio/ambient/` directory
- [x] **HISTORICAL NOTE**: Civilian role should NOT have air raid siren in early scenes - there was no warning
- [x] **BLOCKER**: Tasks 3.4 and 3.5 cannot proceed until audio files are provided

### Task 3.4: Tag scenes with ambient sound
- [x] Review `js/content/missions/pearl-harbor/american-sailor.js`
- [x] Add `ambientSound` configuration to scenes:
  - Scene 1 (0745): `ocean-waves` (peaceful ship ambience)
  - Scene 2 (0755): `air-raid-siren` (general alarm sounds)
  - Scenes 3-5: `explosion-distant` (combat chaos)
- [x] Review `js/content/missions/pearl-harbor/american-civilian.js`
- [x] Add `ambientSound` configuration to scenes:
  - Scene 1 (0745): `peaceful-morning` or `neighborhood-ambience` (NO SIREN - no warning)
  - Scene 2 (0800): `explosion-distant` (sudden chaos, no warning)
  - Scenes 3-5: `explosion-distant` (ongoing chaos)
  - **CRITICAL**: NO air raid siren for civilian role - historically accurate
- [x] Review `js/content/missions/pearl-harbor/japanese-aviator.js`
- [x] Add `ambientSound` configuration to scenes:
  - Scene 1 (0545): `aircraft-engines` (carrier deck)
  - Scenes 2-5: `aircraft-engines` (in flight)

### Task 3.5: Write AmbientSoundManager tests
- [x] Create `js/engine/AmbientSoundManager.test.js`
- [x] Test audio playback
- [x] Test crossfading
- [x] Test mute/unmute
- [x] Test graceful degradation for missing files
- [x] Test EventBus integration

---

## Task 4: AtmosphericEffects Component

### Task 4.1: Create atmospheric-effects.css
- [x] Create `css/atmospheric-effects.css`
- [x] Implement `.effect-smoke` CSS animation (dark particles rising)
- [x] Implement `.effect-fire` CSS animation (orange/red flickering glow)
- [x] Implement `.effect-shake` CSS animation (screen shake)
- [x] Implement `.effect-dawn` CSS animation (soft orange/pink gradient)
- [x] Implement `.effect-explosion` CSS animation (bright white flash + fade)
- [x] Implement `.effect-aftermath` CSS animation (desaturated hazy overlay)
- [x] Implement `.effect-rain` CSS animation (subtle rain particles)
- [x] Implement `.effect-ocean` CSS animation (gentle wave motion blur)
- [x] Implement `.effect-ash` CSS animation (gray ash particles falling)
- [x] Use GPU-accelerated properties (`transform`, `opacity`)
- [x] Add `@media (prefers-reduced-motion: reduce)` rules
- [x] Ensure effects don't obscure text or choices
- [x] Link CSS file in `index.html`

### Task 4.2: Create AtmosphericEffects.js
- [x] Create `js/engine/AtmosphericEffects.js`
- [x] Implement constructor with EventBus and config parameters
- [x] Implement `applyEffect(effectName, duration)` method
- [x] Implement `removeEffect(effectName)` method
- [x] Implement `clearAllEffects()` method
- [x] Add/remove CSS classes on `document.body`
- [x] Check `prefers-reduced-motion` before applying
- [x] Auto-remove effects after duration (default 2000ms)
- [x] Support multiple simultaneous effects
- [x] Subscribe to `scene:transition` event
- [x] Emit `effect:applied` when effect starts
- [x] Emit `effect:removed` when effect ends

### Task 4.3: Tag scenes with atmospheric effects
- [x] Review `js/content/missions/pearl-harbor/american-sailor.js`
- [x] Add `atmosphericEffect` to appropriate scenes
- [x] Review `js/content/missions/pearl-harbor/american-civilian.js`
- [x] Add `atmosphericEffect` to appropriate scenes
- [x] Review `js/content/missions/pearl-harbor/japanese-aviator.js`
- [x] Add `atmosphericEffect` to appropriate scenes

### Task 4.4: Write AtmosphericEffects tests
- [x] Create `js/engine/AtmosphericEffects.test.js`
- [x] Test effect application
- [x] Test effect removal
- [x] Test multiple simultaneous effects
- [x] Test prefers-reduced-motion handling
- [x] Test EventBus integration

---

## Task 5: SceneTransition Component

### Task 5.1: Create SceneTransition.js
- [x] Create `js/engine/SceneTransition.js`
- [x] Implement constructor with EventBus and config parameters
- [x] Implement `transition(fromScene, toScene, type, duration)` method
- [x] Support transition types: fade, flash, none
- [x] Use CSS animations for performance
- [x] Block user input during transition
- [x] Total duration: 500ms (250ms out + 250ms in)
- [x] Check `prefers-reduced-motion` (use instant transition)
- [x] Subscribe to `scene:transition` event
- [x] Emit `transition:start` when animation begins
- [x] Emit `transition:complete` when animation finishes

### Task 5.2: Create transition CSS
- [x] Add transition CSS to `css/style.css`
- [x] Implement `.scene-transition-fade-out` animation
- [x] Implement `.scene-transition-fade-in` animation
- [x] Implement `.scene-transition-flash` animation
- [x] Add `@media (prefers-reduced-motion: reduce)` rules

### Task 5.3: Write SceneTransition tests
- [x] Create `js/engine/SceneTransition.test.js`
- [x] Test fade transition
- [x] Test flash transition
- [x] Test instant transition (prefers-reduced-motion)
- [x] Test input blocking during transition
- [x] Test EventBus integration

---

## Task 6: Enhanced Choice Interactions

### Task 6.1: Update choice button CSS
- [x] Update `.choice-button` styles in `css/style.css`
- [x] Add hover state with scale and shadow
- [x] Add active state with scale and shadow
- [x] Add smooth transitions
- [x] Add `@media (prefers-reduced-motion: reduce)` rules
- [x] Ensure accessibility (focus states, keyboard navigation)
- [x] Test on both mouse and touch devices

---

## Task 7: UIController Integration

### Task 7.1: Update UIController constructor
- [x] Import all new components in `js/engine/UIController.js`
- [x] Accept components object parameter in constructor
- [x] Store component references
- [x] Initialize components with inline config

### Task 7.2: Update UIController.renderScene method
- [x] Apply scene transition before rendering
- [x] Render narrative with typewriter effect
- [x] **CRITICAL**: Disable choices until typewriter completes
- [x] **CRITICAL**: Start timed choice ONLY AFTER typewriter completes (in typewriter callback)
- [x] Apply atmospheric effects if specified
- [x] Change ambient sound if specified (COMPLETE)
- [x] Ensure proper cleanup on scene transition

### Task 7.3: Add enableChoices/disableChoices methods
- [x] Implement `enableChoices()` method to make buttons clickable
- [x] Implement `disableChoices()` method to prevent clicks during typewriter
- [x] Call `disableChoices()` at start of scene render
- [x] Call `enableChoices()` in typewriter completion callback

### Task 7.4: Add timer event handlers
- [x] Implement `handleTimerStarted()` to show timer UI
- [x] Implement `handleTimerUpdate()` to update countdown display
- [x] Implement `handleTimerExpired()` to hide timer UI
- [x] Implement `handleTimerCancelled()` to hide timer UI
- [x] Implement `updateTimerDisplay()` to update timer text and progress

---

## Task 8: Main.js Integration

### Task 8.1: Initialize components in main.js
- [x] Import all new components in `js/main.js`
- [x] Initialize TypewriterEffect with inline config
- [x] Initialize TimedChoiceSystem with inline config
- [x] Initialize AmbientSoundManager with inline config (blocked by Task 3 - not implemented)
- [x] Initialize AtmosphericEffects with inline config
- [x] Initialize SceneTransition with inline config
- [x] Pass components object to UIController constructor
- [x] Verify no global variables are created

### Task 8.2: Update component verification
- [x] Update `js/engine/verify-components.test.js`
- [x] Add checks for new components
- [x] Verify EventBus integration
- [x] Verify no global variables

---

## Task 9: Phase 1 Checkpoint - Browser Testing

### Task 9.1: **CHECKPOINT: Test Phase 1 in browser**
- [ ] **STOP HERE**: Do not proceed to Phase 2 until Phase 1 is tested
- [ ] Start local server (`python -m http.server 8000`)
- [ ] Open game in browser
- [ ] Test typewriter effect on multiple scenes
- [ ] Verify click-to-skip works
- [ ] Test scene transitions (fade between scenes)
- [ ] Test choice button hover effects
- [ ] Verify no console errors
- [ ] Test on mobile device
- [ ] **USER APPROVAL REQUIRED**: Confirm Phase 1 works before proceeding to Phase 2

---

## Task 10: Testing and Polish

### Task 10.1: Integration testing
- [ ] Test typewriter effect on all scenes
- [ ] Test timed choices on Arizona sailor role
- [ ] Test atmospheric effects on all roles
- [ ] Test scene transitions between all scenes
- [ ] Test choice hover effects
- [ ] Test ambient sound crossfading (if audio files provided)

### Task 10.2: Accessibility testing
- [-] Test with prefers-reduced-motion enabled
- [ ] Test keyboard navigation
- [ ] Test screen reader announcements
- [ ] Test color contrast for all effects
- [ ] Test focus management during transitions

### Task 10.3: Performance testing
- [ ] Monitor FPS during effects on desktop
- [ ] Monitor FPS during effects on mobile
- [ ] Test on iOS Safari
- [ ] Test on Android Chrome
- [ ] Optimize if performance < 60fps

### Task 10.4: Browser compatibility testing
- [ ] Test on Chrome
- [ ] Test on Firefox
- [ ] Test on Safari
- [ ] Test on Edge
- [ ] Fix any browser-specific issues

---

## Implementation Priority

**Phase 1 (High Impact, Low Effort) - Complete First**:
- Task 1: TypewriterEffect Component
- Task 6: Enhanced Choice Interactions
- Task 5: SceneTransition Component
- Task 7: UIController Integration
- Task 8: Main.js Integration
- **Task 9: CHECKPOINT - Browser test before proceeding**

**Phase 2 (High Impact, Medium Effort) - Complete Second**:
- Task 4: AtmosphericEffects Component
- Task 2: TimedChoiceSystem Component

**Phase 3 (Dependent on User) - Complete Last**:
- Task 3: AmbientSoundManager Component (requires audio files from user)

**Phase 4 (Final Testing)**:
- Task 10: Testing and Polish

**DEPRIORITIZED (Skip until after April 4th)**:
- Documentation tasks - focus on pitch video and survey follow-up instead

---

## Critical Dependencies

1. **Task 9.1 CHECKPOINT blocks Phase 2**: Phase 1 must be browser-tested and approved before starting Phase 2
2. **Task 3.3 blocks Task 3.4 and 3.5**: Audio files must be provided by user before ambient sound can be tested
3. **Task 7.2 depends on Task 1.1**: Typewriter must be complete before UIController integration
4. **Task 7.2 depends on Task 2.1**: TimedChoiceSystem must be complete before UIController integration
5. **Task 8.1 depends on all component tasks**: All components must exist before main.js integration
6. **Task 10 depends on Task 8**: Integration testing requires complete system

---

## Success Criteria

**Phase 1 Success (Task 9.1 Checkpoint)**:
- [ ] Typewriter effect reveals text character-by-character on all scenes
- [ ] Players can click to skip typewriter animation
- [ ] Scene transitions are smooth and non-jarring
- [ ] Choice buttons have satisfying hover and click feedback
- [ ] No console errors in browser
- [ ] Works on mobile device
- [ ] **USER CONFIRMS**: Phase 1 works correctly before proceeding

**Final Success Criteria**:
- [ ] Timed choices display countdown timer and auto-select on expiration
- [ ] **Timer does NOT start until typewriter completes**
- [ ] Atmospheric effects trigger on appropriate scenes
- [ ] All features respect prefers-reduced-motion
- [ ] Performance maintains 60fps on mobile devices
- [ ] No global variables are created
- [ ] All EventBus communication works correctly
- [ ] Ambient sound system works (if audio files provided)

