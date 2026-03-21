# Witness Interactive — Architecture Rules

Applies to: **all files** in this repository.

---

## Hard Rules — Never Violate

### Module system
- ES6 modules only. No CommonJS (`require`, `module.exports`).
- Every import uses a relative path with `.js` extension: `import Foo from './Foo.js'`
- No npm packages, no build tools, no bundlers, no frameworks.
- No global variables. Every component is a class exported as `export default`.

### Layer separation
- **Engine layer** (`js/engine/`): zero content strings. Logic only.
- **Content layer** (`js/content/`): zero logic. Data and strings only.
- No engine file may import from a content file.
- No content file may import from an engine file.
- Components communicate exclusively via EventBus — no direct coupling.

### Asset paths
- All audio, image, and asset paths in content files must be **relative** (start with `./` or `../`).
- Never use absolute paths (`/audio/...`).

### CSS
- All values for UI elements use CSS custom properties defined in `css/style.css`.
- No inline style values hardcoded in JS.

### No death mechanic for Haymarket
- All Haymarket scenes: `deathCheckpoint: false` (or field absent).
- `ConsequenceSystem.determineSurvival()` returns `{ survived: true, deathChance: 0, modifiers: {} }` for all three Haymarket role IDs.

---

## Consequence Flag Prefixes

Every mission uses a unique prefix for its flags to prevent cross-mission contamination:

| Mission | Prefix |
|---------|--------|
| Pearl Harbor | (no prefix — legacy) |
| Rwanda | `rw_` |
| Urban Design | `ud_` |
| Haymarket | `hm_` |

Within Haymarket, role-specific sub-prefixes apply:
- Lucy Parsons: `hm_lp_`
- Karl Brenner: `hm_kb_`
- James Doyle: `hm_jd_`

---

## Psychology Effects

Valid keys for `psychologyEffects` on any choice object:
```
morale | loyalty | humanity | composure
```

**`awareness` is NOT a valid key.** It was a naming bug caught during Rwanda development. Never use it.

---

## Outcome Array Rule

Every role's `outcomes` array must have an empty-conditions catch-all as the **last** item:
```javascript
{ id: "...-default", survived: true, conditions: {}, epilogue: `...` }
```

The scoring system picks the highest-scoring match; the catch-all wins only when nothing else matches. If it is not last, it will win for every player.

---

## Audio Null Guard

NarratorAudioManager has a null guard on `src`. All audio paths are placeholders until recording. Never crash on a missing file — log and continue.

---

## EventBus Pattern

```javascript
// Subscribe
this.eventBus.on('event:name', this.handler.bind(this));

// Emit
this.eventBus.emit('event:name', { key: value });
```

No component holds a reference to another component. All communication is event-driven.
