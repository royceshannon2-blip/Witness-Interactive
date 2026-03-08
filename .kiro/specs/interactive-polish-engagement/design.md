# Design Document: Interactive Polish & Engagement Features

## Overview

This document describes the technical design for adding interactive polish and engagement features to the Witness Interactive Pearl Harbor game. The design prioritizes high-impact, low-effort features that can be completed before April 4th while maintaining the existing architecture and zero-dependency constraints.

## Architecture Principles

1. **EventBus Communication**: All features communicate through the existing EventBus
2. **Separation of Concerns**: Engine logic in `js/engine/`, content data in `js/content/`
3. **Progressive Enhancement**: Features degrade gracefully when unavailable
4. **Accessibility First**: Respect `prefers-reduced-motion` and provide alternatives
5. **Zero Dependencies**: Pure vanilla JS/CSS, no frameworks or build tools

## Component Design

### 1. TypewriterEffect Component

**Location**: `js/engine/TypewriterEffect.js`

**Purpose**: Reveals text character-by-character to create narrative immersion.

**Public Interface**:
```javascript
class TypewriterEffect {
  constructor(eventBus, config)
  revealText(element, text, speed, onComplete)
  skipToEnd()
  isActive()
}
```

**Configuration**:
```javascript
{
  defaultSpeed: 30,        // milliseconds per character
  skipOnClick: true,       // allow click to complete
  respectMotionPrefs: true // check prefers-reduced-motion
}
```

**EventBus Events**:
- Listens: `scene:transition` - Start typewriter on new scene
- Emits: `typewriter:complete` - Text reveal finished
- Emits: `typewriter:skipped` - User skipped animation

**Implementation Details**:
- Use `requestAnimationFrame` for smooth character reveal
- Store interval ID for cleanup
- Check `window.matchMedia('(prefers-reduced-motion: reduce)')` before animating
- Apply to scene narrative text only, not choices
- Prevent choice interaction until typewriter completes

---

### 2. TimedChoiceSystem Component

**Location**: `js/engine/TimedChoiceSystem.js`

**Purpose**: Adds countdown timers to choices to create urgency.

**Public Interface**:
```javascript
class TimedChoiceSystem {
  constructor(eventBus, config)
  startTimer(duration, defaultChoiceId, onExpire)
  cancelTimer()
  getRemainingTime()
}
```

**Configuration in Scene Data**:
```javascript
{
  id: "as-scene-03",
  narrative: "...",
  timedChoice: {
    enabled: true,
    duration: 10000,        // 10 seconds in milliseconds
    defaultChoice: "as-choice-03-a"  // auto-select if time expires
  },
  choices: [...]
}
```

**EventBus Events**:
- Listens: `scene:transition` - Check if scene has timed choice
- Listens: `choice:made` - Cancel timer when player chooses
- Emits: `timer:started` - Timer begins countdown
- Emits: `timer:expired` - Time ran out, auto-selecting
- Emits: `timer:cancelled` - Player made choice in time

**UI Rendering**:
- Display circular progress indicator above choices
- Show remaining seconds as text
- Pulse/flash when < 3 seconds remain
- Red color for urgency

**Implementation Details**:
- Use `setInterval` for countdown updates
- Store timer ID for cleanup
- Emit `choice:made` event with default choice on expiration
- Respect `prefers-reduced-motion` by reducing pulse effects
- Clear timer on scene transition or component destruction

---

### 3. AmbientSoundManager Component

**Location**: `js/engine/AmbientSoundManager.js`

**Purpose**: Manages background audio playback and crossfading.

**Public Interface**:
```javascript
class AmbientSoundManager {
  constructor(eventBus, config)
  playSound(soundId, loop, volume)
  stopSound(soundId, fadeOut)
  crossfade(fromSoundId, toSoundId, duration)
  toggleMute()
  isMuted()
}
```

