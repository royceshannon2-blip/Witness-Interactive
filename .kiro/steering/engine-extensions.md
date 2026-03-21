# Witness Interactive — Engine Extensions for Haymarket

Applies to: `js/engine/StimuliManager.js`, `js/engine/ConsequenceSystem.js`, `js/engine/SceneStateMachine.js`, `js/main.js`.

---

## StimuliManager (New Engine Component)

### Responsibility
Display real primary source documents mid-scene when a scene's `stimuliUnlock` array is populated. Present an AP pause question after each document. Deduplicate documents across briefing and scene display.

### Interface

```javascript
class StimuliManager {
  constructor(eventBus)
  // Internal: called when scene:transition fires
  handleSceneTransition(sceneData)
  showDocument(documentId)
  showPauseQuestion(pauseQuestion)
  dismissDocument()
}
```

### Events consumed
- `scene:transition` — reads `data.scene.stimuliUnlock`; queues documents for display

### Events emitted
- `stimuli:shown` — `{ documentId }`
- `stimuli:pause-question-answered` — `{ documentId, correct, selectedId }`
- `stimuli:dismissed` — `{ documentId, answeredCorrectly }`

### Deduplication (Property 17)

```javascript
this.shownDocuments = new Set();  // session-scoped

showDocument(documentId) {
  if (this.shownDocuments.has(documentId)) return; // skip silently
  this.shownDocuments.add(documentId);
  // ... display logic
}
```

`hm-doc-1b` unlocks on briefing page 2 for all roles AND could also appear in a scene's `stimuliUnlock`. The Set prevents double-display. `hm-doc-1a` similarly appears in both LP Scene 01 and KB Scene 01 — the second player to reach it sees nothing (already shown).

### No-op behavior
If `stimuliUnlock` is absent, null, or `[]`, StimuliManager emits zero events. This must not throw.

### Pause question is required before dismissal
Player must answer the `pauseQuestion` before the dismiss button appears. If `pauseQuestion` is missing from a document (data error), log a warning and allow immediate dismissal.

### Initialization in main.js
StimuliManager must be instantiated **before any scene loads** — it must be listening before `scene:transition` fires for Scene 01.

```javascript
const stimuliManager = new StimuliManager(eventBus);
```

No other component needs a reference to it. It is self-contained via EventBus.

---

## ConsequenceSystem — Range-Check Extension

### What it is
`calculateOutcome()` currently only supports exact boolean matches in conditions objects. Haymarket needs numeric range-checks for `hm_lp_movement_trust`.

### New condition syntax
```javascript
// Existing (unchanged) — still valid
{ hm_lp_attended_rally: true }

// New range-check syntax
{ hm_lp_movement_trust: { gte: 3 } }
{ hm_lp_movement_trust: { lte: 1 } }
{ hm_lp_movement_trust: { gte: 2, lte: 4 } }
```

### Implementation (additive — existing logic unchanged)

In `_scoreConditions()` or equivalent, add a branch:

```javascript
if (typeof conditionValue === 'object' && conditionValue !== null) {
  // Range check
  if (conditionValue.gte !== undefined && actual < conditionValue.gte) return 0;
  if (conditionValue.lte !== undefined && actual > conditionValue.lte) return 0;
  score++;
} else {
  // Existing boolean/exact match
  if (actual !== conditionValue) return 0;
  score++;
}
```

### Error handling
- If a range condition value is not a plain object (e.g., a string), log a warning and treat as non-match. Do not crash.
- If `gte` or `lte` values are not numbers, log a warning and skip that bound.
- **Existing boolean matching is unchanged.** This extension is additive only.

### Haymarket survival cases

Add to `determineSurvival()`:

```javascript
case 'hm-lucy-parsons':
case 'hm-karl-brenner':
case 'hm-james-doyle':
  return { survived: true, deathChance: 0, modifiers: {} };
```

`shouldDieNow()` must return `{ dies: false, reason: '', deathChance: 0 }` for all three Haymarket role IDs.

---

## SceneStateMachine — initFlags Support

