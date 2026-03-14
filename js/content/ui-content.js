/**
 * UI Content Configuration
 * 
 * All user-facing text strings for UI screens.
 * Separated from engine logic per architecture rules.
 * 
 * Engine files must contain zero content strings.
 * This file provides all text content for UIController to render.
 */

const uiContent = {
  landing: {
    title: "Witness Interactive",
    subtitle: "History doesn't repeat itself. But you can witness it.",
    tagline: "Choose a moment. Inhabit a perspective. Live with the consequences.",
    context: "Every mission puts you inside a pivotal moment in history — not as an observer, but as someone who had to decide. Your choices reflect real decisions real people made. Some survived. Some didn't. All of them were changed.",
    buttonText: "Choose Your Mission"
  },
  
  timeline: {
    title: "Historical Timeline",
    subtitle: "Select a mission to begin"
  },
  
  roleSelection: {
    title: "Choose Your Perspective",
    subtitle: "Experience Pearl Harbor through different eyes",
    endingsLabel: "Endings Discovered:",
    allRolesCompletedTitle: "All Perspectives Witnessed",
    allRolesCompletedMessage: "You have experienced Pearl Harbor from all three perspectives. You now understand the complexity of this historical moment from multiple viewpoints — a crucial skill in historical analysis.",
    selectRoleButton: "Select Role",
    playAgainButton: "Play Again",
    selectRoleAriaLabel: "Select role",
    playAgainAriaLabel: "Play again as",
    completionBadge: "✓ Completed",
    completionBadgeAriaLabel: "Role completed"
  },
  
  outcome: {
    title: "Your Story",
    buttonText: "Continue"
  },
  
  historicalRipple: {
    title: "Historical Consequences",
    subtitle: "The ripples of December 7, 1941",
    buttonText: "Continue",
    apThemeLabel: "AP Theme:"
  },
  
  knowledgeCheckpoint: {
    title: "Knowledge Checkpoint",
    subtitle: "Test your understanding of the historical context",
    buttonText: "View Results"
  },
  
  resultsCard: {
    title: "Mission Complete",
    copyButtonText: "Copy Results",
    playAgainButtonText: "Play Another Role"
  },
  
  progress: {
    sceneLabel: "Scene"
  },
  
  comingSoon: {
    title: "Coming Soon",
    message: "This mission is not yet available. Check back soon for more historical experiences!",
    buttonText: "Back to Timeline"
  },
  
  soundToggle: {
    muteLabel: "Mute Sound",
    unmuteLabel: "Unmute Sound",
    placeholderNote: "(Sound coming soon)"
  },
  
  errors: {
    outcomeScreen: {
      noMissionOrRole: "Error: Unable to determine outcome. Mission or role data missing.",
      missionNotFound: "Error: Mission data not found.",
      roleNotFound: "Error: Role outcome data not found.",
      noOutcomeId: "Error: Unable to determine outcome based on your choices.",
      outcomeNotFound: "Error: Outcome data not found."
    },
    knowledgeCheckpoint: {
      noMissionOrRole: "Error: Unable to load questions. Mission or role data missing.",
      noQuestions: "Error: Knowledge questions not found.",
      noRoleQuestions: "Error: No questions available for this role.",
      selectionFailed: "Error: Unable to select questions."
    },
    resultsCard: {
      generatorUnavailable: "Error: Results card generator not available."
    }
  }
};

// ES6 module export
export default uiContent;
