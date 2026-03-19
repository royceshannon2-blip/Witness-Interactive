/**
 * Urban Design Mission Briefing Content
 * 
 * Historical newspaper briefing pages and property card for the Legacy Resident role.
 * Displayed before Scene 01 to provide historical context on redlining, blockbusting,
 * and environmental justice.
 * 
 * Content separated from engine logic per architecture rules.
 */

export const BRIEFING_PAGES = {
  'ud-resident': [
    {
      vol: 'Historical Record',
      date: 'Washington, D.C. — June 28, 1934',
      price: 'Archive Edition',
      hSize: 'sz-lg',
      hClass: '',
      h: 'National Housing Act Formalizes Federal Redlining',
      deck: 'New FHA mortgage insurance system locks in HOLC neighborhood grades — "D" areas marked in red, denied all federal lending',
      body: 'President Roosevelt signed the National Housing Act today, creating the Federal Housing Administration. The FHA will insure private mortgages — but only in neighborhoods the Home Owners\' Loan Corporation, created last year, has graded acceptable.\n\nTo assess risk, HOLC appraisers grade neighborhoods A through D. Grade A areas receive green on the map — designated "best" for investment. Grade D areas receive red — designated "hazardous" for lending. The FHA Underwriting Manual lists racial composition as a risk factor. Neighborhoods with Black residents receive D grades regardless of housing condition.\n\nFHA-insured lending follows the grades. Between 1934 and 1962, the federal government backed approximately $120 billion in home loans. Less than 2% went to non-white families, according to the National Commission on Urban Problems (1968). The grade assigned today will determine where capital flows for the next three decades.\n\nThe maps are filed. The lending criteria are in effect.',
      ticker: 'HOLC Residential Security Maps referenced by FHA underwriters through 1968.'
    },
    {
      vol: 'Vol. XLII — No. 187',
      date: 'Washington, D.C. — June 22, 1944',
      price: 'Ten cents',
      hSize: 'sz-lg',
      hClass: '',
      h: 'GI Bill Offers Home Loans to Veterans',
      deck: 'Servicemen\'s Readjustment Act provides mortgage assistance — but local banks and realtors control access',
      body: 'The Servicemen\'s Readjustment Act of 1944 provides low-interest home loans to returning veterans. Sixteen million veterans are eligible. Administration of the program runs through local banks and the Veterans Administration.\n\nLocal lending institutions control loan approval. The FHA Underwriting Manual, still in effect, recommends against insuring mortgages in racially mixed or predominantly Black neighborhoods. Black veterans applying for suburban mortgages are denied at rates documented by the NAACP and the President\'s Committee on Civil Rights (1947). White veterans purchase homes in Levittown and comparable developments. Black veterans are directed to urban areas already carrying HOLC D-grade designations.\n\nHome equity is the primary mechanism of intergenerational wealth transfer in postwar America. The Urban Institute (2018) estimates that the homeownership gap created in this period accounts for a significant share of the current racial wealth disparity.\n\nSuburban development proceeds with federal mortgage backing. Urban areas with D-grade designations receive declining capital investment.',
      ticker: 'By 1960: homeownership rate 60% for white families, 38% for Black families. (U.S. Census Bureau)'
    },
    {
      vol: 'Vol. LXI — No. 203',
      date: 'Chicago, Illinois — 1960s',
      price: 'Fifteen cents',
      hSize: 'sz-lg',
      hClass: 'alert',
      h: 'Blockbusting Accelerates White Flight',
      deck: 'Real estate speculators exploit racial fear — neighborhoods transition in months as property values collapse',
      body: 'A practice documented in Chicago, Detroit, and Philadelphia emerges in transitioning neighborhoods: blockbusting. Real estate agents contact white homeowners with warnings that Black families are moving into the area and that property values will fall. Homeowners sell at below-market prices. Agents resell to Black families — who have limited housing options due to ongoing FHA lending restrictions — at above-market prices, often on installment contracts that transfer no equity until full payment.\n\nThe mechanism is documented in the U.S. Commission on Civil Rights (1961): Agent contacts white homeowner → manufactured urgency → below-market sale → resale at premium to Black buyer on contract terms. Entire blocks transition within months. As higher-income residents depart, assessed property values fall. Municipal tax revenue declines. Cities reduce services proportionally: school funding, infrastructure maintenance, transit routes.\n\nThe Fair Housing Act of 1968 prohibits blockbusting by name. By that date, the spatial redistribution of capital — from urban cores to suburban rings — is documented across major American cities.\n\nThe demographic transition is not the cause of disinvestment. It is concurrent with it. The capital withdrawal precedes and follows the transition.',
      ticker: 'Chicago: net loss of approximately 600,000 white residents, 1950–1970. (U.S. Census Bureau)'
    },
    {
      vol: 'Vol. XCII — No. 156',
      date: 'Multiple Cities — 2010-2020',
      price: 'Digital Edition',
      hSize: 'sz-lg',
      hClass: 'alert',
      h: 'Satellite Data Reveals Urban Heat Islands',
      deck: 'Formerly redlined neighborhoods 5-12°F hotter than green-graded areas — 1930s maps predict 21st century temperatures',
      body: 'Researchers at the University of Richmond, Portland State University, and Virginia Commonwealth University publish findings from the Digital Scholarship Lab\'s "Mapping Inequality" project (2018) and subsequent peer-reviewed studies. Using satellite thermal imaging overlaid on digitized HOLC maps, the research documents a consistent pattern across 108 U.S. cities.\n\nNeighborhoods graded D in the 1930s record surface temperatures 5°F to 12°F higher than neighborhoods graded A or B in the same metropolitan areas. The temperature differential correlates with reduced tree canopy coverage, higher impervious surface ratios, and lower rates of public green infrastructure investment — all documented outcomes of decades of reduced capital flow into D-grade areas.\n\nHoffman, Shandas, and Pendleton (2020) find that 92% of formerly redlined areas exhibit higher temperatures than their green-graded counterparts. The study notes that heat-related health outcomes, including emergency department visits and mortality, are elevated in these same areas.\n\nThe 1934 HOLC grade boundaries remain spatially predictive of 21st-century temperature distributions.',
      ticker: 'Hoffman et al. (2020): 92% of formerly redlined areas record higher temperatures than green-graded counterparts.'
    },
    {
      vol: 'Vol. XCIV — No. 001',
      date: 'United States — 2024',
      price: '—',
      hSize: 'sz-xl',
      hClass: 'urgent',
      h: 'The Wealth Gap Persists',
      deck: 'Ninety years after the National Housing Act, median white family wealth is 8-10x median Black family wealth — most of the gap is home equity',
      body: 'The Federal Reserve\'s Survey of Consumer Finances (2022) documents a median white family net worth of approximately $285,000 against a median Black family net worth of approximately $44,900 — a ratio of roughly 6.4 to 1, with some analyses placing the gap at 8 to 10 times when controlling for income. The Federal Reserve Bank of Chicago (2017) attributes a substantial portion of this disparity to differential home equity accumulation beginning in the 1930s.\n\nThe three eras you are about to experience — federal grade assignment (1934), blockbusting and white flight (1960s), and urban heat island documentation (2010s–present) — are causally linked. Each era\'s outcomes are measurable in the historical record.\n\nYou are about to follow one property through those three eras: The Line (1930s), The Panic (1960s), and The Heat (present). The decisions you make reflect choices that real families faced. The consequences follow from the policy mechanisms in place at each moment.\n\nYour story begins in 1934. A federal appraiser is coming to your neighborhood.',
      ticker: null
    }
  ]
};

