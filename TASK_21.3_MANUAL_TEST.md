# Task 21.3 Manual Test: Role Completion Tracking

## Test Objective
Verify that role completion tracking works correctly:
1. Completed roles are tracked in session state
2. Endings counter updates correctly
3. Completion checkmarks appear on completed roles
4. Special message displays when all 3 roles are completed

## Test Steps

### Step 1: Initial State
1. Open `index.html` in a browser
2. Navigate to role selection screen
3. **Expected**: Endings counter shows "0/3"
4. **Expected**: No completion badges on any role cards
5. **Expected**: No special completion message visible

### Step 2: Complete First Role
1. Select "Japanese Naval Aviator" role
2. Play through all scenes (make any choices)
3. Complete outcome screen, historical ripple, and knowledge checkpoint
4. Click "Play Another Role" button
5. **Expected**: Return to role selection screen
6. **Expected**: Endings counter shows "1/3"
7. **Expected**: Japanese Aviator card shows "✓ Completed" badge
8. **Expected**: Japanese Aviator button text changes to "Play Again"
9. **Expected**: No special completion message yet

### Step 3: Complete Second Role
1. Select "American Sailor (USS Arizona)" role
2. Play through all scenes
3. Complete outcome, ripple, and checkpoint
4. Click "Play Another Role" button
5. **Expected**: Return to role selection screen
6. **Expected**: Endings counter shows "2/3"
7. **Expected**: Both Japanese Aviator and American Sailor cards show completion badges
8. **Expected**: No special completion message yet

### Step 4: Complete Third Role
1. Select "American Civilian" role
2. Play through all scenes
3. Complete outcome, ripple, and checkpoint
4. Click "Play Another Role" button
5. **Expected**: Return to role selection screen
6. **Expected**: Endings counter shows "3/3"
7. **Expected**: All three role cards show completion badges
8. **Expected**: Special completion message appears at top:
   - Title: "All Perspectives Witnessed"
   - Message: "You have experienced Pearl Harbor from all three perspectives..."
   - Styled with gold border and gradient background
   - Animated fade-in effect

### Step 5: Replay Completed Role
1. Click "Play Again" on any completed role
2. Play through the role again
3. **Expected**: Role remains marked as completed
4. **Expected**: Endings counter still shows "3/3"
5. **Expected**: Special completion message still visible

### Step 6: Session Persistence
1. Refresh the browser page (F5)
2. Navigate back to role selection
3. **Expected**: Endings counter resets to "0/3"
4. **Expected**: No completion badges (session-only tracking, no localStorage)
5. **Expected**: No special completion message

## Visual Verification

### Completion Badge Styling
- Badge text: "✓ Completed"
- Position: Top-right corner of role card
- Background: Semi-transparent gold
- Text color: Dark navy

### Completed Role Card Styling
- Border color: Blue accent (lighter than default)
- Button text: "Play Again" instead of "Select Role"

### Special Completion Message Styling
- Background: Gradient (gold to blue, semi-transparent)
- Border: 2px solid gold
- Animation: Fade-in with scale effect
- Title: Gold color, larger font
- Message: Secondary text color, readable line height

## Requirements Validated
- ✅ Requirement 23.1: Track completed roles in session state
- ✅ Requirement 23.2: Show completion status on role selection screen
- ✅ Requirement 23.3: Display "endings discovered" counter
- ✅ Requirement 23.4: Display special message when all roles completed

## Notes
- Role completion tracking is session-only (no localStorage per scope.md)
- Completion state resets on page refresh
- All three roles must be completed to see special message
- Replaying a completed role does not affect completion status
