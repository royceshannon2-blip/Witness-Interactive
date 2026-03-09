# Feature Verification Checklist

## How to Test (Clear Browser Cache First!)

**IMPORTANT**: Before testing, clear your browser cache:
- Chrome/Edge: Ctrl+Shift+Delete → Clear cached images and files
- Firefox: Ctrl+Shift+Delete → Cached Web Content
- Or use Incognito/Private mode

## Features to Verify

### 1. Typewriter Effect ✓
- **What to look for**: Text appears character-by-character
- **How to test**: Start any role, watch the narrative text
- **Expected**: Text reveals gradually (not all at once)
- **Skip test**: Click anywhere during text reveal - should complete instantly

### 2. Scene Transitions ✓
- **What to look for**: Fade animation between scenes
- **How to test**: Make a choice and watch the transition
- **Expected**: Screen fades out, then fades in with new scene

### 3. Timed Choices ✓
- **What to look for**: Countdown timer appears on some choices
- **How to test**: Play as Arizona sailor (most timed choices)
- **Expected**: 
  - Circular timer appears
  - Countdown shows seconds remaining
  - Timer turns red when < 3 seconds
  - Auto-selects default choice if time expires

### 4. Atmospheric Effects ✓
- **What to look for**: Visual effects like smoke, fire, explosions
- **How to test**: Play through combat scenes
- **Expected**: Screen effects overlay (smoke particles, flash effects, etc.)

### 5. Ambient Sound ✓
- **What to look for**: Background audio plays
- **How to test**: 
  - Unmute sound (speaker icon in top-right)
  - Start any role
- **Expected**: 
  - Ocean waves (sailor)
  - Aircraft engines (aviator)
  - Peaceful morning (civilian)
  - Sound changes between scenes

### 6. Enhanced Choice Buttons ✓
- **What to look for**: Hover effects on choice buttons
- **How to test**: Hover mouse over choice buttons
- **Expected**: Buttons scale up slightly and show shadow

## Troubleshooting

### "I don't see any of these features"
1. **Clear browser cache** (most common issue)
2. Hard refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
3. Try Incognito/Private browsing mode
4. Check browser console (F12) for errors

### "Typewriter works but nothing else"
- Check that you're testing the right features:
  - Timed choices: Only on Arizona sailor role
  - Atmospheric effects: Only on combat/dramatic scenes
  - Ambient sound: Must unmute first

### "Sound doesn't play"
1. Click the speaker icon to unmute
2. Check browser console for audio loading errors
3. Verify audio files exist in `/audio/ambient/`

## Console Verification

Open browser console (F12) and look for:
```
✓ TypewriterEffect initialized
✓ SceneTransition initialized
✓ AtmosphericEffects initialized
✓ TimedChoiceSystem initialized
✓ AmbientSoundManager initialized
✓ UIController initialized
```

If you see all these, the features are loaded correctly.
