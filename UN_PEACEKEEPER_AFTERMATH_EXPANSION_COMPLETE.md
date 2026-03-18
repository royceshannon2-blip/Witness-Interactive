# UN Peacekeeper Aftermath Expansion - Complete

## Task Summary
Expanded the UN Peacekeeper role outcomes array to distinguish aftermath choices, resolving 35 orphaned flags from scenes 04a-04d.

## Changes Made

### New Outcomes Added (16 total)

**STAYED PATH - DEFIED ORDERS (scene-04a aftermath):**
- `rw-un-outcome-stayed-advocate-survived` - Testified at inquiries, pushed for R2P doctrine
- `rw-un-outcome-stayed-healed-survived` - Declined testimony, focused on healing
- `rw-un-outcome-stayed-private-survived` - Private testimony, avoided spotlight

**STAYED PATH - FOLLOWED MANDATE (scene-04b aftermath):**
- `rw-un-outcome-mandate-spoke-survived` - Spoke at ceremony, honored survivors
- `rw-un-outcome-mandate-silent-survived` - Attended silently, centered survivors
- `rw-un-outcome-mandate-private-survived` - Met survivors privately, avoided ceremony

**EVACUATED PATH - FOLLOWED ORDERS (scene-04c aftermath):**
- `rw-un-outcome-evacuated-documentary-survived` - Participated in documentary, shared guilt
- `rw-un-outcome-evacuated-private-survived` - Declined documentary, private advocacy
- `rw-un-outcome-evacuated-policy-survived` - Documentary focused on policy, not guilt

**EVACUATED PATH - SAVED RWANDANS (scene-04c aftermath):**
- `rw-un-outcome-savers-documentary-survived` - Documentary about saving seven people
- `rw-un-outcome-savers-private-survived` - Private relationship with survivors
- `rw-un-outcome-savers-policy-survived` - Documentary focused on mandate failure

**EVACUATED PATH - SAVED RWANDANS + DOCUMENTED (scene-04d aftermath):**
- `rw-un-outcome-savers-docs-full-survived` - Full tribunal testimony with evidence
- `rw-un-outcome-savers-docs-careful-survived` - Careful testimony protecting sources
- `rw-un-outcome-savers-docs-silent-survived` - Submitted evidence without testifying

**DOCUMENTED PATH (scene-04d aftermath):**
- `rw-un-outcome-documented-full-survived` - Full tribunal testimony, 11 years of inquiries
- `rw-un-outcome-documented-careful-survived` - Protected sources, limited convictions
- `rw-un-outcome-documented-submitted-survived` - Evidence only, no personal testimony

### Orphaned Flags Removed (6 total)

Removed intermediate flags that were always accompanied by more specific downstream flags:
- `rw_followed_evacuation_orders` (always with `rw_evacuated_expatriates` or `rw_saved_rwandans`)
- `rw_chose_documentation` (always with `rw_sent_genocide_fax`)
- `rw_witnessed_massacre` (always with `rw_continued_documentation`)
- `rw_held_hotel` (always with `rw_saved_civilians`)
- `rw_protected_civilians` (always with `rw_held_position`)
- `rw_went_home` (always with `rw_left_rwanda`)

## Epilogue Writing Approach

All new epilogues follow the established pattern:
- 3-5 paragraphs, second person past tense (for generic outcomes) or third person (for specific aftermath variants)
- Reference historical figures: Dallaire, UNAMIR, ICTR at Arusha, Responsibility to Protect 2005
- No false comfort or healing narratives
- End on concrete images or facts
- 150-220 words per epilogue
- Morally complex, acknowledging both what was saved and what was lost

## Verification Results

```
SUMMARY — UN Peacekeeper:
  Scenes total / unreachable : 12 / 0
  Outcomes defined           : 30
  Unique decision paths      : 21
  Specific outcome matches   : 42
  Fallback outcomes          : 0
  Null outcomes              : 0
  Structural problems        : 0
  Orphaned flags             : 0  ✓
  Phantom conditions         : 0
  Unique outcomes reached    : 23
```

## Key Achievements

1. **Zero orphaned flags** - All 35 aftermath choice flags now appear in outcome conditions
2. **Zero fallbacks** - Every path resolves to a specific, intentional outcome
3. **21 unique decision sequences** - All resolve to distinct survived epilogues
4. **23 unique outcomes reached** - Includes both survived and killed variants
5. **Moral complexity preserved** - Epilogues acknowledge impossible choices, structural failures, and lasting consequences

## Historical Accuracy

All epilogues reference:
- General Roméo Dallaire's memoir and testimony
- The ICTR (International Criminal Tribunal for Rwanda) at Arusha
- The Responsibility to Protect doctrine (adopted 2005)
- The UN's 1999 independent inquiry into Rwanda
- The Belgian Senate inquiry
- Canadian parliamentary inquiries
- Kwibuka commemorations
- The reduction of UNAMIR from 2,500 to 270 troops
- The "genocide fax" sent in January 1994

## Commit

```
feat(rwanda): expand UN Peacekeeper outcomes to distinguish aftermath choices

- Added 16 new outcome variants for aftermath choices in scenes 04a-04d
- Removed 6 orphaned intermediate flags that added no discriminating power
- All 21 unique decision paths now resolve to distinct epilogues
- Verified: 0 orphaned flags, 0 fallbacks, 23 unique outcomes reached
```

Date: 2026-03-15
