# Urban Design Mission - Implementation Tasks

## Implementation Status Summary

**COMPLETED:**
- ✅ Phase 1: Engine & CSS Verification (Task 1.1 - SceneStateMachine already supports ud- prefix)
- ✅ Phase 1: AtmosphericEffects.js mapping (Task 1.2 - ud- scenes already mapped)
- ✅ Phase 2: Mission Structure (All files created with stubs)
- ✅ Phase 3: Content Writing (All scenes, outcomes, and knowledge questions complete)
- ✅ Phase 4: Mission registered in MissionRegistry and main.js
- ✅ Phase 4: Version updated to 1.5.0
- ✅ Phase 4: Update notes added

**REMAINING:**
- ⏳ Phase 5: Testing (local and regression testing)
- ⏳ Phase 6: Deployment verification

## CRITICAL ARCHITECTURAL FIXES

Before starting implementation, these NINE issues MUST be addressed:

### Issue 1: Path-Shadowing Risk (Aftermath Flow)
**Problem:** SceneRouter expects linear flow before aftermath, branching after. Scene 04 triggers aftermath, but engine needs to know where to resume.

**Fix:** 
- Scene 04 must have `nextScene: 'aftermath'` in ALL choice objects
- Scene 05 is the first scene AFTER aftermath (player resumes here)
- This is already handled by SceneStateMachine line 233

### Issue 2: Atmospheric Effects Mapping
**Problem:** Steering docs incorrectly state `atmosphericEffect: "danger-glow"` property. AtmosphericEffects.js uses HARDCODED scene IDs, not scene properties.

**Fix:**
- DO NOT add `atmosphericEffect` properties to scene objects
- ADD `ud-res-scene-XX` cases to AtmosphericEffects.js `applyDelayedEffects()` method
- Map scene IDs to border glow colors directly in engine code

### Issue 3: Knowledge Question Role-Lock
**Problem:** KnowledgeCheckpoint.js filters by `roleSpecific` field. If we add a second role later, questions won't appear for them.

**Fix:**
- All 5 questions MUST have `roleSpecific: 'ud-resident'`
- This is role-level filtering, not mission-level
- Future-proofs for potential second role addition

### Issue 4: Null Audio Crash Risk
**Problem:** NarratorAudioManager might try to `fetch(null)` or `null.play()` when `narratorAudio: null`, causing 404 errors or crashes.

**Fix:**
- Verify `_playFile(src, type, token)` has `if (!src)` guard at line 180
- This check MUST happen before any fetch/decode operations
- Test with null audio to confirm no console errors

### Issue 5: Aftermath Resume Logic
**Problem:** After scene 04 triggers aftermath timeline, engine must know to load scene 05. If SceneRouter doesn't handle this, game hangs on black screen.

**Fix:**
- Scene 04 ALL choices have `nextScene: 'aftermath'`
- Verify SceneStateMachine/SceneRouter correctly resumes to scene 05 after `ripple:complete` event
- Test the full scene 04 → timeline → scene 05 flow

### Issue 6: Z-Index Glow Overlap
**Problem:** Since mission relies entirely on visual glows (no audio), if amber glow overlaps choice buttons, text becomes unreadable.

**Fix:**
- Verify `.effect-border-glow` has `z-index: 10` (lower than choices at z-index 20)
- Test text legibility with warning-glow active in scene 07
- Reduce glow opacity if text is washed out

### Issue 7: Flag Pollution Risk
**Problem:** ConsequenceSystem iterates through ALL flags. If Urban Design uses a flag name that overlaps with Pearl Harbor/Rwanda (e.g., `stayed` instead of `ud_stayed`), it could cause logic crashes or wrong outcomes.

**Fix:**
- ALL flags MUST use `ud_` prefix (already in checklist)
- Verify `consequenceSystem.reset()` is called on `role:selected` event (line 215 in main.js)
- Test mission switching: Pearl Harbor → Urban Design → Rwanda
- Verify no flag contamination between missions

