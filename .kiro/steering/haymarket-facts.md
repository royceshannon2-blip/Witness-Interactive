# Haymarket Affair Mission — Reference Facts

Applies to: all files in `js/content/missions/haymarket/`.

This file is the single source of truth for Haymarket-specific facts. Do not invent historical details. Verify against this file first.

---

## Mission Identity

```javascript
id: 'haymarket-affair'
historicalDate: '1886-05-04'
era: 'Modern'
unlocked: true
apUnits: ['Unit 6.5', 'Unit 6.6', 'Unit 7.1']
```

---

## Three Roles

| Role ID | Name | Card Type |
|---------|------|-----------|
| `hm-lucy-parsons` | Lucy Parsons | Chicago Police Dept Surveillance File |
| `hm-karl-brenner` | Karl Brenner | McCormick Reaper Works Employee Record #2847 |
| `hm-james-doyle` | James Doyle | Pinkerton National Detective Agency Operative Assignment CHI-1886-114 |

---

## Scene Map — 18 Scenes

### Lucy Parsons (hm-lp-)

| Scene ID | Setting | Date | Key mechanic |
|----------|---------|------|--------------|
| hm-lp-scene-01 | West Indiana Street hall, sewing women's meeting | Late April 1886 | `stimuliUnlock: ['hm-doc-1a']` |
| hm-lp-scene-02 | Warning from Wilhelm (ink pressman, Pinkerton informant) | 3 days before May 4 | `stimuliUnlock: ['hm-doc-2']` |
| hm-lp-scene-03 | One block from Haymarket, children present | May 4 evening | **BOTH** `predictionQuestion` AND `timedChoice` (10000ms, default "stay with children") |
| hm-lp-scene-04 | The bomb, children holding her coat | May 4 night | `timedChoice` (14000ms), `atmosphericEffect: 'shake'` |
| hm-lp-scene-05 | Morning after, Tribune front page | May 5 | `stimuliUnlock: ['hm-doc-4']` |
| hm-lp-scene-06 | Trial sentencing | August 1886 | `stimuliUnlock: ['hm-doc-5']` |

### Karl Brenner (hm-kb-)

| Scene ID | Setting | Date | Key mechanic |
|----------|---------|------|--------------|
| hm-kb-scene-01 | Reading Arbeiter-Zeitung, McCormick lockout | April 1886 | `stimuliUnlock: ['hm-doc-1a']` (deduplicates via Set) |
| hm-kb-scene-02 | May 1st eight-hour march, Heinrich alongside | May 1 | — |
| hm-kb-scene-03 | McCormick gates, shooting of strikers | May 3 | `predictionQuestion`, `atmosphericEffect: 'shake'` |
| hm-kb-scene-04 | Receiving the Revenge Circular | May 3 evening | `stimuliUnlock: ['hm-doc-3']` |
| hm-kb-scene-05 | Haymarket Square, bomb explosion | May 4 night | `timedChoice` (12000ms), `atmosphericEffect: 'shake'` |
| hm-kb-scene-06 | Red Scare arrests, identity decision | August 1886 | — |

### James Doyle (hm-jd-)

| Scene ID | Setting | Date | Key mechanic |
|----------|---------|------|--------------|
| hm-jd-scene-01 | Undercover as "James Reilly" inside IWPA | 3 months before | — |
| hm-jd-scene-02 | Filing surveillance report, Ward present | April | `stimuliUnlock: ['hm-doc-0']` |
| hm-jd-scene-03 | McCormick gates, undercover | May 3 | `predictionQuestion` |
| hm-jd-scene-04 | Orders from Ward to attend Haymarket | May 3 evening | `stimuliUnlock: ['hm-doc-3']` (deduplicates) |
| hm-jd-scene-05 | Haymarket Square, crisis of identity | May 4 night | `timedChoice` (12000ms), `atmosphericEffect: 'shake'` |
| hm-jd-scene-06 | The trials, James testifies | August 1886 | — |

---

## Ambient Audio Map

