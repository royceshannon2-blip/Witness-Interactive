/**
 * Haymarket Affair Mission — Briefing Content
 *
 * Five-page Chicago Daily Tribune briefing newspaper, identity cards,
 * role-specific final lines, and UI text.
 *
 * All three roles share the same five briefing pages.
 * Page 2 unlocks hm-doc-1b (BLS wage data) for all roles.
 * Page 4 unlocks hm-doc-0 (Hayes troop order) mid-page for all roles.
 *
 * Writing register: third-person historical narrative, newspaper style.
 * Factually grounded in Avrich (1984) and EBSCO Vaughn (2021).
 *
 * Architecture: Content layer only — no logic, no engine imports.
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4, 9.5, 25.1, 25.2
 */

const BRIEFING_PAGES = [
  {
    vol: 'Vol. XLII — No. 124',
    date: 'Chicago, Illinois — May 1886',
    price: 'Two cents',
    hSize: 'sz-lg',
    hClass: '',
    h: 'Industrial Transformation, 1871–1885',
    deck: 'From the ashes of the Great Fire, a city of iron and smoke — and the men who feed its furnaces',
    body: `On the night of October 8, 1871, fire consumed four square miles of Chicago. By morning, 100,000 people were homeless and $200 million in property had turned to ash. The city rebuilt with a ferocity that matched the blaze itself.

Within a decade, Chicago had become the industrial capital of the American interior. More than twenty railroads converged on the city. The Union Stock Yards processed four million animals a year. The McCormick Reaper Works on Blue Island Avenue employed 1,400 men and produced the mechanical harvesters that were transforming the Great Plains. The smell of the place — coal smoke, animal blood, machine oil — reached visitors before they could see the skyline.

The population exploded with it. From just over 110,000 on the eve of the Civil War, Chicago grew to nearly 300,000 by 1870 and to almost 1.1 million by 1890. The newcomers came from Ireland, Germany, Bohemia, and the Scandinavian countries. They filled the tenements of the Near West Side and the South Side, within walking distance of the factories that needed their hands.

The machinery they tended was new and indifferent to them. A reaper press stamped out parts at a rate no human hand could match. A blast furnace ran twenty-four hours and required men to feed it in shifts. The work was relentless and the hours were long — ten to twelve hours a day, six days a week, for wages that left little margin between a family and hunger. A skilled machinist at McCormick earned roughly $1.50 a day. An unskilled laborer earned less.

The men who owned the machines lived differently. George Pullman built a model town south of the city for his workers and charged them rent. Cyrus McCormick Jr. inherited his father's reaper empire and expanded it. Marshall Field's department store on State Street sold goods that most of the city's workers could not afford to buy.

By 1885, Chicago was a city of stark contrasts — magnificent and brutal, expanding and explosive. The conditions that would produce the events of May 1886 had been accumulating for fifteen years.`,
    ticker: 'Chicago, 1885: The McCormick Reaper Works employs 1,400 workers. The plant runs 10 hours a day, six days a week.',
    spiceT: ['Economic', 'Technological'],
    apUnit: 'Unit 6.5',
    apTheme: 'contextualization',
    stimuliUnlock: []
  },

  {
    vol: 'Vol. XLII — No. 124',
    date: 'Chicago, Illinois — May 1886',
    price: 'Two cents',
    hSize: 'sz-lg',
    hClass: '',
    h: 'The Workers',
    deck: 'Immigrant labor, the Arbeiter-Zeitung, and the demand for eight hours',
    body: `By 1886, nearly half of Chicago's working population had been born outside the United States. The largest single group was German. They settled in the neighborhoods west of the river — on Milwaukee Avenue, on West Indiana Street, in the blocks around the Arbeiter-Zeitung printing house on Fifth Avenue — and they brought with them a tradition of labor politics that had no equivalent in American-born working-class culture.

The Arbeiter-Zeitung — the Workers' Newspaper — was the daily organ of Chicago's German immigrant labor movement. Its editor, August Spies, had come to Chicago from Germany in the 1870s and had moved steadily from socialism toward anarchism. The paper called for the eight-hour workday, reported on strikes and lockouts, and published the organizing notices that brought workers to meetings in the back rooms of saloons and the upper floors of Turner halls. It reached thousands of readers who could not read English and who had no other source of information about the movement they were part of.

The demand for eight hours was not new. The National Labor Union had called for it in 1866. The Knights of Labor, which by 1886 had grown to 700,000 members nationwide, had made it a central demand. What was new in the spring of 1886 was the scale of the effort. The Federation of Organized Trades and Labor Unions had set May 1st as the date for a nationwide general strike for the eight-hour day. In Chicago alone, organizers expected 40,000 workers to walk out.

The argument for eight hours was simple and the workers made it in every language spoken on the Near West Side. A man who worked ten or twelve hours a day had no time to be a citizen, a father, or a human being. He came home in the dark, ate, and slept. The machine had the rest of him. Eight hours of work, eight hours of rest, eight hours for what you will — that was the formula, printed on banners and sung in meeting halls from Milwaukee Avenue to Blue Island.

The employers heard the demand and prepared their response.`,
    ticker: 'The Arbeiter-Zeitung: Chicago\'s German-language labor newspaper, edited by August Spies. Circulation: approximately 5,000 daily.',
    spiceT: ['Social', 'Cultural', 'Economic'],
    apUnit: 'Unit 6.5',
    apTheme: 'contextualization',
    stimuliUnlock: ['hm-doc-1b']
  },

  {
    vol: 'Vol. XLII — No. 124',
    date: 'Chicago, Illinois — May 1886',
    price: 'Two cents',
    hSize: 'sz-lg',
    hClass: '',
    h: 'The Eight-Hour Movement',
    deck: '80,000 workers march in Chicago — the largest labor demonstration in American history',
    body: `On May 1, 1886, approximately 80,000 workers marched through the streets of Chicago in the largest labor demonstration the country had ever seen. Across the nation, an estimated 340,000 workers participated in strikes and marches demanding the eight-hour workday. In Chicago, the procession stretched for miles. Workers carried banners in German, English, Czech, and Polish. The city's factories fell quiet.

Albert Parsons, a native-born labor organizer and editor of the English-language anarchist paper The Alarm, led a column of workers down Michigan Avenue. His wife Lucy, a labor organizer in her own right, marched alongside him. August Spies addressed crowds in German. The Knights of Labor, the Central Labor Union, and dozens of trade unions had coordinated the action for months.

The marches were peaceful. Mayor Carter Harrison rode through the crowds on horseback and reported to the police that the gatherings were orderly. The eight-hour movement, at least on May 1st, had demonstrated its power without violence.

But the employers had not conceded anything. The McCormick Reaper Works had been locked out since February, when Cyrus McCormick Jr. replaced his union workers with non-union labor and Pinkerton guards. The locked-out workers continued to picket the plant on Blue Island Avenue. The tension between the picketers and the replacement workers — and the Pinkerton men hired to protect them — had been building for three months.

On May 3rd, two days after the great march, August Spies was speaking to a crowd of locked-out McCormick workers near the plant when the factory whistle blew, signaling the end of the shift. A group of workers rushed toward the gates to confront the replacement men leaving the building. Police and Pinkerton guards opened fire. At least two workers were killed and several more were wounded.

Spies, who had witnessed the shooting, went directly to the Arbeiter-Zeitung office and wrote the document that would change everything.`,
    ticker: 'May 1, 1886: 340,000 workers nationwide participate in the eight-hour strike. In Chicago, 80,000 march — the largest labor demonstration in American history.',
    spiceT: ['Economic', 'Political'],
    apUnit: 'Unit 6.5',
    apTheme: 'causation',
    stimuliUnlock: []
  },

  {
    vol: 'Vol. XLII — No. 124',
    date: 'Chicago, Illinois — May 1886',
    price: 'Two cents',
    hSize: 'sz-lg',
    hClass: '',
    h: 'The Other Side',
    deck: 'Pinkertons, federal troops, and the machinery of order',
    body: `The Pinkerton National Detective Agency was founded in Chicago in 1850 by Allan Pinkerton, a Scottish immigrant and former barrel-maker who had stumbled into detective work by accident. By the 1880s it had become the largest private security organization in the United States, with more agents than the standing army of most nations. Its clients were the railroads, the steel mills, and the factory owners — the men who needed to know what their workers were planning and who needed armed men when the planning turned to action.

Pinkerton operatives worked in two modes. The first was infiltration: an agent would take a job in a factory or join a labor organization under a false name, attend meetings, file reports, and identify organizers for dismissal or prosecution. The second was suppression: when a strike began, Pinkerton guards arrived by train, armed with rifles and clubs, to protect replacement workers and intimidate picketers.

The legal and political framework for this work had been established nine years earlier. In July 1877, when railroad workers across the country walked off the job in response to a 10 percent wage cut, the strike spread to seventeen states and paralyzed the national rail network. Local police and state militias could not contain it. President Rutherford B. Hayes called up federal troops — the first time in American history that the federal government had deployed the army against striking workers in peacetime. More than a hundred workers were killed before the strike was broken.

The message of 1877 was clear to both sides. The government would use its full power to protect property and suppress labor organizing. The workers had learned it. The employers had learned it. The Pinkertons had built their business on it.

By 1886, the McCormick Reaper Works had been under Pinkerton guard for three months. The locked-out workers on Blue Island Avenue faced armed men every day. When August Spies arrived to speak on May 3rd, the Pinkertons were already there.`,
    ticker: '1877: President Hayes deploys federal troops against the Great Railroad Strike — the first use of federal force against striking workers in peacetime. More than 100 workers killed.',
    spiceT: ['Political', 'Economic'],
    apUnit: 'Unit 6.5',
    apTheme: 'contextualization',
    stimuliUnlock: ['hm-doc-0']
  },

  {
    vol: 'Vol. XLII — No. 124',
    date: 'Chicago, Illinois — May 1886',
    price: 'Two cents',
    hSize: 'sz-lg',
    hClass: '',
    h: 'May 3rd, 1886',
    deck: 'Shots at McCormick — a circular — and a meeting called for tomorrow night',
    body: `On the evening of May 3rd, 1886, August Spies sat at his desk at the Arbeiter-Zeitung office and wrote in a fury. He had watched police and Pinkerton guards shoot down workers at the McCormick gates that afternoon. He had seen men fall. He did not know yet how many were dead.

The document he produced was called the Revenge Circular. It began: "REVENGE! Workingmen, to Arms!!!" It described the McCormick shooting as the act of "bloodhounds" sent by the workers' masters. It called on workers to arm themselves. It was printed that night and distributed across the Near West Side.

A second notice, more measured in tone, announced a protest meeting for the following evening — Tuesday, May 4th — at Haymarket Square, on Randolph Street between Desplaines and Halsted. The meeting was called to protest the McCormick shooting and to demand accountability. Mayor Harrison had been informed. He attended the early part of the meeting himself and, finding it peaceful, went home.

The speakers that night were August Spies, Albert Parsons, and Samuel Fielden, an English-born teamster and labor organizer. The crowd, which had numbered perhaps 3,000 at the start, had thinned to around 1,000 by the time Fielden took the platform near ten o'clock. Rain clouds were gathering. The meeting was nearly over.

Then a column of 180 police officers marched in from the Desplaines Street station and ordered the meeting to disperse. Fielden objected that the gathering was peaceful. The police captain insisted. At that moment, from somewhere in the darkness near the Crane Brothers building, a bomb arced through the air and landed among the police.

Seven officers would die of their wounds. At least four workers were killed in the gunfire that followed. The identity of the person who threw the bomb was never established.

By morning, Chicago was a different city.`,
    ticker: 'May 3, 1886: Police and Pinkerton guards fire on striking workers at the McCormick plant. At least two workers are killed. August Spies writes the Revenge Circular that night.',
    spiceT: ['Political', 'Social'],
    apUnit: 'Unit 6.5',
    apTheme: 'causation',
    stimuliUnlock: []
  }
];