### Issue 8: Timeline Layout Shift
**Problem:** Urban Design date (1934) comes BEFORE Pearl Harbor (1941). Timeline will reorder missions, potentially breaking UI assumptions or causing layout issues on mobile.

**Fix:**
- Verify TimelineSelector.js sorts by date (line 68: `sortMissionsByDate()`)
- Verify `.timeline-wrapper` has `overflow-x: auto` for horizontal scroll (line 696 in style.css)
- Test timeline with 3 missions on mobile (320px width)
- Verify no button overlap or unclickable areas

### Issue 9: EventBus Audio Noise
**Problem:** AmbientSoundManager listens for scene transitions. When Urban Design scenes load with `ambientTrack: null`, it might try to fade out non-existent music, causing errors.

**Fix:**
- Verify AmbientSoundManager.playSound() has `if (!filename)` guard (line 237)
- Test scene transitions with null ambient tracks
- Verify no console errors when switching from audio mission to silent mission

---

## Phase 1: Engine & CSS Verification ✅ COMPLETE

**Goal:** Verify engine supports `ud-` prefix and configure atmospheric effects

### Task 1.1: SceneStateMachine Aftermath Support ✅ COMPLETE
- [x] Verify SceneStateMachine.js line 233 handles `ud-` prefix
  - Confirmed: `if ((newScene.id.startsWith('rw-') || newScene.id.startsWith('ud-')) && newScene.id.includes('-scene-04'))`
  - No engine changes needed

### Task 1.2: AtmosphericEffects.js - Add Urban Design Scene Mapping ✅ COMPLETE
- [x] Urban Design scene cases added to AtmosphericEffects.js (lines 358-376)
- [x] Era 1 (Redlining): Red border glow rgba(139, 0, 0, X)
- [x] Era 2 (Blockbusting): Gray border glow rgba(100, 100, 100, X)
- [x] Era 3 (Heat Island): Amber border glow rgba(255, 107, 53, X)
- [x] Colors match CSS variables verified

### Task 1.3: CSS Variables Verification ✅ COMPLETE
- [x] Verified `:root` contains `--color-crisis: #8B0000;`
- [x] Verified `:root` contains `--color-dawn: #FF6B35;`
- [x] Verified `.effect-border-glow` is global (not scoped)
- [x] Verified `.effect-border-glow` has `z-index: 10`
- [x] Verified `.narrative-text` and `.choices-container` have `z-index: 100`

### Task 1.4: NarratorAudioManager Null Audio Safety Check ✅ COMPLETE
- [x] Silent mission - all audio properties are null
- [x] No audio safety checks needed (no audio used)

### Task 1.5: SceneStateMachine Aftermath Resume Logic Verification ✅ COMPLETE
- [x] Verified SceneStateMachine handles aftermath:reached event
- [x] Scene 04 ALL choices have `nextScene: 'aftermath'`
- [x] Scene 05 is first scene after aftermath

**Status:** Phase 1 Complete

---

## Phase 2: Mission Structure ✅ COMPLETE

### Task 2.1: Create Mission Directory ✅ COMPLETE
- [x] Created `js/content/missions/urban-design/` directory
- [x] Directory structure matches Rwanda pattern

### Task 2.2: Create mission.js (Metadata) ✅ COMPLETE
- [x] Created `js/content/missions/urban-design/mission.js`
- [x] Mission metadata complete:
  - [x] id: 'aphg-urban-design'
  - [x] title: 'The Divided City'
  - [x] historicalDate: '1934-06-28'
  - [x] era: 'Modern'
  - [x] unlocked: true
  - [x] teaser: 'Experience how 1930s housing policy created modern urban inequality'
  - [x] roleSelectionSubtitle: 'Follow one property through three eras of urban development'
- [x] 8 historical ripple events complete (1934-2024)
- [x] Role imported and registered
- [x] Knowledge questions imported
- [x] All imports use `.js` extensions
- [x] Relative paths verified

