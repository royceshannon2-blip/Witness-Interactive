# Atmospheric Effects Architecture Refactor — Complete

## Problem Identified
The file `js/engine/AtmosphericEffects.js` contained 71 lines of hardcoded Rwanda scene IDs and additional Pearl Harbor scene ID checks, violating the core architecture rule: **engine files must contain logic only, zero content strings**.

## Solution Implemented

### 1. Engine Refactor (AtmosphericEffects.js)
- **Removed**: All hardcoded scene ID checks (71 lines for Rwanda, additional lines for Pearl Harbor)
- **Created**: Generic `applyEffectFromScene(scene)` method that reads `scene.atmosphericEffect` property
- **Updated**: Event listener to call `applyEffectFromScene()` when `typewriter:complete` fires
- **Added**: Support for string effect names (`'dawn'`, `'shake'`, `'explosion'`, `'smoke'`, etc.)
- **Added**: Support for object-based effects with custom parameters: `{ type: 'border-glow', color: 'rgba(...)', duration: 4000 }`

### 2. UIController Update
Updated `js/engine/UIController.js` to emit full scene object in `typewriter:complete` event:
- **Before**: `this.eventBus.emit('typewriter:complete', { sceneId: scene.id })`
- **After**: `this.eventBus.emit('typewriter:complete', { scene: scene })`
- **Locations updated**: 3 instances (lines 485, 493, 500)

### 3. Content Files Updated

#### Pearl Harbor - Japanese Aviator
- `ja-scene-01`: `atmosphericEffectImmediate: "ocean"`
- `ja-scene-02`: `atmosphericEffect: "ocean-approach"`
- `ja-scene-03`: `atmosphericEffect: "harbor-burning"`
- `ja-scene-04`: `atmosphericEffect: "aa-fire"`, `atmosphericEffectImmediate: "shake"`
- `ja-scene-05`: `atmosphericEffect: "aftermath"`

#### Pearl Harbor - American Sailor
- `as-scene-01`: `atmosphericEffectImmediate: "ocean"`
- `as-scene-02`: `atmosphericEffect: "attack-chaos"`, `atmosphericEffectImmediate: "shake"`
- `as-scene-03`: `atmosphericEffect: "magazine-explosion"`, `atmosphericEffectImmediate: "shake"`
- `as-scene-04`: `atmosphericEffect: "burning-water"`
- `as-scene-05`: `atmosphericEffect: "aftermath"`

#### Pearl Harbor - American Civilian
- `ac-scene-01`: `atmosphericEffect: null`
- `ac-scene-02`: `atmosphericEffect: "civilian-explosion"`, `atmosphericEffectImmediate: "shake"`
- `ac-scene-03`: `atmosphericEffect: "smoke"`
- `ac-scene-04`: `atmosphericEffect: "civilian-fire"`
- `ac-scene-05`: `atmosphericEffect: "aftermath"`

#### Rwanda Missions
All Rwanda scenes (Tutsi Survivor, Hutu Moderate, UN Peacekeeper) already had `atmosphericEffect` properties defined. No changes needed.

## Architecture Compliance

### Before Refactor
- ❌ Engine file contained 71+ lines of hardcoded scene IDs
- ❌ Content strings (scene IDs) in logic file
- ❌ Tight coupling between engine and content

### After Refactor
- ✅ Engine file contains zero content strings
- ✅ All scene-specific data lives in content files
- ✅ Generic, reusable effect system
- ✅ EventBus communication pattern maintained
- ✅ Content files contain data only, zero logic

## Supported Effect Types

### String Effects
- `'dawn'` - Soft warm gradient
- `'shake'` - Screen shake with white flash
- `'explosion'` - Orange/red border glow
- `'smoke'`, `'smoke-light'`, `'smoke-medium'`, `'smoke-heavy'` - Various smoke intensities
- `'fire'`, `'fire-glow'` - Fire effects
- `'aftermath'`, `'aftermath-ash'` - Post-battle desaturation
- `'ash'` - Falling ash particles
- `'confined'` - Vignette for enclosed spaces
- `'ocean-approach'`, `'harbor-burning'`, `'aa-fire'`, `'attack-chaos'`, etc.

### Object Effects
```javascript
atmosphericEffect: {
  type: 'border-glow',
  color: 'rgba(120, 100, 80, 0.4)',
  duration: 4000
}
```

### Immediate Effects
Effects that trigger on scene load (before typewriter):
- `atmosphericEffectImmediate: "shake"` - For timed choice scenes
- `atmosphericEffectImmediate: "ocean"` - Continuous sway effect
- `atmosphericEffectImmediate: "shake-ocean"` - Combined effects

## Testing Required
- [ ] Verify all Pearl Harbor atmospheric effects still work correctly
- [ ] Verify all Rwanda atmospheric effects still work correctly
- [ ] Test immediate effects (shake, ocean) trigger before typewriter
- [ ] Test delayed effects trigger after typewriter completes
- [ ] Verify no console errors related to atmospheric effects
- [ ] Test on reduced-motion preference devices

## Commit
```
refactor(engine): remove hardcoded scene IDs from AtmosphericEffects

- Removed 71 lines of hardcoded Rwanda scene IDs from AtmosphericEffects.js
- Removed all Pearl Harbor scene ID checks from applyDelayedEffects()
- Created generic applyEffectFromScene() method that reads scene.atmosphericEffect
- Updated UIController to emit full scene object in typewriter:complete event
- Added atmosphericEffect properties to all Pearl Harbor scenes
- Architecture compliance: engine files contain zero content strings
```

**Commit SHA**: 64aaccefff57930190cd6e6d48b99494de5325bf
