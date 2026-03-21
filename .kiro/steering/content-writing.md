# Witness Interactive — Content Writing Standards

Applies to: all files in `js/content/missions/` and `js/content/ui-content.js`.

---

## Writing Register — Geraldine Brooks

All scene narratives, outcome epilogues, and briefing newspaper text must follow this register:

- **Sensory and specific.** Smell of machine oil. Weight of a machete. The sound of specific radio static. Never abstract.
- **Second person present tense.** "You stand at the gate. The whistle blows."
- **Factually grounded.** Every named person, date, location, and statistic must be historically accurate. No invented facts.
- **No anachronistic language.** Do not use modern idioms, contemporary slang, or post-event framing in the narrative voice.
- **Show, don't name the emotion.** Never write "you feel afraid." Write what fear looks like in the body and environment.
- **Scenes: 150–250 words.** Epilogues: 200–300 words. Briefing pages: 250–400 words.

---

## Scene Object — Full Required Schema

Every scene in every Haymarket role file must include all of these fields:

```javascript
{
  id: "hm-lp-scene-01",           // role prefix + sequential number
  narrative: `...`,                // 150–250 words, second person present tense

  // AP tagging — ALL THREE REQUIRED
  apThemes: ["contextualization", "perspective"],  // AP Reasoning Processes (see below)
  apKeyConcept: "KC-5.1.I",                        // AP key concept code, pattern KC-X.X.X
  apUnit: "Unit 6.5",                              // AP unit section number (Unit X.X)

  // SPICE-T — REQUIRED, non-empty
  spiceT: ["Social", "Economic"],   // 1–3 values from the SPICE-T set

  // Audio — use relative paths
  atmosphericEffect: null,          // or 'shake', 'smoke', etc.
  ambientTrack: "./audio/ambient/hm-ambient-westside-evening.mp3",
  narratorAudio: "./audio/narration/lucy-parsons/hm-lp-scene-01.mp3",

  // New Haymarket mechanics
  stimuliUnlock: ["hm-doc-1a"],    // array of document IDs, or []
  predictionQuestion: null,         // or prediction object (see below)
  timedChoice: null,                // or { enabled: true, duration: N, defaultChoice: 'id' }
  deathCheckpoint: false,           // ALWAYS false for Haymarket

  choices: [
    {
      id: "hm-lp-choice-01-a",
      text: "...",
      consequences: {
        hm_lp_movement_trust: 1,     // numeric increment
        hm_lp_spoke_publicly: true   // boolean flag
      },
      psychologyEffects: {           // optional
        morale: 1,
        humanity: 1
        // VALID: morale | loyalty | humanity | composure
        // INVALID: awareness (this is a bug — never use it)
      },
      nextScene: "hm-lp-scene-02"
    }
  ]
}
```

---

## AP Reasoning Processes

Valid values for `apThemes`:
```
causation | contextualization | continuity | perspective | argumentation | complexity
```

**Coverage requirement across 18 Haymarket scenes (6 per role):**
- All six values must appear at least twice.
- Scenes 01 for all three roles (pre-event, establishing context) must use `contextualization`.
- Do not over-index on `causation`. It was the only tag used before Mrs. Hauf's review.

---

## SPICE-T Themes

Valid values for `spiceT`:
```
Social | Political | Interaction with Environment | Cultural | Economic | Technological
```

**Coverage requirement:**
- All six themes must appear across the 18 Haymarket scenes.
- Every scene must have at least one.
- Every knowledge question must have at least one.
- Every ripple event must have at least one.
- Every briefing page must have at least one.

---

## Prediction Question Format

```javascript
predictionQuestion: {
  question: "What do you predict will be the most immediate consequence of [current situation]?",
  options: [
    { id: "a", text: "..." },
    { id: "b", text: "..." },
    { id: "c", text: "..." },
    { id: "d", text: "..." }
  ],
  // NO correctId — prediction questions are unscored
  reveal: "Historical note: what actually happened, 2–3 sentences."
}
```

Prediction questions are **unscored**. No `correctId` field. All four options are plausible. The `reveal` shows what historically occurred after the player answers.