**Audio File Structure**:
```
/audio/
  ambient/
    ocean-waves.mp3           (for sailor role - aboard ship)
    aircraft-engines.mp3      (for aviator role - in cockpit)
    air-raid-siren.mp3        (for sailor role - attack begins)
    explosion-distant.mp3     (for all roles - during attack)
    peaceful-morning.mp3      (for civilian role - before attack)
    birds-morning.mp3         (for civilian role - peaceful scene 1)
    neighborhood-ambience.mp3 (for civilian role - peaceful scene 1)
```

**Historical Audio Guidance**:
- **Civilian Role**: NO air raid sirens in early scenes - historically inaccurate
  - Scene 1 (0745): Peaceful morning ambience (birds, distant sounds)
  - Scene 2 (0800): Explosions interrupt the peace (no warning)
  - Scenes 3-5: Chaos, explosions, aftermath
- **Sailor Role**: Air raid siren only AFTER attack begins (0755+)
  - Scene 1 (0745): Ocean waves, ship ambience
  - Scene 2 (0755): Explosions + air raid siren (general alarm)
  - Scenes 3-5: Combat, explosions, aftermath
- **Aviator Role**: Aircraft engines throughout
  - Scene 1 (0545): Carrier deck, engines warming
  - Scenes 2-5: Flight, combat, return

**Dramatic Effect**: The civilian role's peaceful → chaos transition with NO WARNING is historically accurate and dramatically powerful. The sudden interruption of normal life is the point.

**Configuration in Scene Data**:
```javascript
{
  id: "as-scene-02",
  narrative: "...",
  ambientSound: {
    id: "aircraft-engines",
    volume: 0.6,
    fadeIn: 1000  // milliseconds
  },
  choices: [...]
}
```

**EventBus Events**:
- Listens: `scene:transition` - Change ambient sound for new scene
- Listens: `sound:toggle` - Mute/unmute from UI button
- Emits: `sound:playing` - Audio started
- Emits: `sound:stopped` - Audio ended
- Emits: `sound:error` - Audio failed to load

**Implementation Details**:
- Use HTML5 `<audio>` elements
- Preload audio files on game start
- Store mute state in memory (no localStorage)
- Implement crossfade using volume ramps
- Gracefully handle missing audio files
- Connect to existing sound toggle button in UI

---

### 4. AtmosphericEffects Component

**Location**: `js/engine/AtmosphericEffects.js`

**Purpose**: Triggers CSS-based visual effects for dramatic moments.

**Public Interface**:
```javascript
class AtmosphericEffects {
  constructor(eventBus, config)
  applyEffect(effectName, duration)
  removeEffect(effectName)
  clearAllEffects()
}
```

**Supported Effects**:
1. **smoke**: Dark particles rising (burning ships)
2. **fire**: Orange/red flickering glow (explosions)
3. **shake**: Screen shake animation (bomb impacts)
4. **dawn**: Soft orange/pink gradient (peaceful morning)
5. **explosion**: Bright white flash + fade (magazine detonation)
6. **aftermath**: Desaturated hazy overlay (post-attack)
7. **rain**: Subtle rain particles (weather)
8. **ocean**: Gentle wave motion blur (aboard ships)
9. **ash**: Gray ash particles falling (post-attack fallout)

**CSS Implementation** (`css/atmospheric-effects.css`):
```css
/* Smoke effect */
.effect-smoke::before {
  content: '';
  position: fixed;
  /* CSS animation for rising particles */
}

/* Fire effect */
.effect-fire::after {
  /* Flickering orange glow animation */
}

/* Shake effect */
@keyframes shake {
  0%, 100% { transform: translate(0, 0); }
  10%, 30%, 50%, 70%, 90% { transform: translate(-2px, 2px); }
  20%, 40%, 60%, 80% { transform: translate(2px, -2px); }
}
.effect-shake {
  animation: shake 0.5s ease-in-out;
}

/* Additional effects... */
```

**Configuration in Scene Data**:
```javascript
{
  id: "as-scene-03",
  narrative: "...",
  atmosphericEffect: "explosion",  // or ["smoke", "fire"] for multiple
  choices: [...]
}
```