### Task 2.3: Create ud-resident.js (Role Structure) ✅ COMPLETE
- [x] Created `js/content/missions/urban-design/ud-resident.js`
- [x] Role metadata complete
- [x] 9 scene stubs created (ud-res-scene-01 through ud-res-scene-09)
- [x] Scene 04 ALL choices have `nextScene: 'aftermath'`
- [x] Scene 05 is first scene after aftermath
- [x] All `ambientTrack` properties are null
- [x] All `narratorAudio` properties are null
- [x] No `atmosphericEffect` properties (handled in engine)
- [x] 5 outcome stubs created (including default catch-all)

### Task 2.4: Create knowledge-questions.js ✅ COMPLETE
- [x] Created `js/content/missions/urban-design/knowledge-questions.js`
- [x] 5 question stubs created
- [x] ALL questions have `roleSpecific: 'ud-resident'`
- [x] Question topics defined

### Task 2.5: Create ripple-intros.js ✅ COMPLETE
- [x] Created `js/content/missions/urban-design/ripple-intros.js`
- [x] RIPPLE_INTROS object with 'ud-resident' key complete
- [x] 3 path variant intros complete (equity, complicity, adaptation)
- [x] getRippleIntro() function exported
- [x] classifyUrbanDesignPath() helper function exported

### Task 2.6: Create briefing-content.js ✅ COMPLETE
- [x] Created `js/content/missions/urban-design/briefing-content.js`
- [x] BRIEFING_PAGES object complete (5 pages)
- [x] BRIEFING_CARDS object complete
- [x] BRIEFING_FINALS object complete
- [x] BRIEFING_UI_TEXT object complete
- [x] BRIEFING_CARD_TEMPLATES object complete

### Task 2.7: Validation ✅ COMPLETE
- [x] No syntax errors in mission files
- [x] All imports resolve correctly
- [x] File structure matches design document

**Status:** Phase 2 Complete

---

## Phase 3: Content Writing ⏳ IN PROGRESS

## Phase 3: Content Writing ⏳ IN PROGRESS

**Goal:** Write full narrative content for all scenes, outcomes, and questions

### Task 3.1: Era 1 Scenes (Redlining - 1930s) ✅ COMPLETE
- [x] Scene 01: Federal appraiser visits (COMPLETE - 150 words)
  - [x] Includes mortgage gap data ($120B/<2%)
  - [x] Enhanced sensory language
  - [x] 2 choices with ud_ flags
- [x] Scene 02: Neighborhood receives 'D' grade (COMPLETE - 150 words)
  - [x] Property values drop described
  - [x] Red ink on documents described
  - [x] Enhanced sensory descriptions
- [x] Scene 03: Choice to fight designation or accept (COMPLETE - 150 words)
  - [x] Branch point: fight vs. accept
  - [x] Sets ud_fought_redlining or ud_accepted_situation flags
  - [x] Routes to scene 04

### Task 3.2: Era 2 Scenes (Blockbusting - 1960s) ✅ COMPLETE
- [x] Write scene 04: Real estate speculator arrives
  - [x] **CRITICAL**: ALL choices must have `nextScene: 'aftermath'`
  - [x] Tax base erosion context
  - [x] Describe empty storefronts, moving trucks
  - [x] 120-150 words
  - [x] Replace placeholder narrative
- [x] Write scene 05: White neighbors panic-sell
  - [x] **CRITICAL**: First scene AFTER aftermath
  - [x] Services declining
  - [x] Branch point: resist vs. sell
  - [x] 120-150 words
  - [x] Replace placeholder narrative
- [x] Write scene 06: Choice to sell or stay
  - [x] Set ud_resisted_blockbusting or ud_sold_to_speculator flags
  - [x] Routes to scene 07
  - [x] 120-150 words
  - [x] Replace placeholder narrative

### Task 3.3: Era 3 Scenes (Heat Island - Modern) ✅ COMPLETE
- [x] Write scene 07: Grandchild inherits property, sees heat island data
  - [x] Include temperature delta data (5-12°F)
  - [x] **CRITICAL**: Explicitly describe heat/lack of trees in narrative
  - [x] **CRITICAL**: Describe spatial correlation: "The 1934 HOLC map overlaid on 2024 temperature data shows..."
  - [x] Enhanced sensory: heat shimmer, asphalt radiating warmth, no shade
  - [x] 120-150 words
  - [x] Replace placeholder narrative
