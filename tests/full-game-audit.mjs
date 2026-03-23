/**
 * full-game-audit.mjs
 *
 * Complete experience audit for the Witness Interactive Rwanda mission.
 * Simulates every possible playthrough in full detail — every scene visited,
 * every atmospheric effect triggered, every sound effect scheduled,
 * every ambient track loaded, every flag set, every outcome reached.
 *
 * This is the single source of truth for "is the game working perfectly?"
 *
 * Usage:
 *   node tests/full-game-audit.mjs               # all roles, full output
 *   node tests/full-game-audit.mjs hutu           # hutu-moderate only
 *   node tests/full-game-audit.mjs tutsi          # tutsi-survivor only
 *   node tests/full-game-audit.mjs un             # un-peacekeeper only
 *   node tests/full-game-audit.mjs --summary      # totals only, no per-path detail
 *   node tests/full-game-audit.mjs hutu --summary # one role, summary only
 *
 * Output sections per role:
 *   1. SCENE INVENTORY       — every scene: fields, word count, AP themes, audio, effects
 *   2. SCENE PROBLEMS        — missing fields, bad values, word count violations
 *   3. CHOICE INVENTORY      — every choice: text length, consequences, nextScene
 *   4. PER-PATH EXPERIENCE   — full playthrough log: narrative → effects → sounds → flags → outcome
 *   5. EFFECT COVERAGE MAP   — which scenes have no atmospheric effect (intentional vs gap)
 *   6. SFX COVERAGE MAP      — which scenes have no sound effects (intentional vs gap)
 *   7. AMBIENT TRACK MAP     — which scenes have no ambient track
 *   8. OUTCOME COVERAGE      — which outcomes are never reached, which are overloaded
 *   9. CROSS-PATH CHECKS     — duplicate paths, flag collision, epilogue consistency
 *   10. SUMMARY              — all counts, pass/fail
 *
 * SCENE FIELD VALIDATION:
 *   - id, narrative, apThemes, choices, atmosphericEffect, ambientTrack,
 *     narratorAudio, soundEffects, timedChoice, deathCheckpoint, linear
 *   - Word count: 80–200 for narrative, 2–12 for choice text
 *   - Choices: 2–4 per scene (except terminal, death checkpoint, or linear=true)
 *   - linear: true suppresses minimum-choice check for forced narrative scenes
 *     (deliberate story beats that funnel into later branching)
 *   - All field values validated against known sets
 */

import hutuData  from '../js/content/missions/rwanda/hutu-moderate.js';
import tutsiData from '../js/content/missions/rwanda/tutsi-survivor.js';
import unData    from '../js/content/missions/rwanda/un-peacekeeper.js';
import knowledgeQuestions from '../js/content/missions/rwanda/knowledge-questions.js';

// ─── KNOWN VALID VALUES ───────────────────────────────────────────────────────

const VALID_ATMOSPHERIC_EFFECTS = new Set([
  'smoke', 'fire', 'shake', 'dawn', 'explosion',
  'aftermath', 'rain', 'ocean', 'ash', 'borderGlow',
]);

const VALID_AP_THEMES = new Set([
  'causation', 'continuity', 'perspective', 'complexity', 'argumentation',
]);

const VALID_AP_SKILLS = new Set([
  'causation', 'continuity', 'perspective', 'complexity', 'argumentation',
]);

const VALID_ROLE_IDS = new Set([
  'hutu-moderate', 'tutsi-survivor', 'un-peacekeeper',
]);