const BRIEFING_CARDS = {
  'hm-lucy-parsons': {
    type: 'Chicago Police Department Surveillance File',
    subject: 'Lucy Parsons',
    fileNumber: 'CPD-1886-0441',
    date: 'April 1886',
    classification: 'LABOR AGITATOR — ACTIVE SURVEILLANCE',
    detail: `SUBJECT: Lucy Parsons (also known as Lucy E. Parsons, Lucy Diaz)
OCCUPATION: Labor organizer, writer, editor
ASSOCIATION: International Working People's Association; Central Labor Union
KNOWN ASSOCIATES: Albert R. Parsons (husband); August Spies; Samuel Fielden
RESIDENCE: 144 West Indiana Street, Chicago

NOTES: Subject is a prominent figure in the anarchist labor movement. Addresses meetings of working women on the Near West Side. Contributes to The Alarm (English-language anarchist paper edited by husband). Believed to be of Mexican and Indian extraction; husband is native-born. Subject is considered an effective public speaker and organizer. Surveillance recommended to continue.

Filed by: Detective Sgt. M. Bonfield, Chicago Police Department`
  },

  'hm-karl-brenner': {
    type: 'McCormick Reaper Works Employee Record',
    subject: 'Karl Brenner',
    employeeNumber: '#2847',
    date: 'February 1886',
    classification: 'LOCKOUT — EMPLOYMENT SUSPENDED',
    detail: `EMPLOYEE: Karl Brenner
EMPLOYEE NO.: 2847
DEPARTMENT: Foundry — Press Operations
HIRE DATE: March 14, 1882
DAILY WAGE: $1.50
SUPERVISOR: Foreman T. Haggerty

STATUS: Employment suspended February 16, 1886, pursuant to general lockout of union workers. Employee is a member of the Metal Workers' Union, Local 9. Replacement labor has been secured through the Pinkerton National Detective Agency.

NOTE: Employee has been observed at labor meetings on Milwaukee Avenue. His name appears on the subscription list of the Arbeiter-Zeitung.

McCormick Reaper Works, Blue Island Avenue, Chicago`
  },

  'hm-james-doyle': {
    type: 'Pinkerton National Detective Agency — Operative Assignment',
    subject: 'James Doyle',
    assignmentNumber: 'CHI-1886-114',
    date: 'February 1886',
    classification: 'UNDERCOVER — ACTIVE',
    detail: `OPERATIVE: James Doyle
ASSIGNMENT NO.: CHI-1886-114
ALIAS: James Reilly
TARGET ORGANIZATION: International Working People's Association (IWPA), Chicago Branch
HANDLER: Captain William Ward, Chicago Office
ASSIGNMENT DATE: February 3, 1886

OBJECTIVE: Infiltrate IWPA meetings. Identify organizers, speakers, and members. Document any discussion of violence or illegal activity. Report weekly to Captain Ward.

COVER: Operative is posing as a recently arrived Irish laborer seeking work. Cover identity has been established. Operative has attended three IWPA meetings to date without incident.

CLASSIFICATION: This document is the property of the Pinkerton National Detective Agency. Unauthorized disclosure is prohibited.`
  }
};

