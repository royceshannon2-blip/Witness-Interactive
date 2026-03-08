# Implementation Plan: Witness Interactive Pearl Harbor

## Current Status (Updated 2026-03-07)

### ✅ Completed (Tasks 1-11)
- Core architecture and project setup
- EventBus communication system
- Game state management (ConsequenceSystem, SceneStateMachine)
- UI rendering system (UIController)
- Landing screen and timeline selector
- Role selection screen
- Scene rendering and choice handling
- Pearl Harbor narrative content (3 roles, 4-5 scenes each, outcomes defined)
- CSS atmospheric effects (smoke, fire, shake)
- Responsive design and keyboard navigation
- Dark cinematic theme

### 🚧 In Progress (Tasks 12-15)
- Outcome screen logic (HTML structure exists, needs population logic)
- Historical ripple timeline (UI structure exists, needs data and animation logic)
- Knowledge checkpoint (UI structure exists, needs questions and scoring logic)

### ⏳ Not Started (Tasks 16-24)
- AnalyticsTracker and ResultsCard implementation
- ARIA labels and semantic HTML improvements
- Sound toggle button placeholder
- Role completion tracking UI
- Documentation (README.md, CONTRIBUTING.md)
- Final testing and deployment

### 🎯 Next Priority Tasks
1. Task 12: Manual testing checkpoint - verify one role plays through end-to-end
2. Task 13.2: Implement outcome screen population logic
3. Task 14: Implement historical ripple timeline with data and animations
4. Task 15: Implement knowledge checkpoint with questions and scoring

## Overview

This implementation plan breaks down the Witness Interactive: Pearl Harbor game into discrete, incremental coding tasks. The approach prioritizes building the core engine first, then adding Pearl Harbor content, and finally polishing the UI and educational features. Each task builds on previous work, with checkpoints to ensure stability before proceeding.

The MVP focuses on shipping a working game by April 4th with manual + Playwright testing. Property-based testing is deferred to Phase 2.

## Tasks

- [x] 1. Project setup and core architecture
  - Create folder structure: witness-interactive/ with css/, js/engine/, js/content/missions/pearl-harbor/
  - Create index.html with ES6 module loading
  - Create style.css with CSS custom properties for colors, fonts, spacing
  - _Requirements: 1.1, 1.5, 13.1-13.5, 19.4_

- [x] 2. Implement EventBus communication system
  - [x] 2.1 Create EventBus.js with pub/sub pattern
    - Implement on(), off(), emit() methods
    - Ensure no global variables, ES6 module exports only
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 19.1, 19.2_
  
  - [x] 2.2 Create LoadingStateHandler.js
    - Implement showLoading(), hideLoading(), updateProgress() methods
    - Subscribe to EventBus for module loading events
    - Display loading animation on index.html initial load
    - _Requirements: 18.3_

- [x] 3. Implement core game state management
  - [x] 3.1 Create ConsequenceSystem.js
    - Implement setFlag(), getFlag(), getAllFlags(), reset() methods
    - Track boolean and numeric flags
    - Subscribe to EventBus for choice:made events
    - _Requirements: 6.1, 6.2, 6.4, 6.5, 20.1, 20.2_
  
  - [x] 3.2 Create SceneStateMachine.js
    - Implement loadRole(), getCurrentScene(), transitionTo(), isComplete() methods
    - Validate scene objects have required fields (id, narrative, apThemes, choices)
    - Log warning if apThemes array is empty
    - Emit scene:transition events via EventBus
    - _Requirements: 2.4, 5.4, 6.5, 20.3_

- [x] 4. Checkpoint - Verify core engine components
  - Ensure EventBus, ConsequenceSystem, SceneStateMachine load without errors
  - Verify no global variables in console
  - Ask user if questions arise

- [x] 5. Implement MissionRegistry and content loading
  - [x] 5.1 Create MissionRegistry.js
    - Implement register(), getMission(), getAllMissions(), getMissionsByEra() methods
    - Validate mission objects have required fields (id, title, historicalDate, era, roles)
    - _Requirements: 2.1, 15.1, 15.2, 15.3, 15.5, 3A.12_
  
  - [x] 5.2 Create Pearl Harbor mission.js
    - Define mission metadata: id, title, historicalDate ("1941-12-07"), era ("Modern"), unlocked: true
    - Define three roles: japanese-aviator, american-sailor, american-civilian
    - Include teaser description for timeline tooltip
    - Register mission with MissionRegistry
    - _Requirements: 3.3, 4.2, 3A.3_

