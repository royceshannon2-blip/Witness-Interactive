# The Divided City Mission - Requirements

## Mission Overview

**Mission ID**: `aphg-urban-design`  
**Prefix**: `ud_`  
**AP Course**: AP Human Geography  
**Topic**: 6.10 - Challenges of Urban Sustainability  
**Historical Period**: 1930s - Present (Multi-era narrative)  
**Educational Focus**: Redlining, Blockbusting, White Flight, Urban Heat Islands, Sustainable Design, Mixed-Use Development

## User Stories

### US-1: Mission Structure
As a student, I want to experience urban development through multiple historical eras so that I understand how past policies created present-day inequalities.

**Acceptance Criteria**:
- Mission follows one property/family through three distinct eras
- Era 1 (1930s): The Line - Redlining policies (Scenes 01-03)
- Era 2 (1960s): The Panic - Blockbusting and White Flight (Scenes 04-06)
- Era 3 (Modern): The Heat - Urban Heat Islands and Gentrification (Scenes 07-09)
- All scenes use `ud_` prefix for flags and IDs
- Mission integrates with existing SceneStateMachine, SceneRouter, and KnowledgeCheckpoint
- Follows Rwanda mission patterns exactly

### US-2: Role Definition
As a student, I want to play as "The Legacy Resident" to understand how urban policies affect families across generations.

**Acceptance Criteria**:
- Single master role: `ud-resident`
- Role follows property/family lineage through time
- Narrative maintains continuity across eras
- Role-specific audio path: `audio/narration/ud-resident/ud-res-scene-XX.mp3`
- Role description emphasizes multi-generational perspective

### US-3: Scene Implementation
As a developer, I need 9 scenes that comply with SceneStateMachine architecture.

**Acceptance Criteria**:
- Each scene includes: `id`, `narrative`, `apThemes`, `choices`, `atmosphericEffect`, `narratorAudio`
- Narratives are 120-150 words using APHG terminology (disinvestment, tax base, infrastructure, food deserts, gentrification)
- **Include concrete data points in narratives for educational impact**:
  - **The Mortgage Gap**: Between 1934-1962, federal government backed $120 billion in home loans; less than 2% went to non-white families
  - **The Temperature Delta**: Redlined districts are now 5°F to 12°F hotter than green-graded neighborhoods due to lack of green space
  - **The Wealth Gap**: Median white family holds 8x to 10x the wealth of median Black family—disparity largely from home equity denied in Era 1
- Each scene has 2-3 choices with consequences using `ud_` prefix
- All choices route to valid `nextScene` IDs
- No dead ends in scene graph
- **CRITICAL**: Scene 04 (first scene of Era 2) MUST trigger `aftermath:reached` event for timeline transition
- Final scenes (07-09) route to `nextScene: "outcome"`
- **Era 3 scenes must explicitly describe heat/lack of trees in narrative text** since UIController doesn't support custom graphics yet

### US-4: AP Themes Integration
As an educator, I want scenes tagged with AP Human Geography skills so students develop geographic thinking.

**Acceptance Criteria**:
- Each scene includes `apThemes` array with AP Human Geography skills
- Themes include: `causation`, `spatial-analysis`, `comparison`, `human-environment-interaction`
- Terminology includes: disinvestment, tax base, infrastructure, gentrification, mixed-use development, redlining, blockbusting, white flight, food deserts
- Scenes demonstrate cause-and-effect relationships in urban development
- Narratives explain WHY spatial patterns exist, not just WHAT they are

### US-5: Visual Modeling via Atmospheric Effects
As a student, I want to see visual representations of urban processes so I understand spatial patterns.

**Acceptance Criteria**:
- **Era 1 scenes**: Use `atmosphericEffect: 'map-holc-overlay'` to show 1930s HOLC redlining maps
- **Era 2 scenes**: Use `atmosphericEffect: 'chart-blockbusting-cycle'` to show Blockbusting Cycle (Agent → Fear → Sell-off → Decline)
- **Era 3 scenes**: Use `atmosphericEffect: 'map-heat-island'` to show spatial correlation between 1930s 'D-grade' zones and modern lack of tree canopy/high temperatures
- Atmospheric effects are specified in scene objects for UIController to render
- Effects are placeholders - UIController will need updates to render these custom graphics