| Track | Scenes |
|-------|--------|
| `./audio/ambient/hm-ambient-westside-evening.mp3` | LP-01, LP-02, KB-01, KB-02, JD-01, JD-02 |
| `./audio/ambient/hm-ambient-haymarket-crowd.mp3` | LP-03, KB-04, JD-04 |
| `./audio/ambient/hm-ambient-chaos.mp3` | LP-04, KB-05, JD-05 |
| `./audio/ambient/hm-ambient-streets-morning.mp3` | LP-05, KB-03, JD-03 |
| `./audio/ambient/hm-ambient-courtroom.mp3` | LP-06, KB-06, JD-06 |

---

## Seven Stimulus Documents

### hm-doc-0 — Hayes Federal Troop Deployment Order, 1877
- **Unlocks in:** Briefing page 4 (mid-page), JD Scene 02
- **SPICE-T:** Political, Economic | **apUnit:** Unit 6.5
- **Source:** President Rutherford B. Hayes, July 1877
- **Key historical fact:** Hayes deployed federal troops against the 1877 Great Railroad Strike — the first use of federal troops to break a labor strike. This created the legal and political precedent for using state power against labor that the Pinkertons operated within.

### hm-doc-1a — Arbeiter-Zeitung excerpt, May 1886
- **Unlocks in:** LP Scene 01, KB Scene 01 (StimuliManager deduplicates — shows only once per session)
- **SPICE-T:** Cultural, Economic | **apUnit:** Unit 6.5
- **Source:** Chicago Arbeiter-Zeitung (German-language labor newspaper), May 1886
- **Key historical fact:** The Arbeiter-Zeitung was the primary media organ of Chicago's German immigrant labor movement. August Spies was its editor. It called for the eight-hour day and published organizing notices for the May 1st strike and the Haymarket meeting.

### hm-doc-1b — BLS Wage Data, 1880s
- **Unlocks in:** Briefing page 2 — for ALL THREE ROLES
- **SPICE-T:** Economic, Social | **apUnit:** Unit 6.5
- **Source:** U.S. Bureau of Labor Statistics, Third Annual Report of the Commissioner of Labor, 1887
- **Key historical fact:** Average manufacturing worker in Chicago worked 10–12 hours/day, 6 days/week, for approximately $1.50/day. The eight-hour movement demanded reduction to 8 hours at the same daily wage.

### hm-doc-2 — Harper's Weekly illustration, May 15, 1886
- **Unlocks in:** LP Scene 02
- **SPICE-T:** Political, Cultural | **apUnit:** Unit 6.5
- **Source:** Harper's Weekly, May 15, 1886 — illustration by Thure de Thulstrup
- **AP Skill 2 REQUIRED:** The pause question must address sourcing — Harper's Weekly was a middle-class publication with a readership hostile to labor radicalism. The illustration depicts the bomb as the act of foreign anarchists. Ask how the publication's audience shapes the framing.
- **Key historical fact:** Harper's Weekly reached 100,000+ subscribers, predominantly educated middle-class. Its coverage framed Haymarket as anarchist terrorism, not labor conflict — shaping public opinion against the defendants before trial.

### hm-doc-3 — The Revenge Circular, May 3, 1886
- **Unlocks in:** KB Scene 04, JD Scene 04
- **SPICE-T:** Political, Social | **apUnit:** Unit 6.5
- **Source:** August Spies, written hours after the McCormick shooting, May 3, 1886
- **Authentic text excerpt:** "REVENGE! Workingmen, to Arms!!! Your masters sent out their bloodhounds — the police — they killed six of your brothers at McCormick's this afternoon..."
- **Key historical fact:** The circular was written in rage after watching Pinkerton guards and police shoot strikers at McCormick. It was used as evidence of premeditated violence at trial — even though the connection between the circular and the bomb was never proven.

### hm-doc-4 — Chicago Tribune front page, May 5, 1886
- **Unlocks in:** LP Scene 05
- **SPICE-T:** Political, Cultural | **apUnit:** Unit 6.5
- **Source:** Chicago Tribune, May 5, 1886
- **AP Skill 2 REQUIRED:** The pause question must address sourcing — the Tribune was owned by Joseph Medill, a Republican political figure with deep ties to business interests and hostility to labor organizing. Ask how the paper's editorial stance shapes its framing of the bombing as "anarchist conspiracy."
- **Key historical fact:** The Tribune's May 5 headline framed the bombing as an anarchist attack on law and order before any investigation. The paper had been editorially hostile to the eight-hour movement for months.