- [x] 6. Implement UI rendering system
  - [x] 6.1 Create UIController.js
    - Implement showScreen(), renderScene(), showLoading(), applyEffect(), updateProgress() methods
    - Subscribe to EventBus for scene:transition, game:start, game:complete events
    - Render screens: landing, timeline, role-selection, scene, outcome, historical-ripple, knowledge-checkpoint, results-card
    - _Requirements: 5.2, 5.3, 5.5, 18.4_
  
  - [x] 6.2 Create main.js application bootstrap
    - Initialize EventBus, LoadingStateHandler, ConsequenceSystem, SceneStateMachine, UIController, MissionRegistry
    - Load Pearl Harbor mission
    - Show loading animation, then transition to landing screen
    - Emit game:start event
    - _Requirements: 3.1, 18.3_

- [x] 7. Implement landing screen and mission selection
  - [x] 7.1 Create landing screen HTML/CSS
    - Display game title, tagline, context setter
    - Add "Begin" button that transitions to timeline
    - Use dark cinematic theme with CSS custom properties
    - _Requirements: 3.1, 10.1, 10.2, 10.3, 10.4_
  
  - [x] 7.2 Create TimelineSelector.js
    - Implement render(), onNodeClick(), showTooltip() methods
    - Render horizontal timeline with Pearl Harbor unlocked, other eras locked
    - Display tooltips on hover/tap with event name, date, teaser
    - Handle click on unlocked node → emit mission:selected event
    - Handle click on locked node → show "Coming Soon" message
    - Make horizontally scrollable on mobile
    - _Requirements: 3A.1, 3A.2, 3A.3, 3A.4, 3A.5, 3A.6, 3A.7, 3A.9, 3A.10_

- [x] 8. Checkpoint - Verify landing and timeline work
  - Manually test landing screen → timeline transition
  - Verify Pearl Harbor node is unlocked, others locked
  - Verify tooltip displays on hover
  - Verify "Coming Soon" message on locked nodes
  - Test horizontal scroll on mobile (320px width)
  - Ask user if questions arise

- [x] 9. Implement role selection screen
  - [x] 9.1 Create role selection UI
    - Display mission title and three role cards
    - Show role name, description for each role
    - Add selection buttons that emit role:selected event
    - Display "endings discovered" counter (0/3 initially)
    - Track completed roles in session state (no localStorage)
    - _Requirements: 4.1, 4.3, 4.5, 23.1, 23.2, 23.3_

- [~] 10. Create Pearl Harbor narrative content
  - [x] 10.1 Write Japanese Naval Aviator role scenes
    - Create japanese-aviator.js with 4-5 scene objects
    - Each scene includes: id, narrative, apThemes array, choices array, atmosphericEffect
    - Tag scenes with AP themes: causation, continuity, perspective
    - Define consequence flags for choices (e.g., avoided_aa_fire, fuel_conserved)
    - Define nextScene for each choice
    - _Requirements: 5.1, 5.2, 5.3, 24.1, 24.2_
  
  - [x] 10.2 Write American Sailor (USS Arizona) role scenes
    - Create american-sailor.js with 4-5 scene objects
    - Tag scenes with AP themes
    - Define consequence flags and scene transitions
    - _Requirements: 5.1, 5.2, 5.3, 24.1, 24.2_
  
  - [x] 10.3 Write American Civilian role scenes
    - Create american-civilian.js with 4-5 scene objects
    - Tag scenes with AP themes
    - Define consequence flags and scene transitions
    - _Requirements: 5.1, 5.2, 5.3, 24.1, 24.2_