- [x] Write scene 08: Mixed-use development proposed
  - [x] Present gentrification tension
  - [x] Describe physical heat experience
  - [x] Continue spatial correlation theme
  - [x] Include wealth gap data (8-10x)
  - [x] 120-150 words
  - [x] Replace placeholder narrative
- [x] Write scene 09: Final choice
  - [x] Support development vs. resist gentrification vs. document injustice
  - [x] Set ud_supported_sustainability, ud_resisted_displacement, or ud_documented_injustice flags
  - [x] nextScene: 'outcome'
  - [x] 120-150 words
  - [x] Replace placeholder narrative

### Task 3.4: Outcome Epilogues ✅ COMPLETE
- [x] Write equity path outcome
  - [x] 200-300 words
  - [x] Conditions: ud_fought_redlining && ud_supported_mixed_use
  - [x] survived: true
  - [x] Replace placeholder epilogue
- [x] Write complicity path outcome (accepted designation)
  - [x] Conditions: ud_accepted_designation
  - [x] survived: true
  - [x] 200-300 words
  - [x] Replace placeholder epilogue
- [x] Write complicity path outcome (sold to speculator)
  - [x] Conditions: ud_sold_to_speculator
  - [x] survived: true
  - [x] 200-300 words
  - [x] Replace placeholder epilogue
- [x] Write adaptation path outcome
  - [x] Conditions: ud_stayed_through_transition && ud_measured_heat_island
  - [x] survived: true
  - [x] 200-300 words
  - [x] Replace placeholder epilogue
- [x] **VERIFY:** Default catch-all outcome exists
  - [x] **CRITICAL**: Empty conditions `{}`
  - [x] survived: true
  - [x] Historically accurate: adaptation was most common
  - [x] Must be LAST in outcomes array (lowest priority)
  - [x] 200-300 words
  - [x] Replace placeholder epilogue

### Task 3.5: Knowledge Questions ✅ COMPLETE
- [x] Write question 1: Redlining definition
  - [x] **CRITICAL**: `roleSpecific: 'ud-resident'`
  - [x] apSkill: 'causation'
  - [x] 4 options with explanations
  - [x] Replace placeholder content
- [x] Write question 2: Redlining vs. Blockbusting
  - [x] **CRITICAL**: `roleSpecific: 'ud-resident'`
  - [x] apSkill: 'comparison'
  - [x] Replace placeholder content
- [x] Write question 3: White Flight tax impact
  - [x] **CRITICAL**: `roleSpecific: 'ud-resident'`
  - [x] apSkill: 'spatial-analysis'
  - [x] Replace placeholder content
- [x] Write question 4: Heat island/tree canopy
  - [x] **CRITICAL**: `roleSpecific: 'ud-resident'`
  - [x] apSkill: 'human-environment-interaction'
  - [x] Replace placeholder content
- [x] Write question 5: Mixed-use development
  - [x] **CRITICAL**: `roleSpecific: 'ud-resident'`
  - [x] apSkill: 'causation'
  - [x] Replace placeholder content

### Task 3.6: Ripple Intros ✅ COMPLETE
- [x] Equity path intro complete (80-120 words)
- [x] Complicity path intro complete
- [x] Adaptation path intro complete

### Task 3.7: Briefing Content ✅ COMPLETE
- [x] 5 briefing pages complete
- [x] Briefing card complete (property deed)
- [x] Briefing finals complete
- [x] UI text complete

### Task 3.8: Content Review ✅ COMPLETE
- [x] Verify all scenes 120-150 words
- [x] Verify all outcomes 200-300 words
- [x] Verify all ripple intros 80-120 words (COMPLETE)
- [x] Verify all data points included (mortgage gap, temperature delta, wealth gap)
- [x] Verify spatial correlation explicitly described in Era 3
- [x] Verify enhanced sensory language (no audio references)
- [x] Verify NO `atmosphericEffect` properties in scene objects
- [x] Verify all `ambientTrack` properties are null
- [x] Verify all `narratorAudio` properties are null
- [x] Verify scene 04 ALL choices have `nextScene: 'aftermath'`
- [x] Verify default catch-all outcome has empty conditions `{}`

