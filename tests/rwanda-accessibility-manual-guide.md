# Rwanda Mission - Manual Accessibility Testing Guide

## Task 12: Accessibility and Mobile Testing
**Requirements**: NFR-3.1

This guide provides step-by-step instructions for manually testing the Rwanda Genocide Mission's accessibility compliance with WCAG AA standards.

---

## Test 1: Screen Reader Compatibility (NVDA/JAWS)

### Setup
- Install NVDA (free) or JAWS (trial available)
- Open http://localhost:8000 in browser
- Start screen reader

### Test Steps - Hutu Moderate Role

1. **Navigate to Rwanda Mission**
   - [ ] Screen reader announces "Rwanda, 1994" button
   - [ ] Button has clear accessible name
   - [ ] Activate with Enter key

2. **Role Selection**
   - [ ] Screen reader announces "Hutu Moderate" role button
   - [ ] Role description is read aloud
   - [ ] Can select with Enter/Space

3. **Scene Navigation**
   - [ ] Narrative text is announced when scene loads
   - [ ] ARIA live region updates on scene transitions
   - [ ] Choice buttons have clear accessible names
   - [ ] Timer countdown is announced (if present)

4. **Choice Selection**
   - [ ] Each choice button text is read clearly
   - [ ] Button state (enabled/disabled) is announced
   - [ ] Selection feedback is provided

### Test Steps - Tutsi Survivor Role

1. **Navigate to Rwanda Mission**
   - [ ] Select "Tutsi Survivor" role
   - [ ] Screen reader announces role name and description

2. **Timed Choice Scenes**
   - [ ] Timer countdown is announced via ARIA live region
   - [ ] Default choice is clearly indicated
   - [ ] Time remaining is communicated

3. **Scene Transitions**
   - [ ] New scene content is announced
   - [ ] Focus is managed appropriately
   - [ ] No content is skipped

### Test Steps - UN Peacekeeper Role

1. **Navigate to Rwanda Mission**
   - [ ] Select "UN Peacekeeper" role
   - [ ] Screen reader announces role name and description

2. **Full Playthrough**
   - [ ] All narrative text is accessible
   - [ ] All choices are accessible
   - [ ] Outcome screen is accessible
   - [ ] Historical ripple timeline is accessible

---

## Test 2: Keyboard Navigation

### Test Steps - All Roles

1. **Tab Navigation**
   - [ ] Tab key moves focus through all interactive elements
   - [ ] Focus order is logical (top to bottom, left to right)
   - [ ] Focus indicator is visible on all elements
   - [ ] No keyboard traps

2. **Enter/Space Activation**
   - [ ] Enter key activates focused buttons
   - [ ] Space key activates focused buttons
   - [ ] Both keys work consistently

3. **Arrow Key Navigation** (if applicable)
   - [ ] Arrow keys navigate within groups
   - [ ] Arrow keys work in radio button groups
   - [ ] Arrow keys work in list boxes

4. **Escape Key** (if applicable)
   - [ ] Escape closes modals/dialogs
   - [ ] Escape cancels operations
   - [ ] Focus returns to trigger element

### Full Keyboard Playthrough

1. **Start Game**
   - [ ] Tab to "Begin" button
   - [ ] Press Enter to start

2. **Select Mission**
   - [ ] Tab to "Rwanda, 1994" button
   - [ ] Press Enter to select

3. **Select Role**
   - [ ] Tab through role buttons
   - [ ] Press Enter on "Hutu Moderate"

4. **Play Through Scenes**
   - [ ] Tab to first choice
   - [ ] Press Enter to select
   - [ ] Repeat for 3-5 scenes
   - [ ] Complete mission using only keyboard

---

## Test 3: Mobile Viewport Testing

### Test 3.1: 320px Viewport (Small Mobile)

**Device**: iPhone SE, Galaxy S8
**Viewport**: 320px × 568px

1. **Open Developer Tools**
   - Press F12
   - Click device toolbar icon
   - Select "iPhone SE" or set custom 320×568

2. **Test Rwanda Mission**
   - [ ] Mission button is visible and tappable
   - [ ] Role selection buttons fit on screen
   - [ ] No horizontal scrolling
   - [ ] Narrative text is readable
   - [ ] Choice buttons are tappable (min 44×44px)
   - [ ] Timer display is visible
   - [ ] No content is cut off