- [x] 11. Implement scene rendering and choice handling
  - [x] 11.1 Create scene display UI
    - Render scene narrative text in aged parchment panel
    - Display 2-4 choice buttons
    - Show progress indicator (e.g., "Scene 2 of 5")
    - Apply atmospheric effects (smoke, fire, shake) based on scene.atmosphericEffect
    - _Requirements: 5.2, 5.3, 5.5, 11.1, 11.2, 11.3, 11.5_
  
  - [x] 11.2 Handle choice selection
    - When choice clicked, emit choice:made event with consequences
    - ConsequenceSystem sets flags
    - SceneStateMachine transitions to nextScene
    - UIController renders new scene
    - _Requirements: 5.4, 6.1, 6.5_

- [x] 12. Checkpoint - Verify one role plays through
  - Manually play through Japanese Aviator role
  - Verify scenes display correctly
  - Verify choices set consequence flags (check console logs)
  - Verify scene transitions work
  - Verify progress indicator updates
  - Ask user if questions arise

- [~] 13. Implement outcome calculation and display
  - [x] 13.1 Define outcome rules for each role
    - In each role file, define outcome objects with conditions and epilogues
    - Example: {survived: true, conditions: {avoided_aa_fire: true}, epilogue: "..."}
    - _Requirements: 6.3, 7.3, 7.4_
  
  - [x] 13.2 Create outcome screen logic
    - Calculate outcome based on consequence flags using ConsequenceSystem.calculateOutcome()
    - Populate outcome screen with survival status and epilogue
    - Add "Continue" button that emits event to proceed to historical ripple
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [~] 14. Implement Historical Ripple timeline
  - [~] 14.1 Create historical ripple event data
    - Define ripple events in pearl-harbor/mission.js historicalRipple array
    - Each event: id, date, title, description, apTheme, animationDelay
    - Include events: Dec 8 1941 war declaration, internment, Pacific theater, Hiroshima/Nagasaki, post-war
    - _Requirements: 8.2, 8.3_
  
  - [~] 14.2 Create historical ripple UI logic
    - Populate ripple timeline container with events from mission data
    - Animate events progressively using CSS transitions based on animationDelay
    - Show AP theme tags for each event
    - Add "Continue" button that emits event to proceed to knowledge checkpoint
    - _Requirements: 8.1, 8.4, 8.5, 24.3_

- [~] 15. Implement Knowledge Checkpoint
  - [~] 15.1 Create knowledge questions for each role
    - Populate knowledge-questions.js with 3 questions per role (9 total)
    - Each question: id, roleSpecific, apSkill, question, options (4 choices), explanation
    - Tag questions with AP reasoning skills
    - Add questions to mission.js knowledgeQuestions array
    - _Requirements: 9.2, 9.3, 24.4_
  
  - [~] 15.2 Create knowledge checkpoint UI logic
    - Render 3 role-specific questions from mission data
    - Show 4 multiple-choice options per question
    - Provide immediate feedback on answer selection (correct/incorrect)
    - Calculate and display final score (e.g., "2/3 correct")
    - Show explanations for each question
    - Add "View Results" button that emits checkpoint:complete event
    - _Requirements: 9.1, 9.4, 9.5_

- [~] 16. Checkpoint - Verify full game flow
  - Manually play through all three roles
  - Verify outcomes reflect different choices
  - Verify historical ripple displays correctly
  - Verify knowledge checkpoint shows role-specific questions
  - Verify scoring works correctly
  - Ask user if questions arise

- [~] 17. Implement AnalyticsTracker and ResultsCard
  - [~] 17.1 Create AnalyticsTracker.js
    - Implement startSession(), logAction(), getSessionSummary(), exportSession() methods
    - Track session start/end times, choices, flags, checkpoint answers
    - Log session data to console as JSON
    - Subscribe to EventBus for all player actions
    - _Requirements: 26.1, 26.2, 26.3, 26.4_
  
  - [~] 17.2 Create ResultsCard.js
    - Implement generateCard(), copyCardText() methods
    - Display mission name, role played, survival status, checkpoint score, completion timestamp
    - List AP themes engaged during session
    - Include game title and call-to-action
    - Add "Copy Results" button that copies text to clipboard
    - _Requirements: 22.1, 22.2, 22.3, 22.4, 22.5, 27.1, 27.2, 27.4, 27.5, 24.5_

