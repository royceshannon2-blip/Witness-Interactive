/**
 * Rwanda Genocide Mission - Path-Specific Ripple Intros
 *
 * 9 intros total: 3 roles Ã— 3 paths
 * Each intro: 80-120 words, second person, reflective tone
 * Connects personal choices to macro-historical consequences
 * No congratulatory tone; acknowledges complexity and cost
 *
 * Requirements: US-9.1, US-9.2
 */

export const RIPPLE_INTROS = {
  "hutu-moderate": {
    rescue: `You helped Celestin. You hid him when the militias came. You lied to neighbors who asked questions. You risked your family for someone else's. Some Hutu who did what you did were killed alongside those they protected. Some survived and carried guilt for those they couldn't save. Rwanda's reconciliation asks people like you to live next to people who didn't make your choice. The history that follows is shaped by thousands of small decisions like yours"”and by the millions who made different ones.`,

    compliance: `You followed orders. You staffed the roadblock. You checked identity cards. You waved some through and stopped others. Most Hutu officials did what you did"”not from hatred, but from fear, pressure, or belief in what the radio said. Gacaca courts later asked people like you to confess and explain. Some did. Some didn't. The history that follows is shaped by the choices of ordinary people who became part of something larger than themselves.`,

    flight: `You fled Kigali. You left before the worst began. You survived by not being there. Millions of Hutu refugees fled to Zaire and Tanzania after July 1994, some perpetrators, some bystanders, some who opposed the genocide. The camps became political, militarized, and eventually ignited the Congo wars. The history that follows is shaped by those who stayed, those who fled, and those who returned.`
  },

  "tutsi-survivor": {
    hidden: `You survived because someone hid you. A Hutu neighbor, a friend, a stranger who chose risk over safety. You spent weeks in an attic, a latrine, a ceiling, moving at night, silent during the day. Most Tutsi who survived did so because of people like that. Gacaca courts later asked survivors like you to testify about who killed and who saved. The history that follows is shaped by those small acts of courage and the trauma they couldn't prevent.`,

    enclave: `You reached the hotel. You made it past roadblocks, through militia checkpoints, into a UN-protected enclave. Twelve hundred people sheltered there. UN peacekeepers held the perimeter. You survived in a crowd, waiting for the RPF to arrive. Most Tutsi who tried to reach safe sites didn't make it. The history that follows is shaped by the few places where protection held and the many where it didn't.`,

    testimony: `You witnessed the massacres. You saw what happened at the church, the roadblock, the school. You survived and you remember. The ICTR and gacaca courts later asked survivors like you to testify, to name perpetrators, to describe what you saw. Some survivors found power in testimony. Others found only re-traumatization. The history that follows is shaped by those who spoke and those who couldn't.`
  },

  "un-peacekeeper": {
    stayed: `You stayed. When the Belgian contingent withdrew, when the Security Council cut the force to 270, you remained. You protected the hotel, the stadium, the enclaves you could hold. You watched massacres you couldn't stop. General Dallaire later said UNAMIR could have saved thousands with a stronger mandate. You lived with what you did and what you couldn't do. The history that follows is shaped by the few who stayed and the many who left.`,

    evacuated: `You followed orders. You evacuated expatriates and left Rwandans behind. You saw people begging to board the convoys. You followed the mandate. Most peacekeepers did what you did. Some carried guilt for decades. Some defended the decision as the only realistic option. The history that follows is shaped by the international community's choice to withdraw rather than intervene.`,

    documented: `You documented what you saw. You sent reports, took photos, gathered testimony. You defied orders to stay silent. You tried to make the world see what was happening. The genocide fax, the media coverage, the evidence that later convicted RTLM leaders"”all came from people like you. The history that follows is shaped by those who documented atrocities and by the world's choice to ignore them until it was too late.`
  }
};

/**
 * Get the appropriate ripple intro based on role and path classification
 * @param {string} roleId - Role identifier (hutu-moderate, tutsi-survivor, un-peacekeeper)
 * @param {string} pathVariant - Path classification (rescue/compliance/flight, hidden/enclave/testimony, stayed/evacuated/documented)
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
