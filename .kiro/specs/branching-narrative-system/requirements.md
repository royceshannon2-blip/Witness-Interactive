# Requirements Document

## Introduction

The branching narrative system transforms Witness Interactive from a linear story experience into a true choice-driven narrative where player decisions create divergent story paths. The core educational principle remains: "Paths diverge. Lessons converge." Players experience different emotional journeys and historical perspectives based on their choices, but all paths teach the same AP History reasoning skills (causation, perspective, continuity, argumentation).

This system enables replayability while maintaining educational rigor. A student who plays the Japanese Aviator role three times with different choices will experience three distinct narrative arcs—compliance with orders, acting on instinct, or bearing witness—but will master the same AP curriculum outcomes regardless of path taken.

## Glossary

- **Scene_Router**: The component responsible for determining which scene to display next based on player choices
- **Path_Variant**: One of three narrative trajectories (Compliance, Instinct, Witness) that a player can follow through a role
- **Branch_Point**: A scene containing choices that route to different nextScene IDs, creating path divergence
- **Convergence_Point**: A scene where all path variants merge back together (Outcome Screen, Historical Ripple)
- **Consequence_Flag**: A boolean value stored by ConsequenceSystem tracking player choices
- **Scene_Map**: A data structure mapping scene IDs to scene objects for efficient routing
- **Outcome_Generator**: Component that creates personalized epilogue text based on consequence flags
- **Path_Aware_Question**: A knowledge checkpoint question tagged for a specific path variant
- **AP_Theme**: Educational tag identifying which AP History reasoning skill a scene addresses

## Requirements

### Requirement 1: Scene Routing Architecture

**User Story:** As a game engine, I want to route players to specific scenes based on their choices, so that different decisions create divergent narrative paths.

#### Acceptance Criteria

1. WHEN a player makes a choice, THE Scene_Router SHALL navigate to the scene ID specified in that choice's nextScene field
2. WHEN a role is loaded, THE Scene_Router SHALL build a Scene_Map from scene ID to scene object for efficient lookup
3. WHEN a scene ID is not found in the Scene_Map, THE Scene_Router SHALL log an error and prevent navigation
4. THE Scene_Router SHALL read the startScene field from mission configuration to determine the first scene
5. WHEN routing to a scene, THE Scene_Router SHALL validate that the scene object contains required fields (id, narrative, choices)

### Requirement 2: Branching Scene Data Structure

**User Story:** As a content author, I want to define scenes with explicit routing targets, so that I can create branching narratives without relying on sequential indices.

#### Acceptance Criteria

1. THE Scene_Object SHALL include an id field containing a unique scene identifier
2. THE Scene_Object SHALL include a choices array where each choice contains a nextScene field
3. WHEN a choice does not specify nextScene, THE Scene_Router SHALL treat it as a terminal choice leading to outcome calculation
4. THE Scene_Object SHALL include an apThemes array containing at least one AP curriculum tag
5. WHEN a scene is missing the apThemes array, THE Scene_Router SHALL emit a console warning

### Requirement 3: Path Variant Content Creation

**User Story:** As a student, I want to experience different narrative arcs based on my choices, so that replaying the same role reveals new perspectives and emotional experiences.

#### Acceptance Criteria

1. THE Japanese_Aviator_Role SHALL contain at least 2 branch points creating 3 distinct path variants
2. THE American_Sailor_Role SHALL contain at least 2 branch points creating 3 distinct path variants
3. THE American_Civilian_Role SHALL contain at least 2 branch points creating 3 distinct path variants
4. WHEN a player follows the Compliance path, THE System SHALL present scenes emphasizing discipline, orders, and strategic objectives
5. WHEN a player follows the Instinct path, THE System SHALL present scenes emphasizing moral agency, survival, and deviation from orders
6. WHEN a player follows the Witness path, THE System SHALL present scenes emphasizing observation, civilian experience, and being pulled into events
7. THE System SHALL ensure each path variant includes at least 2 unique scenes not shared with other paths
8. THE System SHALL ensure all path variants converge at the Outcome Screen
9. THE System SHALL ensure all path variants converge at the Historical Ripple Screen

### Requirement 4: Scene Content Quality Standards

**User Story:** As an educator, I want all branching scenes to meet educational and narrative quality standards, so that every path provides a rigorous learning experience.

#### Acceptance Criteria

1. THE Scene_Narrative SHALL contain between 80 and 150 words
2. THE Scene_Narrative SHALL use second person present tense
3. THE Scene_Narrative SHALL engage at least 3 sensory details (sight, sound, smell, touch, taste)
4. THE Scene_Choices SHALL contain between 4 and 8 choice options
5. THE Scene_Object SHALL include an apThemes array with at least one valid AP curriculum tag
6. THE Scene_Narrative SHALL avoid anachronistic language and maintain historical authenticity
7. THE Scene_Narrative SHALL create emotional engagement without gratuitous violence