### US-6: Historical Ripples
As a student, I want to see how urban policies created long-term consequences through the Historical Ripple timeline.

**Acceptance Criteria**:
- 8 events in `historicalRipples` array following Rwanda mission pattern
- Events must include:
  - 1934 National Housing Act (HOLC creation and redlining begins)
  - 1944 GI Bill (Suburban bias - whites get loans, blacks denied)
  - 1948 Shelley v. Kraemer (Supreme Court bans enforcement of racial covenants)
  - 1956 Interstate Highway Act (Highways destroy black neighborhoods)
  - 1968 Fair Housing Act (Outlaws housing discrimination)
  - 1990s New Urbanism movement (Mixed-use development as solution)
  - 2010s Environmental Justice research (Heat island effect documented)
  - 2024 Urban Heat Island data (Modern consequences of 1930s redlining)
- Each ripple includes: `id`, `date`, `title`, `description`, `apTheme`, `animationDelay`
- Ripples appear on timeline after mission completion
- Descriptions are 60-100 words explaining historical significance

### US-7: Knowledge Checkpoint
As an educator, I want assessment questions that test APHG 6.10 understanding.

**Acceptance Criteria**:
- 5 questions in JSON-compatible format for KnowledgeCheckpoint.js
- All questions matched to `ud-resident` role using `roleSpecific` field
- Questions must cover:
  1. Definition and mechanism of Redlining (Policy)
  2. Difference between Redlining and Blockbusting (Practice)
  3. Impact of White Flight on a city's tax base (Economic geography)
  4. Why formerly redlined areas have less tree canopy (Human-Environment Interaction)
  5. APHG 6.10: Mixed-use Development as sustainable solution
- Each question includes: `id`, `roleSpecific`, `apSkill`, `question`, `options` (4 choices), `explanation`
- Questions follow Rwanda mission format exactly

### US-8: Audio Integration
As a student, I want narration that enhances immersion in each era.

**Acceptance Criteria**:
- Audio paths follow pattern: `audio/narration/ud-resident/ud-res-scene-XX.mp3` (01-09)
- 9 audio files (one per scene) specified in `narratorAudio` field
- Audio paths are placeholders - actual audio files not required for implementation
- NarratorAudioManager compatibility maintained
- Follows Rwanda mission audio pattern exactly

### US-9: SceneStateMachine Engine Fix
As a developer, I need the SceneStateMachine to recognize `ud-` prefix for aftermath events so Scene 04 triggers timeline transition correctly.

**Acceptance Criteria**:
- **CRITICAL ENGINE ISSUE**: `js/engine/SceneStateMachine.js` currently only recognizes `rw-` prefix in aftermath detection logic (line ~200)
- Current code: `if (newScene.id.startsWith('rw-') && newScene.id.includes('-scene-04'))`
- **REQUIRED FIX**: Make aftermath detection prefix-agnostic OR add `ud-` prefix support
- **Option A** (Prefix-agnostic): `if (newScene.id.includes('-scene-04'))`
- **Option B** (Multi-prefix): `if ((newScene.id.startsWith('rw-') || newScene.id.startsWith('ud-')) && newScene.id.includes('-scene-04'))`
- Scene 04 (`ud-res-scene-04`) must trigger `aftermath:reached` event for timeline transition
- Test thoroughly after fix to ensure timeline transition works
- Document fix in implementation notes
- **NOTE**: This is the ONLY engine change required for urban-design mission

### US-10: MissionRegistry Integration
As a developer, I need the mission registered properly so it appears in the timeline selector.

