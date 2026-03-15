/**
 * Rwanda Genocide Mission - Knowledge Checkpoint Questions
 *
 * 9 questions total: 3 per role
 * Each question tests AP reasoning skills: causation, continuity, perspective, complexity
 * Questions are grounded in role experience and historically accurate
 *
 * Requirements: US-8.1, US-8.2, US-8.3
 */

export default [
  // HUTU MODERATE QUESTIONS (3 questions)

  {
    id: "rw-kq-hm-01",
    roleSpecific: "hutu-moderate",
    apSkill: "causation",
    question: "RTLM radio broadcasts played a crucial role in mobilizing participants during the genocide. Which statement best explains how RTLM functioned as a tool of mass violence?",
    options: [
      { id: 'a', text: "RTLM provided military intelligence and tactical coordination for organized army units", correct: false },
      { id: 'b', text: "RTLM used dehumanizing language and specific instructions to transform ordinary citizens into participants", correct: true },
      { id: 'c', text: "RTLM primarily broadcast government propaganda but had little effect on civilian behavior", correct: false },
      { id: 'd', text: "RTLM was controlled by the RPF and used to spread misinformation about Hutu Power", correct: false }
    ],
    explanation: "RTLM broadcasts used dehumanizing language (referring to Tutsi as 'cockroaches'), gave specific instructions about roadblocks and targets, and normalized violence. This transformed neighbors into killers. RTLM leaders were later convicted at the ICTR for incitement to genocide."
  },

  {
    id: "rw-kq-hm-02",
    roleSpecific: "hutu-moderate",
    apSkill: "complexity",
    question: "Identity cards in Rwanda listed ethnicity (Hutu, Tutsi, Twa). How did these cards function as a tool of genocide at roadblocks?",
    options: [
      { id: 'a', text: "Cards allowed militia to quickly identify and target Tutsi, turning bureaucratic documents into death sentences", correct: true },
      { id: 'b', text: "Cards were primarily used to track population movements for census purposes during the conflict", correct: false },
      { id: 'c', text: "Cards helped protect Tutsi by allowing them to prove they were not RPF soldiers", correct: false },
      { id: 'd', text: "Cards were rarely checked because militia could identify ethnicity by physical appearance alone", correct: false }
    ],
    explanation: "Identity cards made ethnic targeting systematic and efficient. At roadblocks, militia checked cards and killed those marked 'Tutsi.' This bureaucratic system - inherited from Belgian colonial rule - transformed administrative documents into instruments of mass murder. Survivors testified that showing a Tutsi card meant immediate death."
  },

  {
    id: "rw-kq-hm-03",
    roleSpecific: "hutu-moderate",
    apSkill: "perspective",
    question: "Historians debate the concept of 'bystander' during the Rwanda genocide. Why is this category problematic when analyzing Hutu who neither actively killed nor actively rescued?",
    options: [
      { id: 'a', text: "Because all Hutu were equally guilty regardless of their actions during the genocide", correct: false },
      { id: 'b', text: "Because inaction in a genocidal state often enabled violence, making the line between bystander and participant unclear", correct: true },
      { id: 'c', text: "Because most Hutu actively participated in killings, so true bystanders did not exist", correct: false },
      { id: 'd', text: "Because the concept of bystander only applies to international actors, not to Rwandans", correct: false }
    ],
    explanation: "The 'bystander' category is problematic because inaction often enabled violence. Hutu who staffed roadblocks, attended rallies, or simply didn't intervene contributed to the genocide's success. Gacaca courts later struggled with this - how to judge those who didn't kill but didn't help? The line between passive complicity and active participation is morally and legally complex."
  },

  // TUTSI SURVIVOR QUESTIONS (3 questions)

  {
    id: "rw-kq-ts-01",
    roleSpecific: "tutsi-survivor",
    apSkill: "perspective",
    question: "Churches became massacre sites during the Rwanda genocide, with thousands killed in places they sought as sanctuary. What does this reveal about how genocides exploit trust and social institutions?",
    options: [
      { id: 'a', text: "Churches were targeted because they were RPF military strongholds disguised as religious sites", correct: false },
      { id: 'b', text: "Genocides weaponize trusted institutions by turning places of safety into traps, exploiting victims' reliance on traditional sanctuaries", correct: true },
      { id: 'c', text: "Churches were massacre sites primarily because they were easy to surround, not because of their symbolic meaning", correct: false },
      { id: 'd', text: "Religious leaders universally supported the genocide, making churches natural sites for organized killings", correct: false }
    ],
    explanation: "Genocides exploit trust by weaponizing institutions victims rely on. Tutsi fled to churches because they had historically been safe. Militia and even some priests betrayed this trust, turning sanctuaries into massacre sites. This pattern appears in other genocides - trusted institutions become traps when perpetrators exploit victims' reliance on traditional safety."
  },

  {
    id: "rw-kq-ts-02",
    roleSpecific: "tutsi-survivor",
    apSkill: "causation",
    question: "The Arusha Accords (1993) were meant to end the civil war between the Rwandan government and RPF. Why did these peace agreements fail to prevent the genocide?",
    options: [
      { id: 'a', text: "The RPF violated the accords by shooting down President Habyarimana's plane, triggering the genocide", correct: false },
      { id: 'b', text: "Hutu Power extremists opposed power-sharing with Tutsi and used the accords' implementation period to plan mass violence", correct: true },
      { id: 'c', text: "The accords were never signed, so no peace agreement existed when the genocide began", correct: false },
      { id: 'd', text: "International peacekeepers refused to enforce the accords, leaving Rwanda without protection", correct: false }
    ],
    explanation: "Hutu Power extremists opposed the Arusha Accords because they required power-sharing with the RPF and Tutsi political parties. During the accords' implementation period, extremists stockpiled weapons, created hit lists, and used RTLM to spread anti-Tutsi propaganda. The genocide was planned during 'peace' - the accords failed because hardliners never intended to honor them."
  },

  {
    id: "rw-kq-ts-03",
    roleSpecific: "tutsi-survivor",
    apSkill: "continuity",
    question: "Rwanda used gacaca courts (2005-2012) to try over one million genocide cases, while the International Criminal Tribunal for Rwanda (ICTR) tried 69 cases. What does this difference reveal about post-genocide justice priorities?",
    options: [
      { id: 'a', text: "Gacaca courts were informal and unreliable, so only ICTR trials produced legitimate justice", correct: false },
      { id: 'b', text: "Rwanda prioritized speed and community reconciliation over due process, while ICTR prioritized international legal standards for high-level perpetrators", correct: true },
      { id: 'c', text: "Gacaca courts were designed to punish all Hutu collectively, while ICTR focused on individual guilt", correct: false },
      { id: 'd', text: "The ICTR was more effective because it convicted more people per trial than gacaca courts", correct: false }
    ],
    explanation: "Rwanda faced 130,000 detainees and limited judicial capacity. Gacaca courts prioritized speed, community participation, and coexistence over formal due process. ICTR focused on high-level organizers using international legal standards. This reveals a tension in post-genocide justice: punish everyone formally (impossible) or prioritize reconciliation and speed (imperfect but pragmatic)."
  },

  // UN PEACEKEEPER QUESTIONS (3 questions)

  {
    id: "rw-kq-un-01",
    roleSpecific: "un-peacekeeper",
    apSkill: "causation",
    question: "General Dallaire's 'genocide fax' (January 1994) warned UN headquarters of planned massacres and requested permission to seize arms caches. Why was this request denied?",
    options: [
      { id: 'a', text: "The UN determined the intelligence was unreliable and likely fabricated by the RPF", correct: false },
      { id: 'b', text: "Dallaire's mandate was limited to monitoring and reporting, not intervention; seizing weapons exceeded peacekeeping authority", correct: true },
      { id: 'c', text: "The Security Council was unaware of the fax because it was never forwarded to member states", correct: false },
      { id: 'd', text: "The UN approved the request but Dallaire failed to act before the genocide began", correct: false }
    ],
    explanation: "UNAMIR's mandate was peacekeeping (monitoring the Arusha Accords), not peace enforcement. Seizing weapons would require a Chapter VII mandate allowing force. The UN denied Dallaire's request, instructing him to share intelligence with President Habyarimana instead - the very government planning the genocide. This reveals how restrictive mandates prevented intervention."
  },

  {
    id: "rw-kq-un-02",
    roleSpecific: "un-peacekeeper",
    apSkill: "complexity",
    question: "UNAMIR peacekeepers faced a mandate that allowed them to 'monitor and report' but not intervene to stop mass killings. What does this reveal about the limits of peacekeeping in preventing atrocities?",
    options: [
      { id: 'a', text: "Peacekeeping mandates are designed to fail so that powerful countries can avoid responsibility for intervention", correct: false },
      { id: 'b', text: "Restrictive mandates reflect political unwillingness to risk peacekeeper lives or commit resources, prioritizing state sovereignty over civilian protection", correct: true },
      { id: 'c', text: "Peacekeepers could have stopped the genocide if they had simply ignored their mandates and acted independently", correct: false },
      { id: 'd', text: "The mandate was appropriate because peacekeepers are not trained for combat operations", correct: false }
    ],
    explanation: "UNAMIR's restrictive mandate reflected Security Council members' unwillingness to commit resources or risk troops for Rwanda. After Somalia (1993), the US opposed robust peacekeeping. France had ties to the Hutu government. The mandate prioritized state sovereignty and political caution over civilian protection. This reveals a core tension: peacekeeping requires political will, not just troops."
  },

  {
    id: "rw-kq-un-03",
    roleSpecific: "un-peacekeeper",
    apSkill: "perspective",
    question: "The 1948 Genocide Convention obligates signatories to 'prevent and punish' genocide. Why did this legal obligation not lead to intervention in Rwanda?",
    options: [
      { id: 'a', text: "The Genocide Convention only applies to genocides in Europe, not Africa", correct: false },
      { id: 'b', text: "Countries avoided using the word 'genocide' to evade legal obligations, prioritizing political considerations over legal duties", correct: true },
      { id: 'c', text: "The Genocide Convention had expired by 1994 and was no longer legally binding", correct: false },
      { id: 'd', text: "The UN determined that the violence in Rwanda did not meet the legal definition of genocide", correct: false }
    ],
    explanation: "The US and other countries deliberately avoided calling Rwanda a 'genocide' during the 100 days. Spokespersons said 'acts of genocide' instead. This semantic evasion was political - acknowledging genocide would trigger legal obligations to intervene under the convention. Countries prioritized avoiding intervention over fulfilling legal duties. This reveals how international law depends on political will to enforce."
  }
];
