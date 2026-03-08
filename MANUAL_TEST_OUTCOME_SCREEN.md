# Manual Test Plan: Outcome Screen Logic (Task 13.2)

## Test Date: 2026-03-07
## Tester: [Your Name]
## Task: 13.2 - Create outcome screen logic

## Requirements Being Tested
- **Requirement 7.1**: Display survival and outcome screen after narrative completion
- **Requirement 7.2**: Show whether character survived or perished
- **Requirement 7.3**: Display personal epilogue based on consequence flags
- **Requirement 7.4**: Outcome text reflects specific decisions made during gameplay
- **Requirement 7.5**: Provide way to proceed to historical ripple screen

---

## Test Scenarios

### Test 1: American Sailor - Hero Outcome
**Setup:**
- Play through American Sailor role
- Make choices that set: `saved_others: true`, `rescued_swimmers: true`

**Expected Results:**
- [ ] Outcome screen displays after final scene
- [ ] Survival status shows "You Survived" in green/success color
- [ ] Epilogue mentions pulling men from burning water, helping sailors escape
- [ ] Epilogue mentions Navy commendation
- [ ] "Continue" button is visible and clickable
- [ ] Clicking "Continue" transitions to historical ripple screen

**Actual Results:**
- Status: [ ] PASS [ ] FAIL
- Notes:

---

### Test 2: American Sailor - Fighter Outcome
**Setup:**
- Play through American Sailor role
- Make choices that set: `fought_back: true`, `stayed_aboard: true`

**Expected Results:**
- [ ] Outcome screen displays after final scene
- [ ] Survival status shows "You Survived" in green/success color
- [ ] Epilogue mentions manning the guns, fighting back
- [ ] Epilogue mentions staying at post as Arizona died
- [ ] Different epilogue text than hero outcome
- [ ] "Continue" button works correctly

**Actual Results:**
- Status: [ ] PASS [ ] FAIL
- Notes:

---

### Test 3: American Sailor - Survivor Outcome
**Setup:**
- Play through American Sailor role
- Make choices that set: `survival_priority: true`, `abandoned_ship: true`

**Expected Results:**
- [ ] Outcome screen displays after final scene
- [ ] Survival status shows "You Survived" in green/success color
- [ ] Epilogue mentions abandoning ship, jumping into burning water
- [ ] Epilogue mentions guilt and survival
- [ ] Different epilogue text than hero and fighter outcomes
- [ ] "Continue" button works correctly

**Actual Results:**
- Status: [ ] PASS [ ] FAIL
- Notes:

---

### Test 4: American Sailor - Default Outcome
**Setup:**
- Play through American Sailor role
- Make random choices that don't match specific outcome conditions

**Expected Results:**
- [ ] Outcome screen displays after final scene
- [ ] Survival status shows "You Survived" in green/success color
- [ ] Epilogue is generic but still meaningful
- [ ] Epilogue mentions 1,177 shipmates who didn't survive
- [ ] "Continue" button works correctly

**Actual Results:**
- Status: [ ] PASS [ ] FAIL
- Notes:

---

### Test 5: Japanese Aviator - Outcome
**Setup:**
- Play through Japanese Aviator role
- Make any choices

**Expected Results:**
- [ ] Outcome screen displays after final scene
- [ ] Survival status displays correctly based on choices
- [ ] Epilogue reflects Japanese perspective
- [ ] Epilogue text is different from American Sailor outcomes
- [ ] "Continue" button works correctly

**Actual Results:**
- Status: [ ] PASS [ ] FAIL
- Notes:

---

### Test 6: American Civilian - Outcome
**Setup:**
- Play through American Civilian role
- Make any choices

**Expected Results:**
- [ ] Outcome screen displays after final scene
- [ ] Survival status displays correctly based on choices
- [ ] Epilogue reflects civilian perspective
- [ ] Epilogue text is different from other roles
- [ ] "Continue" button works correctly

**Actual Results:**
- Status: [ ] PASS [ ] FAIL
- Notes:

---

### Test 7: Outcome Screen Visual Design
**Setup:**
- Complete any role and view outcome screen

**Expected Results:**
- [ ] Outcome screen uses dark cinematic theme
- [ ] Survival status is prominently displayed
- [ ] Epilogue text is in aged parchment-style panel
- [ ] Text is readable and properly formatted
- [ ] Paragraphs are separated correctly
- [ ] "Continue" button is styled consistently with game theme
- [ ] Screen follows responsive design (test at 320px, 768px, 1280px)

**Actual Results:**
- Status: [ ] PASS [ ] FAIL
- Notes:

---

### Test 8: Console Error Checking
**Setup:**
- Open browser developer console
- Play through any role to outcome screen

**Expected Results:**
- [ ] No JavaScript errors in console
- [ ] No warnings about missing data
- [ ] ConsequenceSystem logs show flags being set correctly
- [ ] Outcome calculation logs show correct outcome ID selected

**Actual Results:**
- Status: [ ] PASS [ ] FAIL
- Notes:

---

### Test 9: Multiple Playthroughs
**Setup:**
- Complete one role
- Click "Play Another Role" from results screen
- Complete a different role

**Expected Results:**
- [ ] Second playthrough shows different outcome based on different choices
- [ ] Outcome screen works correctly on second playthrough
- [ ] No state pollution from first playthrough
- [ ] Each role's outcome is independent

**Actual Results:**
- Status: [ ] PASS [ ] FAIL
- Notes:

---

## Browser Compatibility Testing

### Chrome
- [ ] Outcome screen displays correctly
- [ ] Continue button works
- [ ] No console errors

### Firefox
- [ ] Outcome screen displays correctly
- [ ] Continue button works
- [ ] No console errors

### Safari
- [ ] Outcome screen displays correctly
- [ ] Continue button works
- [ ] No console errors

---

## Accessibility Testing

### Keyboard Navigation
- [ ] Can tab to "Continue" button
- [ ] Can activate button with Enter key
- [ ] Focus indicator is visible

### Screen Reader
- [ ] Survival status is announced
- [ ] Epilogue text is readable
- [ ] Button has appropriate label

---

## Test Summary

**Total Tests:** 9 core scenarios + 3 browsers + accessibility
**Passed:** ___
**Failed:** ___
**Blocked:** ___

**Overall Status:** [ ] PASS [ ] FAIL

**Notes:**

---

## Sign-off

**Tester:** ___________________
**Date:** ___________________
**Approved for deployment:** [ ] YES [ ] NO
