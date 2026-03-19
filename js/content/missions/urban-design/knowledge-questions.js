/**
 * Urban Design Mission - Knowledge Checkpoint Questions
 *
 * 10 questions total: all for ud-resident role
 * Each question tests AP Human Geography reasoning skills
 * Questions are grounded in role experience and historically accurate
 *
 * APHG Themes 6.6 (Urban Challenges) and 6.10 (Urban Sustainability)
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
    explanation: "Redlining grew from two related federal policies: the Home Owners' Loan Corporation (HOLC), created in 1933, developed the neighborhood grading maps; the National Housing Act of 1934 created the FHA, which used those maps to determine where federally insured mortgages could be issued. HOLC appraisers graded neighborhoods using a color-coded system: A (green) for 'best,' B (blue) for 'still desirable,' C (yellow) for 'declining,' and D (red) for 'hazardous.' Black neighborhoods systematically received 'D' grades regardless of actual housing quality or economic conditions. Banks used these maps to deny mortgages, creating the mortgage gap: between 1934 and 1962, the federal government backed $120 billion in home loans, but less than 2% went to non-white families. This policy prevented wealth accumulation through home equity for generations. APHG Concept: This demonstrates causation in urban geography—how a single federal policy decision created spatial patterns of inequality that persist 90 years later, affecting property values, tax bases, infrastructure investment, and even modern temperature distributions through the urban heat island effect."
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

  // Question 5: Filtering Theory
  {
    id: "ud-kq-res-05",
    roleSpecific: "ud-resident",
    apSkill: "causation",
    question: "What is the filtering process in urban housing markets, and how did redlining alter its expected outcome in Black neighborhoods?",
    options: [
      {
        id: 'a',
        text: "Filtering describes how cities filter out low-income residents through zoning laws; redlining accelerated this by targeting Black neighborhoods specifically",
        correct: false
      },
      {
        id: 'b',
        text: "Filtering is the process by which housing passes from higher-income to lower-income occupants as it ages; redlining removed the mortgage capital needed for maintenance and reinvestment, accelerating deterioration beyond what normal filtering would produce",
        correct: true
      },
      {
        id: 'c',
        text: "Filtering describes the movement of white residents out of urban areas; redlining had no connection to this process",
        correct: false
      },
      {
        id: 'd',
        text: "Filtering is a natural market process that always improves housing quality over time; redlining had no measurable effect on it",
        correct: false
      }
    ],
    explanation: "In standard housing market theory, filtering describes how housing stock passes from higher-income to lower-income occupants as it ages and depreciates. Older housing becomes affordable as newer housing is built for higher-income buyers. In theory, this provides a supply of affordable housing without government intervention. Redlining broke this mechanism in Black neighborhoods. When HOLC assigned 'D' grades, banks stopped issuing mortgages in those areas. Without mortgage access, homeowners could not borrow to maintain or improve their properties. Landlords had no incentive to reinvest in buildings they could not sell at market value. The result was accelerated deterioration — not the gradual, natural filtering of aging housing, but rapid decline caused by the deliberate removal of capital. Properties that might have filtered down over 40–50 years deteriorated in 10–15. This created the 'blighted' conditions that urban renewal programs later used to justify demolition — demolition that displaced the same residents who had been denied the capital to maintain their homes. The filtering process was weaponized: redlining created the deterioration, then deterioration was used to justify further disinvestment and displacement."
  },

  // Question 6: Restrictive Covenants and Shelley v. Kraemer
  {
    id: "ud-kq-res-06",
    roleSpecific: "ud-resident",
    apSkill: "causation",
    question: "What were restrictive covenants, and what was the significance of Shelley v. Kraemer (1948) in addressing them?",
    options: [
      {
        id: 'a',
        text: "Restrictive covenants were local zoning laws; Shelley v. Kraemer eliminated all housing discrimination by ruling them unconstitutional",
        correct: false
      },
      {
        id: 'b',
        text: "Restrictive covenants were deed clauses prohibiting sale to specified racial groups, recommended by the FHA Underwriting Manual; Shelley v. Kraemer ruled courts could not enforce them but did not ban their inclusion in deeds, leaving the underlying segregation largely intact",
        correct: true
      },
      {
        id: 'c',
        text: "Restrictive covenants were agreements between banks to restrict mortgage lending; Shelley v. Kraemer banned them entirely and required banks to issue mortgages in all neighborhoods",
        correct: false
      },
      {
        id: 'd',
        text: "Restrictive covenants were voluntary neighborhood agreements with no legal standing; Shelley v. Kraemer had no practical effect on housing segregation",
        correct: false
      }
    ],
    explanation: "Restrictive covenants were clauses written into property deeds prohibiting the sale or rental of a property to members of specified racial or ethnic groups. They were not informal agreements — the FHA Underwriting Manual explicitly recommended them as a tool for maintaining neighborhood grade stability, meaning the federal government actively promoted their use. By the 1940s, an estimated 80% of residential property in cities like Chicago, Los Angeles, and Detroit was covered by restrictive covenants. Shelley v. Kraemer (1948) was a landmark Supreme Court ruling that held courts could not enforce restrictive covenants — doing so would constitute state action in violation of the Equal Protection Clause of the 14th Amendment. However, the ruling had a critical limitation: it did not ban restrictive covenants from being written into deeds, only from being enforced by courts. Sellers could still refuse to sell to Black buyers; they simply could not sue to enforce the covenant if a white seller chose to sell. The practical effect was limited because the FHA continued to use HOLC grades to deny mortgages in Black neighborhoods until 1968, and private discrimination continued without legal remedy until the Fair Housing Act. Shelley v. Kraemer is significant as a legal precedent — it established that government enforcement of private discrimination is unconstitutional — but it did not dismantle the spatial segregation that covenants had already produced."
  },

  // Question 7: Suburbanization Mechanisms
  {
    id: "ud-kq-res-07",
    roleSpecific: "ud-resident",
    apSkill: "spatial-analysis",
    question: "Which combination of federal policies most directly produced the spatial separation of white suburban wealth and Black urban poverty in the postwar United States?",
    options: [
      {
        id: 'a',
        text: "The New Deal and Social Security Act, which provided income support that allowed white families to save for suburban homes while excluding most Black workers",
        correct: false
      },
      {
        id: 'b',
        text: "The GI Bill, FHA mortgage insurance, and the Federal-Aid Highway Act of 1956 — which together subsidized white suburban homeownership and highway access while HOLC redlining denied Black families the same mortgage access",
        correct: true
      },
      {
        id: 'c',
        text: "State-level zoning laws that required racial segregation in residential areas, which the federal government had no role in creating",
        correct: false
      },
      {
        id: 'd',
        text: "Private real estate industry practices alone, operating without any federal policy framework that differentiated access by race",
        correct: false
      }
    ],
    explanation: "The postwar spatial separation of white suburban wealth and Black urban poverty was produced by the intersection of three federal programs operating simultaneously. The GI Bill (1944) provided low-interest home loans to returning veterans — but these loans were administered through local banks operating under FHA underwriting criteria. The Urban Institute (2018) documented that Black veterans were systematically denied access to suburban mortgage markets: in Mississippi, for example, of 3,229 GI Bill home loans issued in 1947, only two went to Black veterans. The FHA mortgage insurance program (1934–1968) subsidized suburban development by insuring mortgages in green-graded areas while denying insurance in redlined areas. New Levittown-style suburbs were built with FHA backing and explicit racial restrictions. The Federal-Aid Highway Act of 1956 funded the Interstate Highway System, which routed highways through urban Black neighborhoods (displacing hundreds of thousands of residents) while connecting white suburbs to downtown employment centers. The combined effect: federal dollars built white suburban wealth through subsidized homeownership while simultaneously destroying Black urban neighborhoods through highway construction and denying Black families the mortgage access to follow. The Urban Institute estimates this differential access to the GI Bill alone accounts for a significant portion of the current racial wealth gap."
  },

  // Question 8: Environmental Justice as a Defined Concept
  {
    id: "ud-kq-res-08",
    roleSpecific: "ud-resident",
    apSkill: "human-environment-interaction",
    question: "How does the concept of environmental justice apply to the relationship between redlining and the urban heat island effect?",
    options: [
      {
        id: 'a',
        text: "Environmental justice applies only to industrial pollution and has no relevance to urban heat or housing policy",
        correct: false
      },
      {
        id: 'b',
        text: "Environmental justice holds that all communities deserve equal protection from environmental hazards; the heat island pattern — where formerly redlined areas are 5–12°F hotter due to 90 years of disinvestment in tree canopy and green infrastructure — is a documented environmental inequality produced by federal housing policy",
        correct: true
      },
      {
        id: 'c',
        text: "Environmental justice requires that all neighborhoods have identical temperatures, which is achievable through air conditioning subsidies regardless of tree canopy",
        correct: false
      },
      {
        id: 'd',
        text: "Environmental justice is a recent concept with no connection to historical policies like redlining, which ended before environmental concerns became prominent",
        correct: false
      }
    ],
    explanation: "Environmental justice is the principle that all communities, regardless of race or income, should receive equal protection from environmental hazards and equal access to environmental benefits. The urban heat island pattern in formerly redlined neighborhoods is a textbook case of environmental injustice — not because of industrial pollution, but because of the cumulative environmental consequences of 90 years of disinvestment. When HOLC graded neighborhoods 'D' in 1934, it triggered a cascade that included reduced municipal investment in street trees, parks, and green infrastructure. Hoffman, Shandas, and Pendleton (2020) analyzed 108 U.S. cities and found that 92% of formerly redlined areas are measurably hotter than green-graded areas in the same cities — a 5–12°F difference that increases heat-related illness risk, raises cooling costs, and reduces outdoor livability. The environmental justice framework is critical here because it connects the physical environment (temperature, tree canopy) to the policy decisions that produced it. The heat is not natural — it is the spatial manifestation of discriminatory federal policy. Environmental justice demands that remediation address the root cause: systematic disinvestment. Planting trees without addressing displacement risk, for example, may cool the neighborhood while pricing out the residents who need cooling most. True environmental justice requires both environmental remediation and protection of the communities bearing the environmental burden."
  },

  // Question 9: Smart Growth — TOD, Infill, Green Infrastructure
  {
    id: "ud-kq-res-09",
    roleSpecific: "ud-resident",
    apSkill: "causation",
    question: "How do transit-oriented development, infill development, and green infrastructure function together as smart growth strategies in formerly disinvested urban neighborhoods?",
    options: [
      {
        id: 'a',
        text: "These strategies work independently and are most effective when applied separately in different neighborhoods rather than combined",
        correct: false
      },
      {
        id: 'b',
        text: "Transit-oriented development concentrates density around transit to reduce car dependency; infill development uses vacant urban land to avoid sprawl; green infrastructure reduces heat and manages stormwater — together they address the environmental and economic disinvestment legacy while reducing car dependency and emissions",
        correct: true
      },
      {
        id: 'c',
        text: "Smart growth strategies are designed for new suburban development and cannot be applied to existing urban neighborhoods with established infrastructure",
        correct: false
      },
      {
        id: 'd',
        text: "These strategies primarily benefit high-income residents and are not applicable to formerly redlined neighborhoods where land values are too low for transit investment",
        correct: false
      }
    ],
    explanation: "Smart growth is a set of urban planning principles designed to create compact, walkable, environmentally sustainable communities. In formerly redlined neighborhoods, three strategies are particularly relevant. Transit-oriented development (TOD) concentrates mixed-use, mixed-income development within walking distance of transit stations. This reduces car dependency (important in neighborhoods where disinvestment reduced car ownership rates), increases access to employment, and creates the density needed to support local retail and services. Infill development builds on vacant or underutilized land within existing urban areas rather than at the urban fringe. Formerly redlined neighborhoods often have significant vacant land — the result of urban renewal demolition, abandonment, and disinvestment. Infill uses existing infrastructure (streets, utilities, transit) rather than requiring new suburban infrastructure, reducing sprawl and its associated environmental costs. Green infrastructure — street trees, parks, green roofs, permeable pavement — addresses the urban heat island directly by replacing heat-absorbing surfaces with vegetation. In formerly redlined neighborhoods, green infrastructure investment also addresses the environmental justice deficit: these areas have significantly less tree canopy than green-graded areas due to decades of reduced municipal investment. Together, these strategies address multiple dimensions of the disinvestment legacy: environmental (heat, stormwater), economic (access to employment, local services), and spatial (efficient use of existing urban land). The challenge is implementing them without triggering the gentrification and displacement that often follows neighborhood improvement."
  },

  // Question 10: Community Land Trusts and Sequent Occupance
  {
    id: "ud-kq-res-10",
    roleSpecific: "ud-resident",
    apSkill: "comparison",
    question: "How does the concept of sequent occupance help explain the current conditions in formerly redlined neighborhoods, and how do community land trusts attempt to shape the next layer of that occupance?",
    options: [
      {
        id: 'a',
        text: "Sequent occupance describes only the physical landscape; community land trusts are unrelated to this geographic concept",
        correct: false
      },
      {
        id: 'b',
        text: "Sequent occupance holds that each successive group occupying a place leaves lasting imprints; formerly redlined neighborhoods show layered imprints of HOLC grading, blockbusting, disinvestment, and gentrification pressure — community land trusts attempt to ensure the next layer preserves affordability rather than displacing long-term residents",
        correct: true
      },
      {
        id: 'c',
        text: "Sequent occupance suggests that neighborhoods naturally improve with each successive group; community land trusts accelerate this natural process",
        correct: false
      },
      {
        id: 'd',
        text: "Community land trusts prevent all development in formerly redlined neighborhoods to preserve the historical record of sequent occupance",
        correct: false
      }
    ],
    explanation: "Sequent occupance is the geographic concept that a place is shaped by the successive groups that have occupied it, each leaving cultural, economic, and physical imprints that persist into subsequent periods. Formerly redlined neighborhoods are a clear example: the HOLC 'D' grade (1934) left the imprint of mortgage denial and capital withdrawal; blockbusting (1950s–1960s) left the imprint of rapid racial turnover and predatory land contracts; disinvestment (1970s–1990s) left the imprint of deteriorated housing stock, reduced services, and environmental degradation; and now gentrification pressure is leaving the imprint of rising property values and displacement risk. Each layer was shaped by the previous one — gentrification targets formerly redlined neighborhoods partly because disinvestment left them with low property values and proximity to urban amenities. Community land trusts (CLTs) are a policy tool designed to shape the next layer of sequent occupance. A CLT acquires land and holds it in permanent trust, leasing it to homeowners or renters at below-market rates. Because the CLT retains ownership of the land, it can control resale prices and prevent speculation — the land cannot be sold at market rate even as surrounding property values rise. This breaks the gentrification cycle: neighborhood improvements (cooling, services, safety) can occur without triggering displacement of long-term residents. The Federal Reserve Bank of Chicago (2017) documented that CLT homeowners in gentrifying neighborhoods maintained stable housing costs while surrounding market-rate housing became unaffordable. CLTs represent an attempt to ensure that the next layer of sequent occupance in formerly redlined neighborhoods is written by the communities that survived the previous layers — not by the capital that abandoned them."
  }
];
