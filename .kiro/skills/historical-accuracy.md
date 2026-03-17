# Historical Accuracy Skill

## Purpose
Ensure all narrative content in Witness Interactive is historically accurate,
properly sourced, and appropriate for AP History curriculum use.

## Core Rules
- Never invent quotes for real historical figures
- Never place real historical figures in locations they were not documented to be
- Flag all dramatized or speculative content with a // DRAMATIZED inline comment
- Flag all historically verified content with a // VERIFIED inline comment
- If a historical detail cannot be verified, simplify or remove it entirely

## Pearl Harbor Verified Facts

### Timeline
- 3:42 AM: USS Condor spots midget submarine, reports to USS Ward
- 6:37 AM: USS Ward sinks midget submarine — first US shots of WWII
- 6:53 AM: Ward's report reaches naval command, largely ignored
- 7:02 AM: Radar operators Lockard and Elliott detect incoming aircraft
- 7:20 AM: Lieutenant Tyler dismisses radar contact as B-17s from mainland
- 7:48 AM: First wave attack begins — 183 Japanese aircraft
- 7:55 AM: USS Arizona struck, forward magazine explodes
- 7:57 AM: Admiral Kimmel receives "This is no drill" report
- 8:10 AM: USS Arizona sinks, 1,177 crew killed
- 8:54 AM: Second wave attack begins — 170 Japanese aircraft
- 9:55 AM: Attack ends
- 2:26 PM: Japanese fleet begins withdrawal

### Japanese Force (Kido Butai)
- Commander: Vice Admiral Chuichi Nagumo
- 6 aircraft carriers: Akagi, Kaga, Soryu, Hiryu, Shokaku, Zuikaku
- 353 total aircraft across two waves
- First wave commander: Commander Mitsuo Fuchida
- First wave composition: 183 aircraft — 49 high-level bombers, 51 dive
  bombers, 40 torpedo planes, 43 fighters
- Fuchida's signal "Tora! Tora! Tora!" confirmed complete surprise achieved
- Japanese losses: 29 aircraft, 5 midget submarines, 64 men killed

### American Forces & Casualties
- Commander: Admiral Husband E. Kimmel (Navy), General Walter Short (Army)
- Total American casualties: 2,403 killed, 1,178 wounded
- Aircraft destroyed: 188, damaged: 159
- Ships sunk or damaged: 8 battleships, 3 cruisers, 3 destroyers
- USS Arizona: 1,177 killed — still rests on harbor floor as a memorial
- USS Oklahoma: capsized, 429 killed
- USS Nevada: only battleship to get underway during attack
- Aircraft carriers USS Enterprise, Lexington, Saratoga: all at sea, undamaged

### Geography
- Pearl Harbor located on Oahu, Hawaii — then a US territory, not a state
- Battleship Row: southeast side of Ford Island
- Hickam Field: adjacent Army Air Corps base, heavily attacked
- Wheeler Field: central Oahu, fighter base, attacked in first wave
- Kaneohe Bay Naval Air Station: attacked before Pearl Harbor itself

### Japanese Aviator Context
- Pilots briefed on mission November 23, 1941 at sea
- Many pilots were veterans of the Second Sino-Japanese War
- Aircraft types: Mitsubishi A6M Zero (fighter), Nakajima B5N Kate
  (torpedo/bomber), Aichi D3A Val (dive bomber)
- Pilots told attack was a decisive blow to end potential Pacific conflict
- Some pilots expressed private doubts about attacking without declaration of war
- Fuchida circled Pearl Harbor for entire attack duration observing and
  directing

### American Sailor Context (USS Arizona)
- Ship was moored on Battleship Row, outboard of USS Vestal (repair ship)
- Most crew were sleeping, eating breakfast, or preparing for morning colors
- Band was preparing for the 8:00 AM flag-raising ceremony
- Arizona was hit by at least 8 bombs, one penetrating the forward magazine
- Explosion was so massive it threw men from neighboring ships into the water
- Rescue efforts were hampered by burning oil on the water surface
- Many survivors were pulled from the water by sailors from USS Vestal

### American Civilian Context
- Honolulu had a population of approximately 180,000 in 1941
- Large Japanese-American community — about 37% of Hawaii's population
- Many civilians heard the attack and initially thought it was military exercises
- Some drove toward Pearl Harbor out of curiosity before roads were blocked
- Martial law declared at 11:30 AM December 7, 1941
- Blackout orders issued that evening
- Some civilian casualties from misdirected US anti-aircraft shells falling
  on Honolulu neighborhoods
- Japanese-American families faced immediate suspicion despite loyalty

## Dramatization Guidelines
- Internal thoughts and dialogue for non-historical characters: ALLOWED
- Sensory descriptions of documented events: ALLOWED
- Composite characters representing groups of real people: ALLOWED with comment
- Invented dialogue for named historical figures (Fuchida, Kimmel): NOT ALLOWED
- Changing documented timelines: NOT ALLOWED
- Altering casualty figures or ship fates: NOT ALLOWED

## Data-Narrative Mapping (Urban Design Mission)
For missions spanning decades rather than single events, accuracy requires anchoring narrative to verifiable data:

### HOLC Redlining Maps (1935-1940)
- All neighborhood grades (A/B/C/D) must match actual HOLC maps for the city
- Use // DATA-VERIFIED comment for any reference to specific grades or boundaries
- Never invent neighborhood names — use actual mapped areas or generic descriptions
- Color coding: Green (A), Blue (B), Yellow (C), Red (D) — historically accurate

### Temperature and Environmental Data
- Heat island effects are real and measurable — cite temperature differentials
- Tree canopy coverage correlates with HOLC grades — this is documented
- Use // DATA-VERIFIED for temperature deltas (e.g., "15°F hotter in summer")
- Asphalt, concrete, and lack of shade are documented heat contributors

### Demographic and Economic Data
- Population shifts, property values, and investment patterns must be verifiable
- Use census data ranges rather than specific numbers unless documented
- Wealth gaps and health disparities are documented — cite ranges, not invented figures
- Use // ESTIMATED for reasonable extrapolations from documented trends

### Verification Standard for Urban Design
Every atmospheric effect (Heat, Canopy) must be anchored in 1930s HOLC policy:
```javascript
// Example scene with data verification
{
  id: "ud-resident-scene-02",
  narrative: "The thermometer reads 98°F, but the asphalt radiates heat like an oven. // DATA-VERIFIED: D-graded areas average 15°F hotter than A-graded areas in summer",
  atmosphericEffect: "heat"
}
```

## Sources to Reference
- National Park Service: USS Arizona Memorial documentation
- Naval History and Heritage Command official records
- Gordon Prange "At Dawn We Slept" (definitive Pearl Harbor account)
- College Board AP US History Course and Exam Description
- University of Richmond: Mapping Inequality (HOLC maps digitized)
- EPA and NOAA: Urban heat island effect documentation
- Robert K. Nelson et al.: "Mapping Inequality" project