3. **Test Interactions**
   - [ ] Tap to select mission
   - [ ] Tap to select role
   - [ ] Tap to make choices
   - [ ] Scroll to read long narrative
   - [ ] All buttons respond to touch

### Test 3.2: 768px Viewport (Tablet)

**Device**: iPad, Galaxy Tab
**Viewport**: 768px × 1024px

1. **Open Developer Tools**
   - Press F12
   - Click device toolbar icon
   - Select "iPad" or set custom 768×1024

2. **Test Rwanda Mission**
   - [ ] Layout adapts to tablet size
   - [ ] Content is centered or well-distributed
   - [ ] Text is readable without zooming
   - [ ] Buttons are appropriately sized
   - [ ] No awkward spacing or gaps

3. **Test Interactions**
   - [ ] Touch interactions work smoothly
   - [ ] Landscape orientation works
   - [ ] Portrait orientation works

### Test 3.3: 1280px Viewport (Desktop)

**Device**: Desktop/Laptop
**Viewport**: 1280px × 720px

1. **Open Browser**
   - Resize window to 1280×720
   - Or use full screen on 1280px monitor

2. **Test Rwanda Mission**
   - [ ] Content is centered
   - [ ] Max-width constraints are applied
   - [ ] Text is readable
   - [ ] Layout is balanced
   - [ ] No excessive whitespace

3. **Test Interactions**
   - [ ] Mouse clicks work
   - [ ] Hover states are visible
   - [ ] Focus states are visible

---

## Test 4: Color Contrast (WCAG AA)

### Tools
- Chrome DevTools Lighthouse
- WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- Browser extension: WAVE or axe DevTools

### Test Steps

1. **Narrative Text Contrast**
   - [ ] Open Rwanda mission
   - [ ] Inspect narrative text element
   - [ ] Check color contrast ratio
   - [ ] **Required**: 4.5:1 for normal text (16px)
   - [ ] **Required**: 3:1 for large text (18px+)

2. **Choice Button Contrast**
   - [ ] Inspect choice button
   - [ ] Check text color vs background
   - [ ] Check border color vs background
   - [ ] **Required**: 4.5:1 for button text
   - [ ] **Required**: 3:1 for button border

3. **Focus Indicator Contrast**
   - [ ] Tab to focus a button
   - [ ] Check focus outline color
   - [ ] **Required**: 3:1 contrast with background

4. **Timer Display Contrast**
   - [ ] Find scene with timer
   - [ ] Check timer text color
   - [ ] Check timer background
   - [ ] **Required**: 4.5:1 for timer text

5. **Atmospheric Effects Contrast**
   - [ ] Progress through scenes with effects
   - [ ] Verify text remains readable
   - [ ] Check opacity doesn't drop below 0.7
   - [ ] Ensure contrast is maintained

### Using Chrome Lighthouse

1. **Open DevTools**
   - Press F12
   - Click "Lighthouse" tab

2. **Run Accessibility Audit**
   - Select "Accessibility" category
   - Click "Generate report"
   - Review contrast issues

3. **Check Results**
   - [ ] No contrast errors
   - [ ] All elements pass WCAG AA
   - [ ] Score is 90+ (ideally 100)

---

## Test 5: Focus Management

### Test Steps

1. **Focus Visibility**
   - [ ] Tab through all interactive elements
   - [ ] Focus indicator is always visible
   - [ ] Focus indicator has sufficient contrast
   - [ ] Focus indicator is not hidden by other elements

2. **Focus Order**
   - [ ] Focus moves in logical order
   - [ ] Focus doesn't jump unexpectedly
   - [ ] Focus order matches visual order

3. **Focus During Transitions**
   - [ ] Make a choice
   - [ ] Verify focus is not lost
   - [ ] Focus moves to meaningful element
   - [ ] Focus is not on body element

4. **Focus During Typewriter**
   - [ ] Watch typewriter animation
   - [ ] Tab during animation
   - [ ] Verify focus is maintained
   - [ ] Verify focus doesn't interfere with animation

5. **Focus During Timer**
   - [ ] Find scene with timer
   - [ ] Tab to choice button
   - [ ] Wait during countdown
   - [ ] Verify focus remains on button

---

## Test 6: Reduced Motion Support

