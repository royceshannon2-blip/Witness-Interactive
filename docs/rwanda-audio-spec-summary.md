# Rwanda Mission Audio Specification - Executive Summary

## Overview
Complete audio requirements for the Rwanda Genocide mission (1994) across three playable roles. This document provides sourcing priorities, reuse opportunities, and trauma-informed guidelines.

---

## AUDIO ASSET SUMMARY

### Unique Ambient Sounds Needed: 23

**HIGH PRIORITY (13 sounds)**
1. RTLM Radio Broadcast (hate speech) - 15-30s loop
2. Crowd/Militia Outside - 20-30s loop
3. Rally Crowd - 30-45s loop
4. Distant Screaming (trauma-informed) - loop
5. Machete Sounds (distant, metallic) - loop
6. Roadblock Ambient - loop
7. Machete Tapping on Truck Bed - rhythmic loop
8. Church Interior Ambient (before attack) - loop
9. Hiding Silence - near-silence loop
10. Hotel Interior Crowd - loop
11. Militia Chanting (distant outside) - loop
12. Military Radio Chatter - loop
13. Convoy Ambient - loop

**MEDIUM PRIORITY (7 sounds)**
1. Distant Vehicle Convoy - loop
2. Heavy Knock on Door - one-shot
3. RTLM Radio (rally background) - loop
4. Urban Morning Panic - loop
5. Roadblock Sounds (distant, muffled) - loop
6. Desperate Pleading - occasional loop
7. Church Exterior Ambient - loop

**LOW PRIORITY (3 sounds)**
1. Urban Night Ambient (Kigali) - loop
2. Rural Rwanda Ambient - loop
3. Gacaca Court Ambient - loop

### Reusable Across Roles: 8 sounds
- RTLM Radio (used in HM, TS)
- Roadblock Ambient (used in HM, TS, UN)
- Hiding Silence (used in TS multiple scenes)
- Hotel Interior Crowd (used in TS, UN)
- Militia Chanting Outside (used in TS, UN)
- Rural Countryside Ambient (used in HM multiple scenes)
- Courtroom Ambient (used in TS, UN)
- Military Radio (used in UN multiple scenes)

### Pearl Harbor Audio Reuse Opportunities
- Explosion sounds (grenade) - MEDIUM adaptation needed
- Fire/smoke sounds - MEDIUM adaptation needed
- Military vehicle sounds - LOW adaptation needed
- Gunshot sounds - LOW adaptation needed
- Aircraft sounds (C-130) - LOW adaptation needed
- Panic/chaos sounds - MEDIUM adaptation needed

---

## NARRATOR AUDIO REQUIREMENTS

### Total Narrator Recordings: 35

**Hutu Moderate Role**: 11 recordings (male voice, serious, documentary tone)
**Tutsi Survivor Role**: 12 recordings (female voice preferred, empathetic tone)
**UN Peacekeeper Role**: 12 recordings (male voice, military/professional tone)

All narrator audio should be:
- Clear, professional quality
- Appropriate pacing for reading comprehension
- Emotionally appropriate to scene content
- Accessible (clear pronunciation, moderate speed)

---

## RWANDA-SPECIFIC AUDIO NEEDS

### Critical Cultural/Historical Sounds
1. **RTLM Radio Broadcasts**: Kinyarwanda/French language, propaganda music, hate speech (not graphic content, but urgent/angry tone)
2. **Machete Sounds**: Metallic, rhythmic, menacing - primary weapon of genocide
3. **Gacaca Court Ambient**: Outdoor community justice, African rural setting
4. **African Ambient Sounds**: Birds, insects, rural farm sounds specific to Rwanda

### Language Requirements
- Kinyarwanda phrases (unintelligible background)
- French military/UN communications
- English narrator and some dialogue

---

## TRAUMA-INFORMED AUDIO GUIDELINES

### What to AVOID
- ❌ Graphic violence sounds (impacts on people)
- ❌ Prolonged screaming or suffering
- ❌ Explicit death sounds
- ❌ Sounds that exploit trauma

### What to INCLUDE
- ✅ Distant, implied violence (muffled, brief)
- ✅ Atmospheric tension (silence, waiting, threat)
- ✅ Aftermath sounds (eerie quiet, distant echoes)
- ✅ Emotional weight without exploitation

### Key Principle
**Silence is powerful.** Many scenes should use near-silence with occasional sounds to create tension. Less is more.

---

## SOURCING STRATEGY

### Phase 1: High Priority Ambient (13 sounds)
Focus on sounds that appear in multiple scenes and create core atmosphere:
- RTLM Radio Broadcast
- Roadblock Ambient
- Militia/Crowd sounds
- Hiding Silence
- Hotel Interior

### Phase 2: Narrator Audio (35 recordings)
Can be produced with ElevenLabs or voice actors:
- Hutu Moderate: 11 recordings
- Tutsi Survivor: 12 recordings
- UN Peacekeeper: 12 recordings

### Phase 3: Medium Priority Ambient (7 sounds)
Enhance specific scenes with additional atmosphere

### Phase 4: Low Priority Ambient (3 sounds)
Polish and final touches

---

## TECHNICAL SPECIFICATIONS

### Ambient Loops
- Format: WAV or MP3
- Length: 15-45 seconds (seamless loop)
- Sample Rate: 44.1kHz minimum
- Bit Depth: 16-bit minimum
- Volume: Normalized to -3dB peak

### One-Shot Sounds
- Format: WAV or MP3
- Length: 0.5-3 seconds
- Sample Rate: 44.1kHz minimum
- Bit Depth: 16-bit minimum

### Narrator Audio
- Format: MP3
- Sample Rate: 44.1kHz
- Bit Rate: 128kbps minimum
- Mono acceptable
- Normalized volume

---

## FILE NAMING CONVENTION

### Ambient Sounds
`rw-[description]-ambient.wav`
Examples:
- `rw-radio-rtlm-ambient.wav`
- `rw-roadblock-ambient.wav`
- `rw-hiding-silence-ambient.wav`

### Narrator Audio
`audio/narration/[role]/rw-[role-code]-scene-[id].mp3`
Examples:
- `audio/narration/hutu-moderate/rw-hm-scene-01.mp3`
- `audio/narration/tutsi-survivor/rw-ts-scene-01.mp3`
- `audio/narration/un-peacekeeper/rw-un-scene-01.mp3`

---

## NEXT STEPS

1. **Review & Approve**: Confirm this specification meets educational and ethical standards
2. **Source High Priority**: Begin with 13 high-priority ambient sounds
3. **Record Narration**: Produce 35 narrator recordings (can be done in parallel)
4. **Test Integration**: Implement in game engine and test with scenes
5. **Iterate**: Adjust based on playtesting feedback

---

## DETAILED SPECIFICATIONS

For complete scene-by-scene audio requirements, see:
- `rwanda-audio-spec-part1.md` - Hutu Moderate Role
- `rwanda-audio-spec-part2.md` - Tutsi Survivor Role
- `rwanda-audio-spec-part3.md` - UN Peacekeeper Role
