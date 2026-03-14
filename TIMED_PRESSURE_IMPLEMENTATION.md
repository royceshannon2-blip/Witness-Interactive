# Timed Pressure Moments - Implementation Complete

## Changes Made

### ISSUE 9: Tutsi Survivor - Roadblock Timed Choice

**File:** `js/content/missions/rwanda/tutsi-survivor.js`

**Scene Modified:** `rw-ts-scene-03d` (roadblock before hotel)

**Changes:**
1. Split scene into two parts:
   - `rw-ts-scene-03d`: The roadblock moment with timed choice
   - `rw-ts-scene-03d-inside`: Inside the hotel (existing content)

2. Added timed choice configuration:
   ```javascript
   timedChoice: { enabled: true, duration: 10000, defaultChoice: "rw-ts-choice-03d-b" }
   ```

3. Updated narrative to emphasize pressure:
   - "He's waiting. Two seconds. The line behind you is moving."
   - "Behind him, the gate. Safety. Behind you, the street."
   - "He snaps his fingers once."

4. Modified choices:
   - Choice A: Show Marie's Hutu card (fast action)
   - Choice B: Show real Tutsi card (default - paralysis under pressure)

**Design Intent:** If the student acts fast, they show the false card. If they freeze (timer expires), they show the real ID, simulating paralysis under pressure.

---

### ISSUE 10: UN Peacekeeper - Named Embassy Worker

**File:** `js/content/missions/rwanda/un-peacekeeper.js`

**Scene Modified:** `rw-un-scene-02b` (evacuation convoy)

**Changes:**
1. Added named character: Jean-Baptiste Nkurunziza
   - Canadian embassy lanyard
   - Consular processing desk worker
   - Known face to Captain Webb
   - Has a daughter (8 years old) with school backpack

2. Enhanced narrative with specific details:
   - "I processed visas for your staff for three years"
   - "My children are Rwandan. I am Rwandan."
   - "Your orders were written by people who are not here."

3. Kept the woman with child as additional pressure
   - Shows scale of the crisis
   - "No lanyard. No embassy connection. Just a child."

**Design Intent:** The documented historical betrayal of Rwandan embassy staff is now personalized through Jean-Baptiste, making the moral weight of the "foreign nationals only" order visceral and specific.

---

## Testing Recommendations

1. **Tutsi Survivor Roadblock:**
   - Test that timer defaults to showing real ID
   - Verify both paths lead to hotel interior scene
   - Check that narrative pressure is legible

2. **UN Peacekeeper Convoy:**
   - Verify Jean-Baptiste's character details render correctly
   - Test that both choices (follow orders / take Rwandans) work
   - Confirm timer still functions (12 seconds)

3. **Integration:**
   - Run full Rwanda mission playthrough
   - Check that consequence flags propagate correctly
   - Verify outcome screens reflect new choices

---

## Historical Accuracy Notes

**Tutsi Survivor:**
- Identity cards were indeed death sentences at roadblocks
- Paralysis/freezing under extreme pressure is documented survivor behavior
- False IDs were a common survival strategy

**UN Peacekeeper:**
- Rwandan embassy staff were systematically abandoned by Western governments
- Many had worked for years processing visas for the same people who left them behind
- The "foreign nationals only" order is historically documented
- This betrayal is one of the most painful aspects of the international response

---

## Status: ✅ COMPLETE

Both timed pressure moments are now implemented with:
- Historical accuracy
- Psychological realism
- Clear narrative pressure
- Proper technical implementation
- No syntax errors