const BRIEFING_FINALS = {
  'hm-lucy-parsons': `It is late April 1886. The eight-hour movement is at its peak. You have been organizing the sewing women of the Near West Side for three months. Tonight there is a meeting on West Indiana Street. You have the Arbeiter-Zeitung in your hand.`,

  'hm-karl-brenner': `It is April 1886. You have been locked out of the McCormick plant for two months. The Pinkerton men are at the gates every morning. You have been reading the Arbeiter-Zeitung. Tonight Heinrich Müller is coming over. You have things to discuss.`,

  'hm-james-doyle': `It is February 1886. You have been James Reilly for three months now — long enough that you sometimes forget your real name when you wake up. Captain Ward wants a full report by Friday. You know where the next IWPA meeting is.`
};

const BRIEFING_UI_TEXT = {
  masthead: {
    name: 'Chicago Daily Tribune',
    byline: 'Special Report — Labor Bureau'
  },
  cardEyebrow: 'Your Identity Document',
  buttons: {
    continue: 'Continue',
    seeCard: 'See Your Identity',
    enterMission: 'Enter the Mission'
  }
};

// All three Haymarket roles share the same five briefing pages.
// Keyed by roleId to match MissionBriefing.js lookup pattern.
const _pages = BRIEFING_PAGES;
export const BRIEFING_PAGES_KEYED = {
  'hm-lucy-parsons': _pages,
  'hm-karl-brenner': _pages,
  'hm-james-doyle':  _pages
};

