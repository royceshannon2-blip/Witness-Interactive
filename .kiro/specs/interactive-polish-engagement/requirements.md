# Requirements Document: Interactive Polish & Engagement Features

## Introduction

This specification defines interactive polish and engagement features for the Witness Interactive Pearl Harbor game. The current implementation functions correctly but lacks the immersive, engaging feel of an interactive experience. Users report it feels like "reading a book" rather than playing a game. These features will add visual and interactive polish to create urgency, immersion, and emotional engagement while maintaining the educational focus and technical constraints of the project.

## Glossary

- **Game_Engine**: The core JavaScript modules in js/engine/ that handle game logic and state
- **Scene**: A single narrative moment with text, choices, and optional effects
- **Choice**: A decision point where the player selects from multiple options
- **Typewriter_Effect**: Character-by-character text reveal animation
- **Timed_Choice**: A choice with a countdown timer that auto-selects if time expires
- **Ambient_Sound**: Looping background audio that creates atmosphere
- **Scene_Transition**: Visual animation between scenes
- **Atmospheric_Visual**: CSS-based visual effects like smoke, fire, or screen shake
- **EventBus**: The centralized event system for component communication
- **prefers-reduced-motion**: Browser accessibility setting for users sensitive to motion

## Requirements

### Requirement 1: Typewriter Text Effect

**User Story:** As a player, I want text to appear character by character, so that the story feels like it's unfolding in real time rather than being dumped on screen.

#### Acceptance Criteria

1. WHEN a scene loads, THE Game_Engine SHALL display scene text using a typewriter effect with configurable speed
2. WHEN the typewriter effect is active, THE Game_Engine SHALL reveal characters sequentially at the configured rate
3. WHEN a player clicks during typewriter animation, THE Game_Engine SHALL immediately complete the text reveal
4. WHEN a player has prefers-reduced-motion enabled, THE Game_Engine SHALL display text instantly without animation
5. THE Game_Engine SHALL allow configuration of typewriter speed per scene or globally

### Requirement 2: Timed Choice System

**User Story:** As a player, I want to feel time pressure on critical decisions, so that the urgency and stress of Pearl Harbor is reflected in gameplay.

#### Acceptance Criteria

1. WHEN a scene includes a timed choice, THE Game_Engine SHALL display a visible countdown timer
2. WHEN the countdown reaches zero, THE Game_Engine SHALL automatically select a default choice
3. WHEN a player makes a choice before time expires, THE Game_Engine SHALL cancel the timer and process the choice
4. THE Game_Engine SHALL allow configuration of timer duration per choice in scene content files
5. THE Content files SHALL specify which choices are timed, timer duration, and default auto-select choice
6. THE Arizona sailor role SHALL have the most timed choices to reflect combat urgency
7. WHEN a player has prefers-reduced-motion enabled, THE Game_Engine SHALL still display the timer but with reduced visual effects
8. THE Game_Engine SHALL provide a task to review and tag appropriate scenes in all three role content files

### Requirement 3: Ambient Sound System

**User Story:** As a player, I want atmospheric background audio, so that I feel immersed in the Pearl Harbor setting.

#### Acceptance Criteria

1. WHEN a scene specifies ambient sound, THE Game_Engine SHALL play the corresponding audio file in a loop
2. WHEN the player clicks the sound toggle button, THE Game_Engine SHALL mute or unmute all audio
3. WHEN transitioning between scenes, THE Game_Engine SHALL crossfade between different ambient sounds
4. THE Game_Engine SHALL use only public domain audio files from freesound.org
5. WHEN audio fails to load, THE Game_Engine SHALL continue gameplay without audio and log the error
6. THE Implementation SHALL include a manual step where the USER downloads and provides audio files
7. THE Game_Engine SHALL be built to reference audio files in a `/audio/` directory structure
8. THE Implementation tasks SHALL specify recommended freesound.org search terms:
   - "Pearl Harbor ambience"
   - "WWII aircraft engine loop"
   - "ocean waves loop"
   - "air raid siren"
   - "explosion distant"
