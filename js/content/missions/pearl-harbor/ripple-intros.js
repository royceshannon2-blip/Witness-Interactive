/**
 * ripple-intros.js
 * Path-specific intro texts for Historical Ripple timeline
 * 9 variants: 3 roles × 3 paths (duty, survival, humanity)
 */

export const RIPPLE_INTROS = {
  // Japanese Aviator - Duty Path
  'japanese-aviator-duty': {
    text: `Your unwavering commitment to orders shaped history's course. By following the mission plan precisely, you contributed to the tactical success of the first wave—but also to the strategic failure that united America. Your discipline exemplified the warrior code, yet that same code prevented adaptation when circumstances changed. The attack succeeded militarily but failed politically, awakening a sleeping giant.`,
    tone: 'reflective'
  },

  // Japanese Aviator - Survival Path
  'japanese-aviator-survival': {
    text: `Your focus on self-preservation influenced the battle's outcome. By prioritizing your own safety over mission objectives, you survived—but at what cost? Your choices reflected the human instinct to live, yet they also contributed to incomplete destruction of key targets. The carriers that escaped would return to haunt Japan. Sometimes survival comes with consequences that echo through history.`,
    tone: 'somber'
  },

  // Japanese Aviator - Humanity Path
  'japanese-aviator-humanity': {
    text: `Your recognition of shared humanity, even in war, marked you as different. By showing restraint toward defenseless targets, you preserved your moral compass—but also allowed future threats to survive. Your compassion was honorable, yet in total war, mercy can be a luxury neither side could afford. You carried the weight of being human in an inhuman situation.`,
    tone: 'contemplative'
  },

  // American Sailor - Duty Path
  'american-sailor-duty': {
    text: `Your dedication to duty in chaos saved lives and preserved fighting capability. By maintaining discipline under fire, you embodied the Navy's core values and helped minimize casualties. Your actions ensured that damaged ships could be salvaged and sailors could fight another day. The Pacific Fleet would rise from the ashes, in part because of sailors like you who never abandoned their posts.`,
    tone: 'proud'
  },

  // American Sailor - Survival Path
  'american-sailor-survival': {
    text: `Your instinct for self-preservation kept you alive through hell. By prioritizing escape over duty, you survived to tell the story—but others paid the price. Your choices reflected the primal human drive to live, yet they also meant fewer hands to fight fires, fewer rescuers for trapped shipmates. You lived, but the memory of those you couldn't save would haunt you forever.`,
    tone: 'haunted'
  },

  // American Sailor - Humanity Path
  'american-sailor-humanity': {
    text: `Your compassion in crisis defined your character. By risking everything to save others, you embodied the brotherhood of the sea. Your selfless actions rescued shipmates who would go on to fight in crucial battles. Though you couldn't save everyone, your humanity in the face of horror inspired others. Heroes aren't born—they're forged in moments like these.`,
    tone: 'heroic'
  },

  // American Civilian - Duty Path
  'american-civilian-duty': {
    text: `Your commitment to helping others in chaos made a difference. By organizing rescue efforts and maintaining order, you prevented panic from claiming more lives. Your leadership showed that civilians could be as brave as soldiers. The community would remember your steadiness when everything fell apart. Sometimes duty calls even those who never wore a uniform.`,
    tone: 'resolute'
  },

  // American Civilian - Survival Path
  'american-civilian-survival': {
    text: `Your focus on protecting your family was understandable, even if it meant others went without help. By prioritizing your loved ones, you ensured they survived—but at the cost of being unable to aid your neighbors. Your choices reflected the impossible decisions civilians face in war. You lived with your family intact, but also with the knowledge of what you didn't do.`,
    tone: 'conflicted'
  },

  // American Civilian - Humanity Path
  'american-civilian-humanity': {
    text: `Your compassion for all victims, regardless of uniform, showed remarkable moral courage. By helping wounded Japanese pilots despite the risk, you demonstrated that humanity transcends nationality. Your actions were controversial then and remain so now—but they proved that even in war's darkest hour, some people refuse to surrender their principles. You chose to see people, not enemies.`,
    tone: 'principled'
  }
};

/**
 * Get ripple intro text based on role and path
 * @param {string} roleId - Player's role ID
 * @param {string} path - Player's classified path (duty/survival/humanity)
 * @returns {Object} - Intro object with text and tone
 */
export function getRippleIntro(roleId, path) {
  const key = `${roleId}-${path}`;
  return RIPPLE_INTROS[key] || {
    text: 'Your choices shaped history in ways both seen and unseen. The ripples of December 7th, 1941 continue to this day.',
    tone: 'neutral'
  };
}
