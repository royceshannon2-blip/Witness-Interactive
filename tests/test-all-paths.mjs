/**
 * test-all-paths.mjs
 *
 * Headless path simulator for the Rwanda mission.
 * Walks every possible decision tree for all three roles,
 * records every flag set, runs outcome scoring, and reports
 * which epilogue each path receives.
 *
 * Run with: node scripts/test-all-paths.mjs
 * Or for a specific role: node scripts/test-all-paths.mjs hutu
 */

import hutuData    from '../js/content/missions/rwanda/hutu-moderate.js';
import tutsiData   from '../js/content/missions/rwanda/tutsi-survivor.js';
import unData      from '../js/content/missions/rwanda/un-peacekeeper.js';

// ─── SCORING ENGINE (mirrors ConsequenceSystem logic exactly) ──────────────

function scoreConditions(conditions, flags) {
  let score = 0;
  for (const [flag, expected] of Object.entries(conditions)) {
    const actual = flags[flag] !== undefined ? flags[flag] : false;
    if (actual === expected) score++;
  }
  return score;
}

function calculateOutcome(outcomes, flags, survived) {
  const pool = outcomes.filter(o =>
    o.conditions &&
    Object.keys(o.conditions).length > 0 &&
    o.survived === survived
  );

  let bestScore   = -1;
  let bestOutcome = null;

  for (const o of pool) {
    const score = scoreConditions(o.conditions, flags);
    if (score > bestScore) {
      bestScore   = score;
      bestOutcome = o;
    }
  }

  if (bestOutcome) return { outcome: bestOutcome, score: bestScore, usedFallback: false };

  const fallback = outcomes.find(o =>
    (!o.conditions || Object.keys(o.conditions).length === 0) &&
    o.survived === survived
  );

  if (fallback) return { outcome: fallback, score: 0, usedFallback: true };

  const anyFallback = outcomes.find(o =>
    !o.conditions || Object.keys(o.conditions).length === 0
  );

  return anyFallback
    ? { outcome: anyFallback, score: 0, usedFallback: true }
    : { outcome: null, score: 0, usedFallback: true };
}

// ─── PATH WALKER ───────────────────────────────────────────────────────────

function walkPaths(scenes, outcomes, roleId) {
  const sceneMap = {};
  for (const s of scenes) sceneMap[s.id] = s;

  const results = [];

  function walk(sceneId, flags, pathLog) {
    if (sceneId === 'outcome' || !sceneMap[sceneId]) {
      // Terminal — score both survived and died
      for (const survived of [true, false]) {
        const { outcome, score, usedFallback } = calculateOutcome(outcomes, flags, survived);
        results.push({
          path:        pathLog.join(' → '),
          flags:       { ...flags },
          survived,
          outcomeId:   outcome?.id ?? 'NULL — no outcome found',
          score,
          usedFallback,
          epilogueStart: outcome
            ? outcome.epilogue.slice(0, 120).replace(/\n/g, ' ') + '...'
            : 'NO EPILOGUE'
        });
      }
      return;
    }

    const scene = sceneMap[sceneId];
    if (!scene.choices || scene.choices.length === 0) {
      walk('outcome', flags, pathLog);
      return;
    }

    for (const choice of scene.choices) {
      const newFlags = { ...flags };
      if (choice.consequences) {
        for (const [k, v] of Object.entries(choice.consequences)) {
          if (typeof v === 'boolean') newFlags[k] = v;
        }
      }
      const newPath = [...pathLog, `${scene.id}[${choice.id}]`];
      const next = choice.nextScene || 'outcome';
      walk(next, newFlags, newPath);
    }
  }

  const startScene = scenes[0];
  walk(startScene.id, {}, []);
  return results;
}

// ─── ANALYSIS ──────────────────────────────────────────────────────────────

