/**
 * Urban Design Mission - The Legacy Resident Role
 *
 * Historical Context:
 * - Follow one property and family through 90 years of urban policy
 * - 1934-1950s: Federal redlining creates spatial inequality
 * - 1960s: Blockbusting and white flight accelerate disinvestment
 * - Modern: Heat islands and gentrification reveal lasting consequences
 * - Mission demonstrates how 1930s policy created 2024 environmental inequality
 *
 * BRANCHING STRUCTURE:
 * - Equity Path: Fought redlining, supported fair housing, resisted blockbusting
 * - Complicity Path: Accepted designation, didn't resist, prioritized property value
 * - Adaptation Path: Focused on survival, adapted to changing neighborhood
 *
 * Requirements: US-1, US-2, US-3, US-4
 */

const udResidentScenes = [
  // ERA 1: THE LINE (1930s Redlining)
  {
    id: "ud-res-scene-01",
    narrative: `The federal appraiser stands on your porch, clipboard in hand. He explains the Home Owners' Loan Corporation grading system: A through D. Green for "best." Blue for "still desirable." Yellow for "declining." Red for "hazardous." The FHA Underwriting Manual lists racial composition as a risk factor. He records the demographics of your block. You watch his pen move. Between 1934 and 1962, the federal government will back approximately $120 billion in home loans. According to the National Commission on Urban Problems (1968), less than 2% will go to non-white families. The appraiser records what he observes. The grade will determine where banks lend, where businesses invest, where the city allocates infrastructure maintenance. The assessment criteria are in the manual. The manual is federal policy.`,
    apThemes: ["causation", "spatial-analysis"],
    atmosphericEffect: null,
    ambientTrack: null,
    narratorAudio: null,
    soundEffects: null,
    choices: [
      {
        id: "ud-res-choice-01-a",
        text: "Question the grading criteria",
        consequences: { ud_questioned_appraisal: true },
        nextScene: "ud-res-scene-02a"
      },
      {
        id: "ud-res-choice-01-b",
        text: "Accept the assessment quietly",
        consequences: { ud_accepted_designation: true },
        nextScene: "ud-res-scene-02b"
      }
    ]
  },

  {
    id: "ud-res-scene-02a",
    narrative: `The appraiser pauses when you ask about the criteria. He opens the HOLC Underwriting Manual — dense government language, but the factors are listed plainly: physical condition of the housing stock, proximity to industrial zones, income levels, and "racial and ethnic composition of the neighborhood." He does not defend it. He points to the column where your block's demographics were recorded. You ask him to write down the criteria. He does.

Three weeks later, the map arrives. Your neighborhood is outlined in red ink. Grade D. "Hazardous." You challenged the process. The appraiser heard you. He filled out the form exactly the same way. The criteria are not a mistake or an oversight. They are the policy.

Banks will not issue FHA-insured mortgages in D-grade zones. Property assessments begin to fall — not because housing conditions have changed, but because the federal designation has removed the primary mechanism of capital access. Your neighbor two blocks west, in a C-grade zone, watches his assessed value hold. Yours declines. You have the appraiser's notes in your hand. The grade boundary is not marked on the street, but you know exactly where it falls and why.`,
    apThemes: ["causation", "spatial-analysis"],
    atmosphericEffect: null,
    ambientTrack: null,
    narratorAudio: null,
    soundEffects: null,
    choices: [
      {
        id: "ud-res-choice-02a-a",
        text: "Document the discrimination — record the criteria in writing",
        consequences: { ud_documented_appraisal: true },
        nextScene: "ud-res-scene-03"
      },
      {
        id: "ud-res-choice-02a-b",
        text: "Focus on maintaining the property despite the designation",
        consequences: { ud_maintained_property: true },
        nextScene: "ud-res-scene-03"
      }
    ]
  },

  {
    id: "ud-res-scene-02b",
    narrative: `The map arrives three weeks later. Your neighborhood is outlined in red ink. Grade D. "Hazardous." The letter from HOLC is bureaucratic in tone. It states that lending institutions will reference these maps to assess mortgage risk. Banks will not issue FHA-insured mortgages in D-grade zones. Property assessments begin to fall — not because housing conditions have changed, but because the federal designation has removed the primary mechanism of capital access. Your neighbor's house, structurally identical to yours, sits two blocks west in a C-grade zone. His assessed value holds. Yours declines. The grade boundary is not marked on the street, but it determines where investment flows, where businesses locate, where the city schedules infrastructure maintenance. The HOLC map is now on file with lending institutions across the city.`,
    apThemes: ["causation", "spatial-analysis"],
    atmosphericEffect: null,
    ambientTrack: null,
    narratorAudio: null,
    soundEffects: null,
    choices: [
      {
        id: "ud-res-choice-02b-a",
        text: "Document the discrimination",
        consequences: { ud_documented_appraisal: true },
        nextScene: "ud-res-scene-03"
      },
      {
        id: "ud-res-choice-02b-b",
        text: "Focus on maintaining property",
        consequences: { ud_maintained_property: true },
        nextScene: "ud-res-scene-03"
      }
    ]
  },

  {
    id: "ud-res-scene-03",
    narrative: `You gather the documents: the appraiser's notes, the HOLC map with its D-grade boundary, the bank rejection letters. The appraisal criteria are explicit in the HOLC manual — racial and ethnic composition is listed as a factor in neighborhood grading. The assessment was not based on housing condition or infrastructure quality. Some neighbors want to challenge the designation through legal channels or appeals to city officials. Others note that the federal government issued the grade and banks are following it — the administrative pathway for appeal is not defined in the HOLC documentation. The choice is yours: pursue a challenge through available channels, knowing the legal framework for contesting federal lending criteria does not yet exist, or focus resources on maintaining the property and household stability. The D-grade designation remains on file either way. The question is how you allocate your time and resources in response to it.`,
    apThemes: ["causation", "perspective"],
    atmosphericEffect: null,
    ambientTrack: null,
    narratorAudio: null,
    soundEffects: null,
    choices: [
      {
        id: "ud-res-choice-03-a",
        text: "Challenge the designation",
        consequences: { ud_fought_redlining: true },
        nextScene: "ud-res-scene-04"
      },
      {
        id: "ud-res-choice-03-b",
        text: "Accept and adapt",
        consequences: { ud_accepted_situation: true },
        nextScene: "ud-res-scene-04"
      }
    ]
  },

  // ERA 2: THE PANIC (1960s Blockbusting/White Flight)
  {
    id: "ud-res-scene-04",
    narrative: `The real estate agent parks outside your house. His approach is documented in the U.S. Commission on Civil Rights (1961) as blockbusting: contact white homeowners, warn that Black families are moving in, predict property value decline, offer immediate cash purchase at below-market price. Down the block, a moving truck idles. The Johnsons are leaving. The Millers left last week. The corner grocery closed — the owner could not sustain operations after assessed values fell and the tax base contracted. The agent offers cash, below market value, immediate. He will resell to a Black family at above-market price on an installment contract — a land contract that transfers no equity until full payment. He profits from both transactions. The tax base is contracting. City services will follow the revenue. The D-grade designation created the conditions for capital withdrawal. The agent is operating within them. Your block is transitioning. The choice is yours.`,
    apThemes: ["causation", "spatial-analysis"],
    atmosphericEffect: null,
    ambientTrack: null,
    narratorAudio: null,
    soundEffects: null,
    choices: [
      {
        id: "ud-res-choice-04-a",
        text: "Refuse to sell to speculator",
        consequences: { ud_refused_speculator: true },
        nextScene: "aftermath"
      },
      {
        id: "ud-res-choice-04-b",
        text: "Consider the speculator's offer",
        consequences: { ud_considered_offer: true },
        nextScene: "aftermath"
      },
      {
        id: "ud-res-choice-04-c",
        text: "Organize neighbors to resist",
        consequences: { ud_organized_resistance: true },
        nextScene: "aftermath"
      }
    ]
  },

  {
    id: "ud-res-scene-05",
    narrative: `The block transitions in six months. The Johnsons' moving truck idles at the curb — sold thirty percent below assessed value. The Millers follow two weeks later. The corner grocery sits vacant. Property tax revenue declined when assessments fell. The elementary school lost per-pupil funding. Bus routes were cut when ridership dropped below the district threshold. The agent's method is documented: manufactured urgency, below-market purchase from white homeowners, above-market resale to Black families on installment contracts. He extracted profit from both sides of the transaction. Your property assessment dropped forty percent in eighteen months — not from deferred maintenance, but from the withdrawal of FHA-insured lending that the 1934 D-grade designation had already set in motion. The disinvestment follows the grade boundary. You stand on the sidewalk, watching another moving truck load furniture. The choice is yours: remain in a neighborhood the city is reducing services to, or sell at a loss and relocate.`,
    apThemes: ["causation", "spatial-analysis"],
    atmosphericEffect: null,
    ambientTrack: null,
    narratorAudio: null,
    soundEffects: null,
    choices: [
      {
        id: "ud-res-choice-05-a",
        text: "Stay and resist blockbusting",
        consequences: { ud_resisted_blockbusting: true, ud_stayed_through_transition: true },
        nextScene: "ud-res-scene-06"
      },
      {
        id: "ud-res-choice-05-b",
        text: "Sell to speculator at low price",
        consequences: { ud_sold_to_speculator: true },
        nextScene: "ud-res-scene-06"
      }
    ]
  },

  {
    id: "ud-res-scene-06",
    narrative: `The block is half-empty now. The elementary school closed last month — enrollment fell below the district minimum. The bus route was cut. The corner store sits vacant. Your property tax bill arrives: assessed value down forty-three percent in eighteen months. The housing stock has not deteriorated — your home is maintained — but the D-grade designation removed FHA-insured lending from the area three decades ago, and assessed values track capital access. The city allocates infrastructure maintenance budgets proportionally to tax revenue. New families are moving in, directed here by the same lending restrictions that limited their options elsewhere. The demographic transition is a consequence of the capital withdrawal, not its cause. The agent's offer remains open: sell at a loss and relocate, or remain in a neighborhood with declining municipal services. The choice is yours.`,
    apThemes: ["spatial-analysis", "continuity"],
    atmosphericEffect: null,
    ambientTrack: null,
    narratorAudio: null,
    soundEffects: null,
    choices: [
      {
        id: "ud-res-choice-06-a",
        text: "Stay through the transition",
        consequences: { ud_stayed_through_transition: true },
        nextScene: "ud-res-scene-07"
      },
      {
        id: "ud-res-choice-06-b",
        text: "Leave the neighborhood",
        consequences: { ud_left_neighborhood: true },
        nextScene: "ud-res-scene-07"
      }
    ]
  },

  // ERA 3: THE HEAT (Modern Heat Island/Gentrification)
  {
    id: "ud-res-scene-07",
    narrative: `You inherit the property in July. The surface temperature on your block reads 87°F. No tree canopy. Asphalt and concrete absorb and re-radiate heat through the evening. Three miles west, the temperature reads 75°F. Twelve degrees difference. You pull up the research: Hoffman, Shandas, and Pendleton (2020) overlaid HOLC Residential Security Maps on satellite thermal imaging across 108 U.S. cities. The spatial correlation is documented: neighborhoods graded D in the 1930s record surface temperatures 5°F to 12°F higher than neighborhoods graded A or B in the same metropolitan areas. The mechanism is reduced tree canopy coverage and higher impervious surface ratios — both outcomes of decades of reduced public and private investment in D-grade areas. The 1934 grade boundary and the 2024 temperature boundary occupy the same coordinates.`,
    apThemes: ["human-environment-interaction", "spatial-analysis"],
    atmosphericEffect: "warning-glow",
    ambientTrack: null,
    narratorAudio: null,
    soundEffects: null,
    choices: [
      {
        id: "ud-res-choice-07-a",
        text: "Measure and document heat island",
        consequences: { ud_measured_heat_island: true },
        nextScene: "ud-res-scene-08"
      },
      {
        id: "ud-res-choice-07-b",
        text: "Advocate for environmental justice",
        consequences: { ud_advocated_environmental_justice: true },
        nextScene: "ud-res-scene-08"
      }
    ]
  },

  {
    id: "ud-res-scene-08",
    narrative: `The developer's proposal arrives: mixed-use development, walkable streets, green infrastructure, grocery co-op. The renderings show tree-lined sidewalks and shaded plazas. The projected temperature reduction is 8 to 10 degrees, consistent with studies on urban greening interventions. Property values in comparable mixed-use developments have risen 15 to 30 percent within five years of completion, according to Urban Land Institute data. Rising assessed values will increase property taxes and market rents. Families who remained through decades of reduced municipal services — because lending restrictions and below-market sale pressure left them with limited alternatives — will face displacement pressure as the area becomes more attractive to higher-income residents. The Federal Reserve Bank of Chicago (2017) documents that the racial wealth gap is primarily attributable to differential home equity accumulation. The development addresses the environmental outcome of the 1934 grade designation. It does not address the wealth gap that designation produced. You stand in 87-degree heat, reading the proposal.`,
    apThemes: ["comparison", "spatial-analysis"],
    atmosphericEffect: "warning-glow",
    ambientTrack: null,
    narratorAudio: null,
    soundEffects: null,
    choices: [
      {
        id: "ud-res-choice-08-a",
        text: "Support mixed-use development",
        consequences: { ud_supported_mixed_use: true },
        nextScene: "ud-res-scene-09"
      },
      {
        id: "ud-res-choice-08-b",
        text: "Resist gentrification pressures",
        consequences: { ud_resisted_gentrification: true },
        nextScene: "ud-res-scene-09"
      }
    ]
  },

  {
    id: "ud-res-scene-09",
    narrative: `The city council meeting is tonight. The developer's proposal is on the agenda: mixed-use development, green infrastructure, cooling corridors. Environmental health researchers present temperature data — the 5-to-12-degree differential between formerly D-grade and A-grade areas, documented across 108 cities. Tenant organizers present displacement data — rent increases of 20 to 40 percent in comparable mixed-use developments within five years, documented by the National Low Income Housing Coalition. Your neighbors fill the room. Some hold thermal maps. Others hold rent increase notices from adjacent neighborhoods where similar development has already occurred. The policy mechanisms that created this situation — the 1934 HOLC grade, the FHA underwriting criteria, the blockbusting of the 1960s, the decades of reduced municipal services — are documented in the historical record. The question before the council is what policy mechanisms address the outcomes without replicating the displacement pattern. You stand to speak.`,
    apThemes: ["causation", "perspective"],
    atmosphericEffect: "warning-glow",
    ambientTrack: null,
    narratorAudio: null,
    soundEffects: null,
    choices: [
      {
        id: "ud-res-choice-09-a",
        text: "Support sustainable development",
        consequences: { ud_supported_sustainability: true },
        nextScene: "outcome"
      },
      {
        id: "ud-res-choice-09-b",
        text: "Resist displacement",
        consequences: { ud_resisted_displacement: true },
        nextScene: "outcome"
      },
      {
        id: "ud-res-choice-09-c",
        text: "Document the injustice",
        consequences: { ud_documented_injustice: true },
        nextScene: "outcome"
      }
    ]
  }
];

