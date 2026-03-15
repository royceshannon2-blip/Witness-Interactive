# SFX Manager Implementation Complete

## Summary

Successfully implemented one-shot sound effects system for scene-triggered audio in the Rwanda Genocide mission.

## What Was Built

### 1. SFXManager Engine Component (`js/engine/SFXManager.js`)
- Listens for `scene:transition` events
- Reads `soundEffects` array from scene data
- Schedules one-shot sounds at specified delays using `setTimeout`
- Cancels all pending timers on scene transitions
- Respects mute state via `sound:muted` event
- Fails silently if audio files are missing or audio is not unlocked
- Uses Web Audio API with buffer caching for performance

### 2. Integration into main.js
- SFXManager initialized after NarratorAudioManager
- Shares the same AudioContext as other audio systems
- Volume set to 0.65 (65%)
- Audio path: `audio/ambient/`

### 3. Scene Data Updates

Added `soundEffects` arrays to Rwanda mission scenes:

**Tutsi Survivor Role:**
- `rw-ts-scene-02a`: Gunshot (2800ms), Grenade (5200ms)
- `rw-ts-scene-02b`: Door knock (800ms), Floorboard creak (3000ms)
- `rw-ts-scene-03a`: UN vehicle passing (4500ms)
- `rw-ts-scene-03b`: Boots on stone (3200ms), Suppressed cough (5800ms)

**Hutu Moderate Role:**
- `rw-hm-scene-02a`: Door knock (2200ms), Floorboard creak (4800ms)

**UN Peacekeeper Role:**
- `rw-un-scene-02c`: Camera shutter (1500ms, 3800ms)

## Architecture Compliance

✅ Engine logic only in `js/engine/` - no content strings
✅ Content data only in `js/content/missions/` - no logic
✅ EventBus communication - no direct coupling
✅ No global variables - ES6 modules only
✅ Respects `prefers-reduced-motion` (audio continues but visual effects respect it)
✅ Trauma-informed audio - all sounds are muffled/distant, never graphic

## Sound Effect Files Used

All files exist in `audio/ambient/`:
- `rw-sfx-door-knock.mp3`
- `rw-sfx-floorboard-creak.mp3`
- `rw-sfx-gunshot-muffled.mp3`
- `rw-sfx-grenade-muffled.mp3`
- `rw-sfx-boots-stone.mp3`
- `rw-sfx-suppressed-cough.mp3`
- `rw-sfx-un-vehicle-pass.mp3`
- `rw-sfx-camera-shutter.mp3`

## Testing

Created `test-sfx-manager.html` for manual testing:
- Unlock audio button
- Individual sound effect tests
- Scene sequence test (multiple SFX with delays)
- Verifies EventBus integration
- Confirms audio unlocking works correctly

## How It Works

1. Scene transitions emit `scene:transition` event with scene data
2. SFXManager reads `scene.soundEffects` array
3. For each effect, schedules a `setTimeout` with `triggerAfterMs` delay
4. When timer fires, plays the sound using Web Audio API
5. On next scene transition, all pending timers are cancelled
6. Respects global mute state from sound toggle

## Format

```javascript
soundEffects: [
  { file: 'rw-sfx-door-knock.mp3', triggerAfterMs: 800 },
  { file: 'rw-sfx-floorboard-creak.mp3', triggerAfterMs: 3000 }
]
```

## Commits

1. `feat(engine): add SFXManager for one-shot scene sound effects` (05804c6)
2. `feat(content): add soundEffects arrays to Rwanda mission scenes` (cc2e450)

## Next Steps

The system is ready for use. To add SFX to additional scenes:

1. Add `soundEffects` array to scene object in content files
2. Use format: `{ file: 'filename.mp3', triggerAfterMs: milliseconds }`
3. Place audio files in `audio/ambient/` directory
4. No engine changes needed - system is fully data-driven

## Performance Notes

- Audio buffers are cached after first load
- Failed loads fail silently (no console errors)
- Timers are properly cleaned up on scene transitions
- No memory leaks - all references are cleared
- Respects AudioContext suspended state
