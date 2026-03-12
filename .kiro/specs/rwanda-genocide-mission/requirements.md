# Rwanda Genocide Mission — Requirements Document

## Mission Overview

**Feature Name:** rwanda-genocide-mission  
**Mission ID:** `rwanda-genocide`  
**Historical Date:** April 6, 1994  
**Era:** Modern  
**Educational Context:** AP Human Geography / AP World History

This mission implements the Rwandan Genocide (April–July 1994) as a playable historical experience within Witness Interactive, following the same architecture patterns established by the Pearl Harbor mission while introducing significantly deeper branching narrative structures.

## Student Perspective — What This Mission Must Deliver

From AP Human Geography students who analyze "Scale," "Political Boundaries," and "Ethnic Conflict":

**1. Learning Without the Quiz Feel**
- Students want to apply upper-level skills (causation, complexity, perspective) by living through scenarios, not reading lists
- The mission must feel like an experience, not "extra work"
- AP reasoning skills must emerge from choices themselves, not from tooltips or labels

**2. Choices That Actually Snowball**
- Early decisions (hiding a neighbor, staffing a roadblock) must visibly change later scenes
- If a player helps Celestin in Scene 1, Celestin must appear in Scene 5 or affect the gacaca outcome
- Branching must be real, not cosmetic — students will lose interest if paths feel identical

**3. The "Why" Behind the Conflict**
- Students need to understand human motivation, not just textbook facts about RPF and Hutu Power
- The "good" choice isn't always easy: Would I risk my family to save a stranger?
- The aftermath (gacaca courts, "no ethnicity" policy) shows the trade-off between justice and peace

**4. Evidence for FRQs (Free Response Questions)**
- Students are always thinking about AP Exam applications
- Seeing identity cards used at roadblocks makes political geography concepts stick better than lectures
- The mission must help students "personalize content" for better application to exam contexts

**5. Authenticity and Weight**
- Students know this is heavy and don't want gratuitous violence
- They want "horror in the choices" to be real
- Using witness accounts (Genocide Fax, Hotel des Mille Collines conditions) makes it feel important

**6. No "Perfect" Endings**
- Students learn that reconciliation is real but imperfect
- Every path must have a cost
- Even the "reconciliation" path must show tension and compromise
- A single "good" choice shouldn't lead to "happily ever after"

**Design Implication:**
Every requirement in this document must serve these student needs. If a feature doesn't help students understand causation, feel the weight of choices, or prepare for AP exams, it should be reconsidered.

## Design Philosophy

This mission was requested by an AP Human Geography teacher with specific pedagogical goals:

> "Letting them choose their own way through a historical event shows the human side of history. It helps personalize the content so kids are better able to apply different situations to different historical contexts. We want to understand how things change over time and how little decisions create these historical snowballs. I think this would take their knowledge to the next level without them realizing they have to put in extra work."

### Core Principles

1. **Non-linear by design** — Branching must be real, not cosmetic
2. **Aftermath is half the mission** — Post-genocide scenes (gacaca courts, reconciliation, refugee camps) are full narrative branches
3. **No clean endings** — Rwanda's reconciliation is real and imperfect; show both
4. **Upper-level thinking embedded structurally** — AP skills emerge from choices, not labels
5. **Small decisions create historical snowballs** — Early choices have visible downstream consequences

## Historical Grounding

All content must be traceable to the historical reference document:
- **Source:** `docs/RwandanGenocide(1990–Aftermath).md`
- **Rule:** If a fact, name, date, or statistic is not in this document, do not invent it
- **Verification:** Every scene narrative, outcome epilogue, knowledge question, and ripple event must cite this document

## User Stories

### US-1: Mission Selection
**As a** student  
**I want to** select the Rwanda Genocide mission from the timeline  
**So that** I can experience this historical event from multiple perspectives

