# Contributing to Witness Interactive

Welcome! This guide will help you add new historical missions to Witness Interactive. Whether you're a teacher creating content for your classroom or a student building a history project, this guide assumes you have basic coding knowledge (HTML, CSS, JavaScript) but are not a professional developer.

## Table of Contents

1. [Understanding the Architecture](#understanding-the-architecture)
2. [Adding a New Mission: Step-by-Step](#adding-a-new-mission-step-by-step)
3. [Mission Data Structure](#mission-data-structure)
4. [Scene Object Template](#scene-object-template)
5. [Role Template](#role-template)
6. [Outcome Template](#outcome-template)
7. [Knowledge Questions Template](#knowledge-questions-template)
8. [Registering Your Mission](#registering-your-mission)
9. [Testing Your Mission](#testing-your-mission)
10. [Best Practices](#best-practices)

---

## Understanding the Architecture

Witness Interactive uses a **data-driven architecture**, which means:

- **Engine files** (`js/engine/`) contain the game logic and should **never be modified**
- **Content files** (`js/content/missions/`) contain the story, choices, and questions
- **To add a new mission, you only edit content files—no engine code changes needed**

This separation means you can focus on writing great historical content without worrying about breaking the game engine.

### Key Concepts

- **Mission**: A complete historical scenario (e.g., Pearl Harbor, D-Day, Moon Landing)
- **Role**: A playable perspective within a mission (e.g., Japanese Aviator, American Sailor)
- **Scene**: A single narrative moment with text, choices, and consequences
- **Consequence Flags**: Variables that track player decisions (e.g., `helped_comrade: true`)
- **Outcome**: The ending the player receives based on their choices

---

## Adding a New Mission: Step-by-Step

### Step 1: Create Your Mission Folder

Create a new folder in `js/content/missions/` with your mission name in kebab-case:

```
js/content/missions/your-mission-name/
```

**Example**: For a D-Day mission, create `js/content/missions/d-day/`

### Step 2: Create Your Mission Files

Inside your mission folder, create these files:

1. `mission.js` - Mission metadata and configuration
2. `role-name-1.js` - First role's scenes and outcomes
3. `role-name-2.js` - Second role's scenes and outcomes
4. `role-name-3.js` - Third role's scenes and outcomes (optional)
5. `knowledge-questions.js` - AP-style assessment questions

**Example**: For D-Day with three roles:
```
js/content/missions/d-day/
├── mission.js
├── american-paratrooper.js
├── german-defender.js
├── french-resistance.js
└── knowledge-questions.js
```

### Step 3: Write Your Mission Metadata

Open `mission.js` and define your mission configuration:

```javascript
// Import your role files
import americanParatrooper from './american-paratrooper.js';
import germanDefender from './german-defender.js';
import frenchResistance from './french-resistance.js';
import knowledgeQuestions from './knowledge-questions.js';

// Define your mission
const dDayMission = {
  id: 'd-day',
  title: 'D-Day: The Normandy Invasion',
  historicalDate: '1944-06-06',  // ISO format: YYYY-MM-DD
  era: 'Modern',  // Options: Ancient, Medieval, Early Modern, Modern
  unlocked: true,  // Set to false for "Coming Soon" missions
  teaser: 'Experience the largest amphibious invasion in history from three perspectives',
  
  roles: [
    {
      id: 'american-paratrooper',
      name: 'American Paratrooper',
      description: 'Drop behind enemy lines in the early hours of June 6, 1944',
      scenes: americanParatrooper.scenes,
      outcomes: americanParatrooper.outcomes
    },
    {
      id: 'german-defender',
      name: 'German Defender',
      description: 'Defend the Atlantic Wall against the Allied invasion',
      scenes: germanDefender.scenes,
      outcomes: germanDefender.outcomes
    },
    {
      id: 'french-resistance',
      name: 'French Resistance Fighter',
      description: 'Aid the invasion from within occupied France',
      scenes: frenchResistance.scenes,
      outcomes: frenchResistance.outcomes
    }
  ],
  
  knowledgeQuestions: knowledgeQuestions,
  
  historicalRipple: [
    {
      id: 'ripple-01',
      date: 'June 6, 1944',
      title: 'Allied Forces Land in Normandy',
      description: '156,000 troops storm five beaches, beginning the liberation of Western Europe',
      apTheme: 'causation',
      animationDelay: 1000
    },
    {
      id: 'ripple-02',
      date: 'August 25, 1944',
      title: 'Liberation of Paris',
      description: 'French and Allied forces liberate Paris after four years of occupation',
      apTheme: 'continuity',
      animationDelay: 2000
    },
    // Add more ripple events...
  ]
};

export default dDayMission;
```

### Step 4: Write Your Role Scenes

Create a file for each role (e.g., `american-paratrooper.js`). See the [Scene Object Template](#scene-object-template) section below for the complete structure.

### Step 5: Define Outcomes

In each role file, define possible endings based on player choices. See the [Outcome Template](#outcome-template) section below.

### Step 6: Write Knowledge Questions

Create `knowledge-questions.js` with AP-style questions. See the [Knowledge Questions Template](#knowledge-questions-template) section below.

### Step 7: Register Your Mission

Open `js/content/MissionRegistry.js` and add your mission:

```javascript
// At the top, import your mission
import dDayMission from './missions/d-day/mission.js';

// In the initialization code, register it
missionRegistry.register(dDayMission);
```

### Step 8: Test Your Mission

1. Open `index.html` in your browser
2. Navigate to the timeline and click your mission
3. Play through all roles
4. Verify choices work correctly
5. Check that outcomes reflect your decisions
6. Test knowledge questions

---

## Mission Data Structure

```javascript
{
  id: string,              // Unique identifier (kebab-case)
  title: string,           // Display name
  historicalDate: string,  // ISO format: "YYYY-MM-DD"
  era: string,             // "Ancient", "Medieval", "Early Modern", "Modern"
  unlocked: boolean,       // true = playable, false = "Coming Soon"
  teaser: string,          // One-line description for timeline tooltip
  roles: Array,            // Array of role objects (see Role Template)
  knowledgeQuestions: Array,  // Array of question objects
  historicalRipple: Array  // Array of timeline events
}
```

---

## Scene Object Template

Each scene is a JavaScript object with this structure:

```javascript
{
  id: "unique-scene-id",
  
  narrative: `The main story text goes here. Use backticks for multi-line text.
  
  You can include multiple paragraphs. Write cinematically—describe sights, sounds, 
  smells, and emotions. Put the player in the moment.`,
  
  apThemes: ["causation", "perspective", "continuity"],
  // Options: "causation", "continuity", "perspective", "argumentation"
  
  apKeyConcept: "KC-7.3.I",  // Optional: Specific AP curriculum code
  
  atmosphericEffect: "smoke",  // Options: "smoke", "fire", "shake", null
  
  choices: [
    {
      id: "choice-01-a",
      text: "First choice option text",
      consequences: {
        flag_name: true,        // Boolean flag
        numeric_flag: 1         // Numeric counter
      },
      nextScene: "next-scene-id"
    },
    {
      id: "choice-01-b",
      text: "Second choice option text",
      consequences: {
        different_flag: true,
        numeric_flag: 2
      },
      nextScene: "next-scene-id"
    }
    // Add 2-4 choices per scene
  ]
}
```

### Scene Writing Tips

1. **Narrative**: Write 2-3 paragraphs per scene. Be cinematic and immersive.
2. **AP Themes**: Every scene must include at least one AP theme tag
3. **Choices**: Offer 2-4 meaningful choices that reflect historical dilemmas
4. **Consequences**: Use descriptive flag names (e.g., `helped_civilian`, `took_risk`)
5. **Atmospheric Effects**: Use sparingly for dramatic moments

---

## Role Template

```javascript
const roleScenes = [
  // Scene 1
  {
    id: "role-scene-01",
    narrative: "...",
    apThemes: ["perspective"],
    atmosphericEffect: null,
    choices: [...]
  },
  // Scene 2
  {
    id: "role-scene-02",
    narrative: "...",
    apThemes: ["causation"],
    atmosphericEffect: null,
    choices: [...]
  },
  // Add 4-5 scenes total
  
  // Final scene (always leads to outcome)
  {
    id: "role-scene-05",
    narrative: "...",
    apThemes: ["continuity"],
    atmosphericEffect: null,
    choices: [
      {
        id: "final-choice",
        text: "Complete your mission",
        consequences: { mission_complete: true },
        nextScene: "outcome"  // Always "outcome" for final scene
      }
    ]
  }
];

// Export at the bottom of the file
export default {
  scenes: roleScenes,
  outcomes: roleOutcomes  // See Outcome Template
};
```

---

## Outcome Template

Outcomes determine what ending the player receives based on their choices:

```javascript
const roleOutcomes = [
  {
    id: "outcome-survived-heroic",
    conditions: {
      helped_civilian: true,
      took_risk: true
    },
    survived: true,
    epilogue: `You survived the mission. Your choices to help civilians and take risks 
    saved lives, though at great personal cost.
    
    In the years that follow, you will remember this day...
    
    [Write 2-3 paragraphs describing the character's fate and the historical aftermath]`
  },
  {
    id: "outcome-survived-cautious",
    conditions: {
      played_safe: true,
      avoided_combat: true
    },
    survived: true,
    epilogue: `You survived by staying cautious...`
  },
  {
    id: "outcome-died-heroic",
    conditions: {
      sacrificed_self: true
    },
    survived: false,
    epilogue: `You did not survive, but your sacrifice...`
  },
  {
    id: "outcome-default",
    conditions: {},  // Empty conditions = default outcome
    survived: true,
    epilogue: `You survived the mission...`
  }
];
```

### Outcome Logic

- The game checks outcomes in order from top to bottom
- The first outcome whose `conditions` match the player's flags is used
- Always include a default outcome with empty `conditions: {}` at the end
- Conditions use AND logic (all flags must match)

---

## Knowledge Questions Template

Create `knowledge-questions.js` with AP-style multiple-choice questions:

```javascript
const knowledgeQuestions = [
  {
    id: 'mission-role-q-01',
    roleSpecific: 'role-id',  // Must match role id from mission.js
    apSkill: 'causation',  // Options: causation, continuity, perspective, argumentation
    question: 'What factor most directly contributed to [historical event]?',
    options: [
      {
        id: 'a',
        text: 'First answer option',
        correct: true  // Only one option should be correct
      },
      {
        id: 'b',
        text: 'Second answer option',
        correct: false
      },
      {
        id: 'c',
        text: 'Third answer option',
        correct: false
      },
      {
        id: 'd',
        text: 'Fourth answer option',
        correct: false
      }
    ],
    explanation: 'Detailed explanation of why the correct answer is correct and why the others are wrong. Include historical context and connect to AP themes.'
  },
  // Add 3 questions per role (9 total for 3 roles)
];

export default knowledgeQuestions;
```

### Question Writing Tips

1. **Role-Specific**: Each role should have 3 unique questions
2. **AP Skills**: Tag each question with the reasoning skill it assesses
3. **Difficulty**: Write college-level questions that require analysis, not just recall
4. **Explanations**: Provide educational explanations that teach, not just correct
5. **Historical Accuracy**: Verify all facts before including them

---

## Registering Your Mission

Once your mission files are complete, register it in the Mission Registry:

1. Open `js/content/MissionRegistry.js`
2. Add an import statement at the top:
   ```javascript
   import yourMission from './missions/your-mission-name/mission.js';
   ```
3. Find the section where missions are registered (look for `missionRegistry.register()` calls)
4. Add your mission:
   ```javascript
   missionRegistry.register(yourMission);
   ```

**That's it!** The game engine will automatically:
- Add your mission to the timeline
- Position it chronologically based on `historicalDate`
- Make it playable if `unlocked: true`
- Load all roles, scenes, and questions

---

## Testing Your Mission

### Manual Testing Checklist

- [ ] Mission appears on the timeline in the correct chronological position
- [ ] Clicking the mission node navigates to role selection
- [ ] All roles display with correct names and descriptions
- [ ] Each role has 4-5 scenes that display correctly
- [ ] Choices set consequence flags (check browser console)
- [ ] Scene transitions work smoothly
- [ ] Progress indicator updates correctly
- [ ] Atmospheric effects trigger appropriately
- [ ] Different choices lead to different outcomes
- [ ] Outcomes reflect the decisions made
- [ ] Historical ripple timeline displays and animates
- [ ] Knowledge questions are role-specific
- [ ] Answer feedback works correctly
- [ ] Results card displays all information
- [ ] No JavaScript errors in browser console

### Testing on Different Devices

- **Desktop**: Test at 1280px width
- **Tablet**: Test at 768px width
- **Mobile**: Test at 320px width
- **Keyboard**: Navigate using Tab, Enter, and Arrow keys

### Common Issues

**Mission doesn't appear on timeline**:
- Check that `historicalDate` is in ISO format (YYYY-MM-DD)
- Verify mission is registered in MissionRegistry.js
- Check browser console for errors

**Scenes don't transition**:
- Verify `nextScene` IDs match scene `id` values exactly
- Check that final scene has `nextScene: "outcome"`
- Look for typos in scene IDs

**Outcomes don't match choices**:
- Verify consequence flag names match between scenes and outcomes
- Check that outcome conditions use the correct flag names
- Remember: conditions use AND logic (all must match)

**Questions don't appear**:
- Verify `roleSpecific` matches the role `id` exactly
- Check that questions are imported in mission.js
- Ensure `knowledgeQuestions` array is exported

---

## Best Practices

### Historical Accuracy

1. **Research First**: Use primary sources, academic histories, and reputable websites
2. **Cite Sources**: Add comments in your code noting where facts came from
3. **Verify Dates**: Double-check all dates, names, and events
4. **Avoid Myths**: Don't perpetuate historical myths or inaccuracies
5. **Multiple Perspectives**: Show the complexity of historical events

### Writing Quality

1. **Show, Don't Tell**: Use sensory details and emotions, not just facts
2. **Moral Complexity**: Avoid simplistic "good vs. evil" narratives
3. **Meaningful Choices**: Every choice should feel significant
4. **Consequences Matter**: Player decisions should affect outcomes
5. **Educational Value**: Connect to AP themes and learning objectives

### Technical Quality

1. **No Engine Modifications**: Only edit content files, never engine files
2. **Consistent Naming**: Use kebab-case for IDs (e.g., `american-sailor`)
3. **Descriptive Flags**: Use clear flag names (e.g., `helped_comrade`, not `flag1`)
4. **Test Thoroughly**: Play through every role and choice combination
5. **Check Console**: Look for errors and warnings in browser console

### AP Curriculum Alignment

1. **Tag Every Scene**: Include at least one AP theme per scene
2. **Use All Skills**: Incorporate causation, continuity, perspective, and argumentation
3. **College-Level Questions**: Write questions that require analysis and synthesis
4. **Historical Thinking**: Focus on reasoning skills, not just memorization
5. **Curriculum Codes**: Include AP Key Concept codes when applicable

---

## Example: Complete Mini-Mission

Here's a simplified example showing all the pieces together:

### `js/content/missions/example/mission.js`

```javascript
import exampleRole from './example-role.js';
import knowledgeQuestions from './knowledge-questions.js';

const exampleMission = {
  id: 'example-mission',
  title: 'Example Historical Event',
  historicalDate: '2000-01-01',
  era: 'Modern',
  unlocked: true,
  teaser: 'A brief example mission for demonstration',
  
  roles: [
    {
      id: 'example-role',
      name: 'Example Role',
      description: 'Experience the event from this perspective',
      scenes: exampleRole.scenes,
      outcomes: exampleRole.outcomes
    }
  ],
  
  knowledgeQuestions: knowledgeQuestions,
  
  historicalRipple: [
    {
      id: 'ripple-01',
      date: 'January 1, 2000',
      title: 'Event Occurs',
      description: 'The historical event takes place',
      apTheme: 'causation',
      animationDelay: 1000
    }
  ]
};

export default exampleMission;
```

### `js/content/missions/example/example-role.js`

```javascript
const exampleScenes = [
  {
    id: "scene-01",
    narrative: `You stand at a crossroads. The year is 2000, and history is about to change.`,
    apThemes: ["perspective"],
    atmosphericEffect: null,
    choices: [
      {
        id: "choice-01-a",
        text: "Take the left path",
        consequences: { went_left: true },
        nextScene: "scene-02"
      },
      {
        id: "choice-01-b",
        text: "Take the right path",
        consequences: { went_right: true },
        nextScene: "scene-02"
      }
    ]
  },
  {
    id: "scene-02",
    narrative: `Your choice has led you here. What happens next?`,
    apThemes: ["causation"],
    atmosphericEffect: null,
    choices: [
      {
        id: "choice-02-final",
        text: "Complete the journey",
        consequences: { mission_complete: true },
        nextScene: "outcome"
      }
    ]
  }
];

const exampleOutcomes = [
  {
    id: "outcome-left",
    conditions: { went_left: true },
    survived: true,
    epilogue: `You took the left path and discovered...`
  },
  {
    id: "outcome-right",
    conditions: { went_right: true },
    survived: true,
    epilogue: `You took the right path and found...`
  },
  {
    id: "outcome-default",
    conditions: {},
    survived: true,
    epilogue: `Your journey is complete.`
  }
];

export default {
  scenes: exampleScenes,
  outcomes: exampleOutcomes
};
```

### `js/content/missions/example/knowledge-questions.js`

```javascript
const knowledgeQuestions = [
  {
    id: 'example-q-01',
    roleSpecific: 'example-role',
    apSkill: 'causation',
    question: 'What caused the historical event?',
    options: [
      { id: 'a', text: 'Correct answer', correct: true },
      { id: 'b', text: 'Incorrect answer', correct: false },
      { id: 'c', text: 'Incorrect answer', correct: false },
      { id: 'd', text: 'Incorrect answer', correct: false }
    ],
    explanation: 'The correct answer is A because...'
  }
];

export default knowledgeQuestions;
```

---

## Getting Help

If you encounter issues:

1. **Check the Console**: Open browser developer tools (F12) and look for error messages
2. **Review Examples**: Study the Pearl Harbor mission files for reference
3. **Test Incrementally**: Add one scene at a time and test after each addition
4. **Ask Questions**: Open an issue on GitHub with your question

---

## Mission Ideas

Need inspiration? Here are some historical events that would make great missions:

- **Ancient**: Battle of Thermopylae, Fall of Rome, Siege of Masada
- **Medieval**: Battle of Hastings, Siege of Constantinople, Black Death
- **Early Modern**: Storming of the Bastille, Boston Tea Party, Battle of Waterloo
- **Modern**: Titanic sinking, Moon landing, Fall of the Berlin Wall
- **Contemporary**: 9/11, Arab Spring, COVID-19 pandemic

Choose events with:
- Multiple perspectives (different roles)
- Moral complexity (difficult choices)
- Historical significance (lasting impact)
- Educational value (AP curriculum alignment)

---

## License and Attribution

When creating missions:
- Use primary sources and academic research
- Cite your sources in code comments
- Respect copyright and fair use guidelines
- Attribute quotes and specific phrasings
- Paraphrase rather than copy verbatim

---

**Thank you for contributing to Witness Interactive!** Your work helps students experience history in an immersive, educational way. Every mission you create brings the past to life for a new generation of learners.