function analyzeResults(results, roleName) {
  console.log(`\n${'═'.repeat(80)}`);
  console.log(`ROLE: ${roleName.toUpperCase()}`);
  console.log(`${'═'.repeat(80)}`);
  console.log(`Total paths: ${results.length} (${results.length / 2} unique decision sequences × 2 survival states)\n`);

  // Group by outcome ID
  const byOutcome = {};
  for (const r of results) {
    if (!byOutcome[r.outcomeId]) byOutcome[r.outcomeId] = [];
    byOutcome[r.outcomeId].push(r);
  }

  // Problems first
  const fallbacks  = results.filter(r => r.usedFallback);
  const nulls      = results.filter(r => r.outcomeId === 'NULL — no outcome found');
  const contradictions = results.filter(r => {
    // Survived=true but epilogue starts with "You didn't survive"
    if (r.survived && r.epilogueStart.startsWith("You didn't survive")) return true;
    // Survived=false but epilogue starts with "You survived"
    if (!r.survived && r.epilogueStart.toLowerCase().startsWith('you survived')) return true;
    return false;
  });

  if (nulls.length > 0) {
    console.log(`🔴 NULL OUTCOMES (${nulls.length}) — these paths have NO epilogue at all:`);
    for (const r of nulls) {
      console.log(`   PATH: ${r.path}`);
      console.log(`   FLAGS: ${Object.keys(r.flags).filter(k => r.flags[k] === true).join(', ')}`);
      console.log(`   SURVIVED: ${r.survived}\n`);
    }
  }

  if (fallbacks.length > 0) {
    console.log(`🟠 FALLBACK OUTCOMES (${fallbacks.length}) — these paths matched no specific outcome:`);
    for (const r of fallbacks) {
      console.log(`   PATH: ${r.path}`);
      console.log(`   FLAGS SET: ${Object.keys(r.flags).filter(k => r.flags[k] === true).join(', ')}`);
      console.log(`   SURVIVED: ${r.survived} → fell to: ${r.outcomeId}\n`);
    }
  }

  if (contradictions.length > 0) {
    console.log(`🔴 EPILOGUE CONTRADICTIONS (${contradictions.length}) — survived/died status doesn't match epilogue text:`);
    for (const r of contradictions) {
      console.log(`   PATH: ${r.path}`);
      console.log(`   SURVIVED: ${r.survived} but epilogue says: "${r.epilogueStart}"\n`);
    }
  }

  // Full outcome map
  console.log(`\n📊 FULL OUTCOME MAP:`);
  console.log(`${'─'.repeat(80)}`);

  const outcomeIds = Object.keys(byOutcome).sort();
  for (const id of outcomeIds) {
    const group = byOutcome[id];
    const isFallback = group[0].usedFallback;
    const marker = isFallback ? '⚠ ' : '✓ ';
    console.log(`\n${marker}${id} (${group.length} path${group.length > 1 ? 's' : ''})`);
    for (const r of group) {
      const flagList = Object.keys(r.flags)
        .filter(k => r.flags[k] === true)
        .join(', ') || '(none)';
      console.log(`   survived=${r.survived} score=${r.score}`);
      console.log(`   flags: ${flagList}`);
      console.log(`   path:  ${r.path.split(' → ').slice(-3).join(' → ')} (last 3 steps)`);
    }
  }

  // Summary stats
  console.log(`\n📈 SUMMARY:`);
  console.log(`   Total paths:       ${results.length}`);
  console.log(`   Specific outcomes: ${results.filter(r => !r.usedFallback && r.outcomeId !== 'NULL — no outcome found').length}`);
  console.log(`   Fallback outcomes: ${fallbacks.length}`);
  console.log(`   Null outcomes:     ${nulls.length}`);
  console.log(`   Contradictions:    ${contradictions.length}`);
  console.log(`   Unique outcomes hit: ${Object.keys(byOutcome).length}`);

  const allOutcomeIds = new Set(results.map(r => r.outcomeId));
  // Note any orphaned outcomes (defined but never reached)
  return { fallbacks: fallbacks.length, nulls: nulls.length, contradictions: contradictions.length };
}

// ─── ORPHANED FLAG DETECTOR ────────────────────────────────────────────────

function findOrphanedFlags(scenes, outcomes, roleName) {
  // Collect all flags ever set by any choice
  const setByChoices = new Set();
  for (const scene of scenes) {
    for (const choice of scene.choices || []) {
      for (const [k, v] of Object.entries(choice.consequences || {})) {
        if (typeof v === 'boolean') setByChoices.add(k);
      }
    }
  }

  // Collect all flags referenced in any outcome condition
  const usedInOutcomes = new Set();
  for (const outcome of outcomes) {
    for (const k of Object.keys(outcome.conditions || {})) {
      usedInOutcomes.add(k);
    }
  }

  const orphaned = [...setByChoices].filter(f => !usedInOutcomes.has(f));
  const unreachable = [...usedInOutcomes].filter(f => !setByChoices.has(f));

  if (orphaned.length > 0) {
    console.log(`\n⚠  ORPHANED FLAGS in ${roleName} — set by choices but never scored in outcomes:`);
    for (const f of orphaned) console.log(`   ${f}`);
  }

  if (unreachable.length > 0) {
    console.log(`\n⚠  UNREACHABLE CONDITIONS in ${roleName} — in outcome conditions but never set by any choice:`);
    for (const f of unreachable) console.log(`   ${f}`);
  }
}

// ─── MAIN ──────────────────────────────────────────────────────────────────

const roleArg = process.argv[2];

const roles = [
  { name: 'Hutu Moderate',   data: hutuData,  id: 'hutu-moderate'  },
  { name: 'Tutsi Survivor',  data: tutsiData, id: 'tutsi-survivor'  },
  { name: 'UN Peacekeeper',  data: unData,    id: 'un-peacekeeper'  },
].filter(r => {
  if (!roleArg) return true;
  return r.id.includes(roleArg) || r.name.toLowerCase().includes(roleArg);
});

let totalFallbacks = 0;
let totalNulls     = 0;
let totalContradictions = 0;

for (const role of roles) {
  const { scenes, outcomes } = role.data;
  const results = walkPaths(scenes, outcomes, role.id);
  const stats   = analyzeResults(results, role.name);
  findOrphanedFlags(scenes, outcomes, role.name);
  totalFallbacks      += stats.fallbacks;
  totalNulls          += stats.nulls;
  totalContradictions += stats.contradictions;
}

console.log(`\n${'═'.repeat(80)}`);
console.log('TOTAL ACROSS ALL ROLES');
console.log(`${'═'.repeat(80)}`);
console.log(`🔴 Null outcomes:      ${totalNulls}`);
console.log(`🟠 Fallback outcomes:  ${totalFallbacks}`);
console.log(`🔴 Contradictions:     ${totalContradictions}`);

if (totalNulls === 0 && totalFallbacks === 0 && totalContradictions === 0) {
  console.log('\n✅ All paths have specific, non-contradictory outcomes.');
} else {
  console.log('\n❌ Issues found. Fix the items marked 🔴 first, then 🟠.');
}