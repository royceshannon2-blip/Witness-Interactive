# Implementation Tasks: Interactive Polish & Engagement Features

## Task 1: TypewriterEffect Component

### Task 1.1: Create TypewriterEffect.js
- [ ] Create `js/engine/TypewriterEffect.js`
- [ ] Implement constructor with EventBus and config parameters
- [ ] Implement `revealText(element, text, speed, onComplete)` method
- [ ] Implement `skipToEnd()` method for click-to-complete
- [ ] Implement `isActive()` method to check animation state
- [ ] Check `prefers-reduced-motion` and skip animation if enabled
- [ ] Use `requestAnimationFrame` for smooth character reveal
- [ ] Store interval ID for cleanup
- [ ] Subscribe to `scene:transition` event
- [ ] Emit `typewriter:complete` when finished
- [ ] Emit `typewriter:skipped` when user skips

### Task 1.2: Write TypewriterEffect tests
- [ ] Create `js/engine/TypewriterEffect.test.js`
- [ ] Test character-by-character reveal
- [ ] Test skip-on-click functionality
- [ ] Test prefers-reduced-motion handling
- [ ] Test EventBus integration

---

## Task 2: TimedChoiceSystem Component

### Task 2.1: Create TimedChoiceSystem.js
- [ ] Create `js/engine/TimedChoiceSystem.js`
- [ ] Implement constructor with EventBus and config parameters
- [ ] Implement `startTimer(duration, defaultChoiceId, onExpire)` method
- [ ] Implement `cancelTimer()` method
- [ ] Implement `getRemainingTime()` method
- [ ] Use `setInterval` for countdown updates
- [ ] Store timer ID for cleanup
- [ ] Subscribe to `scene:transition` event to cancel timer
- [ ] Subscribe to `choice:made` event to cancel timer
- [ ] Emit `timer:started` when countdown begins
- [ ] Emit `timer:expired` when time runs out
- [ ] Emit `timer:cancelled` when player chooses in time
- [ ] Auto-select default choice on expiration

### Task 2.2: Create timer UI rendering
- [ ] Add timer display HTML in UIController
- [ ] Create circular progress indicator CSS
- [ ] Show remaining seconds as text
- [ ] Add pulse/flash animation when < 3 seconds remain
- [ ] Use red color for urgency
- [ ] Respect `prefers-reduced-motion` for pulse effects

### Task 2.3: Write TimedChoiceSystem tests
- [ ] Create `js/engine/TimedChoiceSystem.test.js`
- [ ] Test timer countdown
- [ ] Test auto-select on expiration
- [ ] Test timer cancellation on choice
- [ ] Test EventBus integration

### Task 2.4: Tag scenes with timed choices
- [ ] Review `js/content/missions/pearl-harbor/american-sailor.js`
- [ ] Add `timedChoice` configuration to appropriate scenes (focus on combat scenes)
- [ ] Specify duration and default choice for each timed scene
- [ ] Review `js/content/missions/pearl-harbor/american-civilian.js`
- [ ] Add `timedChoice` configuration to 1-2 high-urgency scenes
- [ ] Review `js/content/missions/pearl-harbor/japanese-aviator.js`
- [ ] Add `timedChoice` configuration to 1-2 combat decision scenes
- [ ] **Arizona sailor role should have the most timed choices (4-5 scenes)**

---

## Task 3: AmbientSoundManager Component

### Task 3.1: Create AmbientSoundManager.js
- [ ] Create `js/engine/AmbientSoundManager.js`
- [ ] Implement constructor with EventBus and config parameters
- [ ] Implement `playSound(soundId, loop, volume)` method
- [ ] Implement `stopSound(soundId, fadeOut)` method
- [ ] Implement `crossfade(fromSoundId, toSoundId, duration)` method
- [ ] Implement `toggleMute()` method
- [ ] Implement `isMuted()` method
- [ ] Use HTML5 `<audio>` elements
- [ ] Implement volume ramp for crossfading
- [ ] Store mute state in memory
- [ ] Subscribe to `scene:transition` event
- [ ] Subscribe to `sound:toggle` event
- [ ] Emit `sound:playing` when audio starts
- [ ] Emit `sound:stopped` when audio ends
- [ ] Emit `sound:error` when audio fails to load
- [ ] Gracefully handle missing audio files