Placement: at least one per role, in the scene immediately before the bomb explosion.

---

## Knowledge Question Format

```javascript
{
  id: "hm-lp-q-01",
  roleSpecific: "hm-lucy-parsons",    // role ID
  questionType: "before",              // "before" | "during" | "cross-role" | "synthesis"
  apSkill: "contextualization",        // AP Reasoning Process
  spiceT: ["Economic", "Social"],      // required
  apUnit: "Unit 6.5",                  // required
  question: "Which of the following best explains...",  // APUSH exam stem phrasing
  options: [
    { id: "a", text: "...", correct: true },
    { id: "b", text: "...", correct: false },
    { id: "c", text: "...", correct: false },
    { id: "d", text: "...", correct: false }
  ],
  explanation: "...citing specific historical evidence..."
}
```

**questionType rules:**
- `"before"` — pre-event context, briefing-phase knowledge
- `"during"` — the event itself
- `"cross-role"` — asks player to consider another role's perspective; tag `apSkill: "perspective"`
- `"synthesis"` — connects Haymarket to broader historical pattern across time; tag `apSkill: "argumentation"`

**Each role must have at least one of each type.**

**Stem language** must use standard APUSH exam phrasing:
- "Which of the following best explains..."
- "The excerpt best supports which of the following arguments..."
- "Which of the following most directly caused..."
- "Which of the following represents the most significant long-term effect of..."

**Synthesis questions** — the correct answer must model AP skill 6.D complexity: qualify or complicate the argument, not just support it. Example: "X demonstrated Y, while simultaneously Z, which limited its effectiveness."

**Sourcing questions** (on `hm-doc-2` and `hm-doc-4`) must address AP Historical Thinking Skill 2: ask about the author's purpose, intended audience, or how the source's origin limits its reliability.

---

## Stimulus Document Format

```javascript
{
  id: "hm-doc-3",
  title: "Revenge Circular",
  source: "August Spies, Chicago, May 3, 1886",
  date: "May 3, 1886",
  spiceT: ["Political", "Social"],
  apUnit: "Unit 6.5",
  text: `[authentic quoted primary source text]`,
  pauseQuestion: {
    question: "...",
    options: [
      { id: "a", text: "...", correct: false },
      { id: "b", text: "...", correct: true },
      { id: "c", text: "...", correct: false },
      { id: "d", text: "...", correct: false }
    ],
    correctId: "b",
    explanation: "...citing specific historical evidence..."
  }
}
```

All 7 stimulus documents must contain **authentic quoted text** from the real primary source — not summaries or paraphrases. For visual sources (Harper's Weekly cartoon), provide an accurate description of the image and its original caption text.

---

## Outcome Conditions — Range-Check Syntax

For numeric flags like `hm_lp_movement_trust`, outcomes use range-check conditions:

```javascript
// Exact boolean (existing syntax — still valid)
{ hm_lp_attended_rally: true }

// Range check (new syntax — Haymarket only)
{ hm_lp_movement_trust: { gte: 3 } }
{ hm_lp_movement_trust: { lte: 1 } }
{ hm_lp_movement_trust: { gte: 2, lte: 4 } }
```

`hm_lp_movement_trust` must be initialized to `0` via `initFlags` on the Lucy Parsons role export. It must never inherit the psychology system's default of 50.

---

## Briefing Page Metadata

```javascript
{
  // ... existing fields ...
  spiceT: ["Economic", "Social"],   // required
  apUnit: "Unit 6.5",               // required
  apTheme: "contextualization"      // required
}
```

---

## Named Characters — Haymarket

Do not rename or remove these characters. They are locked.

| Role | NPC | Occupation | Must appear in |
|------|-----|-----------|---------------|
| Lucy Parsons | **Wilhelm** | Ink pressman (print trade worker) — Pinkerton informant. The irony that a *labor press worker* is informing on the labor movement is intentional and must be in the narrative. | LP Scene 02 |
| Karl Brenner | **Heinrich Müller** | Machinist, coworker | KB Scenes 01 and 03 |
| James Doyle | **Captain William Ward** | Pinkerton handler | JD Scenes 02 and 04 |