- [~] 18. Implement responsive design and mobile optimization
  - [x] 18.1 Add responsive CSS breakpoints
    - Test at 320px (mobile), 768px (tablet), 1280px (desktop)
    - Ensure timeline scrolls horizontally on mobile
    - Ensure all text is readable at all sizes
    - Ensure touch targets are at least 44x44px
    - Use max-width centered layout
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [~] 19. Implement accessibility features
  - [x] 19.1 Add keyboard navigation
    - Ensure all interactive elements are focusable with Tab
    - Add visible focus indicators (CSS :focus styles)
    - Support Enter key for button activation
    - Support Arrow keys for choice navigation
    - _Requirements: 25.1, 25.2, 25.6_
  
  - [~] 19.2 Add ARIA labels and semantic HTML
    - Use semantic HTML5 elements (nav, main, article, button)
    - Add ARIA labels to all interactive elements
    - Add role attributes where appropriate
    - _Requirements: 25.3, 25.4_

- [~] 20. Polish UI and add atmospheric effects
  - [x] 20.1 Refine dark cinematic theme
    - Implement CSS custom properties for all colors, fonts, spacing
    - Create aged parchment text panels with CSS
    - Add red and gold accent colors
    - Implement smooth fade transitions between screens
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_
  
  - [x] 20.2 Implement pure CSS atmospheric effects
    - Create smoke effect CSS animation
    - Create fire glow effect CSS animation
    - Create screen shake effect CSS animation
    - Trigger effects based on scene.atmosphericEffect property
    - Verify no JavaScript animation libraries used
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [~] 21. Add UI controls and final touches
  - [~] 21.1 Add sound toggle button (visual placeholder)
    - Display toggle button in UI (non-functional for MVP)
    - Style consistently with theme
    - _Requirements: 18.1, 18.2_
  
  - [x] 21.2 Add intro animation
    - Create CSS loading animation for initial page load
    - Fade in landing screen after loading completes
    - _Requirements: 18.3_
  
  - [~] 21.3 Implement role completion tracking
    - Track completed roles in session state (ConsequenceSystem or separate tracker)
    - Update "endings discovered" counter on role selection screen
    - Show completion checkmarks on completed roles
    - Display special message when all 3 roles completed
    - _Requirements: 23.1, 23.2, 23.3, 23.4_

- [~] 22. Create documentation files
  - [~] 22.1 Write README.md
    - Project description and educational value
    - How to play instructions
    - GitHub Pages deployment steps
    - Architecture overview
    - Roadmap for future missions
    - _Requirements: 17.1, 17.2, 17.3_
  
  - [~] 22.2 Write CONTRIBUTING.md
    - Step-by-step guide for adding new missions
    - Mission data structure template
    - Scene object template
    - How to register missions in MissionRegistry
    - Targeted at teachers/students with basic coding knowledge
    - _Requirements: 17.4, 17.5_

- [~] 23. Final testing and deployment preparation
  - [~] 23.1 Manual playtesting
    - Play through all three roles with different choices
    - Verify outcomes reflect decisions
    - Test on mobile (320px), tablet (768px), desktop (1280px)
    - Test keyboard navigation
    - Verify no console errors
    - _Requirements: All_
  
  - [~] 23.2 Verify offline functionality
    - Load game once, then disconnect internet
    - Verify game functions fully offline
    - _Requirements: 28.1, 28.2, 28.4_
  
  - [~] 23.3 Deploy to GitHub Pages
    - Push all code to main branch
    - Enable GitHub Pages in repository settings
    - Verify deployment is live and accessible
    - Test deployed version on multiple devices
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [~] 24. Final checkpoint - Complete MVP verification
  - Verify all three roles are playable end-to-end
  - Verify consequence flags affect outcomes
  - Verify knowledge checkpoint scoring works
  - Verify results card displays and is copyable
  - Verify timeline selector works correctly
  - Verify mobile responsive design
  - Verify keyboard navigation
  - Verify GitHub Pages deployment is live
  - Verify no console errors
  - Verify historical ripple timeline animates
  - Ask user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP (none in this plan - all tasks are required for MVP)
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation before proceeding
- Focus on shipping working game by April 4th - property-based testing deferred to Phase 2
- All code must follow architecture rules: no global variables, ES6 modules only, EventBus for communication, engine/content separation
