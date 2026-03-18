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
    narrative: `The federal appraiser stands on your porch, clipboard in hand. He explains the Home Owners' Loan Corporation grading system: A through D. Green for "best." Blue for "still desirable." Yellow for "declining." Red for "hazardous." He glances at your neighbors—their skin, their accents—and marks the map. You watch his pen move. The federal government will back one hundred twenty billion dollars in home loans over the next three decades. Less than two percent will go to non-white families. The appraiser doesn't say this. He doesn't need to. The map will speak for itself. Your block is being measured, categorized, and judged—not by the condition of the homes, but by the people who live in them. The designation will determine everything: where banks lend, where businesses invest, where the city maintains infrastructure.`,
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
        nextScene: "ud-res-scene-02"
      },
      {
        id: "ud-res-choice-01-b",
        text: "Accept the assessment quietly",
        consequences: { ud_accepted_designation: true },
        nextScene: "ud-res-scene-02"
      }
    ]
  },

  {
    id: "ud-res-scene-02",
    narrative: `The map arrives three weeks later. Your neighborhood is outlined in red ink. Grade D. "Hazardous." The letter from HOLC is polite, bureaucratic. It explains that lending institutions will use these maps to assess risk. Banks will not issue mortgages in red zones. Property values begin to drop immediately—not because the homes are deteriorating, but because the federal government has declared them worthless. Your neighbor's house, identical to yours, sits two blocks west in a yellow zone. His property value holds. Yours falls. The red line is invisible on the street, but it will shape everything: where investment flows, where businesses open, where infrastructure is maintained. The line has been drawn. It will last for generations. The spatial pattern of inequality begins here, with red ink on a federal map.`,
    apThemes: ["causation", "spatial-analysis"],
    atmosphericEffect: null,
    ambientTrack: null,
    narratorAudio: null,
    soundEffects: null,
    choices: [
      {
        id: "ud-res-choice-02-a",
        text: "Document the discrimination",
        consequences: { ud_documented_appraisal: true },
        nextScene: "ud-res-scene-03"
      },
      {
        id: "ud-res-choice-02-b",
        text: "Focus on maintaining property",
        consequences: { ud_maintained_property: true },
        nextScene: "ud-res-scene-03"
      }
    ]
  },

  {
    id: "ud-res-scene-03",
    narrative: `You gather the documents: the appraiser's notes, the HOLC map with its red boundary, the bank rejection letters. The evidence is clear—your neighborhood was not graded on housing quality, but on the race of its residents. Some neighbors want to challenge the designation. They talk about lawsuits, about appealing to city officials, about organizing. Others say it's pointless. The federal government has spoken. Banks will follow. The choice is yours: fight a system designed to exclude you, knowing the odds are long and the cost is high, or accept the reality and focus on what you can control—your family, your home, your immediate survival. Either way, the red line remains. The question is how you will live with it. The federal policy has created a spatial trap with no easy escape.`,
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
    narrative: `The real estate speculator parks outside your house. His pitch is practiced, urgent: "The neighborhood is changing. Property values are dropping fast. Sell now before it's too late." Down the block, a moving truck idles. The Johnsons are leaving. The Millers left last week. The corner grocery closed last month—the owner couldn't afford the property tax after assessments fell. The speculator offers cash, below market value, but immediate. He'll flip the house to a Black family at twice the price, profiting from both sides of the manufactured panic. This is blockbusting: exploiting racial fear for private gain. The tax base is eroding. City services will follow. The 1934 red line created the conditions. The speculator is exploiting them. Your block is emptying. The choice is yours.`,
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
    narrative: `The block empties in six months. The Johnsons' moving truck idles at the curb—sold thirty percent below market. The Millers follow two weeks later. The corner grocery sits dark, windows empty. Property tax revenue collapsed when assessments fell. The elementary school lost funding. Bus routes were cut. The speculator's strategy worked: manufactured panic, exploited on both sides. He bought low from white families fleeing integration. He sold high to Black families desperate for housing after decades of federal exclusion. Your property value dropped forty percent, not from neglect, but from the 1934 red line finally completing its work. The disinvestment is structural, not accidental. The tax base erodes. City services follow. You stand on the sidewalk, watching another moving truck load furniture. The choice is yours: stay in a neighborhood the city is abandoning, or sell at a loss and leave.`,
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
    narrative: `The block is half-empty now. The elementary school closed last month—enrollment dropped below the district minimum. The bus route was cut. The corner store sits vacant, windows dark. Your property tax bill arrives: assessed value down forty-three percent in eighteen months. Not from neglect—your home is maintained, your lawn mowed—but from the 1934 red line completing its work. The city is withdrawing services from a neighborhood it designated "hazardous" three decades ago. New families are moving in, priced out of other areas by the same federal policies that created this disinvestment. The demographic transition is not the cause of decline. It is the consequence. The speculator's offer still stands: sell at a loss and leave, or stay in a neighborhood the city has abandoned. The choice is yours.`,
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
    narrative: `You inherit the property in July. The summer heat presses down—87°F on your block. No trees. Just asphalt radiating warmth, heat shimmer rising from the pavement. Three miles west, the temperature reads 75°F. Twelve degrees cooler. You pull up the satellite data: urban heat island mapping overlaid on historical records. The pattern is unmistakable. The 1934 HOLC map overlaid on 2024 temperature data shows perfect spatial correlation. Every neighborhood graded "D" in red ink is now deep red on the thermal map. The areas that received federal investment have tree canopy, parks, green infrastructure. Your block has parking lots and cracked concrete. The federal government drew the line ninety years ago. The heat island is not natural. It is policy made visible.`,
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
    narrative: `The developer's proposal arrives: mixed-use development, walkable streets, green space, grocery co-op. The renderings show tree-lined sidewalks and shaded plazas. Everything the 1934 red line denied you. The heat would drop ten degrees. Property values would rise. But so would rents. Your neighbors—families who stayed through decades of disinvestment—would be priced out within five years. The median white family holds eight to ten times the wealth of the median Black family, a gap created by the same federal policies that made this block a heat island. The development promises environmental justice. It threatens economic displacement. You stand in 87-degree heat, reading renderings of shade you were denied for ninety years, knowing the cooling will come with eviction notices. Improvement or replacement. The choice has always been impossible.`,
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
    narrative: `The city council meeting is tonight. The developer's proposal sits on the table: mixed-use development, green infrastructure, cooling corridors. Everything the 1934 red line denied. The environmental justice advocates speak first—heat kills, they say, and the data proves it. Then the tenant organizers: cooling comes with eviction notices, they say, and history proves it. Your neighbors fill the room. Some hold temperature maps showing the 5-to-12-degree gap. Others hold rent increase notices. The choice has always been impossible: environmental justice or economic displacement. Improvement or replacement. Cooling or community. You stand to speak. Ninety years of federal policy created this moment. The question is not why the choice is impossible. The question is what you will say when it is your turn.`,
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
    epilogue: `You fought. Not everyone did. When the federal appraiser marked your block in red ink in 1934, you documented the discrimination. You gathered the evidence: the HOLC maps, the bank rejection letters, the appraisal notes that graded neighborhoods by skin color rather than housing quality. The lawsuit failed. The appeals went nowhere. The red line remained. But the documentation survived. Ninety years later, researchers used those records to prove the spatial correlation between 1930s policy and 2024 environmental inequality. Your grandmother's meticulous notes became evidence in environmental justice litigation. The temperature maps—5 to 12 degrees hotter in formerly redlined areas—matched the HOLC boundaries exactly. The lack of tree canopy, the asphalt heat islands, the unequal burden of climate change: all predicted by a 1934 map.

When the mixed-use development was proposed, you supported it. Not because gentrification is justice, but because your family had fought too long for environmental equity to accept permanent heat exposure as the price of staying. The compromise was imperfect: community land trusts to prevent displacement, green infrastructure to drop temperatures, affordable housing mandates to keep long-term residents. Some neighbors left anyway. Property values rose. The cooling came with costs.

You stand in the shade now. Twelve degrees cooler than it was five years ago. The tree canopy filters the summer sun. The grocery co-op is two blocks away. Your family stayed. Not everyone could. The federal government drew the line in 1934. You spent ninety years erasing it. The work is not finished. It never is. But the temperature has dropped. The shade exists. You fought for this.`
  },

  // COMPLICITY PATH - Accepted or benefited from discriminatory systems
  {
    id: "ud-res-outcome-complicity-path",
    survived: true,
    conditions: {
      ud_accepted_designation: true
    },
    epilogue: `You accepted the designation. The federal appraiser marked your block in red ink—Grade D, "hazardous"—and you did not question the criteria. The assessment was not based on housing quality or infrastructure condition. It was based on the race and ethnicity of your neighbors. You knew this. The appraiser's notes were explicit: "infiltration of undesirable populations," "adverse influences," "threat to property values." The language was bureaucratic, but the meaning was clear. You accepted it quietly.

The consequences unfolded over decades. Banks refused mortgages in red zones. Property values dropped forty percent in eighteen months, not from neglect but from federal policy. The tax base eroded. City services were cut. The elementary school closed. Bus routes were eliminated. Investment flowed to green-graded neighborhoods three miles west—neighborhoods identical to yours except for the demographics. The 1934 map created a self-fulfilling prophecy: areas designated "hazardous" became hazardous because the designation ensured disinvestment.

By the 1960s, blockbusting speculators exploited the manufactured decline. By 2024, satellite data showed your block was 5 to 12 degrees hotter than formerly green-graded areas. No tree canopy. No parks. Just asphalt and heat. The federal government drew the line. You accepted it. The acceptance was not neutral. It was complicity in a system that required silence to function. The red line remained for ninety years. You never challenged it. The heat island exists because the designation was never contested. You survived. The neighborhood did not.`
  },

  {
    id: "ud-res-outcome-complicity-sold",
    survived: true,
    conditions: {
      ud_sold_to_speculator: true
    },
    epilogue: `You sold. The pressure was real. The speculator's offer was thirty percent below market value, but it was cash, immediate, certain. Your neighbors were leaving. The Johnsons sold two weeks earlier. The Millers followed. The corner grocery closed—property tax revenue collapsed when assessments fell. The elementary school was losing enrollment. Bus routes were being cut. The 1934 red line had done its work: three decades of disinvestment created the conditions for manufactured panic. The speculator exploited what federal policy had engineered.

The economic pressure was genuine. Your property value had dropped forty percent in eighteen months, not from neglect but from systematic withdrawal of city services and bank lending. Staying meant watching your largest asset erode further. The choice felt rational. Survival, not ideology. But the aggregate effect was catastrophic. Each sale accelerated the next. The tax base collapsed. Services disappeared. The speculator flipped your house to a Black family at twice what he paid you, profiting from both sides of the racial divide. This was blockbusting: private gain extracted from public policy.

You moved three miles west to a neighborhood graded "B" in 1934—green on the HOLC map. Tree-lined streets. Funded schools. Stable property values. The federal government had created two cities within one. You crossed the invisible line. Your family accumulated wealth. The neighborhood you left became a heat island: 5 to 12 degrees hotter by 2024, no tree canopy, just asphalt and consequences. The pressure was real. The choice was yours. The pattern was white flight. You survived. The system required your participation to function. You provided it.`
  },

  // ADAPTATION PATH - Focused on survival and adaptation
  {
    id: "ud-res-outcome-adaptation-path",
    survived: true,
    conditions: {
      ud_stayed_through_transition: true,
      ud_measured_heat_island: true
    },
    epilogue: `You stayed. Most families did. When the real estate speculator arrived in the 1960s with his manufactured panic and below-market offers, you refused. Not from ideology, but from necessity. You had nowhere else to go. The federal government had drawn red lines around every neighborhood that would accept you. The choice was not between staying and leaving. It was between staying here and staying somewhere identical three blocks away. So you stayed. You watched the Johnsons leave. You watched the Millers follow. You watched the corner grocery close when property tax revenue collapsed. You watched the elementary school lose funding. You adapted because adaptation was survival.

The block changed. New families moved in—families who had been excluded from other neighborhoods by the same federal policies that created your disinvestment. The demographic transition was not the cause of decline. It was the consequence of a 1934 map that designated your block "hazardous" based on the race of its residents. You understood this. You documented it. When your grandchild inherited the property decades later, you handed them the records: the HOLC maps, the bank rejection letters, the temperature data showing your block was 5 to 12 degrees hotter than formerly green-graded areas three miles west. The documentation became evidence. Researchers used it to prove spatial correlation between 1930s policy and 2024 environmental inequality.

You survived. Your family persisted. The community endured. But the burden was yours to carry. The federal government drew the line. The city withdrew services. You stayed through it all. The resilience was real. So was the cost. You stand in 87-degree heat now, no shade, no trees, just asphalt and consequences. You documented the injustice. You could not prevent it. Adaptation was not acceptance. It was survival. You are still here.`
  },

  // DEFAULT CATCH-ALL OUTCOME - CRITICAL: Must be last in array
  {
    id: "ud-res-outcome-adaptation-default",
    survived: true,
    conditions: {},
    epilogue: `You adapted. Most families did. The federal government drew the lines in 1934—red ink on a map designating your neighborhood "hazardous" based not on housing quality but on the race of its residents. The line determined everything that followed: where banks would lend, where businesses would invest, where the city would maintain infrastructure. You could not change the line. You could only live with its consequences.

The adaptation took many forms. When property values dropped forty percent in the 1960s, you maintained your home anyway. When the elementary school closed and bus routes were cut, you found other ways to get your children educated. When the corner grocery shut down because the tax base collapsed, you traveled farther for food. When summer temperatures climbed to 87°F while tree-lined neighborhoods three miles west stayed at 75°F, you bought fans and closed the curtains. Adaptation was not acceptance. It was survival.

By 2024, researchers overlaid the 1934 HOLC map on satellite temperature data. The correlation was perfect: every neighborhood graded "D" in red ink was now deep red on the thermal map, 5 to 12 degrees hotter than formerly green-graded areas. The lack of tree canopy, the asphalt heat islands, the unequal burden of climate change—all predicted by a ninety-year-old map. Your family's story became data in environmental justice studies. The adaptation was documented. The injustice was proven. The line remained.

You survived. Your community persisted. The resilience was real. So was the cost. The federal government drew the line. You spent ninety years living with it. Adaptation was the most common response to systemic policy. It was also the most exhausting. You are still here. The heat is still here. The line is still here.`
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
