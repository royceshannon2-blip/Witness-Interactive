/**
 * Haymarket Affair Mission — Knowledge Checkpoint Questions
 *
 * 12 AP-style questions (4 per role), covering all four question types:
 * "before" | "during" | "cross-role" | "synthesis"
 *
 * Architecture: Content layer only — no logic, no engine imports.
 * Requirements: 21.1, 21.2, 21.3, 21.4, 21.5, 21.6, 6.1, 6.2, 6.3, 16.1, 16.2, 16.3
 */

const knowledgeQuestions = [

  // ─── Lucy Parsons Questions ───────────────────────────────────────────────

  {
    id: 'hm-lp-q-01',
    roleSpecific: 'hm-lucy-parsons',
    questionType: 'before',
    apSkill: 'contextualization',
    spiceT: ['Economic', 'Social'],
    apUnit: 'Unit 6.5',
    question: 'Which of the following best explains why Chicago workers demanded an eight-hour workday in 1886?',
    options: [
      {
        id: 'a',
        text: 'Manufacturing workers in Chicago averaged ten to twelve hours of labor per day, six days a week, for approximately $1.50 per day — conditions that the eight-hour movement argued denied workers the time and wages necessary for a dignified life.',
        correct: true
      },
      {
        id: 'b',
        text: 'Federal law already mandated an eight-hour workday for government employees, and private-sector workers sought to extend the same legal protection to industrial labor.',
        correct: false
      },
      {
        id: 'c',
        text: 'The Knights of Labor had successfully negotiated eight-hour contracts at most major Chicago factories, and workers at McCormick sought to match those gains.',
        correct: false
      },
      {
        id: 'd',
        text: 'Chicago employers had voluntarily reduced hours from fourteen to ten in the 1870s, and workers demanded a further reduction to eight as a continuation of that trend.',
        correct: false
      }
    ],
    explanation: 'According to Bureau of Labor Statistics data from the 1880s, Chicago manufacturing workers typically worked ten to twelve hours per day, six days a week, for wages of approximately $1.50 per day. The eight-hour movement, organized through groups like the Knights of Labor and the International Working People\'s Association, demanded the same daily wage for two fewer hours of labor. This reflected the core argument of KC-5.1.I: that industrial capitalism had created a wage labor system in which workers organized to improve conditions. The McCormick lockout of 1886 was a direct response to workers asserting these demands.'
  },

  {
    id: 'hm-lp-q-02',
    roleSpecific: 'hm-lucy-parsons',
    questionType: 'during',
    apSkill: 'causation',
    spiceT: ['Political', 'Social'],
    apUnit: 'Unit 6.5',
    question: 'Which of the following most directly caused the conviction of the Haymarket defendants despite no proof that any individual threw the bomb?',
    options: [
      {
        id: 'a',
        text: 'Physical evidence recovered from the Crane Brothers building conclusively linked the defendants to the manufacture of the bomb used on May 4th.',
        correct: false
      },
      {
        id: 'b',
        text: 'The prosecution successfully argued a conspiracy theory — that the defendants\' speeches and writings had incited the unknown bomber — in a climate of intense anti-anarchist and anti-immigrant sentiment.',
        correct: true
      },
      {
        id: 'c',
        text: 'Several eyewitnesses testified that they had seen the defendants throw the bomb from the Crane Brothers building on Desplaines Street.',
        correct: false
      },
      {
        id: 'd',
        text: 'The defendants confessed to organizing the bombing as a coordinated response to the McCormick shooting, which the prosecution used as the basis for the murder charges.',
        correct: false
      }
    ],
    explanation: 'No evidence was ever produced identifying who threw the bomb at Haymarket Square on May 4, 1886. State\'s Attorney Julius Grinnell argued a conspiracy theory: that the defendants\' anarchist writings and speeches had incited the unknown bomber, making them legally responsible for the deaths. Judge Joseph Gary conducted the trial in an atmosphere of intense anti-anarchist and anti-immigrant hostility. Governor Altgeld\'s 1893 pardon message concluded that the jury had been improperly selected and that no evidence connected any defendant to the bombing. This reflects KC-5.1.II: state and corporate power suppressed labor organizing through legal mechanisms that did not require proof of individual guilt.'
  },

  {
    id: 'hm-lp-q-03',
    roleSpecific: 'hm-lucy-parsons',
    questionType: 'cross-role',
    apSkill: 'perspective',
    spiceT: ['Political'],
    apUnit: 'Unit 6.5',
    question: 'A Pinkerton detective assigned to monitor labor meetings in 1886 would most likely have interpreted the eight-hour movement as',
    options: [
      {
        id: 'a',
        text: 'a legitimate expression of workers\' constitutional rights that his employer was obligated to respect under federal labor law.',
        correct: false
      },
      {
        id: 'b',
        text: 'a temporary disruption that would resolve itself once employers agreed to modest wage increases without reducing hours.',
        correct: false
      },
      {
        id: 'c',
        text: 'a coordinated threat to industrial order organized by foreign-born anarchists whose goal was not labor reform but the violent overthrow of American institutions.',
        correct: true
      },
      {
        id: 'd',
        text: 'a movement that deserved sympathy because the wage conditions in Chicago manufacturing were genuinely unjust by any reasonable standard.',
        correct: false
      }
    ],
    explanation: 'Pinkerton operatives were hired by employers specifically to monitor and disrupt labor organizing. Their reports consistently framed labor activism — including the eight-hour movement — as a threat to social order rather than a legitimate labor grievance. The Pinkerton agency\'s institutional role was to protect employer interests, which meant interpreting any organized worker action as dangerous. The anti-anarchist and anti-immigrant framing that dominated the Haymarket trial reflected the same perspective: the movement was characterized as foreign-born radicalism rather than a response to documented wage and hour conditions. This reflects KC-5.4.I: government and corporate power aligned against labor organizing.'
  },

  {
    id: 'hm-lp-q-04',
    roleSpecific: 'hm-lucy-parsons',
    questionType: 'synthesis',
    apSkill: 'argumentation',
    spiceT: ['Political', 'Economic'],
    apUnit: 'Unit 6.6',
    question: 'Which of the following best evaluates the long-term significance of the Haymarket trial for American labor history?',
    options: [
      {
        id: 'a',
        text: 'The Haymarket trial effectively ended the American labor movement by demonstrating that anarchist infiltration had discredited workers\' legitimate demands for shorter hours and higher wages.',
        correct: false
      },
      {
        id: 'b',
        text: 'The Haymarket trial established a legal precedent for using conspiracy charges against labor organizers, while simultaneously galvanizing international labor solidarity and contributing to the eventual passage of the eight-hour workday — demonstrating that state suppression and labor mobilization were contradictory effects of the same event.',
        correct: true
      },
      {
        id: 'c',
        text: 'The Haymarket trial had little lasting impact because Governor Altgeld\'s 1893 pardon fully rehabilitated the defendants and restored public confidence in the labor movement.',
        correct: false
      },
      {
        id: 'd',
        text: 'The Haymarket trial proved that immigrant workers could not effectively organize in the United States because their foreign origins made them vulnerable to conspiracy charges that native-born workers would not have faced.',
        correct: false
      }
    ],
    explanation: 'The Haymarket trial\'s significance is best understood through AP skill 6.D — qualifying a historical argument by acknowledging contradictory effects. The trial established the conspiracy doctrine as a tool for suppressing labor organizing (a pattern that continued through the Palmer Raids of 1919–1920 and beyond), while simultaneously making the Haymarket martyrs into international symbols of labor solidarity. The Second International adopted May Day on July 14, 1889, explicitly in commemoration of the Haymarket executions. The eight-hour workday the marchers demanded in 1886 became federal law with the Fair Labor Standards Act of June 25, 1938 — fifty-two years later. The trial both suppressed and galvanized the movement it targeted, reflecting the complexity of KC-5.1.I and KC-5.4.I operating simultaneously.'
  },

  // ─── Karl Brenner Questions ───────────────────────────────────────────────

  {
    id: 'hm-kb-q-01',
    roleSpecific: 'hm-karl-brenner',
    questionType: 'before',
    apSkill: 'contextualization',
    spiceT: ['Economic', 'Cultural'],
    apUnit: 'Unit 6.5',
    question: 'Which of the following best explains the role of the Arbeiter-Zeitung in the 1886 labor movement?',
    options: [
      {
        id: 'a',
        text: 'The Arbeiter-Zeitung served as the primary organizing medium for Chicago\'s German immigrant labor community, publishing calls for the eight-hour strike and providing a shared political identity for workers who could not access English-language press.',
        correct: true
      },
      {
        id: 'b',
        text: 'The Arbeiter-Zeitung was a mainstream Chicago newspaper that covered labor news alongside business and political reporting, reaching a broad audience of native-born and immigrant readers.',
        correct: false
      },
      {
        id: 'c',
        text: 'The Arbeiter-Zeitung was founded by the Pinkerton National Detective Agency to monitor radical labor activity by publishing inflammatory content that could be used as evidence in court.',
        correct: false
      },
      {
        id: 'd',
        text: 'The Arbeiter-Zeitung opposed the eight-hour movement on the grounds that shorter hours would reduce wages and harm the immigrant workers it represented.',
        correct: false
      }
    ],
    explanation: 'The Arbeiter-Zeitung (Workers\' Newspaper) was a German-language socialist newspaper edited by August Spies. It served as the primary media organ of Chicago\'s German immigrant labor movement, publishing organizing notices for the May 1st strike and the Haymarket meeting. Its German-language format was essential: it reached immigrant workers who could not access English-language press and provided a shared political identity for the community. This reflects KC-5.2.I — immigrants played central roles in industrial labor and created ethnic communities with their own institutions. The paper\'s role in the Haymarket events was used against Spies at trial, where his editorials were presented as evidence of incitement.'
  },

  {
    id: 'hm-kb-q-02',
    roleSpecific: 'hm-karl-brenner',
    questionType: 'during',
    apSkill: 'causation',
    spiceT: ['Social', 'Political'],
    apUnit: 'Unit 6.5',
    question: 'Which of the following most directly led to the calling of the Haymarket meeting on May 4, 1886?',
    options: [
      {
        id: 'a',
        text: 'The Knights of Labor national leadership called for a protest meeting in Chicago after learning that the eight-hour strike had failed to win concessions from McCormick management.',
        correct: false
      },
      {
        id: 'b',
        text: 'Mayor Carter Harrison issued a permit for a labor rally at Haymarket Square as part of a broader effort to reduce tensions between workers and police during the strike.',
        correct: false
      },
      {
        id: 'c',
        text: 'On May 3rd, police and Pinkerton guards fired into a crowd of striking workers at the McCormick gates, killing and wounding several men; August Spies responded by writing the Revenge Circular calling workers to a protest meeting the following evening.',
        correct: true
      },
      {
        id: 'd',
        text: 'The Haymarket meeting was a pre-planned culmination of the May 1st eight-hour strike, scheduled weeks in advance as the final demonstration before employers were expected to respond to workers\' demands.',
        correct: false
      }
    ],
    explanation: 'The causal chain leading to Haymarket is specific and documented. On May 3, 1886, police and Pinkerton guards fired into a crowd of striking workers at the McCormick Reaper Works gates, killing and wounding several men. August Spies, who witnessed the shooting, wrote the Revenge Circular that same evening — a document calling workers to arms and announcing a protest meeting at Haymarket Square for the following night. The Haymarket meeting was therefore a direct response to the McCormick shooting, not a pre-planned event. This causal chain — McCormick shooting → Revenge Circular → Haymarket meeting → bomb → trial — is the core narrative of KC-5.1.II: workers protested conditions, and state and corporate power responded with suppression.'
  },

  {
    id: 'hm-kb-q-03',
    roleSpecific: 'hm-karl-brenner',
    questionType: 'cross-role',
    apSkill: 'perspective',
    spiceT: ['Political'],
    apUnit: 'Unit 6.5',
    question: 'A labor organizer like Lucy Parsons would most likely have interpreted the McCormick shooting on May 3, 1886 as evidence of',
    options: [
      {
        id: 'a',
        text: 'the inevitable violence that results when anarchist agitators provoke confrontations with law enforcement officers who are simply maintaining public order.',
        correct: false
      },
      {
        id: 'b',
        text: 'the systematic use of state and corporate power — through Pinkerton guards and police — to suppress workers who were exercising their right to strike for better conditions.',
        correct: true
      },
      {
        id: 'c',
        text: 'a tragic accident caused by miscommunication between police commanders and Pinkerton guards who were operating without clear authority at the factory gates.',
        correct: false
      },
      {
        id: 'd',
        text: 'proof that the eight-hour movement had been infiltrated by violent radicals whose actions undermined the legitimate demands of moderate labor reformers.',
        correct: false
      }
    ],
    explanation: 'Lucy Parsons and other labor organizers interpreted the McCormick shooting through the framework of KC-5.1.II: state and corporate power used against workers who were organizing for better conditions. The Pinkerton guards at McCormick were hired by the company specifically to break the strike; the police who fired into the crowd were acting in support of employer interests. From the labor organizer\'s perspective, the shooting was not an accident or a response to provocation — it was the predictable outcome of a system in which employers could deploy private and state force against workers without legal consequence. This perspective directly shaped the Revenge Circular and the decision to hold the Haymarket meeting.'
  },

  {
    id: 'hm-kb-q-04',
    roleSpecific: 'hm-karl-brenner',
    questionType: 'synthesis',
    apSkill: 'argumentation',
    spiceT: ['Economic', 'Social'],
    apUnit: 'Unit 6.6',
    question: 'Which of the following best evaluates the relationship between immigration and labor organizing in the Gilded Age?',
    options: [
      {
        id: 'a',
        text: 'Immigrant workers were largely excluded from labor organizing because language barriers and cultural differences prevented them from participating in English-language union structures.',
        correct: false
      },
      {
        id: 'b',
        text: 'Immigrant workers drove the most radical labor organizing of the Gilded Age — building ethnic labor institutions like the Arbeiter-Zeitung and leading the eight-hour movement — while their foreign origins were simultaneously weaponized against them to discredit their demands as un-American radicalism.',
        correct: true
      },
      {
        id: 'c',
        text: 'Immigrant workers consistently opposed labor organizing because they feared deportation and preferred to accept lower wages rather than risk confrontation with employers who could report them to immigration authorities.',
        correct: false
      },
      {
        id: 'd',
        text: 'The relationship between immigration and labor organizing was primarily economic: immigrants accepted lower wages than native-born workers, which undermined union efforts to establish wage floors across industries.',
        correct: false
      }
    ],
    explanation: 'AP skill 6.D requires qualifying a historical argument by acknowledging contradictory effects. German immigrant workers were central to the 1886 eight-hour movement — they built the Arbeiter-Zeitung, organized through the IWPA, and made up a significant portion of the Haymarket defendants. This reflects KC-5.2.I: immigrants played central roles in industrial labor and created ethnic communities with their own institutions. However, their immigrant identity was simultaneously used against them: the prosecution at the Haymarket trial framed the defendants as foreign-born anarchists whose radicalism was alien to American values, using their ethnicity to discredit their labor demands. This pattern — immigrant workers as both drivers of labor organizing and targets of nativist suppression — continued through the broader immigration debates of Unit 6 and the Red Scare of Unit 7.'
  },

  // ─── James Doyle Questions ────────────────────────────────────────────────

  {
    id: 'hm-jd-q-01',
    roleSpecific: 'hm-james-doyle',
    questionType: 'before',
    apSkill: 'contextualization',
    spiceT: ['Political', 'Economic'],
    apUnit: 'Unit 6.5',
    question: 'Which of the following best explains why employers hired Pinkerton detectives to monitor labor organizations in the 1880s?',
    options: [
      {
        id: 'a',
        text: 'Federal law required employers to document labor organizing activity and report it to the Department of Labor, and the Pinkerton agency provided the most efficient means of compliance.',
        correct: false
      },
      {
        id: 'b',
        text: 'The Pinkerton agency was a government contractor that operated under federal authority to investigate potential violations of interstate commerce law by labor unions.',
        correct: false
      },
      {
        id: 'c',
        text: 'In the absence of effective federal labor law, employers used private detective agencies like Pinkerton to gather intelligence on union organizing, identify leaders for dismissal, and provide armed strikebreakers — a practice established during the 1877 Railroad Strike when President Hayes deployed federal troops against workers.',
        correct: true
      },
      {
        id: 'd',
        text: 'Employers hired Pinkerton detectives primarily to protect workers from violence by radical anarchist groups that had infiltrated legitimate labor unions.',
        correct: false
      }
    ],
    explanation: 'The Pinkerton National Detective Agency operated as a private labor suppression force hired directly by employers. Its role was established during the 1877 Great Railroad Strike, when President Hayes deployed federal troops against striking workers — the first use of federal troops to break a labor strike. This created the legal and political framework within which private agencies like Pinkerton operated: in the absence of federal labor protections, employers could use both private and state force against organizing workers. Pinkerton operatives infiltrated labor organizations, identified leaders for dismissal, and provided armed strikebreakers. This reflects KC-5.4.I: government sided with business over labor, and private agencies like Pinkerton extended that alignment into the workplace.'
  },

  {
    id: 'hm-jd-q-02',
    roleSpecific: 'hm-james-doyle',
    questionType: 'during',
    apSkill: 'perspective',
    spiceT: ['Political'],
    apUnit: 'Unit 6.5',
    question: 'The use of undercover Pinkerton operatives inside labor organizations like the IWPA best reflects which of the following about Gilded Age labor relations?',
    options: [
      {
        id: 'a',
        text: 'Labor organizations in the 1880s were so secretive and well-organized that employers had no other means of learning about planned strikes or demonstrations.',
        correct: false
      },
      {
        id: 'b',
        text: 'The alignment of employer and government interests meant that workers had no legal protection against surveillance, infiltration, or the use of their own words as evidence against them in criminal proceedings.',
        correct: true
      },
      {
        id: 'c',
        text: 'The Pinkerton agency operated independently of employer interests and provided objective intelligence to both sides of labor disputes as a neutral third party.',
        correct: false
      },
      {
        id: 'd',
        text: 'Undercover surveillance was a last resort used only after labor organizations had already committed acts of violence, and was therefore a justified response to anarchist terrorism.',
        correct: false
      }
    ],
    explanation: 'Pinkerton surveillance of the IWPA and other labor organizations reflects the broader pattern of KC-5.4.I: in the Gilded Age, government and corporate power aligned against labor organizing. Workers had no legal protection against infiltration — the reports filed by Pinkerton operatives were used as evidence in the Haymarket trial, where the defendants\' speeches and writings were presented as proof of conspiracy. The operatives\' reports were not neutral intelligence; they were produced for employers who paid for information that could be used to dismiss organizers, break strikes, and build criminal cases. The Haymarket trial demonstrated that workers\' own words, gathered through surveillance, could be used to convict them of crimes they did not commit.'
  },

  {
    id: 'hm-jd-q-03',
    roleSpecific: 'hm-james-doyle',
    questionType: 'cross-role',
    apSkill: 'perspective',
    spiceT: ['Social', 'Political'],
    apUnit: 'Unit 6.5',
    question: 'A German immigrant machinist who attended the Haymarket meeting would most likely have viewed the subsequent trial as',
    options: [
      {
        id: 'a',
        text: 'a fair legal proceeding that correctly identified the anarchist leaders responsible for inciting the bombing, even if the specific bomber was never found.',
        correct: false
      },
      {
        id: 'b',
        text: 'an overreaction by city authorities that would quickly be corrected on appeal once the courts reviewed the lack of direct evidence against the defendants.',
        correct: false
      },
      {
        id: 'c',
        text: 'a politically motivated prosecution that used the defendants\' immigrant origins and anarchist beliefs to convict them of a crime no one could prove they committed, demonstrating that immigrant workers had no protection under American law.',
        correct: true
      },
      {
        id: 'd',
        text: 'a necessary response to genuine anarchist violence that, while imperfect in its procedures, correctly identified the ideological movement responsible for the bombing.',
        correct: false
      }
    ],
    explanation: 'From the perspective of an immigrant worker who had attended the Haymarket meeting, the trial would have demonstrated the vulnerability of immigrant workers within the American legal system. The defendants were convicted not on evidence of individual guilt but on the basis of their anarchist writings and their immigrant identities — a pattern that reflected both KC-5.2.I (immigrants\' central role in labor organizing made them targets) and KC-5.1.II (state power suppressed labor organizing). Governor Altgeld\'s 1893 pardon concluded that the jury had been improperly selected and that no evidence connected any defendant to the bombing — a conclusion that would have confirmed what immigrant workers already understood: that the trial was a political prosecution, not a legal one.'
  },

  {
    id: 'hm-jd-q-04',
    roleSpecific: 'hm-james-doyle',
    questionType: 'synthesis',
    apSkill: 'argumentation',
    spiceT: ['Political', 'Economic'],
    apUnit: 'Unit 7.1',
    question: 'Which of the following best evaluates the continuity between the suppression of labor organizing after Haymarket and the Red Scare of 1919–1920?',
    options: [
      {
        id: 'a',
        text: 'There was no meaningful continuity between Haymarket and the Red Scare because the 1919 Palmer Raids targeted communist organizations rather than labor unions, representing a fundamentally different political threat.',
        correct: false
      },
      {
        id: 'b',
        text: 'The Red Scare of 1919–1920 represented a complete break from Gilded Age labor suppression because the federal government, rather than private agencies like Pinkerton, took the leading role in identifying and deporting radical organizers.',
        correct: false
      },
      {
        id: 'c',
        text: 'The Haymarket trial established the legal and political framework — conspiracy charges, anti-immigrant framing, and the equation of labor radicalism with foreign subversion — that the Palmer Raids of 1919–1920 intensified and extended, while simultaneously demonstrating that state suppression consistently failed to eliminate the underlying labor grievances that drove organizing.',
        correct: true
      },
      {
        id: 'd',
        text: 'The Red Scare of 1919–1920 was a direct response to the failure of the Haymarket prosecution, as the government sought more effective legal tools after the Altgeld pardon demonstrated that conspiracy charges could not withstand judicial review.',
        correct: false
      }
    ],
    explanation: 'AP skill 6.D requires qualifying a historical argument by acknowledging contradictory effects and continuities across periods. The Haymarket trial established a template for suppressing labor radicalism: conspiracy charges that did not require proof of individual guilt, anti-immigrant framing that equated foreign birth with subversion, and the use of private and state surveillance to build criminal cases. The Palmer Raids of 1919–1920 — in which Attorney General A. Mitchell Palmer ordered the arrest and deportation of thousands of suspected radicals — used the same framework, intensified by wartime anti-German sentiment and the Russian Revolution. This reflects KC-7.1.I: the Red Scare suppressed labor radicalism using legal tools whose precedents ran directly through Haymarket. However, state suppression consistently failed to eliminate the underlying labor grievances — the eight-hour workday became law in 1938, and labor organizing continued despite decades of suppression.'
  }

];

export default knowledgeQuestions;
