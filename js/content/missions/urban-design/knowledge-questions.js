/**
 * Urban Design Mission - Knowledge Checkpoint Questions
 *
 * 5 questions total: all for ud-resident role
 * Each question tests AP Human Geography reasoning skills
 * Questions are grounded in role experience and historically accurate
 *
 * APHG Theme 6.10: Urban Sustainability and Environmental Justice
 */

export default [
  // Question 1: Redlining Definition and Mechanism
  {
    id: "ud-kq-res-01",
    roleSpecific: "ud-resident",
    apSkill: "causation",
    question: "What was redlining and how did it function as a mechanism of systemic discrimination in American cities?",
    options: [
      { 
        id: 'a', 
        text: "A practice where real estate agents drew red lines on maps to mark property boundaries between different ethnic neighborhoods", 
        correct: false 
      },
      { 
        id: 'b', 
        text: "A federal policy where the Home Owners' Loan Corporation graded neighborhoods A through D based on 'risk,' with Black neighborhoods receiving 'D' grades that resulted in systematic mortgage denial", 
        correct: true 
      },
      { 
        id: 'c', 
        text: "A local zoning law that prohibited construction of certain building types in residential areas marked with red ink on city planning maps", 
        correct: false 
      },
      { 
        id: 'd', 
        text: "An informal agreement among white homeowners to refuse to sell properties to Black buyers in neighborhoods outlined in red", 
        correct: false 
      }
    ],
    explanation: "Redlining was a federal policy created by the Home Owners' Loan Corporation (HOLC) in 1934. HOLC appraisers graded neighborhoods using a color-coded system: A (green) for 'best,' B (blue) for 'still desirable,' C (yellow) for 'declining,' and D (red) for 'hazardous.' Black neighborhoods systematically received 'D' grades regardless of actual housing quality or economic conditions. Banks used these maps to deny mortgages, creating the mortgage gap: between 1934 and 1962, the federal government backed $120 billion in home loans, but less than 2% went to non-white families. This policy prevented wealth accumulation through home equity for generations. APHG Concept: This demonstrates causation in urban geography—how a single federal policy decision created spatial patterns of inequality that persist 90 years later, affecting property values, tax bases, infrastructure investment, and even modern temperature distributions through the urban heat island effect."
  },

  // Question 2: Redlining vs. Blockbusting Difference
  {
    id: "ud-kq-res-02",
    roleSpecific: "ud-resident",
    apSkill: "comparison",
    question: "How did blockbusting differ from redlining as a mechanism of neighborhood change in American cities?",
    options: [
      { 
        id: 'a', 
        text: "Redlining was a local practice by individual banks, while blockbusting was a federal policy enforced by the government", 
        correct: false 
      },
      { 
        id: 'b', 
        text: "Redlining prevented Black families from entering white neighborhoods through mortgage denial, while blockbusting exploited white racial fears to induce panic-selling, allowing speculators to profit from rapid neighborhood turnover", 
        correct: true 
      },
      { 
        id: 'c', 
        text: "Redlining encouraged racial integration by offering lower interest rates in diverse neighborhoods, while blockbusting segregated neighborhoods by building physical barriers", 
        correct: false 
      },
      { 
        id: 'd', 
        text: "Both redlining and blockbusting were identical practices with different names used in different regions of the country", 
        correct: false 
      }
    ],
    explanation: "Redlining and blockbusting were distinct but related mechanisms of neighborhood change. Redlining was a federal policy (HOLC, 1934) that prevented Black families from accessing mortgages in white neighborhoods, maintaining segregation through exclusion. Blockbusting was a private real estate practice (1950s-1960s) that exploited the racial fears created by redlining: speculators would introduce a Black family to an all-white block, then spread panic among white homeowners ('your property values will collapse'), inducing them to sell quickly at below-market prices. The speculator would then resell to Black families at inflated prices, profiting from both transactions. Blockbusting didn't create segregation—it exploited the segregation that redlining had already established. The key difference: redlining kept people out through policy; blockbusting profited from letting people in after creating panic. APHG Concept: This demonstrates comparison in urban geography—understanding how different actors (federal government vs. private speculators) used different mechanisms (exclusion vs. exploitation) to produce similar outcomes (segregated neighborhoods, wealth extraction from Black families). Both practices contributed to the spatial inequality patterns visible in cities today, but through opposite tactics: one prevented entry, the other weaponized entry."
  },

  // Question 3: White Flight Impact on Tax Base
  {
    id: "ud-kq-res-03",
    roleSpecific: "ud-resident",
    apSkill: "spatial-analysis",
    question: "What was the impact of white flight on urban tax bases and public services in American cities during the 1960s-1980s?",
    options: [
      { 
        id: 'a', 
        text: "White flight increased property values in urban cores as demand for housing rose, leading to improved public services through higher tax revenues", 
        correct: false 
      },
      { 
        id: 'b', 
        text: "White flight created a self-reinforcing cycle: declining property values reduced tax revenues, forcing cuts to schools and infrastructure, which further decreased property values and accelerated middle-class departure", 
        correct: true 
      },
      { 
        id: 'c', 
        text: "White flight had minimal impact on tax bases because federal revenue-sharing programs compensated cities for lost property tax income", 
        correct: false 
      },
      { 
        id: 'd', 
        text: "White flight improved urban tax efficiency by reducing the population density that strained public services, allowing cities to maintain quality with fewer resources", 
        correct: false 
      }
    ],
    explanation: "White flight created a devastating self-reinforcing cycle of urban decline. As middle-class white families moved to suburbs (1960s-1980s), urban property values fell. Since most cities fund schools, police, fire services, and infrastructure through property taxes, declining property values meant declining tax revenues—even as the remaining population still needed services. Cities responded with service cuts: reduced school funding, deferred infrastructure maintenance, fewer police and fire stations. These cuts made neighborhoods less desirable, further reducing property values and accelerating middle-class departure. This created a downward spiral: lower values → lower taxes → worse services → lower values. The cycle was particularly severe in Rust Belt cities (Detroit, Cleveland, St. Louis) where white flight coincided with industrial decline. Detroit's population fell from 1.8 million (1950) to 1.0 million (1990), while its tax base collapsed. The remaining residents—disproportionately Black families who had been excluded from suburban mortgages through redlining—faced deteriorating schools, crumbling infrastructure, and reduced services despite paying the same tax rates. APHG Concept: This demonstrates spatial-analysis in urban geography—understanding how population movement creates feedback loops that amplify inequality. The geographic redistribution of the tax base (from city to suburb) wasn't neutral—it was structured by federal policies (FHA suburban mortgage subsidies, highway construction) that facilitated white suburban movement while blocking Black families from following. The result: spatial concentration of poverty in cities and wealth in suburbs, a pattern that persists today."
  },

  // Question 4: Heat Island and Tree Canopy Connection
  {
    id: "ud-kq-res-04",
    roleSpecific: "ud-resident",
    apSkill: "human-environment-interaction",
    question: "Why do formerly redlined neighborhoods have significantly less tree canopy and higher temperatures than other urban areas?",
    options: [
      { 
        id: 'a', 
        text: "Residents in redlined areas preferred concrete and asphalt over trees for easier property maintenance", 
        correct: false 
      },
      { 
        id: 'b', 
        text: "The 1934 HOLC 'D' grade designation led to decades of disinvestment in public infrastructure including street trees and parks, while green-graded neighborhoods received continuous investment in green infrastructure, creating a 5-12°F temperature difference that persists today", 
        correct: true 
      },
      { 
        id: 'c', 
        text: "Climate patterns naturally create hotter microclimates in urban cores where redlined neighborhoods were typically located", 
        correct: false 
      },
      { 
        id: 'd', 
        text: "Trees were removed from redlined areas during highway construction in the 1950s but this had no lasting temperature impact", 
        correct: false 
      }
    ],
    explanation: "The urban heat island effect in formerly redlined neighborhoods is a direct consequence of 90 years of disinvestment. When HOLC graded neighborhoods 'D' in 1934, it triggered a cascade: banks denied mortgages, property values fell, tax revenues declined, and cities cut services including tree planting and park maintenance. Meanwhile, green-graded neighborhoods received continuous investment in green infrastructure. By 2024, satellite temperature data shows perfect spatial correlation: areas graded 'D' in red ink are now 5-12°F hotter than formerly green-graded areas. The lack of tree canopy means more heat-absorbing asphalt and concrete, less shade, and higher energy costs for cooling. This is environmental racism made visible—the 1934 map predicted the 2024 temperature map. APHG Concept: This demonstrates human-environment interaction in urban geography—how policy decisions about investment and disinvestment create lasting physical environmental differences. The heat island isn't natural; it's the spatial manifestation of discriminatory federal policy. Understanding this connection is critical for environmental justice: cooling strategies must address the root cause (systematic disinvestment) not just the symptom (high temperatures)."
  },

  // Question 5: Mixed-Use Development as Solution
  {
    id: "ud-kq-res-05",
    roleSpecific: "ud-resident",
    apSkill: "causation",
    question: "How does mixed-use development address urban sustainability challenges while potentially creating new inequalities?",
    options: [
      { 
        id: 'a', 
        text: "Mixed-use development solves all urban problems by combining residential and commercial spaces without any negative consequences", 
        correct: false 
      },
      { 
        id: 'b', 
        text: "Mixed-use development reduces car dependency, increases walkability, and provides green infrastructure that lowers temperatures, but rising property values can displace long-term residents who survived decades of disinvestment, creating a tension between environmental justice and economic justice", 
        correct: true 
      },
      { 
        id: 'c', 
        text: "Mixed-use development only benefits wealthy neighborhoods and has no application in formerly redlined areas", 
        correct: false 
      },
      { 
        id: 'd', 
        text: "Mixed-use development prevents gentrification by keeping property values stable through increased density", 
        correct: false 
      }
    ],
    explanation: "Mixed-use development is a key strategy in APHG 6.10 (Urban Sustainability) because it addresses multiple challenges: walkability reduces car dependency and emissions, mixed-income housing increases economic diversity, local services reduce food deserts, and green infrastructure (trees, parks) lowers urban heat island temperatures. In formerly redlined neighborhoods, these benefits are desperately needed—residents have endured 90 years of disinvestment, lack of services, and environmental burdens. However, mixed-use development creates a cruel paradox: the improvements that make neighborhoods livable (cooling, services, safety) also increase property values, leading to rent increases that displace the very residents who survived the disinvestment. This is the gentrification dilemma: improvement or replacement? The median white family holds 8-10x the wealth of the median Black family (largely due to home equity denied through redlining), so rising property values benefit those who already have wealth while displacing those who don't. APHG Concept: This demonstrates causation in urban geography—understanding how solutions to one problem (environmental inequality) can create or worsen another problem (economic displacement). Sustainable urban development requires addressing both environmental justice (cooling, services) AND economic justice (anti-displacement policies like community land trusts, rent control, affordable housing mandates). The challenge is not whether to improve formerly redlined neighborhoods, but how to improve them without displacing the people who stayed through decades of abandonment."
  }
];