**EventBus Events**:
- Listens: `scene:transition` - Apply effects for new scene
- Emits: `effect:applied` - Effect started
- Emits: `effect:removed` - Effect ended

**Implementation Details**:
- Add/remove CSS classes on `document.body`
- Use CSS animations for performance (GPU-accelerated)
- Check `prefers-reduced-motion` before applying
- Auto-remove effects after duration (default 2000ms)
- Support multiple simultaneous effects
- Ensure effects don't obscure text or choices

---

### 5. SceneTransition Component

**Location**: `js/engine/SceneTransition.js`

**Purpose**: Smooth visual transitions between scenes.

**Public Interface**:
```javascript
class SceneTransition {
  constructor(eventBus, config)
  transition(fromScene, toScene, type, duration)
}
```

**Transition Types**:
- **fade**: Fade out → fade in
- **flash**: Quick white flash
- **none**: Instant (for prefers-reduced-motion)

**CSS Implementation**:
```css
.scene-transition-fade-out {
  animation: fadeOut 250ms ease-out forwards;
}

.scene-transition-fade-in {
  animation: fadeIn 250ms ease-in forwards;
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

**EventBus Events**:
- Listens: `scene:transition` - Trigger transition animation
- Emits: `transition:start` - Animation beginning
- Emits: `transition:complete` - Animation finished

**Implementation Details**:
- Block user input during transition
- Total duration: 500ms (250ms out + 250ms in)
- Use CSS animations for performance
- Respect `prefers-reduced-motion` (instant transition)
- Coordinate with UIController for scene rendering

---

### 6. ChoiceInteractions Enhancement

**Location**: `css/style.css` (CSS-only enhancement)

**Purpose**: Make choice buttons feel weighty and deliberate.

**CSS Enhancements**:
```css
.choice-button {
  transition: all 0.2s ease;
  transform: scale(1);
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.choice-button:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
  background: var(--color-gold-light);
}

.choice-button:active {
  transform: scale(0.98);
  box-shadow: 0 1px 2px rgba(0,0,0,0.2);
}

@media (prefers-reduced-motion: reduce) {
  .choice-button {
    transition: none;
    transform: none;
  }
}
```

**Implementation Details**:
- Pure CSS, no JavaScript required
- Works on both mouse and touch devices
- Respects `prefers-reduced-motion`
- Maintains accessibility (focus states, keyboard navigation)

---

## Integration with Existing Components

### UIController Integration

**Changes Required**:
1. Import new components
2. Initialize components in constructor with inline config
3. Pass components to scene rendering methods
4. **CRITICAL**: Coordinate typewriter effect with timed choice system - timer must not start until typewriter completes

```javascript
// In UIController constructor
this.typewriterEffect = new TypewriterEffect(eventBus, {
  defaultSpeed: 30,
  skipOnClick: true,
  respectMotionPrefs: true
});

this.timedChoiceSystem = new TimedChoiceSystem(eventBus, {
  warningThreshold: 3000,
  pulseInterval: 500
});

this.ambientSoundManager = new AmbientSoundManager(eventBus, {
  defaultVolume: 0.6,
  crossfadeDuration: 1000,
  preloadOnStart: true
});

this.atmosphericEffects = new AtmosphericEffects(eventBus, {
  defaultDuration: 2000,
  respectMotionPrefs: true
});

this.sceneTransition = new SceneTransition(eventBus, {
  defaultType: 'fade',
  duration: 500,
  respectMotionPrefs: true
});