### Task 3.2: Connect sound toggle button
- [ ] Update UIController to wire existing sound toggle button
- [ ] Emit `sound:toggle` event on button click
- [ ] Update button icon based on mute state
- [ ] Enable button (currently disabled)

### Task 3.3: **MANUAL STEP: User provides audio files**
- [ ] **USER ACTION REQUIRED**: Create `/audio/ambient/` directory
- [ ] **USER ACTION REQUIRED**: Download audio files from freesound.org:
  - Search "ocean waves loop" → save as `ocean-waves.mp3` (sailor role)
  - Search "WWII aircraft engine loop" → save as `aircraft-engines.mp3` (aviator role)
  - Search "air raid siren" → save as `air-raid-siren.mp3` (sailor role ONLY, scene 2+)
  - Search "explosion distant" → save as `explosion-distant.mp3` (all roles)
  - Search "morning birds ambience" → save as `peaceful-morning.mp3` (civilian role scene 1)
  - Search "neighborhood ambience" → save as `neighborhood-ambience.mp3` (civilian role scene 1)
- [ ] **USER ACTION REQUIRED**: Ensure all files are public domain/CC0 licensed
- [ ] **USER ACTION REQUIRED**: Place files in `/audio/ambient/` directory
- [ ] **HISTORICAL NOTE**: Civilian role should NOT have air raid siren in early scenes - there was no warning
- [ ] **BLOCKER**: Tasks 3.4 and 3.5 cannot proceed until audio files are provided

### Task 3.4: Tag scenes with ambient sound
- [ ] Review `js/content/missions/pearl-harbor/american-sailor.js`
- [ ] Add `ambientSound` configuration to scenes:
  - Scene 1 (0745): `ocean-waves` (peaceful ship ambience)
  - Scene 2 (0755): `air-raid-siren` (general alarm sounds)
  - Scenes 3-5: `explosion-distant` (combat chaos)
- [ ] Review `js/content/missions/pearl-harbor/american-civilian.js`
- [ ] Add `ambientSound` configuration to scenes:
  - Scene 1 (0745): `peaceful-morning` or `neighborhood-ambience` (NO SIREN - no warning)
  - Scene 2 (0800): `explosion-distant` (sudden chaos, no warning)
  - Scenes 3-5: `explosion-distant` (ongoing chaos)
  - **CRITICAL**: NO air raid siren for civilian role - historically accurate
- [ ] Review `js/content/missions/pearl-harbor/japanese-aviator.js`
- [ ] Add `ambientSound` configuration to scenes:
  - Scene 1 (0545): `aircraft-engines` (carrier deck)
  - Scenes 2-5: `aircraft-engines` (in flight)

### Task 3.5: Write AmbientSoundManager tests
- [ ] Create `js/engine/AmbientSoundManager.test.js`
- [ ] Test audio playback
- [ ] Test crossfading
- [ ] Test mute/unmute
- [ ] Test graceful degradation for missing files
- [ ] Test EventBus integration

---

## Task 4: AtmosphericEffects Component

### Task 4.1: Create atmospheric-effects.css
- [ ] Create `css/atmospheric-effects.css`
- [ ] Implement `.effect-smoke` CSS animation (dark particles rising)
- [ ] Implement `.effect-fire` CSS animation (orange/red flickering glow)
- [ ] Implement `.effect-shake` CSS animation (screen shake)
- [ ] Implement `.effect-dawn` CSS animation (soft orange/pink gradient)
- [ ] Implement `.effect-explosion` CSS animation (bright white flash + fade)
- [ ] Implement `.effect-aftermath` CSS animation (desaturated hazy overlay)
- [ ] Implement `.effect-rain` CSS animation (subtle rain particles)
- [ ] Implement `.effect-ocean` CSS animation (gentle wave motion blur)
- [ ] Implement `.effect-ash` CSS animation (gray ash particles falling)
- [ ] Use GPU-accelerated properties (`transform`, `opacity`)
- [ ] Add `@media (prefers-reduced-motion: reduce)` rules
- [ ] Ensure effects don't obscure text or choices
- [ ] Link CSS file in `index.html`

