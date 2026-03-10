---
inclusion: always
---

# UX Feedback and Updates System - Maintenance Rules

## Critical: Never Break These Systems

The feedback survey and update panel are essential for product improvement and player communication. Follow these rules strictly:

### Post-Mission Feedback Survey

**Always maintain:**
- `game:complete` event listener in FeedbackSurveyPanel
- Data collection: missionId, roleId, flags, survival result, outcome id
- EventBus subscription pattern (no direct coupling)

**When modifying mission flow:**
- If SceneStateMachine changes, ensure `game:complete` still fires
- If ConsequenceSystem changes, ensure `getAllFlags()` and `determineSurvival()` remain available
- If outcome selection changes, feedback must still capture the chosen outcome

**When adding new roles/missions:**
- No code changes needed - system auto-captures new IDs
- Ensure ConsequenceSystem has survival logic for new roles
- Test that feedback appears after new mission completion

### Pre-Game Update Panel

**Always update when:**
- Adding new features that affect player experience
- Fixing bugs that players would notice
- Changing UI/UX in any visible way
- Modifying mission content or balancing

**Update process:**
1. Edit `config/update-notes.json` with new version and bullets
2. Update `config/version.js` to match version number
3. Write in plain language for non-technical players
4. Focus on player benefits, not implementation details

**Never:**
- Remove the update panel initialization from main.js
- Skip updating notes when making player-facing changes
- Use technical jargon in update notes
- Break the JSON format in update-notes.json

### Configuration Files

**config/feedback-config.js:**
- Default to 'console' mode for development
- Document any endpoint URL changes
- Keep surveyFrequency at 1 for MVP

**config/update-notes.json:**
- Always valid JSON
- Keep "new" and "fixed" arrays
- Use player-friendly language
- Update version and date together

**config/version.js:**
- Single source of truth for version
- Keep synchronized with update-notes.json

### Architecture Compliance

These systems follow all architecture rules:

- ✅ EventBus for all communication
- ✅ No global variables
- ✅ ES6 modules only
- ✅ No frameworks or build tools
- ✅ CSS custom properties for styling
- ✅ Loose coupling via events

**Module locations:**
- UI components: `js/ui/`
- Services: `js/services/`
- Config: `config/`
- Styles: `css/`
- Docs: `docs/`

### Testing Requirements

**Before committing changes:**
1. Complete a full mission playthrough
2. Verify feedback survey appears
3. Verify update panel shows on fresh load
4. Check console for errors
5. Test on mobile viewport

**When refactoring:**
1. Run full game flow test
2. Verify all events still fire correctly
3. Check that data payload is complete
4. Test survey frequency logic

### Common Scenarios

**Scenario: Adding a new scene to a role**
- Action: Update `config/update-notes.json` with "New scene in [role] storyline"
- No code changes needed for feedback system

**Scenario: Changing survival calculation**
- Action: Ensure `determineSurvival()` still returns `{ survived, deathChance, modifiers }`
- Test that feedback captures new survival data

**Scenario: Refactoring SceneStateMachine**
- Action: Ensure `game:complete` event still emits with `{ missionId, roleId }`
- Test that feedback survey still appears

**Scenario: Adding a new mission**
- Action: Update notes with "New mission: [name]"
- No feedback system changes needed

**Scenario: Fixing a bug**
- Action: Add to "fixed" array in update-notes.json
- Describe the player-visible fix, not the code change

### Documentation

**Always keep updated:**
- `docs/feedback-and-updates.md` - Main documentation
- This steering file - Maintenance rules
- Inline code comments in feedback modules

**When adding features:**
- Document new config options
- Update transport strategy docs if adding new types
- Add troubleshooting entries for common issues

### Future Kiro Behavior

When Kiro makes changes to the codebase:

1. **Check impact on feedback system** - Does this change affect mission completion flow?
2. **Update notes if needed** - Is this change visible to players?
3. **Test event flow** - Do all events still fire correctly?
4. **Verify data capture** - Is all gameplay data still accessible?
5. **Update documentation** - Do docs reflect the changes?

### Red Flags

**Stop and fix immediately if:**
- ❌ `game:complete` event is removed or renamed
- ❌ Feedback survey stops appearing after missions
- ❌ Update panel breaks or shows errors
- ❌ Data payload is missing required fields
- ❌ EventBus subscriptions are removed
- ❌ Config files have syntax errors

### Success Criteria

The systems are working correctly when:
- ✅ Survey appears after every mission completion
- ✅ Update panel shows once per session on load
- ✅ All gameplay data is captured in feedback
- ✅ No console errors related to feedback/updates
- ✅ UI is responsive on mobile and desktop
- ✅ Update notes are current and accurate