**Acceptance Criteria**:
- Mission added to `js/content/MissionRegistry.js`
- Mission metadata includes: `id`, `title`, `historicalDate`, `era`, `unlocked`, `teaser`, `roleSelectionSubtitle`, `roles`, `historicalRipple`, `knowledgeQuestions`
- Mission appears in timeline selector UI
- **Historical date MUST be**: `1934-06-28` (National Housing Act signing date - "Patient Zero" for APHG 6.10)
- Era set to `'Modern'` to group with Rwanda mission
- Teaser is one compelling sentence about urban inequality
- **Pedagogical Connection**: Date choice connects to spatial concepts:
  - Mortgage Gap → Disinvestment and Tax Base erosion (federal policy created spatial inequality)
  - Temperature Delta → Human-Environment Interaction (policy decisions created physical environmental differences)
  - Wealth Gap → Intergenerational Equity (1934 policy created wealth disparities lasting 90+ years)

### US-11: Ripple Intros
As a student, I want personalized transition text that connects my choices to historical consequences.

**Acceptance Criteria**:
- Create `ripple-intros.js` file following Rwanda pattern
- Export `RIPPLE_INTROS` object with role-based paths
- For `ud-resident` role, create 3 path variants based on player choices:
  - `equity`: Player fought redlining, supported fair housing
  - `complicity`: Player accepted designation, didn't resist
  - `adaptation`: Player focused on personal survival/adaptation
- Each intro is 80-120 words, second person, reflective tone
- Export `getRippleIntro(roleId, pathVariant)` function
- Intros connect personal choices to macro-historical consequences
- **NOTE**: PathClassifier is Phase 3/not built yet - use simple flag-check helper function for path classification
- **Implementation**: Create helper function that checks key flags (e.g., `ud_fought_redlining`, `ud_supported_fair_housing`) to determine path variant
- **SceneRouter Validation**: Use DFS (Depth-First Search) to validate no dead ends in scene graph before deployment

### US-12: Mission Briefing Content
As a student, I want historical context before the mission begins.

**Acceptance Criteria**:
- Create `briefing-content.js` file following Rwanda pattern
- Export `BRIEFING_PAGES` object with newspaper-style historical context
- Create 4-6 briefing pages explaining:
  - 1933: Belgian colonial ethnic classification (context for identity-based discrimination)
  - 1934: HOLC creation and redlining methodology
  - 1944: GI Bill suburban bias
  - 1960s: Blockbusting and White Flight mechanics
  - Modern: Heat island effect and environmental justice
- Export `BRIEFING_CARDS`, `BRIEFING_FINALS`, `BRIEFING_UI_TEXT` following Rwanda structure
- Briefing card shows property deed or neighborhood map (not identity card)
- Content uses dark, serious tone matching frontend design rules

### US-13: Mission Isolation
As a developer, I want to ensure that adding the Urban Design mission does not break or alter the behavior of existing missions.

**Acceptance Criteria**:
- **Namespace Guarantee**: A global search for `ud_` must return zero results in the `rwanda` or `pearl-harbor` content directories
- **State Cleanup**: Ensure that when a user switches missions via the TimelineSelector, all `ud_` flags are cleared or ignored by the ConsequenceSystem if a Pearl Harbor/Rwanda role is loaded
- **Registry Safety**: The entry in MissionRegistry.js must be an append-only operation - no existing mission metadata (IDs, dates, or unlock statuses) should be modified
- **Resource Collision Check**: Verify that all new audio paths (`audio/narration/ud-resident/...`) and briefing images do not overwrite existing file paths in the project structure
- **Cross-Mission Flag Isolation**: Cross-referencing flags from `rw_` (Rwanda) or `ph_` (Pearl Harbor) is strictly prohibited to prevent "state leakage" between missions

### US-14: Regression Testing
As a QA tester, I need to verify that the core engine still processes existing missions correctly after the integration.