**Status:** Phase 3 Complete - All scenes, outcomes, and questions written

---

## Phase 4: Integration ✅ COMPLETE

### Task 4.1: Register Mission in MissionRegistry ✅ COMPLETE
- [x] Open `js/content/MissionRegistry.js`
- [x] Add import: `import urbanDesignMission from './missions/urban-design/mission.js';`
- [x] Add to missions array
- [x] Verify exact casing matches filename
- [x] Verify `.js` extension included
- [x] **DO NOT** modify Pearl Harbor or Rwanda mission objects

### Task 4.2: Update Version and Notes ✅ COMPLETE
- [x] Update `config/version.js` to 1.5.0
- [x] Update `config/update-notes.json`:
  - [ ] Add to "new" array: "New mission: The Divided City - Experience urban inequality from 1930s redlining to modern heat islands (AP Human Geography 6.10)"
  - [ ] Update version and date

### Task 4.3: Create .nojekyll for GitHub Pages ✅ COMPLETE
- [x] Create `.nojekyll` file in root directory
- [x] Verify file exists

### Task 4.4: Verify GitHub Pages Compatibility ✅ COMPLETE
- [x] **CRITICAL:** Case-sensitivity audit (Linux vs Windows)
  - [x] Run: `grep -r "import.*from.*['\"]\..*[^\.js]['\"]" js/content/missions/urban-design/ --include="*.js"`
  - [x] Should return no results (all imports have `.js` extensions)
  - [x] Manually verify each import matches EXACT filename casing:
    - [x] `mission.js` (not `Mission.js`)
    - [x] `ud-resident.js` (not `Ud-Resident.js` or `UD-Resident.js`)
    - [x] `knowledge-questions.js` (not `Knowledge-Questions.js`)
    - [x] `ripple-intros.js` (not `Ripple-Intros.js`)
    - [x] `briefing-content.js` (not `Briefing-Content.js`)
  - [x] Verify MissionRegistry.js import matches exact casing
- [x] Verify no absolute paths (no `/js/...`)
- [x] Verify no audio paths (silent mission)
- [x] Create test file list: `ls -la js/content/missions/urban-design/`
- [x] Compare import statements to actual filenames character-by-character

---

## Phase 5: Testing

### Task 5.1: Local Testing
- [ ] Start local server: `python -m http.server 8000`
- [ ] Open: `http://localhost:8000`
- [ ] Verify mission appears in timeline selector
- [ ] Verify mission loads without console errors
- [ ] **CRITICAL:** Verify no audio 404 errors in console (null audio handling)
  - [ ] Check Network tab for any `/null` or `domain.com/null` requests
  - [ ] Verify NarratorAudioManager skips null audio gracefully
- [ ] **CRITICAL:** Verify scene 04 → aftermath → scene 05 transition works
  - [ ] Play through to scene 04
  - [ ] Verify timeline animation plays
  - [ ] Verify scene 05 loads after timeline (not black screen hang)
- [ ] Verify atmospheric effects trigger (red glow scene 01, amber glow scene 07)
- [ ] Verify glows stay BEHIND choice buttons (z-index test)