9. THE Game_Engine SHALL gracefully handle missing audio files without breaking gameplay
10. THE Implementation SHALL include a task to document audio file requirements and sourcing instructions

### Requirement 4: Atmospheric Visual Effects

**User Story:** As a player, I want visual effects during dramatic moments, so that the intensity of combat and danger feels real.

#### Acceptance Criteria

1. WHEN a scene specifies atmospheric effects, THE Game_Engine SHALL trigger the corresponding CSS animations
2. THE Game_Engine SHALL support the following effect types:
   - **smoke**: Dark smoke particles rising from bottom to top (burning ships, fires)
   - **fire**: Orange/red flickering glow effect (explosions, burning oil)
   - **shake**: Screen shake animation (explosions, bomb impacts)
   - **dawn**: Soft orange/pink gradient overlay (peaceful morning before attack)
   - **explosion**: Bright white flash followed by fade (magazine detonation, bomb hits)
   - **aftermath**: Desaturated, hazy overlay (post-attack devastation)
   - **rain**: Subtle rain particle effect (weather conditions)
   - **ocean**: Gentle wave motion blur (aboard ships)
   - **ash**: Gray ash particles falling slowly (post-attack fallout)
3. WHEN a player has prefers-reduced-motion enabled, THE Game_Engine SHALL disable or reduce atmospheric effects
4. THE Atmospheric_Visual effects SHALL not obscure critical text or choices
5. THE Game_Engine SHALL allow multiple effects to run simultaneously
6. THE Game_Engine SHALL implement effects using pure CSS animations with minimal JavaScript triggers
7. THE Atmospheric_Visual effects SHALL be optimized for 60fps performance on mobile devices

### Requirement 5: Scene Transition Animations

**User Story:** As a player, I want smooth transitions between scenes, so that the experience feels cohesive rather than like clicking through a form.

#### Acceptance Criteria

1. WHEN transitioning to a new scene, THE Game_Engine SHALL apply a fade or flash animation
2. THE Scene_Transition SHALL complete within 500ms to maintain pacing
3. WHEN a player has prefers-reduced-motion enabled, THE Game_Engine SHALL use instant transitions
4. THE Game_Engine SHALL prevent player input during transition animations
5. THE Scene_Transition SHALL work consistently across all browsers and devices

### Requirement 6: Enhanced Choice Interactions

**User Story:** As a player, I want choice buttons to feel weighty and deliberate, so that my decisions feel meaningful rather than like filling out a form.

#### Acceptance Criteria

1. WHEN hovering over a choice button, THE Game_Engine SHALL display visual feedback indicating interactivity
2. WHEN clicking a choice button, THE Game_Engine SHALL provide tactile feedback through animation
3. THE Choice buttons SHALL have distinct visual states for hover, active, and selected
4. WHEN a player has prefers-reduced-motion enabled, THE Game_Engine SHALL use subtle hover effects
5. THE Choice interactions SHALL work on both mouse and touch devices

### Requirement 7: Accessibility and Performance

**User Story:** As a player with accessibility needs, I want all interactive features to respect my preferences, so that I can enjoy the game without discomfort.

#### Acceptance Criteria

1. WHEN prefers-reduced-motion is enabled, THE Game_Engine SHALL disable or reduce all animations
2. THE Game_Engine SHALL maintain 60fps performance on mobile devices during all effects
3. THE Game_Engine SHALL provide keyboard navigation for all interactive elements
4. THE Game_Engine SHALL ensure sufficient color contrast for all visual effects
5. THE Game_Engine SHALL allow players to skip or disable individual effect types

### Requirement 8: Architecture Compliance

**User Story:** As a developer, I want all features to follow existing architecture patterns, so that the codebase remains maintainable and consistent.

#### Acceptance Criteria

1. THE Game_Engine SHALL communicate all effect triggers through the EventBus
2. THE Game_Engine SHALL store all effect logic in js/engine/ with zero content strings
3. THE Game_Engine SHALL store all effect configurations in content files with zero logic
4. THE Game_Engine SHALL use ES6 modules with no global variables
5. THE Game_Engine SHALL work without frameworks, npm, or build tools
