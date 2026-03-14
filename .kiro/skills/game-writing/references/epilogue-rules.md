# Epilogue Writing Rules

Epilogues are the emotional payoff of the entire role. They are NOT summaries.

## What Makes a Good Epilogue
- Names specific people the player met and shows what happened to them
- Anchors in real dates and institutions (gacaca 2005–2012, ICTR verdicts, Kwibuka April 7th, Canadian Senate 2004)
- Holds contradictions without resolving them
- Ends on a specific image or fact, not a lesson or conclusion

## What Makes a Bad Epilogue
- Summarizes what the player already saw
- Resolves moral complexity ("You made the right choice and found peace")
- Uses generalities instead of specifics
- Ends with an inspirational statement

## Length
- 3–5 paragraphs
- Each paragraph advances time or introduces a new development
- Final paragraph lands on a specific, quiet image

## Epilogue Register Examples

**Good ending (Tutsi Survivor):**
"Jeanne's daughter works at the memorial center now. She called you last year to ask if she could use your story—not your name, just your story—in the educational materials. You said yes. Some things are yours to give away. Some aren't. That one felt like it was."

**Bad ending:**
"You survived the genocide and went on to help others heal. Your experience taught you the importance of resilience."

## Outcome Fallbacks
Every role needs two fallback outcomes with `conditions: {}`:
- One `survived: true` — catch-all for survived players who don't match specific outcomes
- One `survived: false` — catch-all for died players
Fallbacks must be the LAST outcomes in the array (scoring system picks highest-match first).
