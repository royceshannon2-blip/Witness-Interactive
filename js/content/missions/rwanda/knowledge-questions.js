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
    role: "hutu-moderate",
    question: "RTLM radio broadcasts played a crucial role in mobilizing participants during the genocide. Which statement best explains how RTLM functioned as a tool of mass violence?",
    choices: [
      "RTLM provided military intelligence and tactical coordination for organized army units",
      "RTLM used dehumanizing language and specific instructions to transform ordinary citizens into participants",
      "RTLM primarily broadcast government propaganda but had little effect on civilian behavior",
      "RTLM was controlled by the RPF and used to spread misinformation about Hutu Power"
    ],
    correctIndex: 1,
    explanations: [
      "Incorrect. While RTLM coordinated some activities, its primary power was in mobilizing civilians, not military units. The genocide was carried out largely by ordinary citizens, not just organized forces.",
      "Correct. RTLM broadcasts used dehumanizing language (referring to Tutsi as 'cockroaches'), gave specific instructions about roadblocks and targets, and normalized violence. This transformed neighbors into killers. RTLM leaders were later convicted at the ICTR for incitement to genocide.",
      "Incorrect. RTLM had a massive effect on civilian behavior. Witnesses testified that broadcasts directly preceded attacks. The ICTR convicted RTLM leaders specifically because the station incited genocide, proving its effectiveness.",
      "Incorrect. RTLM was controlled by Hutu Power extremists, not the RPF. The RPF was the Tutsi-led rebel force fighting against the government. RTLM broadcast anti-Tutsi propaganda and instructions for the genocide."
    ],
    apTheme: "causation"
  },

  {
    id: "rw-kq-hm-02",
    role: "hutu-moderate",
    question: "Identity cards in Rwanda listed ethnicity (Hutu, Tutsi, Twa). How did these cards function as a tool of genocide at roadblocks?",
    choices: [
      "Cards allowed militia to quickly identify and target Tutsi, turning bureaucratic documents into death sentences",
      "Cards were primarily used to track population movements for census purposes during the conflict",
      "Cards helped protect Tutsi by allowing them to prove they were not RPF soldiers",
      "Cards were rarely checked because militia could identify ethnicity by physical appearance alone"
    ],
    correctIndex: 0,
    explanations: [
      "Correct. Identity cards made ethnic targeting systematic and efficient. At roadblocks, militia checked cards and killed those marked 'Tutsi.' This bureaucratic system - inherited from Belgian colonial rule - transformed administrative documents into instruments of mass murder. Survivors testified that showing a Tutsi card meant immediate death.",
      "Incorrect. During the genocide, cards were not used for census purposes. They were used at roadblocks to identify and kill Tutsi. The systematic checking of cards made the genocide more efficient and widespread.",
      "Incorrect. Cards did the opposite - they exposed Tutsi to danger. Showing a Tutsi identity card at a roadblock typically resulted in death. Some Tutsi survived by using false Hutu cards or hiding their real cards.",
      "Incorrect. While militia sometimes used physical stereotypes, identity cards were systematically checked at roadblocks. Many Tutsi and Hutu were physically indistinguishable, making cards the primary identification method. Survivors testified that cards determined life or death."
    ],
    apTheme: "complexity"
  },

  {
    id: "rw-kq-hm-03",
    role: "hutu-moderate",
    question: "Historians debate the concept of 'bystander' during the Rwanda genocide. Why is this category problematic when analyzing Hutu who neither actively killed nor actively rescued?",
    choices: [
      "Because all Hutu were equally guilty regardless of their actions during the genocide",
      "Because inaction in a genocidal state often enabled violence, making the line between bystander and participant unclear",
      "Because most Hutu actively participated in killings, so true bystanders did not exist",
      "Because the concept of bystander only applies to international actors, not to Rwandans"
    ],
    correctIndex: 1,
    explanations: [
      "Incorrect. Not all Hutu were equally guilty. Some actively rescued Tutsi and were killed for it. Others fled or hid. Collective guilt ignores the moral complexity and individual choices people made under extreme pressure.",
      "Correct. The 'bystander' category is problematic because inaction often enabled violence. Hutu who staffed roadblocks, attended rallies, or simply didn't intervene contributed to the genocide's success. Gacaca courts later struggled with this - how to judge those who didn't kill but didn't help? The line between passive complicity and active participation is morally and legally complex.",
      "Incorrect. While participation was widespread, not all Hutu actively killed. Many fled, hid, or tried to avoid involvement. Some were killed for refusing to participate. The genocide's complexity includes the range of Hutu responses, not just active killing.",
      "Incorrect. The bystander concept applies to both Rwandans and international actors. Within Rwanda, many Hutu occupied a gray area between perpetrator and rescuer. Internationally, countries like the US and France were criticized as bystanders who could have intervened but didn't."
    ],
    apTheme: "perspective"
  },

  // TUTSI SURVIVOR QUESTIONS (3 questions)

  {
    id: "rw-kq-ts-01",
    role: "tutsi-survivor",
    question: "Churches became massacre sites during the Rwanda genocide, with thousands killed in places they sought as sanctuary. What does this reveal about how genocides exploit trust and social institutions?",
    choices: [
      "Churches were targeted because they were RPF military strongholds disguised as religious sites",
      "Genocides weaponize trusted institutions by turning places of safety into traps, exploiting victims' reliance on traditional sanctuaries",
      "Churches were massacre sites primarily because they were easy to surround, not because of their symbolic meaning",
      "Religious leaders universally supported the genocide, making churches natural sites for organized killings"
    ],
    correctIndex: 1,
    explanations: [
      "Incorrect. Churches were not RPF military sites. They were civilian sanctuaries where Tutsi sought protection based on historical precedent. The RPF was advancing from the north; churches were targeted by Interahamwe militia and government forces.",
      "Correct. Genocides exploit trust by weaponizing institutions victims rely on. Tutsi fled to churches because they had historically been safe. Militia and even some priests betrayed this trust, turning sanctuaries into massacre sites. This pattern appears in other genocides - trusted institutions become traps when perpetrators exploit victims' reliance on traditional safety.",
      "Incorrect. While churches were physically easy to surround, the symbolic betrayal was crucial. Victims went to churches specifically because they trusted them as sanctuaries. The exploitation of this trust made the genocide more effective and psychologically devastating.",
      "Incorrect. Not all religious leaders supported the genocide. Some priests and pastors were killed for protecting Tutsi. However, some clergy did participate or enable killings. The Catholic Church later apologized for members who failed to protect victims or actively participated."
    ],
    apTheme: "perspective"
  },

  {
    id: "rw-kq-ts-02",
    role: "tutsi-survivor",
    question: "The Arusha Accords (1993) were meant to end the civil war between the Rwandan government and RPF. Why did these peace agreements fail to prevent the genocide?",
    choices: [
      "The RPF violated the accords by shooting down President Habyarimana's plane, triggering the genocide",
      "Hutu Power extremists opposed power-sharing with Tutsi and used the accords' implementation period to plan mass violence",
      "The accords were never signed, so no peace agreement existed when the genocide began",
      "International peacekeepers refused to enforce the accords, leaving Rwanda without protection"
    ],
    correctIndex: 1,
    explanations: [
      "Incorrect. Who shot down the plane remains disputed - both Hutu extremists and RPF have been accused. Regardless, the genocide was pre-planned. Dallaire's genocide fax (January 1994) warned of arms caches and hit lists months before the plane crash. The crash was a trigger, not the cause.",
      "Correct. Hutu Power extremists opposed the Arusha Accords because they required power-sharing with the RPF and Tutsi political parties. During the accords' implementation period, extremists stockpiled weapons, created hit lists, and used RTLM to spread anti-Tutsi propaganda. The genocide was planned during 'peace' - the accords failed because hardliners never intended to honor them.",
      "Incorrect. The Arusha Accords were signed in August 1993. UNAMIR was deployed to monitor their implementation. The accords existed but were undermined by extremists who opposed power-sharing and used the transition period to plan violence.",
      "Incorrect. UNAMIR was deployed to monitor the accords, but its mandate was limited to peacekeeping, not enforcement. The failure wasn't refusal to enforce - it was that the mandate didn't allow intervention to stop mass violence. Dallaire requested a stronger mandate but was denied."
    ],
    apTheme: "causation"
  },

  {
    id: "rw-kq-ts-03",
    role: "tutsi-survivor",
    question: "Rwanda used gacaca courts (2005-2012) to try over one million genocide cases, while the International Criminal Tribunal for Rwanda (ICTR) tried 69 cases. What does this difference reveal about post-genocide justice priorities?",
    choices: [
      "Gacaca courts were informal and unreliable, so only ICTR trials produced legitimate justice",
      "Rwanda prioritized speed and community reconciliation over due process, while ICTR prioritized international legal standards for high-level perpetrators",
      "Gacaca courts were designed to punish all Hutu collectively, while ICTR focused on individual guilt",
      "The ICTR was more effective because it convicted more people per trial than gacaca courts"
    ],
    correctIndex: 1,
    explanations: [
      "Incorrect. While gacaca courts had limitations (lay judges, public testimony, limited appeals), they were Rwanda's pragmatic response to overwhelming case numbers. Dismissing them as illegitimate ignores their role in addressing mass atrocity when formal courts couldn't handle the scale.",
      "Correct. Rwanda faced 130,000 detainees and limited judicial capacity. Gacaca courts prioritized speed, community participation, and coexistence over formal due process. ICTR focused on high-level organizers using international legal standards. This reveals a tension in post-genocide justice: punish everyone formally (impossible) or prioritize reconciliation and speed (imperfect but pragmatic).",
      "Incorrect. Gacaca courts tried individual cases based on evidence and testimony, not collective punishment. Perpetrators could confess for reduced sentences. Some were acquitted. The system aimed at individual accountability within a community framework, not blanket guilt.",
      "Incorrect. Effectiveness isn't measured by convictions per trial. ICTR trials took years and cost millions but established legal precedents (media incitement as genocide). Gacaca trials were faster and cheaper but had less rigorous due process. Both served different purposes in Rwanda's justice landscape."
    ],
    apTheme: "continuity"
  },

  // UN PEACEKEEPER QUESTIONS (3 questions)

  {
    id: "rw-kq-un-01",
    role: "un-peacekeeper",
    question: "General Dallaire's 'genocide fax' (January 1994) warned UN headquarters of planned massacres and requested permission to seize arms caches. Why was this request denied?",
    choices: [
      "The UN determined the intelligence was unreliable and likely fabricated by the RPF",
      "Dallaire's mandate was limited to monitoring and reporting, not intervention; seizing weapons exceeded peacekeeping authority",
      "The Security Council was unaware of the fax because it was never forwarded to member states",
      "The UN approved the request but Dallaire failed to act before the genocide began"
    ],
    correctIndex: 1,
    explanations: [
      "Incorrect. The intelligence came from a high-level informant within the Interahamwe and was considered credible. The denial wasn't about reliability - it was about mandate limitations and political unwillingness to expand UNAMIR's role.",
      "Correct. UNAMIR's mandate was peacekeeping (monitoring the Arusha Accords), not peace enforcement. Seizing weapons would require a Chapter VII mandate allowing force. The UN denied Dallaire's request, instructing him to share intelligence with President Habyarimana instead - the very government planning the genocide. This reveals how restrictive mandates prevented intervention.",
      "Incorrect. The fax reached UN headquarters and was reviewed by officials including Kofi Annan (then head of peacekeeping). The Security Council was informed. The denial was deliberate policy, not a communication failure.",
      "Incorrect. The UN explicitly denied Dallaire's request. He was ordered not to seize weapons and to inform Rwandan authorities instead. Dallaire followed orders. The failure was the UN's restrictive mandate and political unwillingness to act, not Dallaire's inaction."
    ],
    apTheme: "causation"
  },

  {
    id: "rw-kq-un-02",
    role: "un-peacekeeper",
    question: "UNAMIR peacekeepers faced a mandate that allowed them to 'monitor and report' but not intervene to stop mass killings. What does this reveal about the limits of peacekeeping in preventing atrocities?",
    choices: [
      "Peacekeeping mandates are designed to fail so that powerful countries can avoid responsibility for intervention",
      "Restrictive mandates reflect political unwillingness to risk peacekeeper lives or commit resources, prioritizing state sovereignty over civilian protection",
      "Peacekeepers could have stopped the genocide if they had simply ignored their mandates and acted independently",
      "The mandate was appropriate because peacekeepers are not trained for combat operations"
    ],
    correctIndex: 1,
    explanations: [
      "Incorrect. While mandates can be inadequate, they're not designed to fail. They reflect political compromises in the Security Council. Countries debate how much intervention is justified, how much it costs, and whether it violates sovereignty. Restrictive mandates result from political caution, not conspiracy.",
      "Correct. UNAMIR's restrictive mandate reflected Security Council members' unwillingness to commit resources or risk troops for Rwanda. After Somalia (1993), the US opposed robust peacekeeping. France had ties to the Hutu government. The mandate prioritized state sovereignty and political caution over civilian protection. This reveals a core tension: peacekeeping requires political will, not just troops.",
      "Incorrect. Individual peacekeepers acting independently couldn't stop a nationwide genocide. Some peacekeepers did defy orders to protect enclaves (like the hotel), saving thousands. But stopping the genocide required a robust mandate, more troops, and political will - none of which existed. Blaming peacekeepers ignores systemic failures.",
      "Incorrect. Peacekeepers are trained for combat. UNAMIR included experienced soldiers. The issue wasn't training - it was mandate and numbers. Dallaire estimated 5,000 well-armed troops with a robust mandate could have stopped the genocide. He had 2,500, then 270, with orders not to intervene."
    ],
    apTheme: "complexity"
  },

  {
    id: "rw-kq-un-03",
    role: "un-peacekeeper",
    question: "The 1948 Genocide Convention obligates signatories to 'prevent and punish' genocide. Why did this legal obligation not lead to intervention in Rwanda?",
    choices: [
      "The Genocide Convention only applies to genocides in Europe, not Africa",
      "Countries avoided using the word 'genocide' to evade legal obligations, prioritizing political considerations over legal duties",
      "The Genocide Convention had expired by 1994 and was no longer legally binding",
      "The UN determined that the violence in Rwanda did not meet the legal definition of genocide"
    ],
    correctIndex: 1,
    explanations: [
      "Incorrect. The Genocide Convention applies globally, not just to Europe. It was created in response to the Holocaust but covers genocide anywhere. Rwanda clearly fell under its scope - the ICTR later prosecuted perpetrators for genocide under this convention.",
      "Correct. The US and other countries deliberately avoided calling Rwanda a 'genocide' during the 100 days. Spokespersons said 'acts of genocide' instead. This semantic evasion was political - acknowledging genocide would trigger legal obligations to intervene under the convention. Countries prioritized avoiding intervention over fulfilling legal duties. This reveals how international law depends on political will to enforce.",
      "Incorrect. The Genocide Convention remains in force today. It's a permanent international treaty. Countries that signed it (including the US, France, UK) were legally bound in 1994. The issue wasn't expiration - it was unwillingness to act.",
      "Incorrect. The violence clearly met the legal definition: systematic killing of Tutsi as an ethnic group with intent to destroy them. The ICTR later confirmed this. The issue wasn't legal ambiguity - it was political unwillingness to acknowledge genocide while it was happening, which would require intervention."
    ],
    apTheme: "perspective"
  }
];
