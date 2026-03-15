/**
 * Rwanda Mission Glossary
 * Terms that appear in scene narratives and briefings.
 * Keys must exactly match the text as it appears (case-insensitive matching applied at render time).
 */

export const GLOSSARY = {
  // People and Groups
  "Tutsi": "One of Rwanda's three ethnic groups and the primary targets of the 1994 genocide. Under Belgian colonial rule, Tutsi were given administrative privileges over Hutu, creating lasting resentment. About 75% of Rwanda's Tutsi population — 500,000–800,000 people — were killed in 100 days.",
  "Hutu": "Rwanda's majority ethnic group (~85% of the population). Most genocide perpetrators were Hutu, but thousands of Hutu who protected Tutsi or refused to participate were also killed.",
  "Hutu moderate": "A Hutu person who opposed the genocide, refused to participate, or sheltered Tutsi. The genocide's architects targeted moderates first because they represented the most immediate internal obstacle.",
  "Twa": "Rwanda's third ethnic group, a small minority with distinct historical identity.",
  
  // Organizations
  "RPF": "Rwandan Patriotic Front — a Tutsi rebel army based in Uganda, made up largely of Tutsi refugees. They invaded Rwanda in 1990, triggering civil war, then advanced during the genocide and captured Kigali on July 4, 1994, ending the killing.",
  "Interahamwe": "Hutu Power civilian militias. The name means 'those who attack together' in Kinyarwanda. Organized, trained, and armed by the government — the primary ground-level perpetrators who staffed roadblocks and carried out killings.",
  "UNAMIR": "United Nations Assistance Mission for Rwanda — the UN peacekeeping force commanded by General Roméo Dallaire. Had ~2,500 troops when the genocide began; the Security Council cut it to 270 after 10 Belgian peacekeepers were killed.",
  "ICTR": "International Criminal Tribunal for Rwanda — a UN court based in Arusha, Tanzania, established in November 1994 to try senior genocide organizers. Completed 69 cases.",
  "Akazu": "The inner circle around President Habyarimana's wife, who organized and financed Hutu Power militias and planned the genocide.",
  
  // Institutions and Processes
  "gacaca": "Community-level justice tribunals Rwanda used from 2005–2012 to process over 1.2 million genocide cases. 'Justice on the grass' in Kinyarwanda. Lay judges heard testimony; perpetrators who gave full public confessions received reduced sentences instead of prison.",
  "gacaca courts": "Community-level justice tribunals Rwanda used from 2005–2012 to process over 1.2 million genocide cases. Lay judges elected from the community heard testimony; perpetrators who confessed fully received reduced sentences.",
  "Arusha Accords": "A peace agreement signed August 1993 between the Rwandan government and the RPF, meant to end the civil war and create power-sharing. The genocide's architects opposed it and used the implementation period to plan mass violence instead.",
  "Genocide Convention": "The 1948 UN convention that legally obligates member states to intervene to prevent and punish genocide. During 1994, the US instructed officials not to use the word 'genocide' because doing so would trigger this legal obligation.",
  "Responsibility to Protect": "A UN doctrine adopted in 2005, partly in response to Rwanda, establishing that the international community has a responsibility to protect civilians when their own government fails to or is the perpetrator.",
  
  // Media
  "RTLM": "Radio Télévision Libre des Mille Collines — a radio station founded by Hutu Power extremists in 1993. Used music and comedy to build a large audience, then read names and addresses of Tutsi, broadcast militia checkpoint locations, and called Tutsi cockroaches. Its leaders were convicted by the ICTR for incitement to genocide.",
  "Hutu Power": "A political ideology promoting Hutu ethnic supremacy and opposing any power-sharing with Tutsi. Organized the Interahamwe, distributed weapons, used RTLM for propaganda, and planned the genocide.",
  
  // Places
  "Kigali": "Capital city of Rwanda, where the genocide began on the night of April 6–7, 1994.",
  "Hôtel des Mille Collines": "A hotel in Kigali where approximately 1,200 Tutsi and moderate Hutu sheltered during the genocide, protected by UN peacekeepers. Subject of the film Hotel Rwanda.",
  "Arusha": "City in Tanzania where both the Arusha Accords were signed (1993) and the ICTR was based.",
  "Gitarama": "City southwest of Kigali — a destination for those fleeing the capital during the genocide.",
  "Butare": "City in southern Rwanda, a secondary urban center.",
  
  // Key People
  "Habyarimana": "President Juvénal Habyarimana of Rwanda, whose plane was shot down on April 6, 1994, triggering the genocide. Who fired the missiles remains disputed.",
  "Dallaire": "General Roméo Dallaire — Canadian commander of UNAMIR. In January 1994 he sent a fax to UN headquarters warning of weapons caches and death lists, requesting permission to act. The request was denied. Later wrote Shake Hands with the Devil.",
  "Uwilingiyimana": "Prime Minister Agathe Uwilingiyimana — a Hutu moderate who was one of the first targets killed on April 7, 1994.",
  
  // Legal/Institutional
  "mandate": "In UN peacekeeping, the specific legal authorization defining what a force can and cannot do. UNAMIR's mandate was 'observe and report only' — peacekeepers could not use force to protect civilians.",
  "Category Two": "Gacaca court classification for perpetrators who directly participated in killings (as opposed to Category One, which covered planners and organizers). Category Two typically resulted in community service rather than prison if the perpetrator confessed fully.",
  "communal secretary": "A mid-level local government administrative position with access to population records — useful to both the genocide's machinery (for identifying targets) and to resisters (who knew how the system worked).",
  "Kwibuka": "Rwanda's annual national genocide remembrance, held every April 7th. The name means 'remember' in Kinyarwanda.",
  "Kinyarwanda": "The national language of Rwanda, spoken by virtually the entire population across all ethnic groups."
};

/**
 * Apply glossary tooltips to a DOM element's text content.
 * Wraps recognized terms in <span class="glossary-term"> elements.
 * Case-insensitive. Matches longest terms first to avoid partial matches.
 * Never double-wraps already-wrapped terms.
 * @param {HTMLElement} el - Element whose innerHTML will be processed
 */
export function applyGlossaryToElement(el) {
  if (!el) return;
  
  // Sort terms longest-first to prevent partial matches
  // (e.g. "gacaca courts" must match before "gacaca")
  const terms = Object.keys(GLOSSARY).sort((a, b) => b.length - a.length);
  
  let html = el.innerHTML;
  
  for (const term of terms) {
    const def = GLOSSARY[term];
    // Match term not already inside a glossary-term span, not inside an HTML tag
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(
      `(?<!<[^>]*)(?<!class="glossary-term"[^>]*>)(${escaped})(?![^<]*>)(?![^<]*<\\/span>)`,
      'gi'
    );
    html = html.replace(regex, (match) => {
      return `<span class="glossary-term" data-def="${def.replace(/"/g, '&quot;')}" tabindex="0" role="button" aria-label="${match}: ${def.replace(/"/g, '&quot;')}">${match}</span>`;
    });
  }
  
  el.innerHTML = html;
}
