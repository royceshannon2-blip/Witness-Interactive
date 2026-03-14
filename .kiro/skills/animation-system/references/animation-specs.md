# Animation Implementation Specifications

---

## 1. `identity-card-flip`
**Scenes:** rw-ts-scene-02c (hotel roadblock), rw-ts-scene-03e (Paul at roadblock), rw-ts-scene-03f (stadium gate)

**Behavior:**
- Card appears center-screen, face down on dark background
- CSS 3D Y-axis flip (0.6s ease)
- Front face shows "TUTSI" or "HUTU" in colonial typeface
- Fades out after 1.5s, gameplay continues unblocked

**Options:** `{ ethnicity: "TUTSI" | "HUTU", delayMs: 0 }`

```css
.card-flip-container {
  perspective: 1000px;
  width: 200px; height: 120px;
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 10;
}
@keyframes flipCard {
  from { transform: rotateY(0deg); }
  to   { transform: rotateY(180deg); }
}
```

---

## 2. `machete-sweep`
**Scenes:** rw-ts-scene-02a (church massacre), any scene with `rw-sfx-gunshot-muffled` or `rw-sfx-grenade-muffled`

**Behavior:**
- Dark silhouette SVG arm + machete sweeps across lower third of screen
- Single arc, 0.4s ease-in
- Color: `#8B0000` (dark red) on dark background
- No gore — implied violence only. This content is viewed in AP classrooms.

```js
// SVG path: arm silhouette, translateX(-120%) → translateX(0) in 0.4s
// Remove after animation completes
```

---

## 3. `screen-shake`
**Scenes:** Any with `atmosphericEffect: "shake"` — grenade, gunshot moments

**Behavior:** Shakes `.scene-container` 0.5s, 8px offset, eases out. Sync with SFX timing.

```css
@keyframes screenShake {
  0%, 100% { transform: translateX(0); }
  20%       { transform: translateX(-8px); }
  40%       { transform: translateX(8px); }
  60%       { transform: translateX(-5px); }
  80%       { transform: translateX(5px); }
}
```

**Options:** `{ intensity: "light" | "heavy", delayMs: 0 }`

---

## 4. `vignette-tighten`
**Scenes:** rw-ts-scene-03b (church ceiling), rw-ts-scene-03c (attic), rw-ts-scene-03a (drainage ditch)

**Behavior:**
- Radial gradient overlay, transparent center, black edges
- Tightens inward from 80% to 50% visible radius over 3s
- Stays at maximum until cleanup()
- `pointer-events: none`

```css
/* Overlay div */
background: radial-gradient(ellipse at center, 
  transparent var(--vignette-radius), 
  rgba(0,0,0,0.85) calc(var(--vignette-radius) + 15%));
/* Animate --vignette-radius from 80% to 50% */
```

**Options:** `{ tightnessPercent: 50, durationMs: 3000 }`

---

## 5. `dust-particles`
**Scenes:** rw-ts-scene-03b (church ceiling), any attic/enclosed space scene

**Behavior:** 12–15 CSS particle divs float downward slowly. Random opacity 0.2–0.6, size 2–5px, horizontal drift. Loops continuously, very subtle.

```css
@keyframes dustFall {
  from { transform: translateY(-10px) translateX(0); opacity: 0; }
  50%  { opacity: var(--particle-opacity); }
  to   { transform: translateY(100vh) translateX(var(--drift)); opacity: 0; }
}
```

---

## 6. `dawn-to-smoke`
**Scenes:** Scene 01 of each Rwanda role

**Behavior:**
- Starts: warm orange gradient at viewport top (#FF6B35)
- Over 8s: orange bleeds to grey (#4a4a4a) from edges inward
- Represents April 7th morning turning to catastrophe

```css
.atmospheric-dawn-to-smoke {
  /* Layer 1: orange dawn (base) */
  /* Layer 2: grey smoke overlay, opacity animates 0→1 over 8s */
}
```

---

## 7. `roadblock-silhouettes`
**Scenes:** rw-ts-scene-02c (hotel roadblock), rw-ts-scene-03e (Paul at roadblock), rw-un-scene-02b (evacuation convoy)

**Behavior:**
- Row of dark SVG militia silhouettes along bottom of screen
- Torch flicker effect on each (random opacity animation)
- One silhouette steps forward slightly when choice moment arrives
- `pointer-events: none`

```css
@keyframes torchFlicker {
  0%, 100% { opacity: 0.8; }
  50%      { opacity: 0.5; }
}
/* Random animation-delay per silhouette for non-uniform flicker */
```

---

## 8. `typewriter-cursor-pulse`
**Scenes:** All scenes — modifies existing typewriter implementation

**Behavior:** Cursor pulse color varies by scene type:
- Crisis scenes (church, roadblock, militia): `#CC0000` (red)
- Hiding scenes (attic, ceiling, ditch): `#555555` (dim)
- Epilogue/outcome: `#B8860B` (amber)

Add class to `.scene-container` before typewriter runs:
- `scene-crisis` → red cursor
- `scene-hiding` → dim cursor  
- `scene-epilogue` → amber cursor

**Typewriter speed:**
- Normal: 25ms/character
- Crisis (`atmosphericEffect: "shake"` or `"smoke"`): 18ms
- Epilogue: 30ms

---

## 9. `un-vehicle-pass`
**Scenes:** rw-ts-scene-03a (drainage ditch), rw-ts-scene-03f (stadium), rw-un-scene-02b

**Behavior:**
- White UN vehicle SVG slides L→R across bottom of screen
- Blue helmet visible, "UN" on side
- Duration: 2.5s linear, then off-screen
- Syncs with `rw-sfx-un-vehicle-pass.mp3`

```js
// SVG, translateX(-150px → 110vw), 2.5s linear
// Triggered at triggerAfterMs from scene soundEffects array
```

---

## 10. `radio-static-flash`
**Scenes:** Scene 01 Tutsi Survivor, Scene 01 Hutu Moderate (RTLM radio mentioned)

**Behavior:**
- 0.3s screen flash of low-opacity static (SVG feTurbulence or CSS noise)
- Waveform line crackles across top of screen
- Very subtle — does not obscure text

---

## Atmospheric Effects (CSS — not JS animations)
These are applied via `scene.atmosphericEffect` field, handled by `AtmosphericEffects.js`:

```css
/* dawn */
.atmospheric-dawn::before {
  content: ''; position: fixed; top:0; left:0; right:0; height: 3px;
  background: linear-gradient(to right, transparent, #FF6B35, transparent);
  opacity: 0.6;
}

/* smoke */
.atmospheric-smoke::before {
  content: ''; position: fixed; inset: 0;
  background: radial-gradient(ellipse at top, rgba(74,74,74,0.15) 0%, transparent 60%);
  pointer-events: none;
}

/* shake — applied once then removed */
.atmospheric-shake { animation: screenShake 0.5s ease-out; }
```
