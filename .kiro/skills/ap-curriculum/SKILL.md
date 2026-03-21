\---

name: ap-curriculum

description: Tag scenes with AP reasoning skills, audit AP alignment, or write AP-style questions for any Witness Interactive mission. Use when adding apThemes to scenes, checking that a role covers required AP skills, or ensuring knowledge checkpoint questions map to AP exam standards.

\---



\# AP Curriculum Skill



Every scene in Witness Interactive must include at least one AP reasoning skill tag in its `apThemes\[]` array. These tags connect the game directly to what students are tested on in AP History exams.



\## AP Reasoning Skills (use these exact strings as tags)

\- `"causation"` — cause and effect relationships between events

\- `"continuity-and-change"` — what changed and what stayed the same over time

\- `"comparison"` — similarities and differences across situations, groups, or time periods

\- `"contextualization"` — connecting an event to its broader historical context

\- `"argumentation"` — constructing or evaluating historical arguments

\- `"perspective"` — understanding events from different viewpoints

\- `"sourcing"` — evaluating the reliability and purpose of historical sources



\## AP Historical Thinking Skills

\- `"close-reading"` — analyzing historical documents or accounts

\- `"corroboration"` — comparing multiple sources on the same event

\- `"synthesis"` — connecting themes across different historical periods



\## Scene Tagging Rules

\- Every scene must have `apThemes: \[]` with at least 1 tag

\- 2–3 tags per scene is ideal

\- Do not stack all tags on one scene — distribute across the role

\- Final scenes and epilogues should include `"argumentation"` or `"synthesis"`

\- Roadblock/decision scenes: `"causation"`, `"perspective"`

\- Hiding/survival scenes: `"contextualization"`, `"continuity-and-change"`

\- Aftermath/testimony scenes: `"argumentation"`, `"sourcing"`



\## AP Knowledge Checkpoint Questions

Questions must connect to specific AP skills:

\- Q1 typically tests `"causation"` or `"contextualization"` (why did this situation exist?)

\- Q2 typically tests `"perspective"` or `"comparison"` (how did this look from different sides?)

\- Q3 typically tests `"argumentation"` or `"synthesis"` (what do we conclude from what happened?)



\## Per-Role AP Coverage Check

Before finalizing any role, verify that across all scenes the role covers at minimum:

\- `"causation"` — at least 2 scenes

\- `"perspective"` — at least 1 scene

\- `"argumentation"` — at least 1 scene (usually final/epilogue)

\- `"contextualization"` — at least 1 scene



\## Mission-Specific Historical Reference Material



\### Haymarket Affair (haymarket-affair)



\*\*ALL historical knowledge for the Haymarket Affair mission — including scene narratives,

stimulus document text, knowledge checkpoint questions, briefing newspaper content,

ripple event descriptions, identity card details, and outcome epilogues — MUST be

grounded in the primary and secondary sources located at:\*\*



```

C:\\Witness-Interactive\\.kiro\\skills\\ap-curriculum\\references\\haymarket\_raw\_content

```



\*\*This applies to every content file in `js/content/missions/haymarket/`:\*\*

\- `briefing-content.js` — all five newspaper pages

\- `stimulus-documents.js` — all seven primary source document texts

\- `lucy-parsons.js` — all scene narratives and outcome epilogues

\- `karl-brenner.js` — all scene narratives and outcome epilogues

\- `james-doyle.js` — all scene narratives and outcome epilogues

\- `knowledge-questions.js` — all question stems, options, and explanations

\- `ripple-intros.js` — all path-specific ripple intro texts



\*\*Before writing any Haymarket content string, consult the reference folder first.\*\*

Do not invent dates, names, quotes, casualty figures, or causal claims from memory.

Every factual assertion in a Haymarket scene or question must be traceable to a

source in `haymarket\_raw\_content`.



\*\*If a fact cannot be confirmed from `haymarket\_raw\_content`, do one of the following:\*\*

1\. Mark the claim as `// NEEDS VERIFICATION` in a code comment

2\. Use only what can be confirmed and note the gap

3\. Do not include the unverified claim



This rule exists because the game is used in AP History classrooms. Factual errors

in stimulus documents or question explanations cause direct educational harm.