**Acceptance Criteria**:
- **Rwanda Aftermath Check**: Verify that `rw-ts-scene-04` still correctly triggers the `aftermath:reached` event and transition
- **Pearl Harbor Outcome Check**: Verify that the `ph_` flags still correctly determine survival in the Pilot and Nurse roles
- **Knowledge Checkpoint Filtering**: Ensure that when playing a Rwanda role, only `rw-` specific questions appear, and no `ud-` questions "leak" into the pool
- **UI Integrity**: Verify the TimelineSelector renders all three missions (Pearl Harbor, Rwanda, and Urban Design) in the correct chronological order without layout shifts
- **Full Regression Pass**: Complete playthrough of one Pearl Harbor role and one Rwanda role confirms 100% original behavior
- **State Isolation Verification**: Confirmed that `ud_` flags do not appear in the ConsequenceSystem logs during a Rwanda session
- **Registry Integrity**: MissionRegistry.js exports exactly three mission objects

## Technical Constraints

1. **Architecture Compliance**:
   - No global variables - ES6 modules only
   - EventBus for all communication
   - Content in `js/content/missions/urban-design/`
   - Logic stays in `js/engine/` (no changes needed except SceneStateMachine)
   - Follow Rwanda mission patterns exactly

2. **Zero Global Scope Pollution**:
   - All new files MUST use explicit export and import
   - No modifications to main.js or shared engine files, with the exception of the SceneStateMachine patch to support the `ud-` prefix for aftermath triggers
   - All flags, scene IDs, and choice IDs MUST use the `ud_` or `ud-` prefix
   - Cross-referencing flags from `rw_` (Rwanda) or `ph_` (Pearl Harbor) is strictly prohibited to prevent "state leakage" between missions

2. **File Structure**:
   ```
   js/content/missions/urban-design/
   ├── mission.js (main export with metadata)
   ├── ud-resident.js (role scenes and outcomes)
   ├── knowledge-questions.js (5 APHG questions)
   ├── ripple-intros.js (path-specific transition text)
   └── briefing-content.js (historical context pages)
   ```

3. **Scene Object Schema** (must match Rwanda exactly):
   ```javascript
   {
     id: 'ud-res-scene-01',
     narrative: '120-150 words with APHG terminology...',
     apThemes: ['causation', 'spatial-analysis'],
     atmosphericEffect: 'map-holc-overlay', // or null
     ambientTrack: null,
     narratorAudio: 'audio/narration/ud-resident/ud-res-scene-01.mp3',
     soundEffects: [], // optional
     choices: [
       {
         id: 'ud-res-choice-01-a',
         text: 'Choice text',
         consequences: { ud_flag_name: true },
         nextScene: 'ud-res-scene-02'
       }
     ]
   }
   ```

4. **Outcome Object Schema** (must match Rwanda exactly):
   ```javascript
   {
     id: 'ud-res-outcome-equity-path',
     survived: true, // always true for this mission
     conditions: {
       ud_fought_redlining: true,
       ud_supported_fair_housing: true
     },
     epilogue: '200-300 words describing long-term consequences...'
   }
   ```

5. **Validation Requirements**:
   - All scene IDs unique and follow pattern: `ud-res-scene-XX`
   - All choice IDs follow pattern: `ud-res-choice-XX-Y`
   - All nextScene references valid (no dead ends)
   - All flags use `ud_` prefix (e.g., `ud_equity_loss`, `ud_fought_redlining`)
   - Scene 04 includes logic to emit `aftermath:reached` event
   - Final scenes (07-09) route to `nextScene: "outcome"`
   - Audio paths use placeholder format (actual files not required)

## Out of Scope

- Backend integration or data persistence
- User progress tracking across sessions
- Real audio file recording (placeholder paths only)
- 3D graphics or WebGPU rendering
- Interactive map manipulation beyond atmospheric effects
- UIController modifications to render custom graphics (noted as future work)
- Actual implementation of `map-holc-overlay`, `chart-blockbusting-cycle`, `map-heat-island` rendering
- SceneStateMachine engine modifications (Scene 04 will trigger `aftermath:reached` using existing engine logic)

## Success Criteria