### hm-doc-5 — Governor Altgeld's Pardon Message, June 26, 1893
- **Unlocks in:** LP Scene 06
- **SPICE-T:** Political, Economic | **apUnit:** Unit 6.5
- **Source:** Governor John Peter Altgeld, State of Illinois, June 26, 1893
- **Key historical fact:** Altgeld's 18,000-word pardon message concluded: (1) Judge Gary had conducted the trial with "malicious ferocity," (2) jury selection was improper, (3) no evidence connected any defendant to throwing the bomb. The pardon ended Altgeld's political career. He knew it would before he signed it.

---

## Movement Trust Flag — Lucy Parsons

```
Flag name: hm_lp_movement_trust
Type: numeric
Starting value: 0  ← EXPLICIT — initialized via initFlags, NEVER inherits from psychology system
Valid range: 0–5
```

Choices that increment it: solidarity, public speech, choosing the Arbeiter-Zeitung, warning others.
Choices that do NOT increment it: personal safety, staying quiet, avoiding confrontation.

**Outcome gates:**
- "The Voice That Would Not Stop": `{ gte: 3 }` AND `hm_lp_published_arbeiter: true`
- "The Movement and the Man": `{ gte: 2, lte: 3 }`
- "The Private Grief": `{ lte: 1 }`
- Default catch-all: `conditions: {}` — MUST be last in array

---

## Post-Ripple Synthesis Question

This question lives in `mission.js` as `postRippleQuestion` — not in `knowledge-questions.js`. Same for all three roles. Displayed after all ripple events animate, before the knowledge checkpoint.

**Correct answer (option B) models AP skill 6.D complexity** — it qualifies the argument by acknowledging contradictory effects:

> "The Haymarket trial established a precedent for using conspiracy charges against labor organizers, while simultaneously galvanizing international labor solidarity and contributing to the eventual passage of the eight-hour workday."

---

## Historical Ripple Events — Chronological Order

1. **1886-08-20** — Eight defendants sentenced (7 to death, 1 to 15 years) — `apTheme: 'argumentation'`, `spiceT: 'Political'`, `apUnit: 'Unit 6.5'`
2. **1887-11-11** — Four Haymarket martyrs executed — `apTheme: 'causation'`, `spiceT: 'Political'`, `apUnit: 'Unit 6.5'`
3. **1889-07-14** — May Day adopted internationally in Paris — `apTheme: 'continuity'`, `spiceT: ['Social','Political']`, `apUnit: 'Unit 6.6'`
4. **1893-06-26** — Governor Altgeld pardons surviving defendants — `apTheme: 'argumentation'`, `spiceT: 'Political'`, `apUnit: 'Unit 6.5'`
5. **1938-06-25** — Fair Labor Standards Act establishes 40-hour workweek — `apTheme: 'causation'`, `spiceT: ['Economic','Political']`, `apUnit: 'Unit 7.1'`
6. **1919-01-01** — Red Scare — anti-anarchist legal framework from Haymarket intensified — `apTheme: 'continuity'`, `spiceT: ['Political','Social']`, `apUnit: 'Unit 7.1'`

---

## Key Historical Facts for Accuracy Checking

- **McCormick shooting date:** May 3, 1886 — NOT May 4.
- **Haymarket bomb date:** May 4, 1886 evening.
- **Bomb thrower:** Never conclusively identified. Do not state who threw it.
- **Police deaths:** 7 police officers died; at least 4 workers died.
- **Defendants:** 8 charged (Spies, Parsons, Fischer, Engel, Fielden, Schwab, Neebe, Lingg). Lingg died night before execution (reported suicide). 4 executed Nov 11, 1887. 2 commuted to life. Neebe sentenced to 15 years.
- **Lucy Parsons on May 4:** She did not enter Haymarket Square that night. She was nearby with her children. This is the historical grounding for the Scene 03 timed choice default.
- **Altgeld's pardon:** June 26, 1893. It ended his political career. He knew it would.
- **FLSA:** June 25, 1938. The eight-hour/40-hour week workers marched for in 1886 became law 52 years later.
- **May Day:** The Second International adopted it July 14, 1889 in Paris, explicitly in commemoration of the Haymarket martyrs.
- **1877 Railroad Strike:** The first major labor conflict in which Hayes deployed federal troops. This is the backdrop for the Pinkerton role and hm-doc-0.
