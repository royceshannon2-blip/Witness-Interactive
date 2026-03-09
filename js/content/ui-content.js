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
    subtitle: "Pearl Harbor",
    tagline: "December 7, 1941 — A Date Which Will Live in Infamy",
    context: "Experience the attack on Pearl Harbor from three different perspectives. Your choices matter. History remembers.",
    buttonText: "Begin Experience"
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
    allRolesCompletedMessage: "You have experienced Pearl Harbor from all three perspectives. You now understand the complexity of this historical moment from multiple viewpoints — a crucial skill in historical analysis."
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
  }
};

// ES6 module export
export default uiContent;