const udResidentOutcomes = [
  // EQUITY PATH - Fought injustice at multiple stages
  {
    id: "ud-res-outcome-equity-path",
    survived: true,
    conditions: {
      ud_fought_redlining: true,
      ud_supported_mixed_use: true
    },
    epilogue: `You challenged the designation. When the federal appraiser marked your block D in 1934, you documented the criteria: the HOLC manual listed racial composition as a risk factor. You gathered the appraisal notes, the bank rejection letters, the grade boundary maps. The legal framework for contesting federal lending criteria did not exist in 1934. The challenge went nowhere through official channels. But the documentation survived.

Ninety years later, researchers at the University of Richmond's Digital Scholarship Lab used digitized HOLC maps to demonstrate spatial correlation between 1930s grade boundaries and 2024 temperature distributions. Your family's records — the appraisal notes, the rejection letters, the boundary maps — became part of the evidentiary record in environmental justice litigation. Hoffman, Shandas, and Pendleton (2020) documented that 92% of formerly D-grade areas record higher surface temperatures than A-grade areas in the same cities. The mechanism: reduced tree canopy and higher impervious surface ratios resulting from decades of reduced capital investment.

When the mixed-use development was proposed, you supported it with conditions: community land trusts to limit displacement, affordable housing mandates, green infrastructure phased to minimize rent pressure. The negotiation was documented in city council records. Some conditions were accepted. Some were not. Some neighbors were displaced anyway as adjacent property values rose. The outcome was partial.

The surface temperature on your block has dropped eight degrees over five years. Tree canopy coverage has increased. The grocery co-op is two blocks away. Your family retained the property. The Federal Reserve Bank of Chicago (2017) estimates that the racial wealth gap is primarily attributable to differential home equity accumulation beginning in the 1930s. Your family's equity, maintained through ninety years of D-grade designation, is documented in the deed records. The work of contesting the designation's consequences is ongoing.`
  },

  // COMPLICITY PATH - Accepted or benefited from discriminatory systems
  {
    id: "ud-res-outcome-complicity-path",
    survived: true,
    conditions: {
      ud_accepted_designation: true
    },
    epilogue: `You did not contest the designation. The federal appraiser marked your block D in 1934 — Grade D, "Hazardous" — and you did not request the criteria or document the assessment methodology. The HOLC manual listed racial and ethnic composition as a risk factor. The appraisal was not based on housing condition or infrastructure quality. The designation was recorded without challenge.

The consequences followed the documented pattern. FHA-insured lending was unavailable in D-grade zones. Property assessments declined as capital access was removed. The tax base contracted. Municipal services were reduced proportionally: school funding, infrastructure maintenance, transit routes. Investment flowed to A- and B-grade neighborhoods. The National Commission on Urban Problems (1968) later documented that less than 2% of $120 billion in federally backed home loans between 1934 and 1962 went to non-white families. Your neighborhood's D-grade designation was part of that pattern.

By the 1960s, blockbusting agents operated in the area, exploiting the capital withdrawal the 1934 designation had set in motion. By 2024, Hoffman, Shandas, and Pendleton documented that your block recorded surface temperatures 5 to 12 degrees higher than formerly A-grade areas in the same city. Reduced tree canopy. Higher impervious surface ratios. Lower rates of public green infrastructure investment. All outcomes of the reduced capital flow that followed the 1934 grade.

The designation was not contested. The consequences accumulated over ninety years. The spatial pattern of disinvestment is documented in the historical record.`
  },

  {
    id: "ud-res-outcome-complicity-sold",
    survived: true,
    conditions: {
      ud_sold_to_speculator: true
    },
    epilogue: `You sold. The agent offered thirty percent below assessed value — cash, immediate. Your neighbors had already sold. The Johnsons two weeks earlier. The Millers the week after. The corner grocery had closed when property tax revenue fell below operating viability. The elementary school was losing enrollment. Bus routes were being cut as ridership declined. The 1934 D-grade designation had removed FHA-insured lending from the area, which reduced assessed values, which contracted the tax base, which reduced municipal services. The agent was operating in conditions that federal policy had created over three decades.

The economic pressure was documented and real. Your property assessment had declined forty percent in eighteen months, not from deferred maintenance but from the removal of capital access. Remaining meant holding a depreciating asset in an area with declining services. The decision to sell was a response to documented economic conditions, not an isolated choice.

The aggregate effect is also documented. Each sale accelerated the next. The agent purchased below market from white homeowners and resold above market to Black families on installment contracts — land contracts that transferred no equity until full payment. The U.S. Commission on Civil Rights (1961) documented this practice across multiple cities. The agent extracted profit from both sides of the transaction.

You relocated to a neighborhood graded B in 1934. Tree canopy. Funded schools. Stable assessed values. The Federal Reserve Bank of Chicago (2017) documents that differential home equity accumulation beginning in this period is the primary driver of the current racial wealth gap. Your family accumulated equity in a B-grade neighborhood. The neighborhood you sold recorded surface temperatures 5 to 12 degrees higher by 2024, per Hoffman et al. (2020). The blockbusting mechanism required sellers. The pattern required participation to function at scale.`
  },

  // ADAPTATION PATH - Focused on survival and adaptation
  {
    id: "ud-res-outcome-adaptation-path",
    survived: true,
    conditions: {
      ud_stayed_through_transition: true,
      ud_measured_heat_island: true
    },
    epilogue: `You remained. When the blockbusting agent arrived in the 1960s with below-market offers, you declined. The decision was constrained: FHA lending restrictions limited your options in other neighborhoods. The choice was not between staying and relocating to a better area. It was between staying here and relocating to another D-grade area. You stayed. You watched the Johnsons sell. The Millers follow. The corner grocery close when tax revenue fell below operating viability. The elementary school lose per-pupil funding. You adapted because the alternatives were equivalent or worse.

The block transitioned. New families moved in — families directed here by the same FHA lending restrictions that had limited your options. The demographic transition was concurrent with the capital withdrawal, not its cause. The D-grade designation had removed lending access in 1934. The tax base had been contracting since then. The transition accelerated what was already in motion.

When you inherited the property, you documented the heat island data. Hoffman, Shandas, and Pendleton (2020) overlaid HOLC maps on satellite thermal imaging across 108 cities. Your block's temperature differential — 12 degrees above the formerly A-grade area three miles west — matched the grade boundary exactly. You submitted the documentation to the city's environmental justice office. The data was incorporated into the municipal heat mitigation plan. Researchers cited the records in peer-reviewed studies.

The Federal Reserve Bank of Chicago (2017) estimates that differential home equity accumulation beginning in the 1930s is the primary driver of the current racial wealth gap. Your family retained the property through ninety years of D-grade designation. The equity is documented in the deed records. The surface temperature on your block remains elevated. The documentation is in the public record.`
  },

  // DEFAULT CATCH-ALL OUTCOME - CRITICAL: Must be last in array
  {
    id: "ud-res-outcome-adaptation-default",
    survived: true,
    conditions: {},
    epilogue: `You adapted. The federal appraiser marked your block D in 1934 — Grade D, "Hazardous" — based on criteria that included racial and ethnic composition of the neighborhood. The designation determined where FHA-insured lending would flow, where businesses would locate, where the city would allocate infrastructure maintenance budgets. You could not change the designation through available channels. You responded to its consequences.

The adaptation took documented forms. When property assessments declined forty percent in the 1960s, you maintained the housing stock. When the elementary school closed and bus routes were cut as tax revenue contracted, you found alternative arrangements. When the corner grocery closed, you traveled farther for food. When summer surface temperatures reached 87°F while tree-lined neighborhoods three miles west recorded 75°F, you managed the heat differential with available resources. The adaptation was a response to policy outcomes, not a choice made in neutral conditions.

By 2024, Hoffman, Shandas, and Pendleton documented that 92% of formerly D-grade areas record higher surface temperatures than A-grade areas in the same cities. The mechanism: reduced tree canopy and higher impervious surface ratios resulting from decades of reduced capital investment. Your family's experience is part of the dataset. The Federal Reserve Bank of Chicago (2017) estimates that differential home equity accumulation beginning in the 1930s is the primary driver of the current racial wealth gap. Your family's property, held through ninety years of D-grade designation, is part of that record.

You remained. The property is in the deed records. The temperature differential is in the research literature. The policy mechanisms that produced both are documented in the historical record.`
  }
];

// Export role data
export default {
  id: 'ud-resident',
  name: 'The Legacy Resident',
  description: 'Follow one property and family through 90 years of urban policy',
  scenes: udResidentScenes,
  outcomes: udResidentOutcomes
};