// Card templates for _buildCardHTML() — one per role
export const BRIEFING_CARD_TEMPLATES = {
  'hm-lucy-parsons': {
    headerBand: {
      republic: 'CHICAGO POLICE DEPARTMENT',
      type: 'SURVEILLANCE FILE'
    },
    photoLabel: 'SUBJECT PHOTO',
    stamp: {
      line1: 'CHICAGO P.D.',
      line2: 'ACTIVE',
      line3: 'SURVEILLANCE'
    },
    fields: [
      { label: 'SUBJECT', cssClass: 'pc-val-bold' },
      { label: 'FILE NO.', cssClass: 'pc-val' },
      { label: 'CLASSIFICATION', cssClass: 'pc-val-red' },
      { label: 'DATE', cssClass: 'pc-val' },
      { label: 'ASSOCIATION', cssClass: 'pc-val' }
    ],
    footer: {
      issued: 'Issued: April 1886',
      valid: 'Chicago, Illinois',
      number: 'CPD-1886-0441'
    }
  },
  'hm-karl-brenner': {
    headerBand: {
      republic: 'McCORMICK REAPER WORKS',
      type: 'EMPLOYEE RECORD'
    },
    photoLabel: 'EMPLOYEE',
    stamp: {
      line1: 'McCORMICK',
      line2: 'LOCKED',
      line3: 'OUT'
    },
    fields: [
      { label: 'EMPLOYEE', cssClass: 'pc-val-bold' },
      { label: 'EMP. NO.', cssClass: 'pc-val' },
      { label: 'STATUS', cssClass: 'pc-val-red' },
      { label: 'DEPARTMENT', cssClass: 'pc-val' },
      { label: 'DAILY WAGE', cssClass: 'pc-val' }
    ],
    footer: {
      issued: 'Hired: March 1882',
      valid: 'Blue Island Ave., Chicago',
      number: 'EMP-2847'
    }
  },
  'hm-james-doyle': {
    headerBand: {
      republic: 'PINKERTON NATIONAL DETECTIVE AGENCY',
      type: 'OPERATIVE ASSIGNMENT'
    },
    photoLabel: 'OPERATIVE',
    stamp: {
      line1: 'PINKERTON',
      line2: 'ACTIVE',
      line3: 'UNDERCOVER'
    },
    fields: [
      { label: 'OPERATIVE', cssClass: 'pc-val-bold' },
      { label: 'ALIAS', cssClass: 'pc-val' },
      { label: 'ASSIGNMENT', cssClass: 'pc-val' },
      { label: 'HANDLER', cssClass: 'pc-val' },
      { label: 'STATUS', cssClass: 'pc-val-red' }
    ],
    footer: {
      issued: 'Assigned: Feb. 1886',
      valid: 'Chicago Office',
      number: 'CHI-1886-114'
    }
  }
};