**Acceptance Criteria:**
- Mission appears on historical timeline with date April 6, 1994
- Mission displays teaser: "Experience the 100 days that shook the world from three impossible perspectives"
- Mission is marked as unlocked and playable
- Mission metadata includes era: "Modern"

### US-2: Role Selection
**As a** student  
**I want to** choose between three distinct roles  
**So that** I can explore different perspectives on the genocide

**Roles:**
1. **Hutu Moderate** — Augustin, communal secretary in Kigali
2. **Tutsi Survivor** — Immaculée, 19-year-old university student
3. **UN Peacekeeper** — Captain Marcus Webb, Canadian UNAMIR officer

**Acceptance Criteria:**
- Each role displays name, description, and historical context
- Role selection screen follows existing UI patterns from Pearl Harbor
- Each role has 8-10 scene objects to support true branching
- Each role has minimum 4 outcome objects

### US-3: True Branching Narrative
**As a** student  
**I want** my choices to lead to genuinely different scenes  
**So that** replaying reveals new information and perspectives

**Acceptance Criteria:**
- Choices in scenes 2-3 route to different scene IDs (not just flag variations)
- Example: `rw-hm-scene-02` → choice A leads to `rw-hm-scene-03a`, choice B leads to `rw-hm-scene-03b`
- Any single playthrough visits 5 scenes; full role exploration requires 8-10 scenes
- Branching paths do not reconverge until aftermath or outcomes
- Scene IDs clearly indicate branch paths (e.g., `-03a`, `-03b`, `-03c`)

### US-4: Consequence System Integration
**As a** student  
**I want** my earlier choices to be remembered and referenced  
**So that** I understand how small decisions cascade into larger consequences

**Acceptance Criteria:**
- Choices set consequence flags (e.g., `helped_neighbor: true`, `staffed_roadblock: true`)
- Later scenes reference these flags in narrative text
- Example: If player set `helped_neighbor: true` in scene 1, scene 4 mentions "Celestin, the neighbor you helped"
- Gacaca scenes explicitly name actions player took during genocide
- Outcome selection uses consequence flags in conditions

### US-5: Aftermath Branch Scenes
**As a** student  
**I want** to experience post-genocide Rwanda (2005-2012)  
**So that** I understand the long-term consequences of choices and the tension between justice and reconciliation

**Acceptance Criteria:**
- Every role has 2-3 aftermath scenes (post-July 1994)
- Aftermath scenes are NOT epilogues — they are full narrative branches where earlier choices land
- Aftermath scenes have their own choices, consequences, and branching paths
- Aftermath scenes cover:
  - Gacaca courts (2005-2012): testify, confess, deny, judge
  - "No ethnicity" policy: embrace, resent, perform compliance
  - Refugee camps in Zaire: register with UN, stay with militia, disappear
  - Perpetrator return to villages: attend meetings, refuse, relocate
- Aftermath scenes present the punish-vs-rebuild tension as lived experience
- Neither punishment nor reconciliation is presented as "correct"
- Students should feel the weight of both paths: punishment feels just but divisive, reconciliation feels pragmatic but unjust

### US-6: Timed Choices
**As a** student  
**I want** some choices to have time pressure  
**So that** I experience the urgency and impossible decisions of the genocide

**Acceptance Criteria:**
- Minimum 2 timed choices per role
- Timed choices use existing `TimedChoiceSystem` architecture
- Default choice is specified (what happens if time runs out)
- Timer duration: 10-15 seconds
- Examples:
  - Hutu moderate at roadblock: 12 seconds
  - Tutsi survivor at roadblock: 10 seconds
  - UN peacekeeper at hotel: 15 seconds

**Pedagogical Intent — Default Choice as Historical Lesson:**
- Default choice MUST represent the "path of least resistance" or "statistically most common" historical action
- Default choice MUST demonstrate the consequences of inaction, compliance, or following orders in a genocidal state
- This design choice is intentional: it teaches that doing nothing or obeying orders was itself a choice with deadly consequences
- Default choices should feel "normal," "safe," or "bureaucratic" in the moment but carry tragic historical weight