The mission is complete when:
1. All 9 scenes implemented with valid routing (no dead ends)
2. Scene 04 triggers `aftermath:reached` event (verify in testing)
3. Mission registered in MissionRegistry.js and appears in timeline selector
4. 5 knowledge checkpoint questions created following Rwanda format
5. 8 historical ripples defined with proper metadata
6. Audio paths specified as placeholders
7. Ripple intros created for 3 path variants
8. Briefing content created with 4-6 historical context pages
9. No console errors during mission playthrough
10. All APHG 6.10 learning objectives addressed
11. Mission follows Rwanda patterns exactly (file structure, naming, schema)
12. Update notes added to `config/update-notes.json` for version 1.2.0
13. Historical date set to `1934-06-28` in mission metadata
14. Concrete data points (mortgage gap, temperature delta, wealth gap) integrated into scene narratives

## Implementation Notes

### Era Structure
- **Era 1 (Scenes 01-03)**: 1930s Redlining
  - Scene 01: Federal appraiser visits, explains HOLC grading (include mortgage gap data)
  - Scene 02: Neighborhood receives 'D' grade (red), property values drop
  - Scene 03: Choice to fight designation or accept it
  
- **Era 2 (Scenes 04-06)**: 1960s Blockbusting and White Flight
  - Scene 04: Real estate speculator arrives (**MUST TRIGGER aftermath:reached event**)
  - Scene 05: White neighbors panic-sell, services decline
  - Scene 06: Choice to sell or stay as neighborhood changes
  
- **Era 3 (Scenes 07-09)**: Modern Urban Heat Island and Gentrification
  - Scene 07: Grandchild inherits property, sees heat island data (include temperature delta)
  - Scene 08: Mixed-use development proposed (include wealth gap data)
  - Scene 09: Choice to support development or resist gentrification

### Key APHG Concepts to Include
- **Redlining**: Federal policy that denied loans to "risky" (Black) neighborhoods
- **Blockbusting**: Real estate practice exploiting racial fears for profit
- **White Flight**: Mass exodus of white residents to suburbs
- **Disinvestment**: Withdrawal of capital and services from urban areas
- **Tax Base Erosion**: Loss of property tax revenue due to declining values
- **Food Deserts**: Areas lacking access to healthy food due to disinvestment
- **Urban Heat Island**: Higher temperatures in areas with less tree canopy
- **Environmental Justice**: Unequal distribution of environmental burdens
- **Mixed-Use Development**: Combining residential, commercial, and green space
- **Gentrification**: Neighborhood change that displaces long-term residents

### Narrative Tone
- Dark, serious, present tense (matching frontend design rules)
- Second person perspective ("You are...")
- No congratulatory or gamified language
- Acknowledges complexity and cost of all choices
- Uses APHG terminology naturally in narrative
- Explains WHY patterns exist, not just WHAT they are

## Reference Templates and Integration Points

### 1. Mission Structure Templates

**Primary Reference**: `js/content/missions/rwanda/mission.js`
- Complete mission object structure with metadata
- Roles array with scene/outcome imports
- Historical ripples array with proper formatting (8 events with `id`, `date`, `title`, `description`, `apTheme`, `animationDelay`)
- AP theme tags and knowledge questions integration
- Mission metadata: `id`, `title`, `historicalDate`, `era`, `unlocked`, `teaser`, `roleSelectionSubtitle`

**Key Mission Metadata for Urban Design**:
```javascript
{
  id: 'aphg-urban-design',
  title: 'The Divided City',
  historicalDate: '1934-06-28', // National Housing Act
  era: 'Modern',
  unlocked: true,
  teaser: 'Experience how 1930s housing policy created modern urban inequality',
  roleSelectionSubtitle: 'Follow one property through three eras of urban development'
}
```

### 2. Role Content Structure Templates

**Primary References**:
- `js/content/missions/rwanda/tutsi-survivor.js` - Scene graph with branching paths, death checkpoints, aftermath scenes
- `js/content/missions/rwanda/hutu-moderate.js` - Linear and branching scene mix
- `js/content/missions/rwanda/un-peacekeeper.js` - Role with mandate constraints

