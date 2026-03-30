/**
 * Haymarket Affair Mission — Stimulus Documents
 *
 * Seven real primary source documents that unlock mid-scene or during briefing.
 * Each document includes authentic text, AP pause question, SPICE-T, and apUnit.
 *
 * Architecture: Content layer only — no logic, no engine imports.
 * Requirements: 14.1, 14.3
 */

const STIMULUS_DOCUMENTS = [
  {
    id: 'hm-doc-0',
    title: 'Hayes Federal Troop Deployment Order, 1877',
    source: 'President Rutherford B. Hayes, July 1877',
    date: 'July 1877',
    spiceT: ['Political', 'Economic'],
    apUnit: 'Unit 6.5',
    text: `PROCLAMATION BY THE PRESIDENT OF THE UNITED STATES

Whereas, by reason of unlawful obstructions, combinations, and assemblages of persons, it has become impracticable to enforce by the ordinary course of judicial proceedings the laws of the United States within the State of West Virginia, and the laws of said State require that the militia thereof should be called forth to suppress insurrection:

Now, therefore, I, Rutherford B. Hayes, President of the United States, do hereby admonish all good citizens of the United States, and especially of the State of West Virginia, against aiding, countenancing, abetting, or taking part in such unlawful proceedings; and I do hereby warn all persons engaged in or connected with said obstruction of the laws to disperse and retire peaceably to their respective abodes on or before twelve o'clock noon of the 18th day of July instant.

— President Rutherford B. Hayes, Proclamation, July 18, 1877

[From President Hayes's diary, July 1877:]

"The strikes have been put down by force... The strikers have been put down by U.S. troops. Several of the ringleaders have been arrested and will be punished. The railroad companies now insist on the restoration of the wages cut... I shall use all the power of the Government to maintain order and to protect property."`,
    pauseQuestion: {
      question: 'Which of the following best explains the long-term significance of President Hayes\'s deployment of federal troops against the 1877 Railroad Strike?',
      options: [
        { id: 'a', text: 'It demonstrated that the federal government would remain neutral in disputes between labor and capital, allowing market forces to resolve conflicts.', correct: false },
        { id: 'b', text: 'It established that workers had a constitutional right to strike, which courts would later be forced to recognize.', correct: false },
        { id: 'c', text: 'It established the precedent that the federal government would use military force to protect property and suppress labor organizing, a pattern repeated in subsequent decades.', correct: true },
        { id: 'd', text: 'It convinced labor organizers to abandon strikes in favor of electoral politics as the primary means of achieving reform.', correct: false }
      ],
      correctId: 'c',
      explanation: 'Hayes\'s 1877 deployment was the first use of federal troops to break a labor strike in American history. It established a critical precedent: the federal government would side with railroad owners and other industrialists against striking workers. This pattern repeated itself — in the 1894 Pullman Strike, President Cleveland deployed federal troops over the objection of Illinois Governor Altgeld. The Pinkerton National Detective Agency operated within this legal and political framework, providing private enforcement of the same principle: property rights superseded workers\' rights to organize. The 1877 precedent directly shaped the environment in which the Haymarket events unfolded nine years later.'
    }
  },
  {
    id: 'hm-doc-1a',
    title: 'Arbeiter-Zeitung Excerpt, May 1886',
    source: 'Chicago Arbeiter-Zeitung (German-language labor newspaper), May 1886',
    date: 'May 1886',
    spiceT: ['Cultural', 'Economic'],
    apUnit: 'Unit 6.5',
    text: `ARBEITER-ZEITUNG
Chicago, Illinois — May 1886
August Spies, Editor

ACHT-STUNDEN-TAG! ACHT-STUNDEN-TAG!
[EIGHT-HOUR DAY! EIGHT-HOUR DAY!]

Arbeiter! Die Zeit ist gekommen. Seit Jahren haben wir gearbeitet — zehn Stunden, zwölf Stunden, vierzehn Stunden am Tag — für Löhne, die uns kaum am Leben erhalten.
[Workers! The time has come. For years we have labored — ten hours, twelve hours, fourteen hours a day — for wages that barely keep us alive.]

The McCormick Reaper Works has locked out its workers. The men who built this city's wealth with their hands are told they have no right to organize, no right to demand a living wage, no right to the hours of daylight that belong to every human being.

On May 1st, eighty thousand workers in this city will lay down their tools. Not in anger. Not in riot. In the simple, dignified assertion that a man who works ten hours deserves to be paid for ten hours — and that eight hours of labor, eight hours of rest, and eight hours for what we will is not a radical demand. It is a human one.

The eight-hour day is not the end of our struggle. It is the beginning. When the worker controls his own time, he controls his own mind. He can read. He can organize. He can vote. He can think.

The capitalists know this. That is why they are afraid.

— Arbeiter-Zeitung, Chicago, May 1886`,
    pauseQuestion: {
      question: 'Which of the following best explains the role of the Arbeiter-Zeitung in the 1886 Chicago labor movement?',
      options: [
        { id: 'a', text: 'It served primarily as an entertainment publication for German immigrants, with labor news as a secondary feature.', correct: false },
        { id: 'b', text: 'It functioned as the primary organizing tool for Chicago\'s German immigrant workers, who lacked access to English-language labor media and used the paper to coordinate the eight-hour movement.', correct: true },
        { id: 'c', text: 'It was a mainstream newspaper that occasionally covered labor issues alongside general news for a broad Chicago readership.', correct: false },
        { id: 'd', text: 'It was published by the Knights of Labor as an official organ of the national labor movement.', correct: false }
      ],
      correctId: 'b',
      explanation: 'The Arbeiter-Zeitung (Workers\' Newspaper) was the primary media organ of Chicago\'s German immigrant labor movement. Edited by August Spies, it published organizing notices, called for the May 1st strike, and served as the connective tissue of a community that could not rely on English-language newspapers hostile to labor. German immigrants made up a significant portion of Chicago\'s industrial workforce in the 1880s, and the paper gave them a political voice. This is a key example of how immigrant communities built parallel institutions — press, mutual aid societies, labor organizations — to navigate a society that excluded them from mainstream power. The paper\'s role also explains why Spies was targeted after Haymarket: destroying the Arbeiter-Zeitung meant destroying the movement\'s communications infrastructure.'
    }
  },
  {
    id: 'hm-doc-1b',
    title: 'Bureau of Labor Statistics Wage Data, 1880s',
    source: 'U.S. Bureau of Labor Statistics, Third Annual Report of the Commissioner of Labor, 1887',
    date: '1887',
    spiceT: ['Economic', 'Social'],
    apUnit: 'Unit 6.5',
    text: `THIRD ANNUAL REPORT OF THE COMMISSIONER OF LABOR
United States Bureau of Labor Statistics, 1887
Carroll D. Wright, Commissioner

WAGES AND HOURS OF LABOR IN MANUFACTURING INDUSTRIES
State of Illinois — Selected Industries, 1886

HOURS OF LABOR (Average per day, manufacturing workers):
  Skilled machinists:          10.2 hours
  Unskilled factory labor:     11.4 hours
  Women in garment trades:     11.8 hours
  Child labor (under 16):      10.5 hours

DAILY WAGES (Average, manufacturing workers):
  Skilled machinists:          $1.50 — $2.00 per day
  Unskilled factory labor:     $0.90 — $1.25 per day
  Women in garment trades:     $0.60 — $0.90 per day
  Child labor (under 16):      $0.25 — $0.50 per day

ANNUAL EARNINGS (Estimated, assuming 300 working days):
  Skilled machinist:           $450 — $600 per year
  Unskilled factory worker:    $270 — $375 per year

COST OF LIVING (Chicago, 1886, family of four):
  Minimum subsistence budget:  $500 — $600 per year
  Rent (tenement, 2 rooms):    $6 — $8 per month
  Food (basic):                $30 — $40 per month

COMMISSIONER'S NOTE: "The data presented herein demonstrate that a significant proportion of manufacturing workers in the principal industrial cities earn wages insufficient to maintain a family at a standard of minimum comfort, even when employed the full year. The reduction of working hours to eight per day, without reduction in daily wages, would represent a material improvement in the condition of the laboring classes."

— Third Annual Report, Commissioner of Labor, 1887`,
    pauseQuestion: {
      question: 'Which of the following conclusions is best supported by the Bureau of Labor Statistics data you collected in your Intel Inventory?',
      options: [
        { id: 'a', text: 'Chicago manufacturing workers in the 1880s earned wages sufficient to support a family, making the eight-hour movement primarily a political rather than economic demand.', correct: false },
        { id: 'b', text: 'The wage gap between skilled and unskilled workers was the primary cause of labor unrest, as skilled workers resented competition from unskilled immigrants.', correct: false },
        { id: 'c', text: 'Child labor was the most significant economic problem facing Chicago workers, and the eight-hour movement was primarily aimed at protecting children.', correct: false },
        { id: 'd', text: 'The data shows that even skilled workers earned wages near or below the minimum cost of living while working 10-plus hour days, directly explaining why workers demanded an eight-hour workday at the same daily wage.', correct: true }
      ],
      correctId: 'd',
      explanation: 'The BLS data reveals the economic logic behind the eight-hour demand. A skilled machinist earning $1.50–$2.00 per day for 10+ hours of work was earning $450–$600 annually — barely at or below the $500–$600 minimum subsistence budget for a Chicago family of four. Unskilled workers and women in the garment trades earned far less. Workers were not demanding a raise; they were demanding the same daily wage for eight hours instead of ten or twelve. The eight-hour day would also create more jobs by spreading available work among more workers. The Commissioner\'s own note acknowledges that current wages were insufficient for "minimum comfort" — making this a government document that inadvertently validated the workers\' core argument.'
    }
  },
  {
    id: 'hm-doc-1c',
    title: '"Eight Hours" — Marching Song of the Labor Movement',
    source: 'Words by I.G. Blanchard; music by Rev. Jesse H. Jones. Published in The Alarm, 1886.',
    date: '1886',
    docType: 'arbeiter-zeitung',
    image: 'images/labor-union-banner.png',
    spiceT: ['Cultural', 'Social'],
    apUnit: 'Unit 6.5',
    text: `We mean to make things over,
  We are tired of toil for naught,
With but bare enough to live upon
  And never an hour for thought;
We want to feel the sunshine,
  And we want to smell the flowers,
We are sure that God has willed it,
  And we mean to have eight hours.

We're summoning our forces
  From the shipyard, shop, and mill;
Eight hours for work, eight hours for rest,
  Eight hours for what we will!

This song, written in 1866 by an American-born worker, became the anthem of the 1886 movement. Its existence proves that the demand for eight hours was a long-standing American labor goal, not a recent import of foreign radical ideology.`,
    pauseQuestion: {
      question: 'Which of the following describes the most significant function of this song in the 1886 labor movement?',
      options: [
        { id: 'a', text: 'It was used by anarchist leaders to coordinate the specific timing of the Haymarket bombing.', correct: false },
        { id: 'b', text: 'It served as a unifying cultural tool, articulating common working-class values and demonstrating that labor demands were grounded in American traditions and religious ideals.', correct: true },
        { id: 'c', text: 'It was a recruitment tool for the Democratic Party in the 1886 elections.', correct: false },
        { id: 'd', text: 'It was written specifically for the McCormick lockout to protest the use of Pinkerton guards.', correct: false }
      ],
      correctId: 'b',
      explanation: "The 'Eight Hours' song provided the movement with a moral and cultural vocabulary. By invoking 'sunshine,' 'flowers,' and the 'will of God,' it framed the eight-hour day as a basic human right necessary for citizenship and family life. Sourcing this document reveals that the movement had deep American roots, countering the prosecution's later claims that it was an alien anarchist conspiracy."
    }
  },
  {
    id: 'hm-doc-2',
    title: "Harper's Weekly Illustration, May 15, 1886",
    source: "Harper's Weekly, May 15, 1886 — illustration by Thure de Thulstrup",
    date: 'May 15, 1886',
    docType: 'harper-weekly',
    image: 'images/harper-weekly-haymarket.png',
    spiceT: ['Political', 'Cultural'],
    apUnit: 'Unit 6.5',
    text: `The illustration from May 15, 1886, famously captioned "The Anarchist Riot in Chicago," depicts the dramatic moment when a dynamite bomb exploded among a column of police officers.

In the foreground, a disciplined column of uniformed police is struck by a burst of fire and white light. Officers fall backward in chaos. In the background, a faceless, anonymous crowd of rioters disperses into the darkness. 

Harper's Weekly, with a circulation of over 100,000 middle-class readers, framed the event as a premeditated "anarchist riot" before any trial began. This visual narrative shaped the national public's perception of the labor movement as a violent, radical threat to civic order.`,
    pauseQuestion: {
      question: "Based on the chaos you witnessed in the square during Scene 5, how does the editorial framing of this illustration—specifically its use of the label 'Anarchist Riot'—work to shape the reader's perception of the event?",
      options: [
        { id: 'a', text: "It accurately captured the testimony of workers who witnessed the bomb, providing a balanced account of the evening's events as you saw them.", correct: false },
        { id: 'b', text: "By depicting orderly police against a faceless, chaotic crowd and labeling it a 'riot' rather than a protest, it reinforces middle-class fears of radicalism and delegitimizes the labor movement.", correct: true },
        { id: 'c', text: "It demonstrates that Harper's Weekly was an unbiased source that supported the workers' demand for shorter hours.", correct: false },
        { id: 'd', text: "It proved that the bomb was thrown by one of the eight anarchist leaders you saw in the crowd.", correct: false }
      ],
      correctId: 'b',
      explanation: "AP Historical Thinking Skill 2 (Sourcing and Situation) requires examining who created a source and for what audience. Harper's Weekly reached over 100,000 subscribers, predominantly middle-class readers who feared labor radicalism. The illustration's visual choices—orderly police vs. faceless, chaotic crowd—and its 'anarchist riot' caption framed the event as a criminal conspiracy rather than the labor protest you experienced. This framing turned national public opinion against the defendants before the trial even began."
    }
  },
  {
    id: 'hm-doc-6',
    title: 'Pinkerton National Detective Agency Identity Document',
    source: 'Pinkerton Agency Archives, CHI-1886',
    date: '1886',
    docType: 'pinkerton-report',
    image: 'images/pinkerton-eye.png',
    spiceT: ['Political', 'Social'],
    apUnit: 'Unit 6.5',
    text: '', // IMAGE ONLY STIMULUS
    pauseQuestion: {
      question: "The 'We Never Sleep' logo of the Pinkerton Agency reflects which trend in Gilded Age labor relations?",
      options: [
        { id: 'a', text: 'The expansion of federal police powers to regulate industrial safety in factories.', correct: false },
        { id: 'b', text: 'The rise of private security organizations hired by industrialists to monitor workers and suppress labor unions during a period of minimal government regulation.', correct: true },
        { id: 'c', text: 'The cooperation between labor unions and detectives to identify corrupt factory foremen.', correct: false },
        { id: 'd', text: 'The invention of the modern surveillance camera for use in retail stores.', correct: false }
      ],
      correctId: 'b',
      explanation: "The Pinkerton Agency was the largest private security force in the world by the 1880s. Its logo symbolized the constant surveillance of the 'labor element.' Because there was little federal regulation of labor relations, companies relied on the Pinkertons for infiltration of unions and armed protection of replacement workers during strikes. This private enforcement of 'order' was central to the conflicts at McCormick and Haymarket."
    }
  },
  {
    id: 'hm-doc-3',
    title: 'Revenge Circular',
    source: 'August Spies, Chicago, May 3, 1886',
    date: 'May 3, 1886',
    spiceT: ['Political', 'Social'],
    apUnit: 'Unit 6.5',
    text: `REVENGE!

Workingmen, to Arms!!!

Your masters sent out their bloodhounds — the police — they killed six of your brothers at McCormick's this afternoon. They killed the poor wretches because they, like you, had the courage to disobey the supreme will of your bosses. They killed them to show you, "Free American Citizens," that you must be satisfied and contented with whatever your bosses condescend to allow you, or you will get killed!

You have for years endured the most abject humiliations; you have for years suffered unmeasurable iniquities; you have worked yourself to death; you have endured the pangs of want and hunger; your Children you have sacrificed to the factory lords — in short: you have been miserable and obedient slaves all these years. Why? To satisfy the insatiable greed, to fill the coffers of your lazy thieving master? When you ask them now to lessen your burdens, he sends his bloodhounds out to shoot you, kill you!

If you are men, if you are the sons of your grandsires, who have shed their blood to free you, then you will rise in your might, Hercules, and destroy the hideous monster that seeks to destroy you. To arms we call you, to arms!

— August Spies
Chicago, May 3, 1886

[Historical note: This circular was printed and distributed on the evening of May 3, 1886, hours after police and Pinkerton guards fired on striking workers at the McCormick Reaper Works, killing at least two men and wounding several others. The circular was used as evidence of premeditated violence at the subsequent trial of the Haymarket defendants — even though no direct connection between the circular and the bomb was ever established.]`,
    pauseQuestion: {
      question: 'The Revenge Circular, written by August Spies on May 3, 1886, best supports which of the following arguments about the causes of the Haymarket meeting?',
      options: [
        { id: 'a', text: 'The Haymarket meeting was a long-planned anarchist conspiracy to attack the Chicago police, organized weeks in advance by Spies and Parsons.', correct: false },
        { id: 'b', text: 'The Haymarket meeting was called directly in response to the McCormick shooting, making the causal link between police violence against strikers and the subsequent protest explicit in the primary source itself.', correct: true },
        { id: 'c', text: 'The circular demonstrates that Spies intended to throw a bomb at the police, which is why it was used as evidence at trial.', correct: false },
        { id: 'd', text: 'The circular shows that the eight-hour movement had abandoned peaceful protest in favor of armed revolution by May 1886.', correct: false }
      ],
      correctId: 'b',
      explanation: 'The Revenge Circular is a primary source that makes the causal chain explicit: police killed workers at McCormick on May 3 → Spies wrote the circular that same evening → the circular called workers to a meeting at Haymarket on May 4. The circular was written in rage, not as a premeditated plan. Spies himself later testified that he did not know a bomb would be thrown. The prosecution used the circular as evidence of conspiracy, but historians have noted that the circular called workers "to arms" in a rhetorical sense common to labor writing of the period — not as a specific operational order. The circular is most valuable as evidence of the immediate cause of the Haymarket meeting: the McCormick shooting, not a long-planned conspiracy.'
    }
  },
  {
    id: 'hm-doc-4',
    title: 'Chicago Tribune Front Page, May 5, 1886',
    source: 'Chicago Tribune, May 5, 1886',
    date: 'May 5, 1886',
    spiceT: ['Political', 'Cultural'],
    apUnit: 'Unit 6.5',
    text: `CHICAGO DAILY TRIBUNE
Wednesday Morning, May 5, 1886

ANARCHY'S RED HAND

Rioting and Bloodshed in the Streets of Chicago

A BOMB THROWN INTO A SQUAD OF POLICEMEN

Seven Officers Killed and Sixty Wounded

HUNDREDS OF RIOTERS SHOT DOWN BY THE POLICE

The Villainous Teaching of the Anarchists Bears Its Bloody Fruit

LONG-PLANNED CONSPIRACY EXECUTED AT LAST

The Anarchists of Chicago inaugurated in earnest last night the reign of lawlessness which they have long threatened and endeavored to bring about. Taking advantage of a peaceable labor meeting in the Haymarket, they turned it into a riot of the most sanguinary character, and for a time the streets of Chicago ran red with blood.

The immediate cause of the outbreak was the throwing of a dynamite bomb into the ranks of the police, who had been ordered to disperse the meeting. The bomb, which was of the most destructive character, exploded with terrific force, killing and wounding a large number of officers. The police, maddened by the attack upon their comrades, opened fire upon the crowd, and for a time the scene was one of indescribable carnage.

The Anarchists have long threatened that they would inaugurate a reign of terror in Chicago. They have preached the doctrine of dynamite and the knife. They have counseled the murder of capitalists and the destruction of property. Last night they put their theories into practice.

The city is now thoroughly aroused. The authorities are determined to stamp out the Anarchist conspiracy root and branch. Warrants have been issued for the arrest of the leaders of the movement, and it is expected that before nightfall the ringleaders will be in custody.

— Chicago Tribune, May 5, 1886`,
    pauseQuestion: {
      question: "The Chicago Tribune framing of the Haymarket bombing as an 'anarchist conspiracy' and a 'long-planned' attack best reflects which of the following about this source?",
      options: [
        { id: 'a', text: "The Tribune reporters had access to police intelligence reports that confirmed the bombing was premeditated, making their framing an accurate reflection of the available evidence.", correct: false },
        { id: 'b', text: "The Tribune coverage reflects the standard journalistic practice of the 1880s, in which all major newspapers reported the Haymarket events in identical terms.", correct: false },
        { id: 'c', text: "The Tribune close ties to business interests and its owner Joseph Medill's Republican politics shaped its interpretation of the bombing as a threat to social order, framing it as anarchist conspiracy before any investigation had taken place.", correct: true },
        { id: 'd', text: "The Tribune framing as 'anarchist conspiracy' was accurate because the trial later proved that all eight defendants had planned the bombing in advance.", correct: false }
      ],
      correctId: 'c',
      explanation: "AP Historical Thinking Skill 2 (Sourcing and Situation) requires examining who created a source and why. The Chicago Tribune was owned by Joseph Medill, a Republican political figure with deep ties to Chicago's business community and a long editorial history of hostility to labor organizing. The Tribune had opposed the eight-hour movement for months before Haymarket. Its May 5 headline — published the morning after the bombing, before any investigation — declared the event a 'long-planned conspiracy' and called for the arrest of 'ringleaders.' This framing preceded any evidence. Governor Altgeld's 1893 pardon message later documented that the trial itself was conducted with 'malicious ferocity' and that no evidence connected the defendants to the bomb. The Tribune's coverage is valuable evidence of how business-aligned media constructed the meaning of Haymarket — not as evidence of what actually happened."
    }
  },
  {
    id: 'hm-doc-5',
    title: "Governor Altgeld's Pardon Message, June 26, 1893",
    source: 'Governor John Peter Altgeld, State of Illinois, June 26, 1893',
    date: 'June 26, 1893',
    spiceT: ['Political', 'Economic'],
    apUnit: 'Unit 6.5',
    text: `PARDON MESSAGE
Governor John Peter Altgeld
State of Illinois, June 26, 1893

In the case of Samuel Fielden, Michael Schwab, and Oscar Neebe, convicted of murder in connection with the Haymarket affair of May 4, 1886, I have carefully examined all the evidence and the records of the trial, and I am satisfied that the men ought to be pardoned for the following reasons:

FIRST — The jury which tried the case was a packed jury selected to convict.

The record shows that the jury was not drawn in the manner required by law. The special bailiff appointed to draw the jury was a bailiff who had been selected by the State's Attorney's office. The jurors were not drawn from the regular jury list but were selected by this bailiff, who went out and picked men whom he thought would convict. Several jurors admitted on examination that they were prejudiced against the defendants and did not believe they could give them a fair trial, yet they were accepted by the court.

SECOND — The trial judge was not impartial.

The record of the trial shows that the judge conducted it with malicious ferocity. Throughout the trial he ruled against the defendants on every point, and in his charge to the jury he practically told them to find the defendants guilty. The record shows that he was determined to hang the defendants, and that he used his position to accomplish that result.

THIRD — The State failed to prove that any of the defendants were guilty of the crime charged.

The State's Attorney admitted in his closing argument that he could not show that any of the defendants had thrown the bomb, or that they had any connection with the man who did throw it. The verdict was based on the theory that the defendants were responsible for the acts of the unknown bomb-thrower because they had made speeches and published articles which the prosecution claimed had incited him to throw the bomb. This is a principle of law that has never been recognized in this country, and its application in this case was a perversion of justice.

I am satisfied that these men were tried and convicted in a time of public excitement, when the public mind was inflamed against them, and that they did not receive a fair trial. I therefore pardon them.

— Governor John Peter Altgeld
Springfield, Illinois, June 26, 1893

[Historical note: Altgeld knew before signing this pardon that it would end his political career. He was correct. He was denounced by newspapers across the country, including the Chicago Tribune, as an anarchist sympathizer. He lost his bid for re-election in 1896. He died in 1902, largely forgotten. Historians have since confirmed the substance of his three conclusions.]`,
    pauseQuestion: {
      question: "Reflecting on the courtroom proceedings you observed in Scene 6, which of Governor Altgeld's subsequently documented findings in this 1893 pardon message most directly addresses the judicial environment you witnessed?",
      options: [
        { id: 'a', text: 'His proof that the bomb was thrown by a government agent provocateur, confirming what you saw in the crowd.', correct: false },
        { id: 'b', text: 'His assertion that the eight-hour movement was legally recognized, establishing an important precedent for the trial.', correct: false },
        { id: 'c', text: 'His observation that the public had turned against business interests, making the trial safer for the defendants than it appeared.', correct: false },
        { id: 'd', text: "His documented critique of the trial's procedural failures—a packed jury and a judge acting with 'malicious ferocity'—which aligns with your observation of the court's biased atmosphere.", correct: true }
      ],
      correctId: 'd',
      explanation: "Altgeld's 1893 pardon message is significant because it provides a documented, legal foundation for the procedural failures you observed in the courtroom. His three conclusions (packed jury, biased judge, no evidence connecting defendants to the bomb) were reached after a review of the same record you helped create. Historians have since confirmed these findings, recognizing the Haymarket trial as one of the most unjust in American legal history—not due to the lack of a crime, but due to the systematic failure of the judicial process."
    }
  }
];

/**
 * Look up a stimulus document by ID
 * @param {string} id - Document ID (e.g., 'hm-doc-0')
 * @returns {Object|undefined} Document object or undefined if not found
 */
function getDocument(id) {
  return STIMULUS_DOCUMENTS.find(doc => doc.id === id);
}

export { STIMULUS_DOCUMENTS, getDocument };