**Required Default Choice Examples:**
- **Hutu moderate at roadblock:** Default = "Wave them through" (following orders → victims are killed)
  - Rationale: Most officials complied; compliance was the path of least resistance and led to death
- **Tutsi survivor at roadblock:** Default = "Show the university card" (trusting official documents → may be killed if guard checks both cards)
  - Rationale: Many initially trusted official processes; this represents the "normal" response that often failed
- **UN peacekeeper at hotel:** Default = "Stall — call Dallaire, buy time" (bureaucratic response → delays but doesn't refuse)
  - Rationale: UN peacekeepers often stalled rather than directly refusing; this represents institutional caution

**Historical Grounding Principle:**
- Students who let the timer run out should experience what most people historically did: comply, wait, follow orders
- This creates a powerful pedagogical moment: inaction has consequences, and "normal" behavior in abnormal times can be catastrophic

### US-7: Historical Ripple Timeline
**As a** student  
**I want** to see the long-term consequences of the genocide  
**So that** I understand how 1994 shaped Rwanda and the region

**Acceptance Criteria:**
- 8 ripple events, chronologically ordered
- Events span April 1994 to present day
- Each event includes: id, date, title, description, apTheme, animationDelay
- Events cover:
  - April 7, 1994: Moderate leaders assassinated, roadblocks established
  - April-July 1994: 100 days, 500,000-800,000 killed
  - April 21, 1994: UN reduces UNAMIR to 270 troops
  - July 4, 1994: RPF captures Kigali
  - November 1994: ICTR created
  - 2003-2004: 20,000 detainees released, gacaca begins
  - 2005-2012: Gacaca courts conclude, ethnic identity banned
  - 1994-Present: Hotel des Mille Collines legacy

### US-8: Knowledge Checkpoint Questions
**As a** student  
**I want** to answer AP-style questions about the genocide  
**So that** I can demonstrate understanding of historical causation, continuity, perspective, and complexity

**Acceptance Criteria:**
- 3 questions per role (9 total)
- Each question tagged with AP skill: causation, continuity, perspective, complexity
- Questions are role-specific and grounded in that role's experience
- Format matches existing `knowledge-questions.js` structure
- Example topics:
  - Hutu moderate: RTLM's role, identity cards, concept of "bystander"
  - Tutsi survivor: Churches as massacre sites, Arusha Accords failure, gacaca courts
  - UN peacekeeper: Dallaire's genocide fax, peacekeeping mandate limits, Genocide Convention obligations

### US-9: Path-Specific Ripple Intros
**As a** student  
**I want** a personalized introduction to the ripple timeline  
**So that** my specific choices are connected to macro-historical consequences

**Acceptance Criteria:**
- 9 ripple intro variants (3 roles × 3 paths)
- Paths classified as:
  - Hutu moderate: rescue / compliance / flight
  - Tutsi survivor: hidden / enclave / testimony
  - UN peacekeeper: stayed / evacuated / documented
- Each intro: 80-120 words, second person, reflective tone
- Intros connect player's personal choices to historical outcomes
- No congratulatory tone; Rwanda doesn't offer clean endings

### US-10: Audio Integration
**As a** student  
**I want** ambient sound and narration to enhance immersion  
**So that** the historical experience feels authentic

**Acceptance Criteria:**
- Each scene specifies `ambientTrack` (filename only, no path)
- Each scene specifies `narratorAudio` (full relative path)
- Ambient tracks use placeholder filenames indicating what to source:
  - `rw-radio-rtlm-ambient.wav`
  - `rw-crowd-night-ambient.wav`
  - `rw-machete-distant-ambient.wav`
  - `rw-hotel-interior-ambient.wav`
  - `rw-jungle-night-ambient.wav`
  - `rw-military-radio-ambient.wav`
- Narration paths follow pattern: `audio/narration/{role-id}/rw-xx-scene-XX.mp3`
- Audio files are pre-loaded by developer; system only references paths

### US-11: Atmospheric Effects
**As a** student  
**I want** visual effects that reflect the scene's intensity  
**So that** I feel the emotional weight of the moment

**Acceptance Criteria:**
- Each scene specifies `atmosphericEffect` (or null)
- Effects available: "smoke", "shake", "dawn", "explosion"
- Effects use existing `AtmosphericEffects` system
- Example usage:
  - Smoke: distant fires visible during genocide
  - Shake: explosions, grenades at massacre sites
  - Dawn: morning of April 7, 1994

### US-12: Trauma-Informed Writing
**As a** content creator  
**I want** to depict violence responsibly  
**So that** students learn without gratuitous trauma

**Acceptance Criteria:**
- Violence is present but not gratuitous
- Horror is in the choices, not the descriptions
- Do not use dehumanizing language directly (e.g., "cockroaches")
- Reference RTLM language indirectly: "the language RTLM used" or "the word the radio used for people like you"
- Minimum 3 sensory details per scene (sound, smell, physical sensation)
- Narrative: 100-160 words per scene, second person present tense
- Outcome epilogues: 150-200 words, second person, past tense at the end

## Technical Requirements

### TR-1: Architecture Compliance
**Requirement:** All files must follow existing Witness Interactive architecture

**Acceptance Criteria:**
- Zero npm, zero build tools, zero frameworks
- ES6 modules with `type="module"` only
- All paths relative (GitHub Pages compatible)
- Engine files in `js/engine/` — logic only, zero content strings
- Content files in `js/content/missions/rwanda/` — data only, zero logic
- All communication via EventBus — no direct component coupling
- No global variables

### TR-2: File Structure
**Requirement:** Mission files must match Pearl Harbor structure exactly

**Files to create:**
```
js/content/missions/rwanda/
  mission.js
  hutu-moderate.js
  tutsi-survivor.js
  un-peacekeeper.js
  knowledge-questions.js
  ripple-intros.js
```

**Acceptance Criteria:**
- `mission.js` exports default mission object (no registration)
- Each role file exports `{ scenes: [...], outcomes: [...] }`
- `knowledge-questions.js` exports default array
- `ripple-intros.js` exports `RIPPLE_INTROS` object and `getRippleIntro()` function
- All scene IDs prefixed: `rw-hm-`, `rw-ts-`, `rw-un-`

### TR-3: Scene Object Structure
**Requirement:** Every scene must include required fields

**Acceptance Criteria:**
- `id` (string): Unique scene identifier
- `narrative` (string): 100-160 words, second person present tense
- `apThemes` (array): Minimum 1 tag from: causation, continuity, perspective, complexity
- `choices` (array): 3-4 choices per scene
- `atmosphericEffect` (string|null): Effect name or null
- `ambientTrack` (string): Filename only, no path
- `narratorAudio` (string): Full relative path
- Optional: `timedChoice` object with `enabled`, `duration`, `defaultChoice`
- Optional: `radioClips` array for RTLM broadcasts (see constraints below)

**Note on AP Themes:**
- Use only the four core themes from the Design Philosophy: causation, continuity, perspective, complexity
- "Argumentation" is an AP skill but is not currently supported in the UI (no icon/label in SceneRouter or ProgressUI)
- If argumentation support is added to the engine in the future, scenes can be retroactively tagged

**Trauma-Informed Constraints on Radio Clips:**
- `radioClips` array is optional and used for RTLM hate radio broadcasts
- Radio clips MUST follow trauma-informed writing standards (US-12)
- Radio clips MUST NOT contain direct quotes of dehumanizing language
- Radio clips MUST NOT use the word "cockroaches" or other slurs directly
- Radio clips MUST use indirect references only:
  - ✅ Acceptable: "The radio describes a list of names" or "RTLM uses the language they always use for people like you"
  - ❌ Prohibited: Direct quotes of RTLM broadcasts containing slurs
- Radio clips serve as ambient sound design, not as vehicles for reproducing hate speech
- If a scene requires conveying RTLM's role, do so through narrative description, not through direct audio reproduction of dehumanizing content

### TR-4: Choice Object Structure
**Requirement:** Every choice must include required fields

**Acceptance Criteria:**
- `id` (string): Unique choice identifier
- `text` (string): 4-8 words, no melodrama
- `consequences` (object): Flags set by this choice
- `nextScene` (string): Valid scene ID within same role

### TR-5: Outcome Object Structure
**Requirement:** Every outcome must include required fields

**Acceptance Criteria:**
- `id` (string): Unique outcome identifier
- `survived` (boolean): Death or survival outcome
- `conditions` (object): Consequence flags that trigger this outcome
- `epilogue` (string): 150-200 words, second person, historically grounded
- Optional: `deathContext` object with `cause`, `historicalRate`, `yourChoices`

### TR-6: Mission Registration
**Requirement:** Mission must register with MissionRegistry

**Acceptance Criteria:**
- Registration happens in `main.js` during bootstrap
- Import statement: `import rwandaMission from './content/missions/rwanda/mission.js';`
- Registration call: `MissionRegistry.registerMission(rwandaMission);`
- Mission appears in timeline selector
- Mission is playable via existing game flow

## Non-Functional Requirements

### NFR-1: Historical Accuracy
- Every fact must be traceable to `docs/RwandanGenocide(1990–Aftermath).md`
- Names, dates, statistics, survivor accounts must match source document
- No invented details or speculative content

### NFR-2: Educational Value
- AP reasoning skills (causation, continuity, perspective, complexity) embedded in choices
- Knowledge questions assess understanding, not memorization
- Branching structure teaches that history is contingent, not inevitable

### NFR-3: Accessibility
- All content must be screen-reader compatible
- Color is not the only means of conveying information
- Text contrast meets WCAG AA standards
- Keyboard navigation fully supported

### NFR-4: Performance
- Scene transitions complete within 500ms
- Audio preloading does not block gameplay
- Atmospheric effects do not cause frame drops
- Mobile devices (iOS/Android) supported

## Out of Scope

The following are explicitly NOT part of this mission:

- Backend, database, user accounts
- Real audio file generation (developer sources these separately)
- 3D graphics or WebGPU
- Multiple simultaneous missions
- Teacher dashboard
- localStorage persistence beyond existing systems
- Modifications to engine files (use existing systems only)

## Success Criteria

This mission is complete when:

1. All 6 files are created and follow architecture patterns exactly
2. All scene `nextScene` references resolve to valid scene IDs
3. All outcome `conditions` keys match consequence flags set in scenes
4. `mission.js` imports all role files correctly
5. `ripple-intros.js` has all 9 variants with correct role-path keys
6. All `narratorAudio` paths follow `audio/narration/{role-id}/rw-xx-scene-XX.mp3` format
7. All `ambientTrack` values are filenames only, no path prefix
8. Mission registers in `main.js` and appears in timeline
9. Full playthrough of each role completes without errors
10. Knowledge checkpoint questions display and function correctly
11. Historical ripple timeline displays all 8 events
12. Path-specific ripple intros display based on player choices

## Dependencies

- Existing Witness Interactive codebase (Pearl Harbor mission)
- `docs/RwandanGenocide(1990–Aftermath).md` (historical reference)
- Existing engine systems:
  - `SceneStateMachine`
  - `ConsequenceSystem`
  - `TimedChoiceSystem`
  - `AmbientSoundManager`
  - `NarratorAudioManager`
  - `AtmosphericEffects`
  - `EventBus`
  - `MissionRegistry`

## Architecture Heritage — Proving Platform Scalability

This section demonstrates that the Rwanda mission leverages the battle-tested Pearl Harbor architecture, proving the platform is a cohesive ecosystem capable of supporting multiple historical missions without architectural rewrites.

### AH-1: Core Engine Parity
**Requirement:** Rwanda mission must utilize existing engine systems without modification

**Acceptance Criteria:**
- `SceneStateMachine.js` handles Rwanda scenes using the same transition logic as Pearl Harbor
- No modifications to core state machine logic
- Scene transitions work identically for both missions
- State management remains consistent across missions

**Rationale:** Proves the engine is mission-agnostic and can scale to 50+ missions without refactoring

### AH-2: Consequence System Compatibility
**Requirement:** Rwanda mission must use existing `ConsequenceSystem.js` for flag management

**Acceptance Criteria:**
- Use standard `setFlag()` and `hasFlag()` methods
- Rwanda-specific flags use namespacing convention: `rw_` prefix
  - Example: `rw_helped_celestin`, `rw_staffed_roadblock`, `rw_testified_gacaca`
- No collisions with Pearl Harbor flags (which use `ph_` or `ja_`, `as_`, `ac_` prefixes)
- Consequence flags persist across scene transitions using existing architecture
- Outcome selection uses same `conditions{}` matching logic as Pearl Harbor

**Rationale:** Demonstrates that the consequence system is reusable and can handle complex branching without modification

### AH-3: Event Bus Communication
**Requirement:** Rwanda mission must use existing `EventBus.js` for all inter-component communication

**Acceptance Criteria:**
- Mission start broadcasts `mission:start` event with `{ missionId: 'rwanda-genocide', roleId: '...' }`
- Mission completion broadcasts `game:complete` event for feedback system integration
- Scene transitions emit `scene:transition` events
- No direct component coupling — all communication via EventBus
- Existing feedback system (`FeedbackSurveyPanel.js`) captures Rwanda data without modification

**Rationale:** Proves loose coupling architecture enables adding missions without touching existing UI/feedback code

### AH-4: Mission Registry Integration
**Requirement:** Rwanda mission must register via existing `MissionRegistry.js` using standard configuration pattern

**Acceptance Criteria:**
- Mission exports default object matching Pearl Harbor structure:
  ```javascript
  {
    id: 'rwanda-genocide',
    title: 'Rwanda, 1994',
    historicalDate: '1994-04-06',
    era: 'Modern',
    unlocked: true,
    teaser: '...',
    roles: [...],
    historicalRipple: [...],
    knowledgeQuestions: [...]
  }
  ```
- Registration in `main.js` follows same pattern: `MissionRegistry.registerMission(rwandaMission)`
- Mission appears in timeline selector without UI modifications
- Timeline selector automatically handles multiple missions

**Rationale:** Demonstrates plug-and-play mission architecture — new missions integrate seamlessly

### AH-5: Scene Schema Compatibility
**Requirement:** Rwanda scene objects must maintain 100% schema compatibility with Pearl Harbor scenes

**Acceptance Criteria:**
- Scene objects use identical structure:
  - `id`, `narrative`, `apThemes`, `choices`, `atmosphericEffect`, `ambientTrack`, `narratorAudio`
- `SceneRouter.js` loads Rwanda scenes without modification
- Choice objects use same structure: `id`, `text`, `consequences`, `nextScene`
- Outcome objects use same structure: `id`, `survived`, `conditions`, `epilogue`
- Optional fields (`timedChoice`, `radioClips`) follow Pearl Harbor patterns

**Rationale:** Proves content schema is mission-agnostic — content creators can build new missions without learning new formats

### AH-6: Atmospheric Effects Reuse
**Requirement:** Rwanda mission must reuse existing `AtmosphericEffects.js` system

**Acceptance Criteria:**
- Use existing effects: `smoke`, `shake`, `dawn`, `explosion`
- Effects triggered via scene `atmosphericEffect` field (same as Pearl Harbor)
- No new effect types required (existing effects cover Rwanda needs)
- Effects work identically across missions

**Rationale:** Demonstrates that visual effects system is flexible enough for different historical contexts

### AH-7: Timed Choice System Reuse
**Requirement:** Rwanda mission must use existing `TimedChoiceSystem.js` without modification

**Acceptance Criteria:**
- Timed choices use same configuration: `{ enabled: true, duration: 12000, defaultChoice: 'choice-id' }`
- Progress bar visual works identically
- Timeout logic functions the same
- Default choice mechanism unchanged

**Rationale:** Proves UI systems are reusable across different narrative contexts and time pressures

### AH-8: Audio Architecture Compatibility
**Requirement:** Rwanda mission must use existing audio systems without modification

**Acceptance Criteria:**
- `AmbientSoundManager.js` handles Rwanda ambient tracks using same path resolution
- `NarratorAudioManager.js` handles Rwanda narration using same loading logic
- Audio files follow same naming convention: `audio/ambient/rw-*.wav`, `audio/narration/role-id/rw-xx-scene-XX.mp3`
- No changes to audio playback, crossfading, or volume management

**Rationale:** Demonstrates audio architecture scales to different missions with different soundscapes

### AH-9: Feedback System Integration
**Requirement:** Rwanda mission must integrate with existing feedback system without modification

**Acceptance Criteria:**
- `FeedbackSurveyPanel.js` captures Rwanda gameplay data automatically
- Data includes: `missionId: 'rwanda-genocide'`, `roleId`, consequence flags, survival result, outcome ID
- `FeedbackTransport.js` handles Rwanda data using existing transport logic
- No changes to feedback UI or data collection logic

**Rationale:** Proves analytics architecture is mission-agnostic and scales automatically

### AH-10: UI Component Reuse
**Requirement:** Rwanda mission must reuse all existing UI components

**Acceptance Criteria:**
- Role selection uses existing `RoleSelection.js` logic with Rwanda role data
- Timeline selector uses existing `TimelineSelector.js` with Rwanda mission metadata
- Knowledge checkpoint uses existing checkpoint UI with Rwanda questions
- Historical ripple uses existing ripple animation with Rwanda events
- Outcome screen uses existing outcome display with Rwanda epilogues

**Rationale:** Demonstrates UI components are data-driven and work with any mission content

## Architecture Compliance Verification

**Success Criteria:**
- ✅ Zero modifications to engine files (`js/engine/*.js`)
- ✅ All Rwanda code in content directory (`js/content/missions/rwanda/*.js`)
- ✅ Mission works with existing UI components unchanged
- ✅ Feedback system captures Rwanda data automatically
- ✅ Both missions can be played in same session without conflicts
- ✅ Adding a third mission would follow identical integration pattern

**Judge Pitch:**
"We aren't building a game — we're building a platform. The Rwanda mission proves our architecture is modular, reusable, and scalable. Every engine system works unchanged. Every UI component adapts automatically. This is how you build for 50+ missions without technical debt."

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Historical inaccuracy | High — undermines educational value | All content verified against source document |
| Gratuitous violence | High — traumatizes students | Trauma-informed writing guidelines enforced |
| Broken branching | Medium — reduces replay value | Comprehensive scene ID validation |
| Audio path errors | Medium — breaks immersion | Strict path format enforcement |
| Performance issues | Low — existing systems proven | Use existing engine, no new systems |

## Approval

This requirements document must be approved before design and implementation begin.

**Stakeholders:**
- Product Owner (educational mission design)
- Technical Lead (architecture compliance)
- Content Lead (historical accuracy)
- Student (end user perspective)

---

**Document Version:** 1.0  
**Last Updated:** 2026-03-11  
**Status:** Draft — Awaiting Approval