### What it is
When `loadRole()` is called, if the role export includes an `initFlags` object, apply each key-value pair as a flag via `consequenceSystem.setFlag()` **before** the first scene transition fires.

### Why this exists
Lucy Parsons has a numeric flag `hm_lp_movement_trust` that must start at `0`. Without explicit initialization, it would default to `undefined`, and `undefined >= 3` evaluates unpredictably. The psychology system defaults other scores to 50 — that must never bleed into this flag.

### Implementation

```javascript
loadRole(missionId, roleId, scenes) {
  // ... existing validation ...

  // Apply initFlags BEFORE first scene transition
  if (role.initFlags && this.consequenceSystem) {
    for (const [flagName, value] of Object.entries(role.initFlags)) {
      this.consequenceSystem.setFlag(flagName, value);
    }
  }

  // ... existing first scene transition ...
}
```

The `loadRole()` method receives the role object from `main.js`. `main.js` must pass the full role object (not just the scenes array) so SceneStateMachine can read `initFlags`.

### Lucy Parsons role export structure

```javascript
export default {
  id: 'hm-lucy-parsons',
  initFlags: { hm_lp_movement_trust: 0 },  // REQUIRED — explicit zero initialization
  scenes: lucyParsonsScenes,
  outcomes: lucyParsonsOutcomes
}
```

---

## Post-Ripple Question — Engine Flow

### Problem
`postRippleQuestion` is stored in `mission.js` but no existing engine component triggers its display. The current flow is: `ripple events play → Continue button → knowledge checkpoint`. The post-ripple question must appear between ripple and checkpoint.

### Resolution
UIController intercepts the ripple Continue button click and checks `mission.postRippleQuestion`:

```javascript
// In attachEventListeners (historical-ripple screen)
const continueButton = screen.querySelector('#continue-to-checkpoint');
if (continueButton) {
  continueButton.addEventListener('click', () => {
    const mission = this.missionRegistry.getMission(this.currentMissionId);
    if (mission?.postRippleQuestion) {
      this.showPostRippleQuestion(mission.postRippleQuestion);
    } else {
      this.showScreen('knowledge-checkpoint');
    }
  });
}
```

`showPostRippleQuestion()` renders a question overlay, accepts an answer, shows the explanation, then routes to the knowledge checkpoint.

This must be resolved in Phase 1 (engine) before content writing begins — not discovered during Phase 4 integration.

---

## Correctness Properties Checklist

Before marking any Haymarket phase complete, verify:

| Property | What to check |
|----------|--------------|
| P1: Mission round-trip | `getMission('haymarket-affair')` returns correct id and roles |
| P2: Relative asset paths | No `ambientTrack` or `narratorAudio` starts with `/` |
| P3: hm_ flag prefix | All `consequences` keys start with `hm_` |
| P4: Stimulus flow | `stimuli:shown` fires once per doc per scene transition with stimuliUnlock |
| P5: No-op on empty | Empty/null/absent `stimuliUnlock` emits zero events |
| P6: Prediction structure | `predictionQuestion` has `reveal`, has NO `correctId` |
| P7: SPICE-T per scene | Every scene has non-empty `spiceT` |
| P8: All 6 SPICE-T covered | All six themes appear across 18 scenes |
| P9: AP tagging complete | Every scene has `apThemes` (valid values), `apKeyConcept` (KC-X.X.X pattern), `apUnit` |
| P10: Stimulus docs complete | All 7 documents have all required fields including `spiceT`, `apUnit`, `pauseQuestion` |
| P11: Catch-all last | Last outcome in every role's array has `conditions: {}` |
| P12: No death checkpoints | No Haymarket scene has `deathCheckpoint: true` |
| P13: Question set complete | Each role has at least one `before`, `during`, `cross-role`, and `synthesis` question |
| P14: movement_trust range | `hm_lp_movement_trust` always stays in [0, 5] |
| P15: Range-check eval | `{ gte: 3 }` with value 3 = match; value 2 = no match |
| P16: Haymarket survival | All three role IDs return `survived: true, deathChance: 0` |
| P17: Deduplication | Showing a doc ID twice emits `stimuli:shown` only once |