// In renderScene method
renderScene(scene, sceneIndex, totalScenes) {
  // Apply scene transition
  this.sceneTransition.transition(this.currentScene, scene, 'fade', 500);
  
  // Render narrative with typewriter
  this.typewriterEffect.revealText(narrativeElement, scene.narrative, 30, () => {
    // CRITICAL: Enable choices AFTER typewriter completes
    this.enableChoices();
    
    // CRITICAL: Start timed choice ONLY AFTER typewriter completes
    // This prevents players from losing time while text is still revealing
    if (scene.timedChoice?.enabled) {
      this.timedChoiceSystem.startTimer(
        scene.timedChoice.duration,
        scene.timedChoice.defaultChoice,
        (defaultChoice) => this.handleChoiceClick(defaultChoice)
      );
    }
  });
  
  // Apply atmospheric effects
  if (scene.atmosphericEffect) {
    this.atmosphericEffects.applyEffect(scene.atmosphericEffect, 2000);
  }
  
  // Change ambient sound
  if (scene.ambientSound) {
    this.ambientSoundManager.crossfade(
      this.currentSound,
      scene.ambientSound.id,
      1000
    );
  }
}
```

### Content File Updates

**Scene Data Structure** (example):
```javascript
{
  id: "as-scene-03",
  narrative: "0806 hours. You're on the main deck when you hear it...",
  apThemes: ["perspective", "continuity"],
  apKeyConcept: "KC-7.3.I",
  
  // NEW: Atmospheric effect
  atmosphericEffect: "explosion",
  
  // NEW: Ambient sound
  ambientSound: {
    id: "explosion-distant",
    volume: 0.7,
    fadeIn: 500
  },
  
  // NEW: Timed choice configuration
  timedChoice: {
    enabled: true,
    duration: 10000,  // 10 seconds
    defaultChoice: "as-choice-03-a"  // auto-select if time expires
  },
  
  choices: [
    {
      id: "as-choice-03-a",
      text: "Jump overboard. Swim for Ford Island.",
      consequences: { abandoned_ship: true, survival_instinct: 1 },
      nextScene: "as-scene-04"
    },
    // ... more choices
  ]
}
```

---

## Performance Considerations

1. **CSS Animations**: Use GPU-accelerated properties (`transform`, `opacity`)
2. **Audio Preloading**: Load audio files on game start, not on-demand
3. **Effect Cleanup**: Remove CSS classes and clear timers on scene transition
4. **Mobile Optimization**: Test on mobile devices, reduce particle counts if needed
5. **Memory Management**: Properly destroy components and clear event listeners

---

## Accessibility Compliance

1. **prefers-reduced-motion**: Check and respect user preference
2. **Keyboard Navigation**: All interactive elements accessible via keyboard
3. **Screen Readers**: Announce timer countdowns and effect changes
4. **Color Contrast**: Ensure sufficient contrast for all visual effects
5. **Focus Management**: Maintain focus during transitions and effects

---

## Testing Strategy

1. **Unit Tests**: Test each component in isolation
2. **Integration Tests**: Test component interaction via EventBus
3. **Browser Testing**: Chrome, Firefox, Safari, Edge
4. **Mobile Testing**: iOS Safari, Android Chrome
5. **Accessibility Testing**: Screen reader, keyboard-only navigation
6. **Performance Testing**: Monitor FPS during effects

---

## Implementation Priority

**Phase 1 (High Impact, Low Effort)**:
1. Typewriter effect
2. Choice hover effects (CSS-only)
3. Scene transitions

**Phase 2 (High Impact, Medium Effort)**:
4. Atmospheric visual effects
5. Timed choice system

**Phase 3 (Dependent on User)**:
6. Ambient sound system (requires audio files)

---

## File Structure

```
js/
  engine/
    TypewriterEffect.js          (NEW)
    TimedChoiceSystem.js         (NEW)
    AmbientSoundManager.js       (NEW)
    AtmosphericEffects.js        (NEW)
    SceneTransition.js           (NEW)
    UIController.js              (MODIFIED)
  content/
    missions/
      pearl-harbor/
        american-sailor.js       (MODIFIED - add timed choices)
        american-civilian.js     (MODIFIED - add effects)
        japanese-aviator.js      (MODIFIED - add effects)
  main.js                        (MODIFIED - import effects config)

css/
  atmospheric-effects.css        (NEW)
  style.css                      (MODIFIED - choice interactions)