**Key Patterns to Copy**:
- Scene object structure: `id`, `narrative`, `apThemes`, `atmosphericEffect`, `ambientTrack`, `narratorAudio`, `soundEffects`, `choices`
- Choice objects: `id`, `text`, `consequences`, `nextScene`
- Consequence flags using mission prefix (`rw_` → `ud_`)
- Outcome definitions: `id`, `survived`, `conditions`, `epilogue`
- Death checkpoint handling: `deathCheckpoint: true` (NOT needed for urban-design - no death scenarios)
- Audio integration: `narratorAudio` field with path, `soundEffects` array (optional)
- Aftermath scenes: Scene 04 triggers `aftermath:reached` event for timeline transition

**Scene Structure Example from Rwanda**:
```javascript
{
  id: "rw-ts-scene-01",
  narrative: "120-150 words with AP terminology...",
  apThemes: ["causation", "perspective", "complexity"],
  atmosphericEffect: null, // or 'shake', 'map-holc-overlay', etc.
  ambientTrack: null,
  narratorAudio: "audio/narration/tutsi-survivor/rw-ts-scene-01.mp3",
  soundEffects: [
    { file: 'rw-sfx-radio-static-burst.mp3', triggerAfterMs: 1000 }
  ],
  choices: [
    {
      id: "rw-ts-choice-01-a",
      text: "Choice text",
      consequences: { rw_flag_name: true },
      nextScene: "rw-ts-scene-02a"
    }
  ]
}
```

**Outcome Structure Example from Rwanda**:
```javascript
{
  id: "rw-ts-outcome-attic-survived",
  survived: true,
  conditions: {
    rw_hid_with_hutu: true
  },
  epilogue: "200-300 words describing long-term consequences..."
}
```

### 3. Supporting Content Files

**Knowledge Questions**: `js/content/missions/rwanda/knowledge-questions.js`
- Export default array of question objects
- Each with: `id`, `roleSpecific`, `apSkill`, `question`, `options`, `explanation`
- Options array with: `id`, `text`, `correct` boolean
- 5 questions for urban-design mission, all matched to `ud-resident` role

**Ripple Intros**: `js/content/missions/rwanda/ripple-intros.js`
- Export `RIPPLE_INTROS` object with role-based paths
- Export `getRippleIntro(roleId, pathVariant)` function
- 80-120 word intros in second person, reflective tone
- For urban-design: 3 path variants (equity, complicity, adaptation)

**Briefing Content**: `js/content/missions/rwanda/briefing-content.js`
- Export `BRIEFING_PAGES` object with newspaper-style pages (4-6 pages)
- Export `BRIEFING_CARDS` for identity/role cards
- Export `BRIEFING_FINALS` for transition text
- Export `BRIEFING_UI_TEXT` for UI strings
- Export `BRIEFING_CARD_TEMPLATES` for card structure
- For urban-design: Replace identity card with property deed or neighborhood map

### 4. Mission Registry Integration (CRITICAL)

**File**: `js/content/MissionRegistry.js`

**Required Steps**:
1. Import the new mission: `import urbanDesignMission from './missions/urban-design/mission.js';`
2. Add to missions array in the registry
3. Mission will automatically appear in timeline selector

**Example**:
```javascript
import pearlHarborMission from './missions/pearl-harbor/mission.js';
import rwandaMission from './missions/rwanda/mission.js';
import urbanDesignMission from './missions/urban-design/mission.js';

const missions = [
  pearlHarborMission,
  rwandaMission,
  urbanDesignMission  // Add here
];
```

### 5. Engine Integration Points (Read-Only Reference)

**SceneStateMachine**: `js/engine/SceneStateMachine.js`
- Understand scene flow logic
- How `nextScene` routing works
- How `aftermath:reached` event is triggered
- **CRITICAL ISSUE**: Engine currently only listens for Rwanda (`rw-`) prefix when triggering `aftermath:reached` event
- **WORKAROUND**: Scene 04 ID must be `ud-res-scene-04` and follow exact Rwanda pattern - engine may need update to support `ud-` prefix
- **TEST THOROUGHLY**: Verify Scene 04 triggers timeline transition during implementation

