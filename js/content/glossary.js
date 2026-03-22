/**
 * Rwanda Mission Glossary
 * Terms that appear in scene narratives and briefings.
 * Keys must exactly match the text as it appears (case-insensitive matching applied at render time).
 */

export const GLOSSARY = {
  // People and Groups
  "Tutsi": "One of Rwanda's three ethnic groups and the primary targets of the 1994 genocide. Under Belgian colonial rule, Tutsi were given administrative privileges over Hutu, creating lasting resentment. About 75% of Rwanda's Tutsi population — 500,000–800,000 people — were killed in 100 days.",
  "Hutu": "Rwanda's majority ethnic group (~85% of the population). Most genocide perpetrators were Hutu, but thousands of Hutu who protected Tutsi or refused to participate were also killed.",
  "Hutu moderates": "Hutu people who opposed the genocide, refused to participate, or sheltered Tutsi. The genocide's architects targeted them first — Prime Minister Uwilingiyimana and other moderate leaders were assassinated on April 7, and thousands more were killed as 'accomplices' or 'traitors.'",
  "Hutu moderate": "A Hutu person who opposed the genocide, refused to participate, or sheltered Tutsi. The genocide's architects targeted moderates first because they represented the most immediate internal obstacle.",
  "moderate Hutu": "A Hutu person who opposed the genocide, refused to participate, or sheltered Tutsi. The genocide's architects targeted moderates first because they represented the most immediate internal obstacle.",
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

// ─── Urban Design / Divided City Terms ───────────────────────────────────────

Object.assign(GLOSSARY, {
  // APHG 6.6 — Urban Challenges
  "redlining": "A federal practice in which the Home Owners' Loan Corporation (HOLC) graded neighborhoods A through D based on perceived lending risk. Racial and ethnic composition was an explicit grading factor. Neighborhoods receiving 'D' (red) grades were denied FHA-insured mortgages, systematically removing capital from Black communities from 1934 onward.",
  "HOLC": "Home Owners' Loan Corporation — a federal agency created in 1933 to refinance Depression-era mortgages. HOLC appraisers produced Residential Security Maps grading neighborhoods A through D. These maps were used by the FHA and private banks to determine mortgage eligibility.",
  "FHA": "Federal Housing Administration — created by the National Housing Act of 1934. The FHA insured private mortgages but used HOLC neighborhood grades to determine eligibility, formalizing redlining as federal lending policy.",
  "blockbusting": "A real estate practice documented in the 1950s–1960s in which agents contacted white homeowners with warnings that Black families were moving in and property values would fall. Homeowners sold at below-market prices; agents resold to Black families at above-market prices on installment contracts. Prohibited by the Fair Housing Act of 1968.",
  "white flight": "The large-scale departure of white middle-class residents from urban neighborhoods to suburbs, accelerating in the 1950s–1970s. Driven by blockbusting, FHA suburban mortgage subsidies, and highway construction. Reduced urban tax bases and accelerated disinvestment in formerly redlined areas.",
  "filtering": "The process by which housing passes from higher-income to lower-income occupants as it ages and depreciates. In formerly redlined areas, filtering was accelerated by the removal of mortgage capital, which prevented reinvestment and maintenance.",
  "disinvestment": "The withdrawal of capital, services, and infrastructure maintenance from a neighborhood or area. In formerly redlined districts, disinvestment followed the HOLC D-grade designation as banks, businesses, and municipalities reduced investment over decades.",
  "Fair Housing Act": "Federal legislation passed in 1968 prohibiting discrimination in housing sales, rentals, and financing. Outlawed blockbusting by name. Did not include mechanisms to reverse the spatial wealth distribution created by 34 years of HOLC and FHA policy.",
  "restrictive covenant": "A clause in a property deed prohibiting sale to members of specified racial or ethnic groups. The FHA Underwriting Manual recommended restrictive covenants as a tool for maintaining neighborhood grade stability. Shelley v. Kraemer (1948) ruled courts could not enforce them, but did not ban them outright.",
  "urban renewal": "Government-sponsored programs from the 1950s–1970s that demolished 'blighted' urban neighborhoods, often in formerly redlined areas, and replaced them with highways, public housing, or commercial development. Displaced hundreds of thousands of residents, disproportionately Black families.",
  "suburbanization": "The population shift from urban cores to surrounding suburban areas, accelerated by FHA mortgage subsidies, the GI Bill, and the Federal-Aid Highway Act of 1956. Created spatial separation of wealth (suburbs) and poverty (urban cores) that persists today.",
  "GI Bill": "The Servicemen's Readjustment Act of 1944, which provided low-interest home loans to returning WWII veterans. Administered through local banks operating under FHA underwriting criteria, which denied Black veterans access to suburban mortgage markets at documented rates.",
  "land contract": "An installment purchase agreement in which the seller retains legal title until the buyer completes all payments. Used by blockbusting agents to sell to Black families at above-market prices with no equity transfer until full payment — a predatory instrument that extracted wealth while denying ownership rights.",

  // APHG 6.10 — Urban Sustainability
  "urban heat island": "A phenomenon in which urban areas record higher temperatures than surrounding rural areas due to heat-absorbing surfaces (asphalt, concrete) and reduced vegetation. Hoffman, Shandas, and Pendleton (2020) documented that 92% of formerly HOLC-redlined neighborhoods are measurably hotter than green-graded areas in the same cities.",
  "environmental justice": "The principle that all communities, regardless of race or income, should receive equal protection from environmental hazards and equal access to environmental benefits. Formerly redlined neighborhoods bear disproportionate environmental burdens — higher temperatures, less tree canopy, greater pollution exposure — as documented outcomes of historical disinvestment.",
  "smart growth": "Urban planning principles that promote compact, walkable, mixed-use development to reduce sprawl, car dependency, and environmental impact. Includes infill development, transit-oriented development, and green infrastructure as core strategies.",
  "mixed-use development": "Development that combines residential, commercial, and sometimes industrial uses within a single building or district. A key smart growth strategy that increases walkability, reduces car dependency, and can provide green infrastructure — but may increase property values and displace long-term residents.",
  "gentrification": "The process by which higher-income residents and investment move into lower-income urban neighborhoods, increasing property values and rents. Can improve environmental conditions (cooling, services) while displacing the long-term residents who endured decades of disinvestment.",
  "community land trust": "A nonprofit organization that acquires land and holds it in trust permanently, leasing it to homeowners or renters at below-market rates. Used as an anti-displacement tool in gentrifying neighborhoods to preserve affordable housing as property values rise.",
  "transit-oriented development": "Mixed-use development concentrated around public transit stations to reduce car dependency, increase walkability, and support sustainable urban growth. A core smart growth strategy.",
  "infill development": "Construction on vacant or underutilized land within existing urban areas, rather than on undeveloped land at the urban fringe. Reduces sprawl and makes use of existing infrastructure.",
  "green infrastructure": "Systems that use vegetation, soils, and natural processes to manage stormwater, reduce urban heat, and improve air quality. Includes street trees, parks, green roofs, and permeable pavement. Formerly redlined neighborhoods have significantly less green infrastructure due to decades of disinvestment.",
  "tree canopy": "The layer of leaves, branches, and stems of trees that cover the ground when viewed from above. Reduces urban heat island effect by providing shade and evapotranspiration. Hoffman et al. (2020) found that formerly redlined neighborhoods have significantly lower tree canopy coverage than green-graded areas.",
  "food desert": "An area with limited access to affordable, nutritious food, typically due to the absence of grocery stores within reasonable distance. Disproportionately affects formerly redlined urban neighborhoods where disinvestment reduced commercial activity.",
  "spatial inequality": "Unequal distribution of resources, services, wealth, or environmental conditions across geographic space. The urban heat island pattern — where formerly redlined areas are measurably hotter — is a documented form of spatial inequality produced by federal housing policy.",
  "sequent occupance": "The concept that a place is shaped by the successive groups that have occupied it, each leaving cultural and physical imprints. Formerly redlined neighborhoods show sequent occupance through the layered effects of HOLC grading (1934), blockbusting (1960s), disinvestment (1970s–1990s), and contemporary gentrification pressure."
});

// ─── Haymarket / Labor Movement Terms ────────────────────────────────────────

Object.assign(GLOSSARY, {
  "picket": "A form of labor protest in which workers stand or march outside their workplace to publicize a strike, discourage strikebreakers from entering, and pressure employers to negotiate. In 1886, picketing was not legally protected — police and Pinkerton agents routinely broke up picket lines by force.",
  "picketers": "Workers who stand or march outside a workplace during a strike to publicize the dispute and discourage strikebreakers. At McCormick Reaper Works in May 1886, picketers were met by Pinkerton guards and Chicago police, resulting in the shooting of several workers on May 3 — the event that directly triggered the Haymarket meeting.",
  "Pinkerton": "The Pinkerton National Detective Agency — a private security firm hired by corporations to infiltrate labor unions, gather intelligence on organizers, and break strikes. By 1886, Pinkerton employed more agents than the entire U.S. Army. Their presence at McCormick Reaper Works on May 3, 1886 contributed directly to the violence that preceded Haymarket.",
  "IWPA": "International Working People's Association — a Chicago-based anarchist labor organization founded in 1881. August Spies and Albert Parsons were prominent members. The IWPA organized the Haymarket meeting on May 4, 1886 to protest the police shooting of strikers at McCormick the day before.",
  "Arbeiter-Zeitung": "A German-language labor newspaper published in Chicago. Its name means 'Workers' Newspaper.' Editor August Spies used it to organize Chicago's large German immigrant working class. He wrote the Revenge Circular in its offices on the night of May 3, 1886, hours after watching police shoot strikers at McCormick.",
  "eight-hour movement": "A national labor campaign demanding the workday be reduced from 10–12 hours to 8 hours at the same daily wage. The movement set May 1, 1886 as a national strike deadline. An estimated 340,000 workers walked off the job that day — the largest coordinated labor action in American history to that point.",
  "strikebreaker": "A worker hired to replace striking employees and keep a business operating during a labor dispute. Also called a 'scab.' Employers used Pinkerton agents to escort strikebreakers through picket lines, often resulting in violent confrontations.",
  "anarchism": "A political philosophy rejecting all forms of involuntary government authority, advocating instead for voluntary cooperation and mutual aid. The Haymarket defendants were largely anarchists who believed capitalism and the state were inseparable systems of oppression. Their beliefs were used to convict them despite no evidence connecting them to the bomb.",
  "conspiracy": "In the Haymarket trial, prosecutors argued that the defendants were guilty of murder not because they threw the bomb, but because their speeches and writings had created a 'conspiracy' that inspired the unknown bomber. This legal theory — that speech constitutes criminal conspiracy — set a precedent used against labor organizers for decades.",
  "Knights of Labor": "The largest labor organization in the United States in the 1880s, with over 700,000 members by 1886. Unlike craft unions, the Knights organized across skill levels and included women and Black workers. The Haymarket affair was used to discredit the Knights, and membership collapsed from 700,000 to 100,000 within two years.",
});

/**
 * Mission-specific example terms shown in the glossary intro overlay.
 * Keyed by mission ID. Each value is a 3-element array of representative terms.
 */
export const GLOSSARY_INTRO_TERMS = {
  'rwanda-genocide':   ['RTLM', 'gacaca', 'Interahamwe'],
  'pearl-harbor':      ['Kido Butai', 'Battleship Row', 'USS Arizona'],
  'aphg-urban-design': ['redlining', 'blockbusting', 'urban heat island'],
  'haymarket-affair':  ['Arbeiter-Zeitung', 'Pinkerton', 'IWPA'],
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
