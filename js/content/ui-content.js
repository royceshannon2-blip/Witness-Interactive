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
    buttonText: "Begin Experience",
    socialProof: {
      stat: "Join 100+ students",
      label: "who've experienced Pearl Harbor through multiple perspectives",
      testimonials: [
        {
          quote: "This made Pearl Harbor real in a way textbooks never did.",
          author: "High school junior, AP US History"
        },
        {
          quote: "I played all three roles. Each one taught me something different about perspective.",
          author: "College freshman, History major"
        },
        {
          quote: "The branching choices really made me think about what I would do in that situation.",
          author: "AP History student"
        }
      ]
    }
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
  }
};

// ES6 module export
export default uiContent;
