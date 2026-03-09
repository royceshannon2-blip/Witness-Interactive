# AP Curriculum Alignment Skill

## Purpose
Ensure every scene, choice, consequence, and assessment question in Witness
Interactive directly supports AP US History and AP World History curriculum
standards, making the game a legitimate study tool, not just entertainment.

## AP Historical Thinking Skills
Tag every scene with at least one of these in the apThemes array:

### causation
The scene demonstrates why an event happened or what it caused.
Pearl Harbor examples:
- US oil embargo causing Japanese strategic desperation
- Attack causing US declaration of war
- Surprise attack causing shift in US isolationist sentiment

### continuity-and-change
The scene shows what transformed and what remained constant over time.
Pearl Harbor examples:
- Change: US foreign policy from isolationism to interventionism
- Continuity: racial tensions and discrimination persisting into wartime policy
- Change: role of women and minorities in workforce and military

### periodization
The scene marks a clear turning point or transition between historical eras.
Pearl Harbor examples:
- End of American isolationism era
- Beginning of US involvement in WWII
- Start of the Pacific Theater as a distinct conflict

### comparison
The scene highlights similarities or differences across groups or nations.
Pearl Harbor examples:
- Japanese imperial strategy vs. US Pacific defense strategy
- Treatment of Japanese Americans vs. German Americans during wartime
- US response to Pearl Harbor vs. response to previous European war news

### contextualization
The scene connects to broader historical trends beyond the immediate event.
Pearl Harbor examples:
- Japanese expansionism in Asia since 1931
- US-Japan tensions over China and resource access
- European war context and US Lend-Lease policy

### argumentation
The scene presents evidence-based claims about historical significance.
Pearl Harbor examples:
- Was the attack a strategic mistake for Japan?
- Did US intelligence failures enable the attack?
- How did Pearl Harbor reshape American national identity?

## AP Key Concepts — Pearl Harbor Relevance

### KC-7.1.I: US Involvement Debate
The debate between interventionists and isolationists before Pearl Harbor.
Use in: civilian role scenes showing pre-war American attitudes.

### KC-7.2.I: The Arsenal of Democracy
US industrial and military mobilization after Pearl Harbor.
Use in: Historical Ripple timeline, outcome screens.

### KC-7.3.I: WWII Military Campaigns
The Pacific Theater opened by Pearl Harbor.
Use in: Historical Ripple timeline.

### KC-7.3.II: Home Front Transformations
Japanese American internment, women in workforce, rationing.
Use in: Historical Ripple timeline, civilian role outcome.

### KC-7.3.III: Wartime Diplomacy
Allied coalition building, unconditional surrender policy.
Use in: Historical Ripple timeline final entries.

## Knowledge Checkpoint Question Standards

### Format Requirements
- Every question must have exactly 4 answer choices (A, B, C, D)
- One clearly correct answer
- Three plausible distractors — never obviously wrong
- Brief explanation for BOTH correct and incorrect answers
- Maximum question length: 40 words
- Maximum answer choice length: 15 words each

### Question Types by Role

**Japanese Aviator questions should address:**
- Japanese strategic motivations for the attack
- The role of the US oil embargo in Japanese decision-making
- Military outcomes from the Japanese perspective
- Why the attack is considered a long-term strategic failure for Japan

**American Sailor questions should address:**
- US military preparedness and intelligence failures before the attack
- Immediate military consequences of the attack
- The significance of the aircraft carriers being absent
- Congressional response and declaration of war

**American Civilian questions should address:**
- Japanese American internment and Executive Order 9066
- Shift in American public opinion from isolationism to interventionism
- Home front mobilization and social changes
- Long-term civil liberties implications

### Sample Question Structure
```javascript
{
  id: "q_japanese_strategic",
  role: "japanese-aviator",
  apTheme: "causation",
  apKeyConcept: "KC-7.1.I",
  question: "What was Japan's primary strategic motivation for attacking Pearl Harbor?",
  choices: [
    { id: "A", text: "To permanently destroy US naval power in the Pacific", correct: false,
      explanation: "Japan aimed to disable, not permanently destroy — they notably missed the carriers and fuel depots." },
    { id: "B", text: "To buy time for expanding the Southern Resource Zone while the US recovered", correct: true,
      explanation: "Japan sought to neutralize the US Pacific Fleet long enough to secure oil and resources in Southeast Asia." },
    { id: "C", text: "To provoke a negotiated settlement over China", correct: false,
      explanation: "Japan's leaders knew the attack would end diplomatic options, not create new ones." },
    { id: "D", text: "To support Germany's declaration of war on the United States", correct: false,
      explanation: "Germany declared war on the US after Pearl Harbor — Japan did not coordinate the attack with Germany." }
  ]
}
```

## Scene AP Tagging Requirements
Every scene object must include:
```javascript
{
  id: "scene_id",
  apThemes: ["causation", "perspective"],  // minimum 1, maximum 3
  apKeyConcept: "KC-7.3.I",               // most relevant key concept
  educatorNote: "This scene illustrates the human cost of strategic miscalculation"
}
```

## Historical Ripple AP Anchors
Each ripple event must include which AP theme it demonstrates:
```javascript
{
  date: "December 8, 1941",
  event: "US declares war on Japan",
  apTheme: "causation",
  apNote: "Demonstrates how a single military event triggered formal US entry into WWII"
}
```