**ConsequenceSystem**: `js/engine/ConsequenceSystem.js`
- How flags affect outcomes
- How survival is determined (always `survived: true` for urban-design)
- **No changes needed** - works with any flag prefix

**UIController**: `js/engine/UIController.js`
- How missions are loaded and displayed
- How atmospheric effects are triggered
- **No changes needed** - but note that custom graphics (`map-holc-overlay`, `chart-blockbusting-cycle`, `map-heat-island`) will need future implementation

### 6. Configuration Files

**Version**: `config/version.js`
- Update version number when adding new content
- Suggest: `1.2.0` for new mission addition

**Update Notes**: `config/update-notes.json`
- Document the new mission for players
- Add to `"new"` array with player-friendly description
- Example: `"New mission: The Divided City - Experience urban inequality from 1930s redlining to modern heat islands (AP Human Geography 6.10)"`

### 7. Custom Atmospheric Effects (Future Work)

The mission specifies three custom atmospheric effects that will need UIController implementation:

- `map-holc-overlay`: Display 1930s HOLC redlining maps showing grade zones
- `chart-blockbusting-cycle`: Show Blockbusting Cycle diagram (Agent → Fear → Sell-off → Decline)
- `map-heat-island`: Show spatial correlation between 1930s 'D-grade' zones and modern lack of tree canopy/high temperatures

**For initial implementation**: Specify these in scene `atmosphericEffect` fields as placeholders. UIController will need updates to render these custom graphics in a future task.

**CRITICAL**: Since these graphics won't render initially, Era 3 scene narratives MUST explicitly describe the heat island effect and lack of tree canopy in the text itself. Don't rely on graphics to convey this information.

## Quick Start Checklist

When building the urban-design mission, follow this exact sequence:

### Phase 1: Setup
- [ ] Create folder: `js/content/missions/urban-design/`
- [ ] Copy Rwanda mission files as templates

### Phase 2: Core Content (Create in this order)
- [ ] **mission.js** - Mission metadata, roles array, historical ripples
- [ ] **ud-resident.js** - 9 scenes with choices and outcomes
- [ ] **knowledge-questions.js** - 5 AP checkpoint questions
- [ ] **ripple-intros.js** - 3 path-specific transition texts
- [ ] **briefing-content.js** - 4-6 newspaper briefing pages

### Phase 3: Integration
- [ ] Register in `js/content/MissionRegistry.js`
- [ ] Update `config/version.js` to `1.2.0`
- [ ] Update `config/update-notes.json` with new mission entry

### Phase 4: Validation
- [ ] Verify all scene IDs are unique and follow pattern
- [ ] Verify all `nextScene` references are valid (no dead ends)
- [ ] Verify all flags use `ud_` prefix
- [ ] Verify Scene 04 triggers `aftermath:reached` event
- [ ] Verify final scenes route to `"outcome"`
- [ ] Test mission loads in timeline selector
- [ ] Test full playthrough with no console errors

## File Creation Order and Dependencies

```
1. mission.js (metadata only, no imports yet)
   ↓
2. ud-resident.js (scenes and outcomes)
   ↓
3. knowledge-questions.js (independent)
   ↓
4. ripple-intros.js (independent)
   ↓
5. briefing-content.js (independent)
   ↓
6. mission.js (add imports for steps 2-5)
   ↓
7. MissionRegistry.js (import and register mission)
   ↓
8. version.js + update-notes.json (document changes)
```

## Critical Success Factors

1. **Follow Rwanda patterns exactly** - It's the most complete and recent implementation
2. **Use correct prefixes** - All flags must use `ud_` prefix
3. **Scene 04 is critical** - Must trigger `aftermath:reached` for timeline transition
4. **No engine changes needed** - If you follow the structure, existing engine handles everything
5. **Test incrementally** - Verify each file works before moving to the next
6. **Validate routing** - Every `nextScene` must point to a valid scene ID or `"outcome"`