// Card row data (typed out during briefing animation)
export const BRIEFING_CARDS_KEYED = {
  'hm-lucy-parsons': {
    rows: [
      ['SUBJECT', 'Lucy Parsons'],
      ['FILE NO.', 'CPD-1886-0441'],
      ['CLASSIFICATION', 'LABOR AGITATOR — ACTIVE SURVEILLANCE'],
      ['DATE', 'April 1886'],
      ['ASSOCIATION', 'IWPA; Central Labor Union']
    ],
    note: 'Subject is considered an effective public speaker and organizer. Surveillance recommended to continue. — Det. Sgt. M. Bonfield'
  },
  'hm-karl-brenner': {
    rows: [
      ['EMPLOYEE', 'Karl Brenner'],
      ['EMP. NO.', '#2847'],
      ['STATUS', 'LOCKOUT — EMPLOYMENT SUSPENDED'],
      ['DEPARTMENT', 'Foundry — Press Operations'],
      ['DAILY WAGE', '$1.50']
    ],
    note: 'Employee suspended February 16, 1886, pursuant to general lockout of union workers. Replacement labor secured through Pinkerton Agency.'
  },
  'hm-james-doyle': {
    rows: [
      ['OPERATIVE', 'James Doyle'],
      ['ALIAS', 'James Reilly'],
      ['ASSIGNMENT', 'CHI-1886-114 — IWPA Infiltration'],
      ['HANDLER', 'Captain William Ward'],
      ['STATUS', 'UNDERCOVER — ACTIVE']
    ],
    note: 'Cover identity established. Operative has attended three IWPA meetings without incident. Report weekly to Captain Ward.'
  }
};

export const BRIEFING_FINALS_KEYED = {
  'hm-lucy-parsons': BRIEFING_FINALS['hm-lucy-parsons'],
  'hm-karl-brenner': BRIEFING_FINALS['hm-karl-brenner'],
  'hm-james-doyle':  BRIEFING_FINALS['hm-james-doyle']
};

export { BRIEFING_PAGES, BRIEFING_CARDS, BRIEFING_FINALS, BRIEFING_UI_TEXT };
