# Witness Interactive: Pearl Harbor

**Experience history from three perspectives. Make choices that matter. Learn AP US History through immersive gameplay.**

Witness Interactive: Pearl Harbor is a browser-based educational history game that places students in the December 7, 1941 attack on Pearl Harbor. Play as a Japanese Naval Aviator, an American Sailor aboard the USS Arizona, or an American Civilian to experience this pivotal moment from multiple viewpoints.

## 🎓 Educational Value

This game is designed for **AP US History students** and aligns with AP curriculum standards:

- **AP Reasoning Skills**: Every scene is tagged with causation, continuity, perspective, or argumentation themes
- **Historical Accuracy**: All narrative content is based on primary sources and historical research
- **Assessment Integration**: Built-in knowledge checkpoint with AP-style multiple-choice questions
- **Critical Thinking**: Choices reflect real historical dilemmas and moral complexity
- **Long-term Context**: Historical Ripple timeline connects immediate events to broader consequences

Perfect for:
- AP US History exam preparation
- College-level history courses
- Self-directed learners exploring WWII history
- Classroom assignments with verifiable completion

## 🎮 How to Play

### Getting Started

1. **Visit the game**: Open `index.html` in any modern browser (Chrome, Firefox, Safari, Edge)
2. **Choose your perspective**: Select from three historical roles on the timeline
3. **Experience the narrative**: Read cinematic scenes and make meaningful choices
4. **See the consequences**: Your decisions affect survival outcomes and historical understanding
5. **Test your knowledge**: Answer AP-style questions about the historical context
6. **Share your results**: Copy your completion card to share with teachers or friends

### Three Playable Roles

**Japanese Naval Aviator**
Experience the attack from the cockpit of a Mitsubishi A6M Zero fighter. Navigate tactical decisions, moral dilemmas, and the fog of war.

**American Sailor (USS Arizona)**
Witness the surprise attack from the deck of the USS Arizona. Make split-second survival decisions as chaos erupts around you.

**American Civilian**
Experience the attack from Honolulu as a civilian. Navigate confusion, fear, and the immediate aftermath of the bombing.

### Gameplay Features

- **4-5 narrative scenes per role** with branching choices
- **Consequence tracking** - your decisions affect outcomes
- **Atmospheric effects** - smoke, fire, and screen shake immerse you in the moment
- **Progress tracking** - see which roles you've completed (session-based)
- **Knowledge checkpoint** - 3 AP-style questions per role
- **Shareable results card** - prove completion to teachers
- **Full keyboard navigation** - accessible to all students
- **Mobile-friendly** - play on phone, tablet, or desktop

## 🚀 Deployment (GitHub Pages)

### Quick Deploy

1. **Fork or clone this repository**
   ```bash
   git clone https://github.com/yourusername/witness-interactive.git
   cd witness-interactive
   ```

2. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Deploy from branch `main`
   - Folder: `/ (root)`
   - Click Save

3. **Access your deployment**
   - Your game will be live at: `https://yourusername.github.io/witness-interactive/`
   - Share this URL with students

### Local Testing

No build tools or dependencies required! Simply:

```bash
# Open directly in browser
open index.html

# Or use a simple HTTP server (optional)
python -m http.server 8000
# Then visit http://localhost:8000
```

### Deployment Notes

- **Zero dependencies**: No npm, no build step, no compilation
- **Instant updates**: Push to `main` branch and GitHub Pages updates automatically
- **Offline capable**: After first load, game works without internet
- **No server required**: Pure client-side HTML/CSS/JavaScript

## 🏗️ Architecture Overview

### Design Principles

1. **Data-driven**: All content separated from engine logic
2. **Event-driven**: Components communicate via EventBus (no tight coupling)
3. **Zero dependencies**: Pure vanilla JavaScript (ES6 modules)
4. **Accessibility-first**: WCAG 2.1 AA compliant with full keyboard navigation
5. **Mobile-responsive**: Works on devices from 320px to 4K displays

### Folder Structure

```
witness-interactive/
├── index.html              # Single entry point
├── css/
│   └── style.css          # All styles with CSS custom properties
├── js/
│   ├── main.js            # Application bootstrap
│   ├── engine/            # Core game logic (DO NOT EDIT for content)
│   │   ├── EventBus.js
│   │   ├── SceneStateMachine.js
│   │   ├── ConsequenceSystem.js
│   │   ├── UIController.js
│   │   ├── TimelineSelector.js
│   │   ├── ResultsCard.js
│   │   ├── AnalyticsTracker.js
│   │   └── LoadingStateHandler.js
│   └── content/           # Mission content (EDIT HERE to add missions)
│       ├── MissionRegistry.js
│       └── missions/
│           └── pearl-harbor/
│               ├── mission.js
│               ├── japanese-aviator.js
│               ├── american-sailor.js
│               ├── american-civilian.js
│               └── knowledge-questions.js
└── README.md
```