audio/                           (NEW - user provides files)
  ambient/
    ocean-waves.mp3
    aircraft-engines.mp3
    air-raid-siren.mp3
    explosion-distant.mp3
    peaceful-morning.mp3
```

**Note**: Configuration will be embedded in component constructors rather than a separate config file to avoid creating new directory structure.

---

## Configuration

**Inline Configuration**: Configuration will be passed directly to component constructors in `main.js` to avoid creating new directory structure.

**Component Initialization** (in `main.js`):
```javascript
// Initialize TypewriterEffect
const typewriterEffect = new TypewriterEffect(eventBus, {
  defaultSpeed: 30,        // milliseconds per character
  skipOnClick: true,       // allow click to complete
  respectMotionPrefs: true // check prefers-reduced-motion
});

// Initialize TimedChoiceSystem
const timedChoiceSystem = new TimedChoiceSystem(eventBus, {
  warningThreshold: 3000,  // Show warning at 3 seconds
  pulseInterval: 500       // Pulse every 500ms when warning
});

// Initialize AmbientSoundManager
const ambientSoundManager = new AmbientSoundManager(eventBus, {
  defaultVolume: 0.6,
  crossfadeDuration: 1000,
  preloadOnStart: true
});

// Initialize AtmosphericEffects
const atmosphericEffects = new AtmosphericEffects(eventBus, {
  defaultDuration: 2000,
  respectMotionPrefs: true
});

// Initialize SceneTransition
const sceneTransition = new SceneTransition(eventBus, {
  defaultType: 'fade',
  duration: 500,
  respectMotionPrefs: true
});

// Pass to UIController
const uiController = new UIController(
  eventBus,
  timelineSelector,
  missionRegistry,
  consequenceSystem,
  resultsCard,
  uiContent,
  {
    typewriterEffect,
    timedChoiceSystem,
    ambientSoundManager,
    atmosphericEffects,
    sceneTransition
  }
);
```

---

## Correctness Properties

### Property 1: Typewriter Completion
**Validates: Requirement 1.2, 1.3**

For all scenes with narrative text:
- IF typewriter effect is active
- WHEN user clicks anywhere on screen
- THEN text reveal completes immediately
- AND choices become interactive

### Property 2: Timer Auto-Select
**Validates: Requirement 2.2**

For all scenes with timed choices:
- IF timer reaches zero
- AND player has not made a choice
- THEN default choice is automatically selected
- AND game continues to next scene

### Property 3: Audio Graceful Degradation
**Validates: Requirement 3.5**

For all scenes with ambient sound:
- IF audio file fails to load
- THEN game continues without audio
- AND error is logged to console
- AND no user-facing error is displayed

### Property 4: Motion Preference Respect
**Validates: Requirement 7.1**

For all animated features:
- IF user has prefers-reduced-motion enabled
- THEN animations are disabled or reduced
- AND functionality remains intact

### Property 5: Effect Non-Obstruction
**Validates: Requirement 4.4**

For all atmospheric effects:
- IF effect is active
- THEN narrative text remains readable
- AND choice buttons remain clickable
- AND no UI elements are obscured

---

## Edge Cases

1. **Multiple Effects**: Handle multiple simultaneous effects without performance degradation
2. **Rapid Scene Transitions**: Cancel in-progress effects when transitioning quickly
3. **Audio Loading Failures**: Continue gameplay without audio
4. **Timer During Typewriter**: Don't start timer until typewriter completes
5. **Mobile Touch Events**: Handle both mouse and touch interactions
6. **Browser Compatibility**: Fallback for older browsers without CSS animation support

---

## Documentation Requirements

1. **Audio Sourcing Guide**: Document how to download and add audio files
2. **Content Tagging Guide**: Explain how to add timed choices and effects to scenes
3. **Effect Catalog**: Visual examples of all 9 atmospheric effects
4. **Configuration Guide**: How to adjust speeds, durations, and volumes
5. **Accessibility Guide**: How features respect user preferences

