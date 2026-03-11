/**
 * ripple-intros.js
 * Path-specific intro texts for Historical Ripple timeline
 * 9 variants: 3 roles × 3 paths (duty, survival, humanity)
 */

export const RIPPLE_INTROS = {
  'japanese-aviator-duty': {
    text: 'Your unwavering commitment to orders shaped history. By following the mission plan precisely, you contributed to tactical success but also strategic failure that united America. Your discipline exemplified the warrior code, yet prevented adaptation when circumstances changed.',
    tone: 'reflective'
  },
  'japanese-aviator-survival': {
    text: 'Your focus on self-preservation influenced the battle. By prioritizing safety over objectives, you survived but at what cost? Your choices reflected human instinct yet contributed to incomplete destruction of key targets. The carriers that escaped would return to haunt Japan.',
    tone: 'somber'
  },
  'japanese-aviator-humanity': {
    text: 'Your recognition of shared humanity marked you as different. By showing restraint toward defenseless targets, you preserved your moral compass but allowed future threats to survive. Your compassion was honorable, yet in total war, mercy can be a luxury neither side could afford.',
    tone: 'contemplative'
  },
  'american-sailor-duty': {
    text: 'Your dedication to duty in chaos saved lives. By maintaining discipline under fire, you embodied Navy values and helped minimize casualties. Your actions ensured damaged ships could be salvaged. The Pacific Fleet would rise from the ashes because of sailors like you.',
    tone: 'proud'
  },
  'american-sailor-survival': {
    text: 'Your instinct for self-preservation kept you alive through hell. By prioritizing escape over duty, you survived to tell the story but others paid the price. You lived, but the memory of those you couldn''t save would haunt you forever.',
    tone: 'haunted'
  },
  'american-sailor-humanity': {
    text: 'Your compassion in crisis defined your character. By risking everything to save others, you embodied the brotherhood of the sea. Your selfless actions rescued shipmates who would fight in crucial battles. Heroes aren''t born—they''re forged in moments like these.',
    tone: 'heroic'
  },
  'american-civilian-duty': {
    text: 'Your commitment to helping others made a difference. By organizing rescue efforts and maintaining order, you prevented panic from claiming more lives. Your leadership showed civilians could be as brave as soldiers. Sometimes duty calls even those who never wore a uniform.',
    tone: 'resolute'
  },
  'american-civilian-survival': {
    text: 'Your focus on protecting your family was understandable. By prioritizing loved ones, you ensured they survived but at the cost of being unable to aid neighbors. You lived with your family intact, but also with the knowledge of what you didn''t do.',
    tone: 'conflicted'
  },
  'american-civilian-humanity': {
    text: 'Your compassion for all victims showed remarkable moral courage. By helping wounded Japanese pilots despite the risk, you demonstrated that humanity transcends nationality. You chose to see people, not enemies.',
    tone: 'principled'
  }
};

export function getRippleIntro(roleId, path) {
  const key = ${roleId}-;
  return RIPPLE_INTROS[key] || {
    text: 'Your choices shaped history in ways both seen and unseen. The ripples of December 7th, 1941 continue to this day.',
    tone: 'neutral'
  };
}
