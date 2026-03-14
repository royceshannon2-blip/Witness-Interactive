/**
 * Rwanda Mission Briefing Content
 * 
 * Historical newspaper briefing pages and identity cards for each role.
 * Displayed before Scene 01 to provide historical context.
 * 
 * Content separated from engine logic per architecture rules.
 */

export const BRIEFING_PAGES = {
  tutsi: [
    {
      vol: 'Historical Record',
      date: 'Paris, France â€” 1933',
      price: 'Archive Edition',
      hSize: 'sz-lg',
      hClass: '',
      h: 'Belgium Divides Rwanda by Blood',
      deck: 'Colonial administrators issue permanent ethnic identity cards â€” a designation that cannot be changed at birth, by wealth, or by marriage',
      body: 'Belgian colonial authorities complete the formal classification of Rwanda\'s population into three immutable categories: Hutu, Tutsi, and Twa. Each person receives an identity card recording their ethnicity â€” a designation that is permanent and hereditary.\n\nBefore Belgian rule, these distinctions existed but were fluid. A prosperous Hutu farmer might be reclassified as Tutsi. Under the new system, the card is fixed at birth. It cannot be changed regardless of circumstance.\n\nColonial administrators favour Tutsi for education and administrative roles, creating a class structure enforced by paperwork. Hutu, the majority, are assigned agricultural and manual labour. The card is not merely a document. It is a destiny.\n\nWhen Rwanda gains independence in 1962, the cards remain in circulation. Everything they encode â€” the privilege, the grievance, the permanent distinction between neighbour and neighbour â€” remains with them.',
      ticker: 'This card will remain in circulation â€” unchanged â€” for sixty years.'
    },
    {
      vol: 'Vol. LVII â€” No. 284',
      date: 'Kigali, Rwanda â€” October 1990',
      price: 'Cinq francs',
      hSize: 'sz-lg',
      hClass: '',
      h: 'Civil War Erupts. Radio Mille Collines Takes to the Airwaves.',
      deck: 'Government arms Interahamwe militias as new station reads Tutsi names and addresses on air',
      body: 'Forces of the Rwandan Patriotic Front crossed the northern border from Uganda yesterday. The government accelerates the distribution of machetes to civilian militias known as the Interahamwe â€” "those who attack together."\n\nA new radio station launched this week: Radio Mille Collines, RTLM, 106.3 FM. It plays popular music. Between songs its announcers call Tutsi inyenzi â€” cockroaches â€” and inzoka â€” snakes. They read names aloud. Addresses. They describe which roads people are using to flee.\n\nThe radio is not propaganda. It is a real-time targeting system. Lists are being compiled of who lives where. Weapons are being distributed by neighbourhood. The machinery is being assembled in plain sight.',
      ticker: 'RTLM broadcast range: all of Kigali and surrounding prefectures â€” 24 hours a day.'
    },
    {
      vol: 'Vol. LX â€” No. 11',
      date: 'Kigali, Rwanda â€” January 11, 1994',
      price: 'Cinq francs',
      hSize: 'sz-lg',
      hClass: 'alert',
      h: 'U.N. Commander Cables Warning to New York. No Action Taken.',
      deck: 'General Dallaire\'s informant describes 40,000 trained militia and weapons cached by neighbourhood',
      body: 'General RomÃ©o Dallaire, commanding officer of UNAMIR, transmits an urgent cable to UN headquarters. A senior Interahamwe trainer has come forward as an informant.\n\nThe informant describes: 40,000 militia trained and positioned across Kigali. Weapons cached by sector. Lists of Tutsi compiled by neighbourhood. A plan to kill Belgian peacekeepers to trigger their withdrawal â€” after which the mass killing of Tutsi would begin.\n\nDallaire requests permission to raid the weapons caches. New York says no. He is instructed to inform President Habyarimana â€” the man whose government is organizing the operation â€” and take no further action.\n\nThe cable is filed. It will later be known as the genocide fax. The weapons are not seized.',
      ticker: 'UN response to Dallaire: "Inform the president. Do not act unilaterally." â€” January 11, 1994.'
    },
    {
      vol: 'Vol. LXI â€” No. 96',
      date: 'Kigali, Rwanda â€” April 6, 1994 â€” Late Edition',
      price: 'Cinq francs',
      hSize: 'sz-xl',
      hClass: 'alert',
      h: 'President\'s Plane Shot Down Over Kigali Airport',
      deck: 'Roadblocks appear within twenty minutes â€” moderate Hutu politicians killed before dawn â€” RTLM broadcasting without interruption',
      body: 'President Habyarimana\'s aircraft was struck by surface-to-air missiles on approach to Kigali airport this evening. He was killed instantly. Within twenty minutes of the crash â€” before the wreckage had cooled â€” roadblocks appeared across the capital.\n\nThey were constructed from materials stored in advance. Presidential Guard units moved immediately against moderate Hutu politicians. Prime Minister Agathe Uwilingiyimana was killed before dawn. The lists were ready. The machetes were already distributed.\n\nThis is not a riot born of grief. This is an operation that was waiting for a signal. RTLM broadcasts without interruption. Announcers describe which churches have the most people sheltering inside.',
      ticker: 'Time between plane crash and first roadblocks: approximately twenty minutes.'
    },
    {
      vol: 'Vol. LXI â€” No. 97',
      date: 'Kigali, Rwanda â€” April 7 â€“ July 4, 1994',
      price: 'â€”',
      hSize: 'sz-xxl',
      hClass: 'urgent',
      h: '800,000 Dead in 100 Days',
      deck: 'The fastest mass killing in recorded history â€” averaging 8,000 dead per day',
      body: 'In one hundred days, approximately 800,000 people are killed in Rwanda. This is 75% of the country\'s entire Tutsi population. The Holocaust killed 2,000 people per day. Rwanda averages 8,000.\n\nMost victims are killed by neighbours with machetes. Churches become massacre sites â€” over two hundred of them. Every place people gather believing it is safe is targeted specifically, because the planners knew where frightened people go. The traps were built around the instinct to seek safety.\n\nThe United Nations has peacekeepers in Kigali ordered not to intervene. The United States instructs its officials not to use the word genocide â€” because under international law, that word creates an obligation to act. The word is not used until it is too late.\n\nYour identity card is in your pocket. The first roadblock is on your street. You have minutes.',
      ticker: null
    }
  ],

  hutu: [
    {
      vol: 'Historical Record',
      date: 'Paris, France â€” 1933',
      price: 'Archive Edition',
      hSize: 'sz-lg',
      hClass: '',
      h: 'Belgium Divides Rwanda by Blood',
      deck: 'Permanent ethnic identity cards issued â€” Tutsi elevated to administrative class over Hutu majority',
      body: 'Belgian colonial authorities classify Rwanda\'s population into three permanent categories: Hutu, Tutsi, and Twa. Before 1933, these distinctions existed but were fluid. The card makes them immovable. It is fixed at birth and cannot be changed.\n\nTutsi are elevated: better schools, administrative positions, access to colonial power. Hutu, the majority population, are assigned agricultural and manual labour. The card creates a hierarchy enforced by paperwork.\n\nWhen Rwanda gains independence in 1962, the cards remain. The resentment they encode remains with them. A generation of Hutu grow up knowing the card their neighbour carries opened doors the card they carry did not.',
      ticker: 'The identity card will remain in use, unchanged, for sixty years.'
    },
    {
      vol: 'Vol. LVII â€” No. 301',
      date: 'Kigali, Rwanda â€” 1990â€“1994',
      price: 'Cinq francs',
      hSize: 'sz-lg',
      hClass: 'alert',
      h: 'Hutu Power Arms Militias. Radio Takes to the Airwaves. Lists Are Compiled.',
      deck: 'Government distributes machetes by neighbourhood as RTLM broadcasts Tutsi names and escape routes',
      body: 'As civil war continues in the north, the government arms civilian militias â€” the Interahamwe â€” and distributes machetes to villages across Rwanda. Training is systematic. The weapons are not hidden.\n\nRadio Mille Collines, RTLM, 106.3 FM, broadcasts music and comedy. Between programmes, announcers call Tutsi inyenzi â€” cockroaches â€” and read their names and addresses aloud. It is a real-time targeting system.\n\nModerate Hutu politicians â€” those who spoke against ethnic violence, those who refused Hutu Power rallies â€” are being watched. Their names recorded. You did not attend the last rally. That was noted. Your name is on a list.',
      ticker: 'RTLM announcer Georges Ruggiu â€” convicted of incitement to genocide, The Hague, 2000.'
    },
    {
      vol: 'Vol. LX â€” No. 11',
      date: 'Kigali â€” January 11, 1994',
      price: 'Cinq francs',
      hSize: 'sz-lg',
      hClass: 'alert',
      h: 'U.N. Commander\'s Warning Filed and Ignored. Weapons Remain.',
      deck: 'Dallaire\'s genocide fax describes 40,000 trained militia â€” New York declines to act',
      body: 'General Dallaire sends an urgent cable to UN headquarters: 40,000 militia in position, weapons cached by neighbourhood, lists of Tutsi compiled by sector. He requests permission to act. New York says no.\n\nThe weapons remain in their caches. The lists remain in circulation. The international community is aware and has chosen not to intervene before the killing begins.\n\nDallaire will describe this later as the moment it could have been stopped. The moment passes.',
      ticker: 'UN mandate: "Observe and report only. Do not intervene in internal conflicts."'
    },
    {
      vol: 'Vol. LXI â€” No. 96',
      date: 'Kigali â€” April 6, 1994 â€” Late Edition',
      price: 'Cinq francs',
      hSize: 'sz-xl',
      hClass: 'alert',
      h: 'Habyarimana Assassinated. Roadblocks Operational Within the Hour.',
      deck: 'First targets are moderate Hutu politicians â€” killed before dawn as planned operation begins',
      body: 'President Habyarimana\'s plane was shot down over Kigali airport this evening. Within twenty minutes, roadblocks appeared across the city â€” constructed from materials stored in advance. This is an operation that was waiting for a signal.\n\nThe first targets are not Tutsi. They are moderate Hutu. Prime Minister Uwilingiyimana is killed before dawn. Journalists. Civil servants. Everyone on the Hutu Power lists of potential traitors. The architects knew that moderates must be eliminated before the killing of Tutsi can proceed without internal opposition.\n\nRTLM broadcasts without interruption. Your name is on a list. You are Hutu â€” but the wrong kind of Hutu. There is a knock at your door.',
      ticker: 'First targets of the genocide: moderate Hutu politicians who refused to participate.'
    },
    {
      vol: 'Vol. LXI â€” No. 97',
      date: 'Kigali â€” April 7 â€“ July 4, 1994',
      price: 'â€”',
      hSize: 'sz-xxl',
      hClass: 'urgent',
      h: '800,000 Dead in 100 Days',
      deck: 'Most perpetrators are ordinary people â€” Hutu who sheltered Tutsi are also killed',
      body: 'In one hundred days, approximately 800,000 people are killed. Most are Tutsi. Most killers are ordinary people given permission and a weapon and told their neighbours were cockroaches. This is the fastest mass killing in recorded history â€” 8,000 dead per day.\n\nThe Hutu who shelter Tutsi â€” who lie to militia at their doors, who falsify identity cards at roadblocks, who flee rather than participate â€” are also killed. Thousands of them. The genocide\'s architects understood that moderates were the obstacle. They were eliminated first.\n\nThe choice you are about to make is the choice thousands of real people faced. Some of them are still alive. Some are not. None of them knew, on April 6th, which one they would become.',
      ticker: null
    }
  ],

  un: [
    {
      vol: 'Historical Record',
      date: 'New York â€” August 1993',
      price: 'Archive Edition',
      hSize: 'sz-lg',
      hClass: '',
      h: 'U.N. Authorizes Rwanda Mission. Mandate: Observe and Report Only.',
      deck: 'General Dallaire given 2,500 troops and explicit orders not to intervene in internal conflicts',
      body: 'The United Nations Security Council authorizes the United Nations Assistance Mission for Rwanda â€” UNAMIR â€” to monitor a peace agreement. The force is commanded by Canadian General RomÃ©o Dallaire.\n\nThe mandate is explicit: observe and report only. Peacekeepers may use force only in self-defence. They may not protect civilians outside designated safe zones. They may not confiscate weapons caches. They may not take any action that could be interpreted as interference in Rwanda\'s internal affairs.\n\nGeneral Dallaire submits written concerns that the mandate is insufficient for conditions on the ground. He is told to proceed as authorized. He proceeds.',
      ticker: 'UNAMIR authorized strength: 2,500 troops. Rules of engagement: self-defence only.'
    },
    {
      vol: 'Vol. LX â€” No. 11',
      date: 'Kigali â€” January 11, 1994',
      price: 'Cinq francs',
      hSize: 'sz-xl',
      hClass: 'alert',
      h: '"The Genocide Fax": Dallaire Warns of Mass Killing Plan',
      deck: 'Informant describes 40,000 trained militia â€” headquarters orders no action',
      body: 'General Dallaire transmits an urgent cable to UN headquarters. A senior Interahamwe trainer has defected: 40,000 militia trained and positioned across Kigali. Weapons distributed by sector. Lists of Tutsi compiled by neighbourhood. A plan to murder Belgian peacekeepers to trigger their withdrawal.\n\nDallaire requests permission to raid the weapons caches. New York says no. He is instructed to share the intelligence with President Habyarimana â€” the man whose government is organizing the killing â€” and take no further action.\n\nThe cable is filed. It will be known as the genocide fax. The weapons are not seized. The informant\'s warning will prove accurate in every detail. Dallaire will spend the rest of his life with this moment.',
      ticker: 'UN response: "Inform the president. Do not act unilaterally." â€” January 11, 1994.'
    },
    {
      vol: 'Vol. LXI â€” No. 97',
      date: 'Kigali â€” April 7, 1994 â€” Morning',
      price: 'Cinq francs',
      hSize: 'sz-xl',
      hClass: 'alert',
      h: 'Ten Belgian Peacekeepers Murdered. Security Council Votes to Withdraw.',
      deck: 'UNAMIR reduced from 2,500 to 270 troops as killing accelerates â€” Dallaire\'s requests denied',
      body: 'Ten Belgian soldiers assigned to protect Prime Minister Uwilingiyimana were captured, tortured, and killed by Rwandan Presidential Guard this morning. This is precisely the scenario Dallaire\'s informant described in January. Belgium announces immediate withdrawal of all its forces.\n\nThe UN Security Council votes to reduce UNAMIR from 2,500 soldiers to 270. As the genocide accelerates, the international force mandated to monitor it is cut by 90%. Dallaire\'s requests for reinforcement and an expanded mandate are denied.\n\nHe is ordered to oversee the evacuation of foreign nationals. Rwandan civilians do not qualify under the current mandate.',
      ticker: 'Dallaire\'s request for reinforcements: denied. His request for expanded mandate: denied.'
    },
    {
      vol: 'Vol. LXI â€” No. 97',
      date: 'Kigali â€” April 7, 1994',
      price: 'Cinq francs',
      hSize: 'sz-xl',
      hClass: 'alert',
      h: 'Foreign Nationals Ordered Evacuated. Rwandans to Be Left Behind.',
      deck: 'UN directive: mandate covers expatriates only â€” Rwandan civilians not protected',
      body: 'UNAMIR has received formal orders: evacuate foreign nationals only. Rwandan civilians at checkpoints do not qualify under the current mandate.\n\nAt roadblocks across Kigali, UN convoys pass through freely. Blue helmets provide immunity. Three feet from UN vehicles, Rwandans are being separated by identity card and taken away. Peacekeepers are under orders to keep moving.\n\nA woman at a checkpoint holds her child toward a UN truck. An embassy worker shows his staff identification â€” eleven years of service. The mandate does not cover him. The convoy moves.\n\nThe United States instructs its officials: do not use the word genocide. That word creates a legal obligation to act.',
      ticker: 'US directive: avoid the word "genocide" â€” it triggers the legal obligation to intervene.'
    },
    {
      vol: 'Vol. LXI â€” No. 98',
      date: 'Kigali â€” April 7 â€“ July 4, 1994',
      price: 'â€”',
      hSize: 'sz-xxl',
      hClass: 'urgent',
      h: '800,000 Dead. The World Watched.',
      deck: 'Fastest mass killing in recorded history ends when RPF captures Kigali â€” one hundred days after it began',
      body: 'In one hundred days, 800,000 people are killed. The international community is present throughout. There are cameras. There are cables. There are peacekeepers in the city who can see the roadblocks from their windows. The world does not act.\n\nThe United States instructs its officials not to use the word genocide because the 1948 Genocide Convention legally obligates signatories to intervene. Officials are directed to say "acts of genocide may have occurred." By the time the word is used officially, the killing is nearly complete.\n\nYou are in Kigali right now. You have 270 soldiers and orders that say observe and report. You have read Dallaire\'s January fax. You have seen the bodies on the roads near headquarters. You know exactly what this is. Your orders do not tell you what to do about it.',
      ticker: null
    }
  ]
};

