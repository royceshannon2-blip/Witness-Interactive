/**
 * Urban Design Mission - Path-Specific Ripple Intros
 *
 * 3 intros total: 1 role × 3 paths
 * Each intro: 80-120 words, second person, reflective tone
 * Connects personal choices to macro-historical consequences
 * No congratulatory tone; acknowledges complexity and cost
 *
 * Requirements: US-9.1, US-9.2
 */

export const RIPPLE_INTROS = {
  "ud-resident": {
    equity: `You fought the designation. You challenged the appraiser's 'D' grade. You documented the discrimination. You supported fair housing when neighbors resisted. You stayed when others fled. You advocated for mixed-use development that wouldn't displace long-term residents. At each decision point, you chose equity over ease. Some who made your choices succeeded in changing policy. Others faced retaliation, economic loss, or isolation. The 1934 map predicted the 2024 temperature map. Your choices couldn't erase that pattern, but they shaped how your community responded. The history that follows is shaped by those who resisted unjust systems and by the federal policies that made resistance so difficult.`,

    complicity: `You accepted the designation. You didn't challenge the 'D' grade. You sold when the speculator came. You prioritized property value over neighborhood stability. Most property owners did what you did—not from malice, but from fear, economic pressure, or belief that the system couldn't be changed. The mortgage gap, the tax base collapse, the heat island effect—all emerged from individual decisions that seemed rational at the time. The history that follows is shaped by millions of individual decisions to accept rather than resist, and by the federal policies that made acceptance the path of least resistance. The cumulative weight of those choices created the spatial inequality visible today.`,

    adaptation: `You adapted. You stayed when the neighborhood changed. You survived disinvestment, watched services decline, measured the heat island effect. You focused on your family's survival rather than fighting systems larger than yourself. Most families did what you did—adaptation was the most common response to federal housing policy. Neither heroes nor villains, but people navigating systems designed to exclude them. The history that follows is shaped by those who endured, those who documented, and those who passed the property to the next generation despite everything. The resilience was real. So was the cost. You carried the burden that federal policy created.`
  }
};

/**
 * Get the appropriate ripple intro based on role and path classification
 * @param {string} roleId - Role identifier (ud-resident)
 * @param {string} pathVariant - Path classification (equity/complicity/adaptation)
 * @returns {string} Ripple intro text
 */
export function getRippleIntro(roleId, pathVariant) {
  if (!RIPPLE_INTROS[roleId]) {
    console.error(`No ripple intros found for role: ${roleId}`);
    return "You made choices during impossible circumstances. The history that follows is shaped by millions of individual decisions like yours.";
  }

  if (!RIPPLE_INTROS[roleId][pathVariant]) {
    console.error(`No ripple intro found for role ${roleId}, path ${pathVariant}`);
    return RIPPLE_INTROS[roleId][Object.keys(RIPPLE_INTROS[roleId])[0]]; // Return first available path
  }

  return RIPPLE_INTROS[roleId][pathVariant];
}

/**
 * Classify Urban Design path based on consequence flags
 * @param {object} flags - Consequence flags from ConsequenceSystem
 * @returns {string} Path variant (equity/complicity/adaptation)
 */
export function classifyUrbanDesignPath(flags) {
  // Equity Path: Fought injustice at multiple stages (rare but heroic)
  if (flags.ud_fought_redlining && flags.ud_supported_mixed_use) {
    return 'equity';
  }
  
  // Complicity Path: Accepted or benefited from discriminatory systems (common among privileged)
  if (flags.ud_accepted_designation || flags.ud_sold_to_speculator) {
    return 'complicity';
  }
  
  // Adaptation Path: Focused on survival/adaptation (most common historical response)
  if (flags.ud_stayed_through_transition && flags.ud_measured_heat_island) {
    return 'adaptation';
  }
  
  // Default: adaptation (historically accurate - most residents were forced into adaptation by federal policy)
  // This is both technically safe and pedagogically meaningful: the weight of federal policy
  // made adaptation the path of least resistance for most families
  return 'adaptation';
}
