/**
 * Haymarket Affair Mission — Ripple Intro Texts
 *
 * Path-specific intro texts displayed before the historical ripple timeline.
 * Each reflects the player's outcome path and perspective on the long-term
 * consequences of the Haymarket Affair.
 *
 * Architecture: Content layer only — no logic, no engine imports.
 * Requirements: 20.5
 */

const RIPPLE_INTROS = {

  // ─── Lucy Parsons Paths ───────────────────────────────────────────────────

  'hm-lucy-parsons:voice': `The movement did not end with the scaffold. What happened in Chicago in 1886 sent ripples forward through decades — through the courtrooms and the marches and the legislation that came after. You were part of what set it in motion.`,

  'hm-lucy-parsons:movement': `Albert Parsons was hanged on November 11, 1887. The movement he helped build did not die with him. It changed shape, found new voices, and carried the eight-hour demand forward through the years that followed.`,

  'hm-lucy-parsons:grief': `The grief of 1887 was real and it was lasting. But the world did not stop moving. The events that began at Haymarket Square on May 4, 1886 continued to unfold long after the scaffold was taken down.`,

  // ─── Karl Brenner Paths ───────────────────────────────────────────────────

  'hm-karl-brenner:witness': `You were there. You saw what happened at the McCormick gates and at Haymarket Square, and you carried it with you. The eight-hour workday you and eighty thousand others marched for on May first did not come quickly — but it came.`,

  'hm-karl-brenner:arrested': `The arrests swept through the German community on the West Side for weeks. You were caught in that net. But the movement that brought you to Haymarket Square was larger than any single arrest, and it did not stop.`,

  'hm-karl-brenner:exile': `You left Chicago. The city you left behind kept moving — through the trial, the executions, the pardon, and the slow decades-long arc toward the eight-hour workday you had marched for. Distance does not erase what you witnessed.`,

  // ─── James Doyle Paths ───────────────────────────────────────────────────

  'hm-james-doyle:testimony': `Your reports became evidence. Your testimony helped convict men whose guilt was never proven. The legal framework you helped build — conspiracy charges, surveillance, the equation of labor organizing with criminal conspiracy — did not end at Haymarket.`,

  'hm-james-doyle:withheld': `You testified, but not everything. What you withheld may have changed nothing, or it may have changed something — you will never know. The machinery of the trial moved forward regardless, and what it set in motion continued long after the verdict.`,

  'hm-james-doyle:refusal': `You refused. The trial proceeded without your testimony, using the written reports you had already filed. The pattern established at Haymarket — private surveillance, conspiracy charges, the suppression of labor organizing — continued without you. You chose not to be its instrument. That choice had its own weight.`

};

/**
 * Get the ripple intro text for a given role and outcome path.
 * Falls back to a generic intro if the specific path is not found.
 *
 * @param {string} roleId - e.g. 'hm-lucy-parsons'
 * @param {string} path - e.g. 'voice', 'grief', 'movement'
 * @returns {string}
 */
export function getRippleIntro(roleId, path) {
  const key = `${roleId}:${path}`;
  if (RIPPLE_INTROS[key]) {
    return RIPPLE_INTROS[key];
  }
  // Fallback: generic intro for any Haymarket role
  return `The events of May 4, 1886 did not end at Haymarket Square. What happened that night sent consequences forward through decades of American labor history — through the courts, the scaffold, the pardon, and the legislation that finally came.`;
}

export default RIPPLE_INTROS;