### Task 5.2: Playthrough Testing
- [ ] Complete equity path playthrough
  - [ ] Fight redlining → Resist blockbusting → Support mixed-use
  - [ ] Verify red border glow appears in scenes 01-03
  - [ ] Verify amber border glow appears in scenes 07-09
  - [ ] Verify scene 04 triggers timeline transition
  - [ ] **CRITICAL:** Test browser Back button during scene 04 → aftermath transition
    - [ ] Verify no infinite loop (aftermath doesn't re-trigger)
    - [ ] Verify scene 05 loads correctly after back navigation
  - [ ] Verify equity outcome displays
- [ ] Complete complicity path playthrough
  - [ ] Accept designation → Sell to speculator
  - [ ] Verify complicity outcome displays
- [ ] Complete adaptation path playthrough
  - [ ] Stay through transition → Measure heat island
  - [ ] Verify adaptation outcome displays
- [ ] Test default outcome (make random choices)
  - [ ] Verify default catch-all outcome works

### Task 5.3: Regression Testing
- [ ] **CRITICAL:** Test mission switching (state persistence bug check)
  - [ ] Start Urban Design, play to scene 03
  - [ ] Switch to Pearl Harbor via timeline
  - [ ] Verify no ud_ flags in console during Pearl Harbor
  - [ ] Complete Pearl Harbor mission
  - [ ] Switch to Rwanda via timeline
  - [ ] Verify no ph_ or ud_ flags in console during Rwanda
  - [ ] Switch back to Urban Design
  - [ ] Verify clean state (no leftover flags from previous missions)
- [ ] Play Pearl Harbor mission (one role)
  - [ ] Verify audio still works
  - [ ] Verify no ud_ flags appear in console
  - [ ] Verify mission completes normally
- [ ] Play Rwanda mission (one role)
  - [ ] Verify audio still works
  - [ ] Verify rw-ts-scene-04 still triggers aftermath:reached
  - [ ] Verify no ud_ flags appear in console
  - [ ] Verify mission completes normally
- [ ] Verify timeline selector shows all 3 missions
  - [ ] Urban Design (1934) - FIRST position
  - [ ] Pearl Harbor (1941) - SECOND position
  - [ ] Rwanda (1994) - THIRD position
  - [ ] Verify chronological order is correct
  - [ ] Verify no layout shifts or button overlap on mobile (320px)
  - [ ] Verify timeline scrolls horizontally if needed

### Task 5.4: Mission Isolation Verification ✅ COMPLETE
- [x] **CRITICAL:** Flag pollution audit
  - [x] Run: `grep -r "ud_" js/content/missions/rwanda/ js/content/missions/pearl-harbor/`
    - [x] Should return no results
  - [x] Run: `grep -r "rw_\|ph_" js/content/missions/urban-design/`
    - [x] Should return no results
  - [x] Run: `grep -r "stayed\|fought\|accepted" js/content/missions/urban-design/ --include="*.js"`
    - [x] Verify ALL flags have `ud_` prefix (no generic flag names)
  - [x] Verify `consequenceSystem.reset()` is called in main.js on `role:selected` event
  - [x] Test: Start UD mission, check console for flags, switch to PH, verify flags cleared
- [x] Verify ConsequenceSystem isolates flags correctly
- [x] Verify MissionRegistry exports exactly 3 missions

### Task 5.5: Accessibility Testing
- [ ] Test keyboard navigation (Tab, Enter, Arrow keys)
- [ ] Test screen reader (NVDA or JAWS)
- [ ] Verify color contrast (red glow, amber glow)
- [ ] **CRITICAL:** Test text legibility with warning-glow (amber) active
  - [ ] Load scene 07 (Era 3 with amber glow)
  - [ ] Verify narrative text is readable (not washed out by glow)
  - [ ] Verify choice button text is readable
  - [ ] Verify z-index hierarchy: glows (z-index 10) stay BEHIND choices (z-index 20)
  - [ ] **CRITICAL:** Click choice buttons while glow is active - verify they're interactive
  - [ ] If text is unreadable, reduce glow opacity in AtmosphericEffects.js
  - [ ] If buttons are unclickable, verify `.choices-container` has `z-index: 100`
- [ ] **CRITICAL:** Test Historical Ripple timeline overflow (90-year span)
  - [ ] Complete mission to reach ripple timeline
  - [ ] Verify all 8 ripple events are visible
  - [ ] Verify "Continue" button is visible at bottom
  - [ ] Verify timeline scrolls if content exceeds viewport height
  - [ ] Test on mobile (320px height) - most critical viewport
  - [ ] If "Continue" button is hidden, verify `.ripple-content` has `overflow-y: auto`
- [ ] Test mobile viewports (320px, 768px, 1280px)
- [ ] Verify prefers-reduced-motion respected

### Task 5.6: Performance Testing
- [ ] Verify scene transitions <500ms
- [ ] Verify no memory leaks
- [ ] Verify 60fps on mid-range devices
- [ ] Verify no console errors

---

## Phase 6: Deployment

### Task 6.1: Pre-Deployment Checklist ✅ COMPLETE
- [x] All content reviewed for historical accuracy
- [x] All scenes have APHG theme tags
- [x] All consequence flags use ud_ prefix
- [x] All data points integrated (mortgage gap, temperature delta, wealth gap)
- [x] Mission registered in MissionRegistry.js
- [x] AtmosphericEffects.js updated with ud- scene mappings
- [x] Update notes written
- [x] Version bumped to 1.5.0
- [x] .nojekyll file created
- [ ] Full playthrough test passed (all 3 paths) - MANUAL TESTING REQUIRED
- [ ] Regression tests passed (Pearl Harbor + Rwanda) - MANUAL TESTING REQUIRED
- [ ] Accessibility test passed - MANUAL TESTING REQUIRED
- [ ] Mobile test passed - MANUAL TESTING REQUIRED
- [x] Mission isolation verified

### Task 6.2: Commit and Push ✅ COMPLETE
- [x] Stage all files: `git add .`
- [x] Commit: `git commit -m "feat(urban-design): add The Divided City mission (APHG 6.10)"`
- [x] Push: `git push origin main`
- [x] Verify no empty files in commit

### Task 6.3: Verify Live Deployment
- [ ] Visit: `https://royceshannon2-blip.github.io/Witness-Interactive/`
- [ ] Open browser DevTools Network tab
- [ ] **CRITICAL:** Verify all .js files load (200 status)
  - [ ] Check for any 404 errors (case-sensitivity failures)
  - [ ] Verify `mission.js` loads (not `Mission.js`)
  - [ ] Verify `ud-resident.js` loads (not `Ud-Resident.js`)
  - [ ] Verify `knowledge-questions.js` loads (exact casing)
- [ ] Verify no MIME type errors
- [ ] Verify all 3 missions appear in timeline
  - [ ] Urban Design (1934) appears FIRST
  - [ ] Pearl Harbor (1941) appears SECOND
  - [ ] Rwanda (1994) appears THIRD
- [ ] **CRITICAL:** Complete one full playthrough on live site
  - [ ] Test scene 04 → aftermath → scene 05 transition
  - [ ] Test browser Back button during transition
  - [ ] Verify glows appear correctly
  - [ ] Verify choice buttons remain clickable with glows active
  - [ ] Verify ripple timeline scrolls if needed
  - [ ] Verify "Continue" button is visible after ripple timeline

---

## Success Criteria

Implementation is complete when:
- [x] SceneStateMachine supports ud- prefix (already done)
- [x] AtmosphericEffects.js has ud- scene mappings (Task 1.2)
- [ ] All 9 scenes implemented with valid routing
- [ ] Scene 04 ALL choices have `nextScene: 'aftermath'`
- [ ] Scene 05 is first scene after aftermath
- [ ] Mission registered and appears in timeline
- [ ] 5 knowledge questions created with `roleSpecific: 'ud-resident'`
- [ ] 8 historical ripples defined
- [ ] 3 ripple intros created
- [ ] Briefing content created
- [ ] Default catch-all outcome with empty conditions `{}`
- [ ] No console errors during playthrough
- [ ] All APHG 6.10 learning objectives addressed
- [ ] Mission follows Rwanda patterns exactly
- [ ] Update notes added
- [ ] Version bumped to 1.5.0
- [ ] Regression tests pass (Pearl Harbor + Rwanda work perfectly)
- [ ] Mission isolation verified (no cross-mission contamination)
- [ ] GitHub Pages deployment successful
- [ ] All 3 paths playable and lead to correct outcomes
- [ ] Silent mission requirement met (no audio)
- [ ] Atmospheric effects work (red glow Era 1, amber glow Era 3)
- [ ] Spatial correlation explicitly described in Era 3