### Key Components

**EventBus** - Lightweight pub/sub system for component communication

**SceneStateMachine** - Manages scene transitions and validates state changes

**ConsequenceSystem** - Tracks player decisions and calculates outcomes

**UIController** - Handles all DOM manipulation and screen rendering

**TimelineSelector** - Interactive historical timeline for mission selection

**MissionRegistry** - Central catalog of all missions (add new missions here)

**AnalyticsTracker** - Session tracking for future analytics integration

**ResultsCard** - Generates shareable outcome cards for teacher verification

### Adding New Missions

See `CONTRIBUTING.md` for detailed instructions on adding new historical missions. The architecture supports 50+ missions without modifying engine code.

## 🗺️ Roadmap

### Current Status: MVP Complete ✅

- ✅ Pearl Harbor mission with 3 roles
- ✅ Interactive historical timeline
- ✅ Choice/consequence system
- ✅ Knowledge checkpoint with AP questions
- ✅ Historical Ripple timeline
- ✅ Shareable results card
- ✅ Mobile responsive design
- ✅ Keyboard navigation
- ✅ GitHub Pages deployment

### Phase 2: Content Expansion (Q2 2026)

**Ancient World**
- Fall of Rome (476 CE)
- Battle of Thermopylae (480 BCE)

**Medieval Era**
- Battle of Hastings (1066)
- Siege of Constantinople (1453)

**Early Modern**
- Boston Massacre (1770)
- Storming of the Bastille (1789)

**World War I**
- Christmas Truce (1914)
- Battle of the Somme (1916)

**Cold War**
- Cuban Missile Crisis (1962)
- Fall of the Berlin Wall (1989)

**Modern Era**
- 9/11 Attacks (2001)
- Arab Spring (2011)

### Phase 3: Enhanced Features (Q3 2026)

- Teacher dashboard with class codes
- Student progress tracking
- LMS integration (Canvas, Blackboard, Google Classroom)
- Audio narration and sound effects
- Enhanced visual effects
- Achievement system
- Multiplayer discussion mode

### Phase 4: School District Licensing (Q4 2026)

- District-wide deployment tools
- Grade export functionality
- Curriculum mapping tools
- Professional development resources
- Custom mission builder for teachers

## 🧪 Testing

### Manual Testing Checklist

- [x] All three roles playable end-to-end
- [x] Consequence flags affect outcomes correctly
- [x] Knowledge checkpoint scoring works
- [x] Results card displays and is shareable
- [x] Timeline selector shows Pearl Harbor unlocked
- [x] Mobile responsive (320px minimum)
- [x] Keyboard navigation functional
- [x] No console errors on load
- [x] Historical ripple timeline animates

### Browser Compatibility

**Tested and supported:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Mobile browsers:**
- iOS Safari 14+
- Chrome Mobile 90+
- Samsung Internet 14+

### Accessibility

- Full keyboard navigation (Tab, Enter, Arrow keys)
- ARIA labels on all interactive elements
- Semantic HTML5 structure
- WCAG 2.1 AA color contrast
- Screen reader compatible

## 📚 For Teachers

### Using in the Classroom

1. **Pre-game**: Assign background reading on Pearl Harbor
2. **Gameplay**: Students play all three roles (30-45 minutes)
3. **Discussion**: Compare perspectives and discuss moral complexity
4. **Assessment**: Review knowledge checkpoint scores
5. **Follow-up**: Essay prompt on causation or perspective

### Verifying Student Completion

Students can copy their results card which includes:
- Mission name and role played
- Survival outcome
- Knowledge checkpoint score (X/3 correct)
- Completion timestamp
- AP themes engaged

### Curriculum Alignment

**AP US History Themes:**
- American and National Identity
- Work, Exchange, and Technology
- Geography and the Environment
- Migration and Settlement
- Politics and Power
- America in the World
- American and Regional Culture
- Social Structures

**AP Historical Reasoning Skills:**
- Causation
- Continuity and Change Over Time
- Comparison
- Contextualization
- Historical Argumentation
- Appropriate Use of Relevant Historical Evidence

## 🤝 Contributing

We welcome contributions! See `CONTRIBUTING.md` for:
- How to add new missions
- Scene data structure templates
- Content writing guidelines
- Code style conventions
- Testing requirements

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 🙏 Acknowledgments

- Historical research based on National WWII Museum archives
- AP curriculum alignment reviewed by certified AP US History teachers
- Accessibility testing conducted with screen reader users
- Beta testing by high school AP History students

## 📧 Contact

For questions, bug reports, or feature requests:
- Open an issue on GitHub
- Email: witness-interactive@example.com
- Twitter: @WitnessInteractive

---

**Built with ❤️ for history education. No frameworks. No dependencies. Just pure web standards.**