export const BRIEFING_CARDS = {
  'ud-resident': {
    title: "PROPERTY DEED — RESIDENTIAL SECURITY MAP GRADE",
    rows: [
      ['Property Address', '1847 MAPLE STREET'],
      ['Recorded', 'June 15, 1932'],
      ['Owner', 'THE LEGACY FAMILY'],
      ['HOLC Grade', 'D — HAZARDOUS', 'redlined'],
      ['Appraisal Note', 'Infiltration of undesirable population']
    ],
    stamp: 'Recorded 1932 · Grade Assigned 1934',
    note: 'You are the Legacy Resident — a family that has owned this property since 1932. In 1934, a federal appraiser will visit your neighborhood and assign it a Grade D designation under the Home Owners\' Loan Corporation grading system. The FHA Underwriting Manual lists racial and ethnic composition as a risk factor. The D grade will make the property ineligible for FHA-insured mortgages.\n\nIn this role, your decisions span three generations and three eras. You will follow how a federal policy decision in 1934 produces documented outcomes through the blockbusting period of the 1960s and the urban heat island research of the 2010s–2020s. Your choices reflect decisions that real families faced under the policy conditions of each era.\n\nThis is not a story about individual outcomes in isolation. It is a case study in how federal policy creates spatial patterns, and how those patterns produce measurable consequences across generations.'
  }
};

export const BRIEFING_FINALS = {
  'ud-resident': 'Your family has owned <strong>1847 Maple Street</strong> since 1932. It is June 1934. A federal appraiser is coming to your neighborhood today.'
};

// UI Text Constants
export const BRIEFING_UI_TEXT = {
  masthead: {
    name: 'The Urban Chronicle',
    byline: 'Special Report — Housing Policy Bureau'
  },
  buttons: {
    continue: 'Continue →',
    seeCard: 'See your property deed —',
    enterMission: 'Enter the mission →'
  },
  cardEyebrow: '— Official Property Record —'
};

// Property Card Structure
export const BRIEFING_CARD_TEMPLATES = {
  'ud-resident': {
    headerBand: {
      republic: 'UNITED STATES OF AMERICA',
      type: 'Property Deed & HOLC Assessment'
    },
    fields: [
      { label: 'Property Address', cssClass: 'pc-val' },
      { label: 'Date Recorded', cssClass: 'pc-val' },
      { label: 'Owner of Record', cssClass: 'pc-val' },
      { label: 'HOLC Residential Security Grade', cssClass: 'pc-val pc-grade-d' },
      { label: 'Appraiser Notes', cssClass: 'pc-val pc-notes' }
    ],
    footer: {
      issued: 'Deed Recorded: 15 Jun 1932',
      valid: 'HOLC Grade Assigned: 28 Jun 1934',
      number: 'Parcel No. 14-22-308-019'
    },
    photoLabel: 'Property',
    stamp: {
      line1: 'HOME OWNERS\'',
      line2: 'LOAN CORPORATION',
      line3: 'GRADE D · 1934'
    }
  }
};