### Test Steps

1. **Enable Reduced Motion**
   - **Windows**: Settings > Ease of Access > Display > Show animations
   - **Mac**: System Preferences > Accessibility > Display > Reduce motion
   - **Browser**: DevTools > Rendering > Emulate CSS media feature prefers-reduced-motion

2. **Test Rwanda Mission**
   - [ ] Typewriter animation is disabled (text appears instantly)
   - [ ] Scene transitions are instant or very fast
   - [ ] Atmospheric effects are reduced or disabled
   - [ ] Timer pulse effects are disabled
   - [ ] Choice button hover effects are reduced

3. **Verify Functionality**
   - [ ] Game still works correctly
   - [ ] No features are broken
   - [ ] Content is still accessible

---

## Test 7: WCAG 2.1 Level AA Compliance

### Checklist

#### Perceivable
- [ ] 1.1.1 Non-text Content: All images have alt text
- [ ] 1.3.1 Info and Relationships: Semantic HTML is used
- [ ] 1.3.2 Meaningful Sequence: Reading order is logical
- [ ] 1.4.3 Contrast (Minimum): 4.5:1 for normal text, 3:1 for large text
- [ ] 1.4.4 Resize Text: Text can be resized to 200% without loss of content
- [ ] 1.4.10 Reflow: Content reflows at 320px without horizontal scrolling
- [ ] 1.4.11 Non-text Contrast: UI components have 3:1 contrast
- [ ] 1.4.12 Text Spacing: Text spacing can be adjusted without loss of content

#### Operable
- [ ] 2.1.1 Keyboard: All functionality available via keyboard
- [ ] 2.1.2 No Keyboard Trap: Focus can move away from all elements
- [ ] 2.1.4 Character Key Shortcuts: No single-key shortcuts (or can be disabled)
- [ ] 2.2.1 Timing Adjustable: Timed choices have default option
- [ ] 2.2.2 Pause, Stop, Hide: Animations can be paused (via reduced motion)
- [ ] 2.4.3 Focus Order: Focus order is logical
- [ ] 2.4.7 Focus Visible: Focus indicator is always visible

#### Understandable
- [ ] 3.1.1 Language of Page: HTML lang attribute is set
- [ ] 3.2.1 On Focus: No unexpected context changes on focus
- [ ] 3.2.2 On Input: No unexpected context changes on input
- [ ] 3.3.1 Error Identification: Errors are clearly identified
- [ ] 3.3.2 Labels or Instructions: Form elements have labels

#### Robust
- [ ] 4.1.2 Name, Role, Value: All UI components have accessible names
- [ ] 4.1.3 Status Messages: Status messages use ARIA live regions

---

## Test Results Template

### Test Date: _______________
### Tester: _______________
### Browser: _______________
### Screen Reader: _______________

### Summary
- [ ] All screen reader tests passed
- [ ] All keyboard navigation tests passed
- [ ] All mobile viewport tests passed
- [ ] All color contrast tests passed
- [ ] All focus management tests passed
- [ ] All reduced motion tests passed
- [ ] WCAG 2.1 Level AA compliance achieved

### Issues Found
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

### Recommendations
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

---

## Automated Testing (Optional)

If Playwright config is updated to allow Rwanda tests:

```bash
# Run accessibility tests
npx playwright test tests/rwanda-accessibility.spec.js

# Run with specific browser
npx playwright test tests/rwanda-accessibility.spec.js --project=chromium

# Run with headed mode (see browser)
npx playwright test tests/rwanda-accessibility.spec.js --headed

# Generate HTML report
npx playwright test tests/rwanda-accessibility.spec.js --reporter=html
```

---

## Resources

- **WCAG 2.1 Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/
- **WebAIM Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **NVDA Screen Reader**: https://www.nvaccess.org/download/
- **JAWS Screen Reader**: https://www.freedomscientific.com/products/software/jaws/
- **Chrome Lighthouse**: Built into Chrome DevTools
- **axe DevTools**: https://www.deque.com/axe/devtools/

---

## Notes

- This manual testing guide complements the automated Playwright tests
- Manual testing is essential for screen reader compatibility
- Real users with disabilities provide the best accessibility feedback
- WCAG AA is the minimum standard; AAA is ideal but not always achievable
- Accessibility is an ongoing process, not a one-time checklist