// Border glow colors defined in AtmosphericEffects.applyDelayedEffects()
// Keyed by scene ID — used to verify coverage in the effect map
const BORDER_GLOW_MAP = {
  // Hutu Moderate
  'rw-hm-scene-01': 'rgba(200,140,40,0.4) amber',
  'rw-hm-scene-02a':'rgba(160,20,20,0.55) blood-red',
  'rw-hm-scene-02b':'rgba(120,160,30,0.45) sick-green',
  'rw-hm-scene-02c':'rgba(80,100,140,0.4) cold-grey-blue',
  'rw-hm-scene-03a':'rgba(180,15,15,0.65) deep-red',
  'rw-hm-scene-03b':'rgba(140,10,10,0.7) dark-crimson',
  'rw-hm-scene-03c':'rgba(90,130,20,0.55) sick-green-deep',
  'rw-hm-scene-03d':'rgba(100,80,40,0.4) muted-earth',
  'rw-hm-scene-04a':'rgba(140,130,120,0.4) pale-ash',
  'rw-hm-scene-04b':'rgba(110,100,90,0.5) ash-grey',
  'rw-hm-scene-04c':'rgba(100,100,110,0.5) cold-stone',
  'rw-hm-scene-04d':'rgba(150,120,70,0.4) dusty-amber',
  // Tutsi Survivor
  'rw-ts-scene-01': 'rgba(200,140,40,0.35) dawn-amber',
  'rw-ts-scene-02a':'rgba(80,110,160,0.45) cold-grey-blue',
  'rw-ts-scene-02b':'rgba(160,110,40,0.4) warm-dim-amber',
  'rw-ts-scene-02c':'rgba(180,180,190,0.45) stark-white-grey',
  'rw-ts-scene-03a':'rgba(80,110,70,0.5) sewage-green',
  'rw-ts-scene-03b':'rgba(30,40,80,0.65) near-black-blue',
  'rw-ts-scene-03c':'rgba(80,50,30,0.6) deep-brown',
  'rw-ts-scene-03d':'rgba(160,20,20,0.6) blood-red',
  'rw-ts-scene-04a':'rgba(60,100,160,0.4) institutional-blue',
  'rw-ts-scene-04b':'rgba(90,85,80,0.45) dark-ash',
  'rw-ts-scene-04c':'rgba(70,110,70,0.4) muted-earth-green',
  'rw-ts-scene-04d':'rgba(180,150,70,0.35) pale-warm-gold',
  // UN Peacekeeper
  'rw-un-scene-01': 'rgba(0,90,160,0.4) un-blue',
  'rw-un-scene-02a':'rgba(0,70,140,0.55) deep-un-blue',
  'rw-un-scene-02b':'rgba(80,150,80,0.5) pale-green',
  'rw-un-scene-02c':'rgba(180,175,170,0.45) stark-white-grey',
  'rw-un-scene-03a':'rgba(0,50,120,0.6) deep-un-blue',
  'rw-un-scene-03b':'rgba(60,90,130,0.5) steel-blue-grey',
  'rw-un-scene-03c':'rgba(140,145,155,0.45) pale-grey',
  'rw-un-scene-03d':'rgba(200,200,210,0.4) cold-white',
  'rw-un-scene-04a':'rgba(30,50,100,0.5) dark-cold-blue',
  'rw-un-scene-04b':'rgba(120,80,80,0.4) muted-red-grey',
  'rw-un-scene-04c':'rgba(130,130,140,0.45) dim-grey',
  'rw-un-scene-04d':'rgba(160,175,200,0.4) cold-institutional',
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const HR1 = '═'.repeat(80);
const HR2 = '─'.repeat(80);
const HR3 = '·'.repeat(80);

function isTerminal(nextScene) {
  return !nextScene || nextScene === 'outcome' || nextScene === 'end';
}

function wordCount(text) {
  if (!text || typeof text !== 'string') return 0;
  return text.trim().split(/\s+/).length;
}

function truncate(str, len = 70) {
  if (!str) return '(empty)';
  return str.length > len ? str.slice(0, len) + '…' : str;
}

// ─── SCENE FIELD VALIDATOR ────────────────────────────────────────────────────

function validateScene(scene, rolePrefix) {
  const issues = [];
  const p = `  [${scene.id}]`;

  // Required string fields
  if (!scene.id || typeof scene.id !== 'string')
    issues.push(`${p} missing or invalid 'id'`);
  else if (!scene.id.startsWith(rolePrefix))
    issues.push(`${p} id should start with "${rolePrefix}" (got "${scene.id}")`);

  if (!scene.narrative || typeof scene.narrative !== 'string' || scene.narrative.trim() === '')
    issues.push(`${p} missing 'narrative'`);
  else {
    const wc = wordCount(scene.narrative);
    if (wc < 80)  issues.push(`${p} narrative too short: ${wc} words (min 80)`);
    if (wc > 200) issues.push(`${p} narrative too long: ${wc} words (max 200)`);
  }

  // apThemes
  if (!Array.isArray(scene.apThemes) || scene.apThemes.length === 0)
    issues.push(`${p} 'apThemes' is missing or empty`);
  else
    for (const t of scene.apThemes)
      if (!VALID_AP_THEMES.has(t))
        issues.push(`${p} unknown apTheme "${t}"`);

  // choices
  if (!Array.isArray(scene.choices) || scene.choices.length === 0)
    issues.push(`${p} 'choices' is missing or empty`);
  else {
    if (scene.choices.length < 2 && !isTerminal(scene.choices[0]?.nextScene) && !scene.deathCheckpoint && scene.linear !== true)
      issues.push(`${p} only 1 choice (min 2 for non-terminal scenes)`);
    if (scene.choices.length > 4)
      issues.push(`${p} ${scene.choices.length} choices (max 4)`);

    const choiceIds = new Set();
    for (const c of scene.choices) {
      if (!c.id) issues.push(`${p} choice missing 'id'`);
      else if (choiceIds.has(c.id)) issues.push(`${p} duplicate choice id "${c.id}"`);
      else choiceIds.add(c.id);

      if (!c.text || typeof c.text !== 'string' || c.text.trim() === '')
        issues.push(`${p} choice "${c.id ?? '?'}" missing 'text'`);
      else {
        const cw = wordCount(c.text);
        if (cw < 2)  issues.push(`${p} choice "${c.id}" text too short: ${cw} words`);
        if (cw > 12) issues.push(`${p} choice "${c.id}" text too long: ${cw} words (max 12)`);
      }

      if (c.consequences === undefined)
        issues.push(`${p} choice "${c.id ?? '?'}" missing 'consequences' (use {} if intentionally empty)`);

      if (c.nextScene !== null && typeof c.nextScene !== 'string')
        issues.push(`${p} choice "${c.id ?? '?'}" nextScene must be a string or null`);
    }
  }

  // atmosphericEffect
  const ae = scene.atmosphericEffect;
  if (ae !== undefined && ae !== null) {
    const effects = Array.isArray(ae) ? ae : [ae];
    for (const e of effects)
      if (!VALID_ATMOSPHERIC_EFFECTS.has(e))
        issues.push(`${p} atmosphericEffect "${e}" not recognised`);
  }

  // ambientTrack
  const at = scene.ambientTrack;
  if (at !== undefined && at !== null && at !== '') {
    if (at.includes('/') || at.includes('\\'))
      issues.push(`${p} ambientTrack "${at}" must be filename only (no slashes)`);
    if (!/\.(mp3|wav|ogg|m4a)$/i.test(at))
      issues.push(`${p} ambientTrack "${at}" missing audio extension`);
  }

  // narratorAudio
  const na = scene.narratorAudio;
  if (na !== undefined && na !== null && na !== '') {
    if (!na.startsWith('audio/narration/'))
      issues.push(`${p} narratorAudio "${na}" must start with "audio/narration/"`);
    if (!na.endsWith('.mp3'))
      issues.push(`${p} narratorAudio "${na}" must end with ".mp3"`);
  }

  // soundEffects
  const sfx = scene.soundEffects;
  if (sfx !== undefined && sfx !== null) {
    if (!Array.isArray(sfx)) {
      issues.push(`${p} soundEffects must be an array`);
    } else {
      if (sfx.length > 3)
        issues.push(`${p} ${sfx.length} soundEffects (max 3 recommended)`);
      sfx.forEach((e, i) => {
        if (!e.file) issues.push(`${p} soundEffects[${i}] missing 'file'`);
        else {
          if (e.file.includes('/') || e.file.includes('\\'))
            issues.push(`${p} soundEffects[${i}].file "${e.file}" must be filename only`);
          if (!/\.(mp3|wav|ogg|m4a)$/i.test(e.file))
            issues.push(`${p} soundEffects[${i}].file "${e.file}" missing audio extension`);
        }
        if (typeof e.triggerAfterMs !== 'number' || e.triggerAfterMs < 0)
          issues.push(`${p} soundEffects[${i}].triggerAfterMs invalid (got ${e.triggerAfterMs})`);
      });
    }
  }

  // timedChoice
  const tc = scene.timedChoice;
  if (tc) {
    if (tc.enabled !== true)
      issues.push(`${p} timedChoice.enabled must be exactly true`);
    if (typeof tc.duration !== 'number' || tc.duration <= 0)
      issues.push(`${p} timedChoice.duration invalid (got ${tc.duration})`);
    if (!tc.defaultChoice)
      issues.push(`${p} timedChoice.defaultChoice missing`);
    else {
      const ids = (scene.choices ?? []).map(c => c.id);
      if (!ids.includes(tc.defaultChoice))
        issues.push(`${p} timedChoice.defaultChoice "${tc.defaultChoice}" not found in choices`);
    }
  }

  return issues;
}

// ─── OUTCOME SCORER ───────────────────────────────────────────────────────────

function scoreOutcome(conditions, flags) {
  let score = 0;
  for (const [flag, expected] of Object.entries(conditions)) {
    const actual = flags[flag] !== undefined ? flags[flag] : false;
    if (actual === expected) score++;
  }
  return score;
}

function resolveOutcome(outcomes, flags, survived) {
  const pool = outcomes
    .filter(o => o.survived === survived && o.conditions && Object.keys(o.conditions).length > 0)
    .map(o => ({ o, score: scoreOutcome(o.conditions, flags) }))
    .sort((a, b) => b.score - a.score);

  if (pool.length > 0 && pool[0].score > 0) {
    const winner = pool[0].o;
    const matched = [], missed = [];
    for (const [f, exp] of Object.entries(winner.conditions)) {
      const act = flags[f] !== undefined ? flags[f] : false;
      act === exp ? matched.push(f) : missed.push({ f, exp, act });
    }
    return { outcome: winner, score: pool[0].score, fallback: false, pool, matched, missed };
  }

  const fb = outcomes.find(o =>
    o.survived === survived && (!o.conditions || Object.keys(o.conditions).length === 0)
  );
  return { outcome: fb ?? null, score: 0, fallback: true, pool, matched: [], missed: [] };
}

// ─── PATH WALKER — rich version ───────────────────────────────────────────────
// Walks every decision path and for each scene visited, records:
//   - scene data (narrative, effects, sounds, ambient, timed choice)
//   - choice made
//   - flags accumulated so far
// At terminal, resolves outcome for both survived states.

function walkPaths(scenes, outcomes) {
  const sceneMap  = new Map(scenes.map(s => [s.id, s]));
  const completed = [];
  const problems  = [];

  function recordTerminal(sceneLog, flags, deathCheckpointExit = false) {
    for (const survived of [true, false]) {
      const { outcome, score, fallback, pool, matched, missed } =
        resolveOutcome(outcomes, flags, survived);

      let epilogue = outcome?.epilogue ?? null;
      let earlyEpilogue = false;
      if (deathCheckpointExit && !survived && outcome?.deathEpilogueEarly) {
        epilogue = outcome.deathEpilogueEarly;
        earlyEpilogue = true;
      }

      completed.push({
        sceneLog: [...sceneLog],           // [{scene, choiceText, choiceId, nextScene}]
        flags: { ...flags },
        survived,
        outcomeId:     outcome?.id ?? 'NULL',
        outcomeScore:  score,
        fallback,
        pool,
        matched,
        missed,
        epilogue,
        earlyEpilogue,
        deathCheckpointExit,
      });
    }
  }

  function walk(sceneId, flags, sceneLog, visited) {
    if (isTerminal(sceneId)) {
      recordTerminal(sceneLog, flags);
      return;
    }
    if (visited.has(sceneId)) {
      problems.push({ type: 'LOOP', sceneId });
      recordTerminal(sceneLog, flags);
      return;
    }
    if (!sceneMap.has(sceneId)) {
      problems.push({ type: 'BROKEN_REF', sceneId });
      recordTerminal(sceneLog, flags);
      return;
    }

    const scene      = sceneMap.get(sceneId);
    const newVisited = new Set(visited);
    newVisited.add(sceneId);

    if (!scene.choices || scene.choices.length === 0) {
      // Scene with no choices — record it then terminate
      recordTerminal([...sceneLog, { scene, choiceText: null, choiceId: null, nextScene: null }], flags);
      return;
    }

    // Death checkpoint fork
    if (scene.deathCheckpoint === true) {
      // Branch A: die here
      recordTerminal(
        [...sceneLog, { scene, choiceText: '⚡ DEATH CHECKPOINT', choiceId: null, nextScene: null }],
        flags,
        true
      );
      // Branch B: survive and continue
      for (const choice of scene.choices) {
        const newFlags = { ...flags };
        for (const [k, v] of Object.entries(choice.consequences ?? {})) newFlags[k] = v;
        walk(
          choice.nextScene ?? 'outcome',
          newFlags,
          [...sceneLog, { scene, choiceText: choice.text, choiceId: choice.id, nextScene: choice.nextScene }],
          newVisited
        );
      }
      return;
    }

    for (const choice of scene.choices) {
      const newFlags = { ...flags };
      for (const [k, v] of Object.entries(choice.consequences ?? {})) newFlags[k] = v;
      walk(
        choice.nextScene ?? 'outcome',
        newFlags,
        [...sceneLog, { scene, choiceText: choice.text, choiceId: choice.id, nextScene: choice.nextScene }],
        newVisited
      );
    }
  }

  walk(scenes[0].id, {}, [], new Set());
  return { completed, problems };
}

// ─── EXPERIENCE LOG PRINTER ───────────────────────────────────────────────────
// Prints the full moment-by-moment experience of a single playthrough path.

function printExperience(path, pathNum, total, summaryOnly) {
  const cpTag    = path.deathCheckpointExit ? ' [CHECKPOINT DEATH]' : '';
  const earlyTag = path.earlyEpilogue       ? ' [EARLY EPILOGUE]'   : '';
  const fbTag    = path.fallback            ? ' ⚠ FALLBACK'         : '';
  const nullTag  = path.outcomeId === 'NULL'? ' 🔴 NULL'            : '';

  console.log('\n' + HR2);
  console.log(`PATH ${String(pathNum).padStart(3)} / ${total}  survived=${path.survived}  outcome=${path.outcomeId}${cpTag}${earlyTag}${fbTag}${nullTag}`);
  console.log(HR2);

  if (summaryOnly) return;

  // ── Scene-by-scene experience log ────────────────────────────────────────
  console.log('\nEXPERIENCE LOG:');

  for (const { scene, choiceText, choiceId } of path.sceneLog) {
    const isAftermath = scene.id.includes('-scene-04');
    const sceneLabel  = isAftermath ? `  ★ ${scene.id}` : `  ◆ ${scene.id}`;

    console.log(`\n${sceneLabel}`);

    // Narrative preview (first 100 chars)
    if (scene.narrative) {
      const preview = scene.narrative.trim().replace(/\s+/g, ' ').slice(0, 100);
      console.log(`    NARRATIVE  (${wordCount(scene.narrative)}w): "${preview}…"`);
    }

    // Atmospheric effect (from scene data field)
    const ae = scene.atmosphericEffect;
    if (ae && ae !== null) {
      const effects = Array.isArray(ae) ? ae : [ae];
      console.log(`    ATMOS FX  : ${effects.join(', ')} [fires on scene:rendered]`);
    } else {
      console.log(`    ATMOS FX  : (none in scene data)`);
    }

    // Border glow (from AtmosphericEffects.applyDelayedEffects — keyed by scene ID)
    const glow = BORDER_GLOW_MAP[scene.id];
    if (glow) {
      console.log(`    BORDER GLOW: ${glow} [fires after typewriter:complete]`);
    } else {
      console.log(`    BORDER GLOW: (not defined for this scene — no delayed glow)`);
    }

    // Ambient track
    if (scene.ambientTrack) {
      console.log(`    AMBIENT   : ${scene.ambientTrack} [crossfade on scene:transition]`);
    } else {
      console.log(`    AMBIENT   : (none)`);
    }

    // Narrator audio
    if (scene.narratorAudio) {
      console.log(`    NARRATOR  : ${scene.narratorAudio}`);
    }

    // Sound effects — show timeline
    const sfx = scene.soundEffects;
    if (sfx && sfx.length > 0) {
      console.log(`    SOUND FX  :`);
      for (const e of sfx) {
        const sec = (e.triggerAfterMs / 1000).toFixed(1);
        console.log(`      +${String(sec).padStart(5)}s  ${e.file}`);
      }
    } else {
      console.log(`    SOUND FX  : (none)`);
    }

    // Timed choice
    const tc = scene.timedChoice;
    if (tc && tc.enabled) {
      const secs = (tc.duration / 1000).toFixed(0);
      console.log(`    TIMED     : ${secs}s countdown → default: "${tc.defaultChoice}"`);
    }

    // AP themes
    if (scene.apThemes && scene.apThemes.length > 0) {
      console.log(`    AP THEMES : ${scene.apThemes.join(', ')}`);
    }

    // Choice made on this path
    if (choiceText) {
      const cpMark = choiceText.startsWith('⚡') ? '' : `  [${choiceId}]`;
      console.log(`    → CHOSE   : "${choiceText}"${cpMark}`);
    }
  }

  // ── Flags accumulated ────────────────────────────────────────────────────
  const trueFlags = Object.entries(path.flags).filter(([, v]) => v === true).map(([k]) => k);
  console.log(`\nFLAGS ACCUMULATED:`);
  if (trueFlags.length > 0) {
    // Show flags in order they were set, grouped by scene
    for (const { scene, choiceId } of path.sceneLog) {
      const sceneFlags = (scene.choices ?? [])
        .find(c => c.id === choiceId);
      const set = Object.entries(sceneFlags?.consequences ?? {})
        .filter(([, v]) => v === true)
        .map(([k]) => k);
      if (set.length > 0) console.log(`  [${scene.id}]  ${set.join(', ')}`);
    }
  } else {
    console.log('  (none)');
  }

  // ── Outcome resolution ────────────────────────────────────────────────────
  console.log(`\nOUTCOME RESOLUTION:`);
  if (path.pool.length > 0) {
    for (const { o, score } of path.pool.slice(0, 8)) {
      const mark = o.id === path.outcomeId ? '  →' : '   ';
      const s    = score === 0 ? 'score=0' : `score=${score}`;
      console.log(`${mark} ${o.id.padEnd(55)} ${s}`);
    }
    if (path.pool.length > 8) console.log(`     … and ${path.pool.length - 8} more`);
  } else {
    console.log('  (no scored candidates — straight to fallback)');
  }

  if (path.fallback)       console.log('  ⚠  FALLBACK — no specific outcome matched');
  if (path.outcomeId === 'NULL') console.log('  🔴 NULL — no outcome found');

  if (path.matched.length > 0 || path.missed.length > 0) {
    console.log(`\nWINNING OUTCOME CONDITIONS  [${path.outcomeId}]:`);
    for (const f of path.matched) console.log(`  ✓ ${f}`);
    for (const { f, exp, act } of path.missed)
      console.log(`  ✗ ${f}  (need ${exp}, have ${act})`);
    if (path.missed.length > 0) {
      console.log('  ⚠  Partial match — outcome won by score, not full condition satisfaction');
    }
  }

  // ── Epilogue ─────────────────────────────────────────────────────────────
  console.log(`\nEPILOGUE  [${path.outcomeId}${path.earlyEpilogue ? ' — EARLY DEATH VERSION' : ''}]:`);
  if (path.epilogue) {
    path.epilogue.split(/\n\n+/).forEach((para, i) => {
      if (i > 0) console.log('');
      para.split('\n').forEach(l => console.log('  ' + l));
    });
  } else {
    console.log('  🔴 NO EPILOGUE');
  }
}

// ─── COVERAGE MAPS ────────────────────────────────────────────────────────────

function printEffectCoverageMap(scenes) {
  console.log('\n' + HR1);
  console.log('ATMOSPHERIC EFFECT COVERAGE MAP');
  console.log('Shows what fires on each scene: scene-data effect + border glow from engine');
  console.log(HR1);

  const aftermath = scenes.filter(s => s.id.includes('-scene-04'));
  const main      = scenes.filter(s => !s.id.includes('-scene-04'));

  console.log('\nMAIN SCENES (genocide period):');
  console.log(`  ${'SCENE'.padEnd(25)} ${'SCENE-DATA EFFECT'.padEnd(22)} ${'BORDER GLOW'.padEnd(30)} AMBIENT`);
  console.log('  ' + HR3.slice(0, 78));

  for (const scene of main) {
    const ae   = scene.atmosphericEffect ?? '—';
    const glow = BORDER_GLOW_MAP[scene.id]
      ? BORDER_GLOW_MAP[scene.id].split(' ').pop()  // just the color name
      : '—';
    const amb  = scene.ambientTrack ?? '—';
    const glowDisplay = glow === '—' ? '🟡 none defined' : `✅ ${glow}`;
    console.log(`  ${scene.id.padEnd(25)} ${String(ae).padEnd(22)} ${glowDisplay.padEnd(35)} ${amb}`);
  }

  console.log('\nAFTERMATH SCENES (post-genocide, 2005–2012):');
  for (const scene of aftermath) {
    const ae   = scene.atmosphericEffect ?? '—';
    const glow = BORDER_GLOW_MAP[scene.id]
      ? BORDER_GLOW_MAP[scene.id].split(' ').pop()
      : '—';
    const amb  = scene.ambientTrack ?? '—';
    const glowDisplay = glow === '—' ? '✅ none (correct — aftermath)' : `✅ ${glow}`;
    console.log(`  ${scene.id.padEnd(25)} ${String(ae).padEnd(22)} ${glowDisplay.padEnd(35)} ${amb}`);
  }
}

function printSFXCoverageMap(scenes) {
  console.log('\n' + HR1);
  console.log('SOUND EFFECTS COVERAGE MAP');
  console.log('Shows every SFX scheduled per scene with timing offset');
  console.log(HR1);

  let totalSFX = 0;
  const gaps   = [];

  for (const scene of scenes) {
    const sfx = scene.soundEffects ?? [];
    const isAftermath = scene.id.includes('-scene-04');

    if (sfx.length === 0) {
      if (!isAftermath) gaps.push(scene.id);
      const note = isAftermath ? '(aftermath — silence intentional)' : '⚠ no SFX';
      console.log(`  ${scene.id.padEnd(25)} ${note}`);
    } else {
      console.log(`  ${scene.id.padEnd(25)} ${sfx.length} effect(s):`);
      for (const e of sfx) {
        const sec = (e.triggerAfterMs / 1000).toFixed(1);
        console.log(`    +${String(sec).padStart(5)}s  ${e.file}`);
        totalSFX++;
      }
    }
  }

  console.log(`\n  Total SFX entries: ${totalSFX}`);
  if (gaps.length > 0) {
    console.log(`  Scenes with no SFX (non-aftermath): ${gaps.join(', ')}`);
  } else {
    console.log('  ✅ All non-aftermath scenes have at least one SFX');
  }

  return gaps.length;
}

function printAmbientTrackMap(scenes) {
  console.log('\n' + HR1);
  console.log('AMBIENT TRACK MAP');
  console.log('Ambient tracks crossfade on scene:transition — filename only');
  console.log(HR1);

  const gaps = [];
  for (const scene of scenes) {
    const at = scene.ambientTrack;
    if (!at) {
      gaps.push(scene.id);
      console.log(`  ${scene.id.padEnd(25)} (none)`);
    } else {
      console.log(`  ${scene.id.padEnd(25)} ${at}`);
    }
  }

  if (gaps.length === scenes.length) {
    console.log('\n  ⚠ No scenes have ambient tracks — audio team delivery pending');
  } else if (gaps.length > 0) {
    console.log(`\n  Scenes without ambient tracks: ${gaps.join(', ')}`);
  } else {
    console.log('\n  ✅ All scenes have ambient tracks');
  }

  return gaps.length;
}

// ─── OUTCOME COVERAGE REPORT ──────────────────────────────────────────────────

function printOutcomeCoverage(outcomes, completed, roleName) {
  console.log('\n' + HR1);
  console.log(`OUTCOME COVERAGE — ${roleName}`);
  console.log(HR1);

  const reachedIds   = new Set(completed.map(p => p.outcomeId));
  const neverReached = outcomes.filter(o => !reachedIds.has(o.id));
  const hitCounts    = {};

  for (const p of completed) {
    hitCounts[p.outcomeId] = (hitCounts[p.outcomeId] ?? 0) + 1;
  }

  // Outcomes sorted by hit count descending
  const sorted = [...outcomes].sort(
    (a, b) => (hitCounts[b.id] ?? 0) - (hitCounts[a.id] ?? 0)
  );

  console.log(`\n  ${'OUTCOME ID'.padEnd(55)} HITS  SURVIVED`);
  console.log('  ' + HR3.slice(0, 70));

  for (const o of sorted) {
    const hits    = hitCounts[o.id] ?? 0;
    const hitStr  = hits === 0 ? '  🔴 0' : String(hits).padStart(4);
    const survStr = o.survived ? 'true ' : 'false';
    const isFb    = !o.conditions || Object.keys(o.conditions).length === 0;
    const fbMark  = isFb ? ' [fallback]' : '';
    console.log(`  ${o.id.padEnd(55)} ${hitStr}  ${survStr}${fbMark}`);
  }

  if (neverReached.length > 0) {
    console.log(`\n  🔴 NEVER REACHED (${neverReached.length}):`);
    for (const o of neverReached) console.log(`    ${o.id}`);
  } else {
    console.log('\n  ✅ All outcomes are reachable on at least one path');
  }

  return neverReached.length;
}

// ─── CROSS-PATH CONSISTENCY ───────────────────────────────────────────────────

function crossPathChecks(completed) {
  const issues = [];

  // Partial condition matches (epilogue may not fit path)
  const partials = completed.filter(p => p.missed.length > 0 && !p.fallback);
  if (partials.length > 0) {
    issues.push(`${partials.length} partial condition match(es) — epilogue may not fit path`);
  }

  // Fallbacks
  const fallbacks = completed.filter(p => p.fallback);
  if (fallbacks.length > 0) {
    issues.push(`${fallbacks.length} fallback outcome(s) — no specific outcome matched`);
  }

  // Null outcomes
  const nulls = completed.filter(p => p.outcomeId === 'NULL');
  if (nulls.length > 0) {
    issues.push(`🔴 ${nulls.length} NULL outcome(s) — game would crash here`);
  }

  // Duplicate epilogue text across different outcome IDs
  const epMap = new Map();
  for (const p of completed) {
    if (!p.epilogue || p.fallback) continue;
    const key = p.epilogue.trim().slice(0, 120);
    if (!epMap.has(key)) epMap.set(key, []);
    epMap.get(key).push(p.outcomeId);
  }
  const dupGroups = [...epMap.values()].filter(
    ids => ids.length > 1 && new Set(ids).size > 1
  );
  if (dupGroups.length > 0) {
    issues.push(`${dupGroups.length} duplicate epilogue group(s) — different outcomes, same text`);
    for (const g of dupGroups) {
      const uniq = [...new Set(g)];
      issues.push(`  Shared epilogue: ${uniq.join(', ')}`);
    }
  }

  return {
    issues,
    partialCount:  partials.length,
    fallbackCount: fallbacks.length,
    nullCount:     nulls.length,
    dupEpiCount:   dupGroups.length,
  };
}

// ─── SCENE INVENTORY PRINTER ──────────────────────────────────────────────────

function printSceneInventory(scenes, rolePrefix) {
  console.log('\n' + HR1);
  console.log('SCENE INVENTORY');
  console.log(`${scenes.length} scenes defined`);
  console.log(HR1);

  const allIssues = [];

  for (const scene of scenes) {
    const issues = validateScene(scene, rolePrefix);
    allIssues.push(...issues);

    const wc     = wordCount(scene.narrative);
    const sfxN   = (scene.soundEffects ?? []).length;
    const tcFlag = scene.timedChoice?.enabled ? ` ⏱${(scene.timedChoice.duration/1000).toFixed(0)}s` : '';
    const cpFlag = scene.deathCheckpoint ? ' ⚡CHECKPOINT' : '';
    const aeStr  = scene.atmosphericEffect
      ? (Array.isArray(scene.atmosphericEffect)
          ? scene.atmosphericEffect.join('+')
          : scene.atmosphericEffect)
      : '—';

    const status = issues.length > 0 ? '🔴' : '✅';
    console.log(`  ${status} ${scene.id.padEnd(25)} ${String(wc).padStart(4)}w  ae=${aeStr.padEnd(10)} sfx=${sfxN}  ${scene.ambientTrack ? '🔊' : '  '}${tcFlag}${cpFlag}`);

    if (issues.length > 0) {
      for (const iss of issues) console.log(`     ${iss}`);
    }
  }

  return allIssues;
}

// ─── ROLE RUNNER ─────────────────────────────────────────────────────────────

function processRole(roleName, rolePrefix, scenes, outcomes, summaryOnly) {
  console.log('\n\n' + HR1);
  console.log(`ROLE: ${roleName.toUpperCase()}`);
  console.log(`${scenes.length} scenes  |  ${outcomes.length} outcomes`);
  console.log(HR1);

  // 1. Scene inventory + field validation
  const sceneIssues = printSceneInventory(scenes, rolePrefix);

  // 2. Walk all paths
  const { completed, problems } = walkPaths(scenes, outcomes);
  const uniquePaths = completed.length / 2;

  // 3. Coverage maps
  printEffectCoverageMap(scenes);
  const sfxGaps     = printSFXCoverageMap(scenes);
  const ambientGaps = printAmbientTrackMap(scenes);

  // 4. Outcome coverage
  const unreachedOutcomes = printOutcomeCoverage(outcomes, completed, roleName);

  // 5. Cross-path checks
  const crossChecks = crossPathChecks(completed);

  // 6. Problems summary before paths
  if (problems.length > 0) {
    console.log('\n' + HR1);
    console.log('STRUCTURAL PROBLEMS');
    console.log(HR1);
    for (const p of problems) console.log(`  🔴 [${p.type}] ${p.sceneId}`);
  }

  if (crossChecks.issues.length > 0) {
    console.log('\n' + HR1);
    console.log('CROSS-PATH ISSUES');
    console.log(HR1);
    for (const iss of crossChecks.issues) console.log(`  🟠 ${iss}`);
  }

  // 7. Per-path experience logs
  console.log('\n' + HR1);
  console.log(`ALL PATHS — ${roleName}  (${completed.length} total: ${uniquePaths} decision paths × 2 survival states)`);
  console.log(HR1);

  completed.forEach((path, i) => printExperience(path, i + 1, completed.length, summaryOnly));

  // 8. Summary
  console.log('\n' + HR1);
  console.log(`SUMMARY — ${roleName}`);
  console.log(HR1);
  console.log(`  Scenes defined           : ${scenes.length}`);
  console.log(`  Outcomes defined         : ${outcomes.length}`);
  console.log(`  Unique decision paths    : ${uniquePaths}`);
  console.log(`  Total path×survival      : ${completed.length}`);
  console.log(`  Structural problems      : ${problems.length}`);
  console.log(`  Scene field issues       : ${sceneIssues.length}`);
  console.log(`  Unreached outcomes       : ${unreachedOutcomes}`);
  console.log(`  SFX coverage gaps        : ${sfxGaps} (non-aftermath scenes with no SFX)`);
  console.log(`  Ambient track gaps       : ${ambientGaps}`);
  console.log(`  Partial cond. matches    : ${crossChecks.partialCount}`);
  console.log(`  Fallback outcomes        : ${crossChecks.fallbackCount}`);
  console.log(`  Null outcomes            : ${crossChecks.nullCount}`);
  console.log(`  Duplicate epilogues      : ${crossChecks.dupEpiCount}`);

  const hardFails = problems.length + crossChecks.nullCount + sceneIssues.filter(i => i.includes('🔴') || i.includes('missing')).length;
  const softWarns = crossChecks.partialCount + crossChecks.fallbackCount + crossChecks.dupEpiCount + unreachedOutcomes;

  if (hardFails === 0 && softWarns === 0) {
    console.log('\n  ✅ ROLE CLEAN — no issues found');
  } else {
    if (hardFails > 0) console.log(`\n  ❌ ${hardFails} hard failure(s) — must fix before shipping`);
    if (softWarns > 0) console.log(`  ⚠  ${softWarns} warning(s) — review recommended`);
  }

  return {
    sceneIssues:    sceneIssues.length,
    problems:       problems.length,
    sfxGaps,
    ambientGaps,
    unreachedOutcomes,
    partials:       crossChecks.partialCount,
    fallbacks:      crossChecks.fallbackCount,
    nulls:          crossChecks.nullCount,
    dupEpis:        crossChecks.dupEpiCount,
  };
}

// ─── KNOWLEDGE QUESTIONS ─────────────────────────────────────────────────────

function printKnowledgeAudit(questions) {
  console.log('\n\n' + HR1);
  console.log('KNOWLEDGE QUESTIONS FULL AUDIT');
  console.log(`${questions.length} questions across ${VALID_ROLE_IDS.size} roles`);
  console.log(HR1);

  let issues = 0;
  const seenIds = new Set();

  for (const q of questions) {
    const pfx = `  [${q.id ?? '(no id)'}]`;
    const correctOpts = (q.options ?? []).filter(o => o.correct === true);
    const hasIssue = !q.id || seenIds.has(q.id) || !VALID_ROLE_IDS.has(q.roleSpecific) ||
      !VALID_AP_SKILLS.has(q.apSkill) || !q.question || !q.explanation ||
      (q.options?.length !== 4) || correctOpts.length !== 1;

    console.log(`\n  ${hasIssue ? '🔴' : '✅'} ${q.id ?? '(no id)'}  role=${q.roleSpecific}  skill=${q.apSkill}`);
    console.log(`     Q: ${truncate(q.question, 100)}`);

    if (Array.isArray(q.options)) {
      for (const opt of q.options) {
        const mark = opt.correct ? '  ✓' : '   ';
        console.log(`    ${mark} [${opt.id}] ${truncate(opt.text, 80)}`);
      }
    }
    console.log(`     Explanation: ${truncate(q.explanation, 100)}`);

    if (!q.id) { console.log(`     🔴 Missing id`); issues++; }
    else if (seenIds.has(q.id)) { console.log(`     🔴 Duplicate id`); issues++; }
    else seenIds.add(q.id);

    if (!VALID_ROLE_IDS.has(q.roleSpecific)) { console.log(`     🔴 Invalid roleSpecific "${q.roleSpecific}"`); issues++; }
    if (!VALID_AP_SKILLS.has(q.apSkill))    { console.log(`     🔴 Invalid apSkill "${q.apSkill}"`); issues++; }
    if (!q.question)     { console.log(`     🔴 Missing question`); issues++; }
    if (!q.explanation)  { console.log(`     🔴 Missing explanation`); issues++; }
    if (!q.options || q.options.length !== 4) { console.log(`     🔴 Expected 4 options, got ${q.options?.length ?? 0}`); issues++; }
    if (correctOpts.length === 0) { console.log(`     🔴 No correct option`); issues++; }
    if (correctOpts.length > 1)   { console.log(`     🔴 ${correctOpts.length} correct options (need exactly 1)`); issues++; }
  }

  // Per-role count
  console.log('\n  Questions per role:');
  for (const roleId of VALID_ROLE_IDS) {
    const n = questions.filter(q => q.roleSpecific === roleId).length;
    console.log(`    ${n === 3 ? '✅' : '🔴'} ${roleId}: ${n} (expected 3)`);
    if (n !== 3) issues++;
  }

  if (issues === 0) console.log('\n  ✅ All knowledge questions valid');
  else console.log(`\n  🔴 ${issues} knowledge question issue(s)`);

  return issues;
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

const args        = process.argv.slice(2);
const summaryOnly = args.includes('--summary');
const roleArg     = args.find(a => !a.startsWith('--'))?.toLowerCase();

const ROLES = [
  { name: 'Hutu Moderate',  prefix: 'rw-hm-', data: hutuData  },
  { name: 'Tutsi Survivor', prefix: 'rw-ts-', data: tutsiData },
  { name: 'UN Peacekeeper', prefix: 'rw-un-', data: unData    },
].filter(r => !roleArg || r.name.toLowerCase().includes(roleArg));

if (ROLES.length === 0) {
  console.error(`No role matched "${roleArg}". Use: hutu, tutsi, or un`);
  process.exit(1);
}

console.log(HR1);
console.log('WITNESS INTERACTIVE — FULL GAME AUDIT');
console.log(`Rwanda Mission  |  ${ROLES.length} role(s)  |  ${summaryOnly ? 'SUMMARY MODE' : 'FULL DETAIL'}`);
console.log(HR1);

let totals = {
  sceneIssues: 0, problems: 0, sfxGaps: 0, ambientGaps: 0,
  unreachedOutcomes: 0, partials: 0, fallbacks: 0, nulls: 0, dupEpis: 0,
};

for (const { name, prefix, data } of ROLES) {
  const stats = processRole(name, prefix, data.scenes, data.outcomes, summaryOnly);
  for (const [k, v] of Object.entries(stats)) totals[k] = (totals[k] ?? 0) + v;
}

const kqIssues = printKnowledgeAudit(knowledgeQuestions);

// ── GRAND TOTAL ───────────────────────────────────────────────────────────────
console.log('\n\n' + HR1);
console.log('GRAND TOTAL — ALL ROLES');
console.log(HR1);
console.log(`  🔴 Structural problems      : ${totals.problems}`);
console.log(`  🔴 Scene field issues       : ${totals.sceneIssues}`);
console.log(`  🔴 Null outcomes            : ${totals.nulls}`);
console.log(`  🔴 Knowledge Q issues       : ${kqIssues}`);
console.log(`  🟠 Unreached outcomes       : ${totals.unreachedOutcomes}`);
console.log(`  🟠 Partial cond. matches    : ${totals.partials}`);
console.log(`  🟠 Fallback outcomes        : ${totals.fallbacks}`);
console.log(`  🟠 Duplicate epilogues      : ${totals.dupEpis}`);
console.log(`  ℹ  SFX coverage gaps        : ${totals.sfxGaps}`);
console.log(`  ℹ  Ambient track gaps       : ${totals.ambientGaps}`);

const hardFails = totals.problems + totals.sceneIssues + totals.nulls + kqIssues;
const softWarns = totals.unreachedOutcomes + totals.partials + totals.fallbacks + totals.dupEpis;
const infoItems = totals.sfxGaps + totals.ambientGaps;

console.log('');
if (hardFails === 0 && softWarns === 0) {
  console.log('  ✅ GAME CLEAN — no hard failures, no warnings');
  if (infoItems > 0) console.log(`  ℹ  ${infoItems} informational item(s) — pending audio asset delivery`);
} else {
  if (hardFails > 0) console.log(`  ❌ ${hardFails} HARD FAILURE(S) — must fix before shipping`);
  if (softWarns > 0) console.log(`  ⚠  ${softWarns} WARNING(S) — review recommended`);
  if (infoItems > 0) console.log(`  ℹ  ${infoItems} informational item(s)`);
}

console.log('\n' + HR1);
console.log('TIP: pipe to file for full review:');
console.log('  $OutputEncoding = [Console]::OutputEncoding = [Text.UTF8Encoding]::new()');
console.log('  node tests/full-game-audit.mjs > full-audit.txt');
console.log('  node tests/full-game-audit.mjs --summary > summary.txt');
console.log(HR1 + '\n');