### Task 4.2: Create AtmosphericEffects.js
- [ ] Create `js/engine/AtmosphericEffects.js`
- [ ] Implement constructor with EventBus and config parameters
- [ ] Implement `applyEffect(effectName, duration)` method
- [ ] Implement `removeEffect(effectName)` method
- [ ] Implement `clearAllEffects()` method
- [ ] Add/remove CSS classes on `document.body`
- [ ] Check `prefers-reduced-motion` before applying
- [ ] Auto-remove effects after duration (default 2000ms)
- [ ] Support multiple simultaneous effects
- [ ] Subscribe to `scene:transition` event
- [ ] Emit `effect:applied` when effect starts
- [ ] Emit `effect:removed` when effect ends

### Task 4.3: Tag scenes with atmospheric effects
- [ ] Review `js/content/missions/pearl-harbor/american-sailor.js`
- [ ] Add `atmosphericEffect` to appropriate scenes
- [ ] Review `js/content/missions/pearl-harbor/american-civilian.js`
- [ ] Add `atmosphericEffect` to appropriate scenes
- [ ] Review `js/content/missions/pearl-harbor/japanese-aviator.js`
- [ ] Add `atmosphericEffect` to appropriate scenes

### Task 4.4: Write AtmosphericEffects tests
- [ ] Create `js/engine/AtmosphericEffects.test.js`
- [ ] Test effect application
- [ ] Test effect removal
- [ ] Test multiple simultaneous effects
- [ ] Test prefers-reduced-motion handling
- [ ] Test EventBus integration

---

## Task 5: SceneTransition Component

### Task 5.1: Create SceneTransition.js
- [ ] Create `js/engine/SceneTransition.js`
- [ ] Implement constructor with EventBus and config parameters
- [ ] Implement `transition(fromScene, toScene, type, duration)` method
- [ ] Support transition types: fade, flash, none
- [ ] Use CSS animations for performance
- [ ] Block user input during transition
- [ ] Total duration: 500ms (250ms out + 250ms in)
- [ ] Check `prefers-reduced-motion` (use instant transition)
- [ ] Subscribe to `scene:transition` event
- [ ] Emit `transition:start` when animation begins
- [ ] Emit `transition:complete` when animation finishes

### Task 5.2: Create transition CSS
- [ ] Add transition CSS to `css/style.css`
- [ ] Implement `.scene-transition-fade-out` animation
- [ ] Implement `.scene-transition-fade-in` animation
- [ ] Implement `.scene-transition-flash` animation
- [ ] Add `@media (prefers-reduced-motion: reduce)` rules

### Task 5.3: Write SceneTransition tests
- [ ] Create `js/engine/SceneTransition.test.js`
- [ ] Test fade transition
- [ ] Test flash transition
- [ ] Test instant transition (prefers-reduced-motion)
- [ ] Test input blocking during transition
- [ ] Test EventBus integration

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
- [ ] Import all new components in `js/engine/UIController.js`
- [ ] Accept components object parameter in constructor
- [ ] Store component references
- [ ] Initialize components with inline config

### Task 7.2: Update UIController.renderScene method
- [ ] Apply scene transition before rendering
- [ ] Render narrative with typewriter effect
- [ ] **CRITICAL**: Disable choices until typewriter completes
- [ ] **CRITICAL**: Start timed choice ONLY AFTER typewriter completes (in typewriter callback)
- [ ] Apply atmospheric effects if specified
- [ ] Change ambient sound if specified
- [ ] Ensure proper cleanup on scene transition

### Task 7.3: Add enableChoices/disableChoices methods
- [ ] Implement `enableChoices()` method to make buttons clickable
- [ ] Implement `disableChoices()` method to prevent clicks during typewriter
- [ ] Call `disableChoices()` at start of scene render
- [ ] Call `enableChoices()` in typewriter completion callback

---

## Task 8: Main.js Integration

### Task 8.1: Initialize components in main.js
- [ ] Import all new components in `js/main.js`
- [ ] Initialize TypewriterEffect with inline config
- [ ] Initialize TimedChoiceSystem with inline config
- [ ] Initialize AmbientSoundManager with inline config
- [ ] Initialize AtmosphericEffects with inline config
- [ ] Initialize SceneTransition with inline config
- [ ] Pass components object to UIController constructor
- [ ] Verify no global variables are created

### Task 8.2: Update component verification
- [ ] Update `js/engine/verify-components.test.js`
- [ ] Add checks for new components
- [ ] Verify EventBus integration
- [ ] Verify no global variables

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
- [ ] Test with prefers-reduced-motion enabled
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

