# Witness Interactive — AP Curriculum Alignment

Applies to: all content files, all knowledge questions, all scene tags.

This file is the reference for correct AP tagging. When in doubt, check here before tagging a scene.

---

## AP US History — Unit Structure (Haymarket)

| Unit | Section | Topic | Haymarket relevance |
|------|---------|-------|---------------------|
| Unit 6 | 6.5 | Labor and Working-Class Identity | Core — eight-hour movement, Haymarket, Knights of Labor |
| Unit 6 | 6.6 | Reform and Labor | May Day, Altgeld pardon, lasting labor movement |
| Unit 7 | 7.1 | Progressivism and Reform | Red Scare, FLSA, government-labor relations |

Always use `Unit X.X` format (e.g., `"Unit 6.5"`). Not `"6.5"` or `"KC"` alone.

---

## AP Key Concept Codes — Haymarket-Relevant

| Code | Content |
|------|---------|
| KC-5.1.I | Industrial capitalism created a wage labor system; workers organized to improve conditions |
| KC-5.1.II | Workers protested conditions; state and corporate power suppressed labor organizing |
| KC-5.2.I | Immigrants played central roles in industrial labor and created ethnic communities |
| KC-5.4.I | Government sided with business over labor; Pinkertons, state militias, federal troops used against strikes |
| KC-7.1.I | Progressive Era reform targeted corporate power; Red Scare suppressed labor radicalism |

---

## AP Reasoning Processes — Valid Values

```
causation          — What caused it? What resulted from it?
contextualization  — What was the broader world like before/around this event?
continuity         — What changed? What stayed the same? Over what period?
perspective        — How did different people experience or interpret this?
argumentation      — What argument does the evidence support? How do you qualify it?
complexity         — How do multiple factors, perspectives, or periods complicate this?
```

**Coverage requirement across 18 Haymarket scenes:** All six must appear at least twice.

**Scene 01 for all three roles must use `contextualization`** — these scenes establish the pre-event world (industrial Chicago, immigrant labor, Pinkerton surveillance). That is exactly what contextualization means.

---

## SPICE-T Themes — Valid Values

```
Social                    — Social structures, class, community, family
Political                 — Government, law, power, policy, elections
Interaction with Environment  — Geography, climate, natural resources, human impact
Cultural                  — Beliefs, religion, arts, ideas, identity
Economic                  — Trade, labor, wealth, poverty, markets
Technological             — Tools, machines, innovation, transportation
```

**Coverage requirement:** All six must appear across the 18 Haymarket scenes combined.

**Mapping guide for Haymarket:**
- `Social` — immigrant communities, labor solidarity, class conflict
- `Political` — Pinkerton surveillance, trial, conspiracy charges, Altgeld pardon
- `Interaction with Environment` — factory conditions, the physical square, industrial city
- `Cultural` — German immigrant press (Arbeiter-Zeitung), IWPA culture, labor identity
- `Economic` — wages, hours, eight-hour demand, McCormick lockout
- `Technological` — machine labor, printing press, industrial tools

---

## Question Types — Haymarket Three-Phase Architecture

Mrs. Hauf's core structural requirement. Questions appear in three phases:

### Phase 1: Before (Briefing)
- Mechanism: AP pause questions attached to stimulus documents in the briefing
- `hm-doc-0` (Hayes troop order) unlocks mid-briefing page 4 for all roles
- `hm-doc-1b` (BLS wage data) unlocks on briefing page 2 for all roles
- These pause questions establish the economic and political context before the story begins

### Phase 2: During (Story Mode)
- Mechanism: `predictionQuestion` objects in scene objects
- Placed in the scene immediately before the bomb (Scene 03 for LP, Scene 03 for KB, Scene 03 for JD)
- **Unscored** — no `correctId` — player predicts, then sees `reveal` showing what actually happened
- Purpose: AP causation skill practiced in real-time

### Phase 3: After (Post-Ripple + Checkpoint)
- Mechanism 1: `postRippleQuestion` in `mission.js` — same for all roles, displayed after ripple timeline
- Mechanism 2: Knowledge checkpoint questions in `knowledge-questions.js`
- Synthesis questions connect Haymarket to events across time (cross-period comparison)

---

## Four Knowledge Question Types

Each role's checkpoint must include all four types:

### `"before"` — Pre-event context
- Tests briefing-phase knowledge
- `apSkill`: usually `contextualization`
- Topic: conditions that led to Haymarket (wages, hours, immigrant labor, Pinkerton history)

### `"during"` — The event itself
- Tests story-phase knowledge
- `apSkill`: usually `causation` or `perspective`
- Topic: McCormick shooting, Revenge Circular, the bomb, the trial

### `"cross-role"` — Another role's perspective
- Asks player to consider how someone from a different role would see the same event
- `apSkill`: always `perspective`
- `spiceT` always includes `Political`
- Example: "A Pinkerton detective assigned to monitor labor meetings in 1886 would most likely have interpreted the eight-hour movement as..."

### `"synthesis"` — Broader historical connection
- Connects Haymarket to events outside the immediate 1886–1938 window
- `apSkill`: always `argumentation`
- Correct answer must model AP skill 6.D: **qualify or complicate the argument**, not just support it

---

## AP Skill 6.D — Required for Synthesis Correct Answers

AP skill 6.D (Corroborate, Qualify, or Modify an Argument) is the most complex argumentation skill. A 6.D answer:
- Acknowledges that a historical development had **contradictory effects**
- Does not simply agree with a claim — it qualifies or complicates it
- Uses words like "while simultaneously," "however," "which also," "despite"

**Model answer structure:**
> "[X] established [Y], while simultaneously [Z], which [limited/complicated/contradicted] its effect."

**Haymarket example (post-ripple question):**
> "The Haymarket trial established a precedent for using conspiracy charges against labor organizers, while simultaneously galvanizing international labor solidarity and contributing to the eventual passage of the eight-hour workday."

This is correct because it acknowledges the suppressive effect (conspiracy precedent) AND the galvanizing effect (May Day, FLSA) — two contradictory outcomes from the same event.

---

## AP Historical Thinking Skill 2 — Sourcing (Required for hm-doc-2 and hm-doc-4)

AP Skill 2 (Sourcing and Situation) asks: Who created this source? For what audience? For what purpose? How does the source's origin limit its reliability?

The pause questions for `hm-doc-2` (Harper's Weekly) and `hm-doc-4` (Chicago Tribune) MUST test Skill 2, not just factual recall.

**Bad pause question (factual recall):**
> "How many police officers died in the Haymarket bombing according to this article?"

**Good pause question (Skill 2 sourcing):**
> "The Chicago Tribune's framing of the Haymarket bombing as an 'anarchist conspiracy' best reflects which of the following about the source? (A) The Tribune's editorial staff conducted an independent investigation... (B) The Tribune's close ties to business interests shaped its interpretation of the bombing as a threat to social order..."

The question must address: the publication's readership, its editorial stance, its relationship to labor vs. capital, or how its intended audience explains its framing.

---

## APUSH Exam Stem Phrasing

All question stems must use standard APUSH exam phrasing. Do not write vague or conversational stems.

**Required formats:**
- "Which of the following best explains why..."
- "Which of the following most directly caused..."
- "The excerpt best supports which of the following arguments..."
- "Which of the following represents the most significant long-term effect of..."
- "A [historical actor] would most likely have interpreted [event] as..."
- "Which of the following best evaluates..."

**Do not write:**
- "What do you think about..."
- "Can you explain..."
- "Why was the Haymarket Affair important?"
- Any question that could be answered with one word
