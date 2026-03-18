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
      body: 'President Roosevelt signed the National Housing Act today, creating the Federal Housing Administration. The FHA will insure private mortgages — but only in neighborhoods the Home Owners\' Loan Corporation, created last year, has graded acceptable.\n\nTo assess risk, HOLC appraisers grade neighborhoods A through D. Grade A areas receive green on the map — "best" neighborhoods for investment. Grade D areas receive red — "hazardous" for lending. The criteria include racial composition. Black neighborhoods automatically receive D grades.\n\nBanks use these maps to deny mortgages. The federal government distributed $120 billion in home loans between 1934 and 1962. Less than 2% went to non-white families. This single policy creates the mortgage gap that will compound for ninety years.\n\nThe maps are drawn in ink. The consequences are permanent.',
      ticker: 'HOLC Residential Security Maps will remain in use by banks until 1968.'
    },
    {
      vol: 'Vol. XLII — No. 187',
      date: 'Washington, D.C. — June 22, 1944',
      price: 'Ten cents',
      hSize: 'sz-lg',
      hClass: '',
      h: 'GI Bill Offers Home Loans to Veterans',
      deck: 'Servicemen\'s Readjustment Act provides mortgage assistance — but local banks and realtors control access',
      body: 'The GI Bill offers low-interest home loans to returning World War II veterans. Sixteen million veterans are eligible. The program will create the American middle class — for those who can access it.\n\nLocal banks and realtors control loan approval. Black veterans are systematically denied access to suburban housing. White veterans buy homes in Levittown and similar suburbs. Black veterans are steered to redlined urban areas where property values are already declining.\n\nHome equity becomes the primary wealth-building tool for white families. Black families are locked out. The wealth gap begins here: not from income differences, but from asset accumulation denied by federal policy and local practice.\n\nThe suburbs are built. The cities are left behind.',
      ticker: 'By 1960, suburban homeownership rate: 60% white families, 38% Black families.'
    },
    {
      vol: 'Vol. LXI — No. 203',
      date: 'Chicago, Illinois — 1960s',
      price: 'Fifteen cents',
      hSize: 'sz-lg',
      hClass: 'alert',
      h: 'Blockbusting Accelerates White Flight',
      deck: 'Real estate speculators exploit racial fear — neighborhoods transition in months as property values collapse',
      body: 'A new practice emerges in transitioning neighborhoods: blockbusting. Real estate speculators target white homeowners with warnings that Black families are moving in and property values will collapse. Panicked homeowners sell at below-market prices. Speculators resell to Black families at inflated prices with predatory contract terms.\n\nThe cycle is systematic: Agent → Fear → Sell-off → Decline. Entire neighborhoods transition in months. As white residents leave, tax bases erode. Cities cut services. Schools lose funding. Infrastructure deteriorates. The prophecy becomes self-fulfilling.\n\nThe Fair Housing Act of 1968 will outlaw this practice. But by then, the damage is done. The spatial pattern is set. White families have accumulated equity in appreciating suburban homes. Black families hold depreciating properties in disinvested urban areas.\n\nThe divided city is not an accident. It is an architecture.',
      ticker: 'Chicago loses 600,000 white residents between 1950 and 1970 — "White Flight."'
    },
    {
      vol: 'Vol. XCII — No. 156',
      date: 'Multiple Cities — 2010-2020',
      price: 'Digital Edition',
      hSize: 'sz-lg',
      hClass: 'alert',
      h: 'Satellite Data Reveals Urban Heat Islands',
      deck: 'Formerly redlined neighborhoods 5-12°F hotter than green-graded areas — 1930s maps predict 21st century temperatures',
      body: 'Environmental justice researchers map urban heat islands using satellite thermal imaging. The pattern is unmistakable: formerly redlined neighborhoods are significantly hotter than areas graded "A" or "B" in the 1930s.\n\nThe temperature delta ranges from 5°F to 12°F. The cause is clear: decades of disinvestment meant fewer trees, more asphalt, less green space. The 1934 HOLC maps predicted 2024 temperatures. Federal policy created environmental inequality that persists ninety years later.\n\nHeat is not just discomfort. It is a health crisis. Higher rates of heat-related illness. Higher cooling costs for families with less wealth. Lower property values in already-devalued areas. The cycle compounds.\n\nThe line drawn in 1934 is still visible from space.',
      ticker: 'Study: 92% of formerly redlined areas are hotter than their green-graded counterparts.'
    },
    {
      vol: 'Vol. XCIV — No. 001',
      date: 'United States — 2024',
      price: '—',
      hSize: 'sz-xl',
      hClass: 'urgent',
      h: 'The Wealth Gap Persists',
      deck: 'Ninety years after the National Housing Act, median white family wealth is 8-10x median Black family wealth — most of the gap is home equity',
      body: 'Ninety years after the Home Owners\' Loan Corporation drew its first redlining maps, the median white family holds eight to ten times the wealth of the median Black family. Most of that gap is home equity — denied in 1934, compounded over three generations.\n\nThe divided city remains divided. The question is no longer why. The question is what comes next.\n\nYou are about to experience one property\'s journey through three eras: The Line (1930s redlining), The Panic (1960s blockbusting), and The Heat (modern environmental justice). Your choices will determine whether the cycle continues or breaks.\n\nThe federal government drew the lines. Real estate speculators exploited them. The consequences are measured in degrees Fahrenheit and dollars of wealth denied.\n\nYour story begins in 1934. A federal appraiser is coming to your neighborhood.',
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
    note: 'You are the Legacy Resident — a family that has owned this property since 1932. In 1934, a federal appraiser will visit your neighborhood and assign it a "D" grade: red on the map, hazardous for lending. This designation will follow your property for ninety years.\n\nIn this role, your decisions span three generations and three eras. You will experience how a single federal policy decision in 1934 creates consequences that compound through blockbusting in the 1960s and environmental injustice in 2024. Your choices will determine whether you fight the designation, adapt to it, or become complicit in the systems it creates.\n\nThis is not a story about individual failure. This is a story about structural inequality — how policy creates geography, and geography creates destiny.'
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