### Requirement 5: Personalized Outcome Generation

**User Story:** As a student, I want to see an epilogue that reflects my specific choices, so that I understand the consequences of my decisions within the historical context.

#### Acceptance Criteria

1. WHEN the Outcome Screen is displayed, THE Outcome_Generator SHALL read consequence flags from ConsequenceSystem
2. THE Outcome_Generator SHALL select an outcome template based on the combination of consequence flags
3. THE Outcome_Generator SHALL generate epilogue text between 100 and 200 words
4. THE Outcome_Epilogue SHALL reference at least one specific player choice by name or description
5. THE Outcome_Epilogue SHALL end with a historical anchor connecting player actions to actual historical outcomes
6. WHEN no matching outcome template exists, THE Outcome_Generator SHALL use a default template that acknowledges player choices generically

### Requirement 6: Path-Aware Historical Ripple

**User Story:** As a student, I want the Historical Ripple introduction to acknowledge my narrative path, so that the transition from personal story to historical timeline feels coherent.

#### Acceptance Criteria

1. WHEN the Historical Ripple Screen is displayed, THE System SHALL read consequence flags to determine the player's path variant
2. WHEN the player followed the Compliance path, THE System SHALL display an intro emphasizing duty and orders
3. WHEN the player followed the Instinct path, THE System SHALL display an intro emphasizing moral agency and deviation
4. WHEN the player followed the Witness path, THE System SHALL display an intro emphasizing observation and civilian experience
5. THE Historical_Ripple_Timeline SHALL remain identical for all players regardless of path
6. THE Historical_Ripple_Intro SHALL be between 15 and 30 words

### Requirement 7: Path-Aware Knowledge Checkpoint

**User Story:** As an educator, I want knowledge checkpoint questions to vary based on the narrative path students experienced, so that assessment aligns with the specific historical perspectives they encountered.

#### Acceptance Criteria

1. THE Knowledge_Question_Pool SHALL contain at least 6 questions per role
2. THE Knowledge_Question SHALL include a pathVariant field with value 'compliance', 'instinct', or 'witness'
3. WHEN the Knowledge Checkpoint is displayed, THE System SHALL read consequence flags to determine the player's path variant
4. THE System SHALL select 3 questions matching the player's path variant
5. WHEN the player followed the Compliance path, THE System SHALL present questions about strategic outcomes and military decision-making
6. WHEN the player followed the Instinct path, THE System SHALL present questions about moral agency and historical contingency
7. WHEN the player followed the Witness path, THE System SHALL present questions about civilian experience and social consequences
8. WHEN fewer than 3 questions exist for a path variant, THE System SHALL supplement with questions from other paths

### Requirement 8: Replayability Indicator

**User Story:** As a student, I want to know which narrative path I experienced and what other paths exist, so that I'm motivated to replay the role and explore alternative perspectives.

#### Acceptance Criteria

1. WHEN the Results Card is displayed, THE System SHALL show the path variant the player followed
2. THE Results_Card SHALL display text in format: "Path taken: [Compliance|Instinct|Witness]"
3. THE Results_Card SHALL list other available path variants not yet experienced
4. THE Results_Card SHALL display text: "Other paths: [list of paths]"
5. THE Results_Card SHALL display encouragement text: "Play again to see how history changes"
6. WHEN a player has completed all path variants for a role, THE System SHALL display: "All paths completed for this role"

### Requirement 9: Error Handling and Validation

**User Story:** As a developer, I want comprehensive error handling for scene routing, so that content errors are caught early and don't break the player experience.

#### Acceptance Criteria

1. WHEN a choice references a non-existent nextScene ID, THE Scene_Router SHALL log an error to console with the missing scene ID
2. WHEN a choice references a non-existent nextScene ID, THE Scene_Router SHALL prevent navigation and keep the player on the current scene
3. WHEN a scene is missing the apThemes array, THE Scene_Router SHALL emit a console warning with the scene ID
4. WHEN a scene narrative exceeds 150 words, THE Scene_Router SHALL emit a console warning
5. WHEN a scene has fewer than 4 or more than 8 choices, THE Scene_Router SHALL emit a console warning
6. THE Scene_Router SHALL validate all scenes in a role on initial load and report all validation errors in a single console message

### Requirement 10: Path Completability

**User Story:** As a student, I want every narrative path to be completable, so that my choices never lead to dead ends or broken experiences.

#### Acceptance Criteria

1. THE System SHALL ensure every path variant has a complete route from startScene to Outcome Screen
2. THE System SHALL ensure no scene creates a routing loop that prevents progression
3. WHEN a scene is terminal (no nextScene in any choice), THE Scene_Router SHALL trigger outcome calculation
4. THE System SHALL validate on role load that all referenced nextScene IDs exist in the Scene_Map
5. WHEN path validation fails, THE System SHALL log all broken routes to console before game start