export const BRIEFING_CARDS = {
  tutsi: {
    title: "REPUBLIQUE RWANDAISE â€” CARTE D'IDENTITÃ‰",
    rows: [
      ['Nom', 'IMMACULÃ‰E UWIMANA'],
      ['NÃ©e le', '3 Septembre 1974'],
      ['Profession', 'Ã‰tudiante, UniversitÃ© du Rwanda'],
      ['Ethnie', 'TUTSI', 'tutsi'],
      ['Secteur', 'Kacyiru, Kigali']
    ],
    stamp: 'DÃ©livrÃ© 1992 Â· En vigueur',
    note: 'This card will get you killed at every roadblock in Kigali today. You cannot cross the city without showing it. You cannot destroy it â€” soldiers ask specifically for people who have removed their cards. This piece of cardboard, issued by Belgian colonizers before you were born, is the reason you are being hunted. It is in your pocket right now.'
  },

  hutu: {
    title: "REPUBLIQUE RWANDAISE â€” CARTE D'IDENTITÃ‰",
    rows: [
      ['Nom', 'AUGUSTIN BIZIMUNGU'],
      ['NÃ© le', '14 Mars 1961'],
      ['Profession', 'SecrÃ©taire Communal, Kigali'],
      ['Ethnie', 'HUTU', 'hutu'],
      ['Secteur', 'Nyamirambo, Kigali']
    ],
    stamp: 'DÃ©livrÃ© 1988 Â· En vigueur',
    note: 'Your ethnicity is Hutu. At roadblocks today, this card is your protection â€” the militia cannot always tell the difference by sight. But you are on a second list. You are a Hutu moderate. You did not attend the last Hutu Power rally. That was recorded. There are two ways to be killed today: carrying a Tutsi card, and being the wrong kind of Hutu.'
  },

  un: {
    title: 'UNITED NATIONS â€” PERSONNEL IDENTIFICATION',
    rows: [
      ['Name', 'CAPT. MARCUS WEBB'],
      ['Rank date', '14 February 1991'],
      ['Service', 'Canadian Forces'],
      ['Status', 'UN PERSONNEL', 'un'],
      ['Mission', 'UNAMIR â€” Kigali, Rwanda']
    ],
    stamp: 'Issued Jan 1994 Â· Active',
    note: 'This card gives you immunity at every roadblock in Kigali. The militia will not touch you. You can walk through any checkpoint in the city. Every Rwandan civilian around you does not have this protection. You will watch people be separated three feet from where you stand. Your orders say you may not intervene. You will have to decide what those orders mean to you.'
  }
};

export const BRIEFING_FINALS = {
  tutsi: 'Your name is <strong>ImmaculÃ©e</strong>. You are nineteen years old. Outside your window, the first roadblock of the morning has just gone up on your street.',
  hutu: 'Your name is <strong>Augustin</strong>. It is the evening of April 6th. There is a knock at your door. You already know who it is.',
  un: 'Your name is <strong>Captain Marcus Webb</strong>. It is 6am. You have just been told the ten Belgian peacekeepers assigned to protect the Prime Minister were murdered an hour ago.'
};
