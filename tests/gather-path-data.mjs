/**
 * gather-path-data.mjs
 *
 * Walks every possible decision path through all three Rwanda roles
 * and outputs a structured JSON report for narrative analysis.
 *
 * Each entry in the report contains everything needed to evaluate
 * whether a path makes narrative sense:
 *   - The exact sequence of choices made (human-readable)
 *   - Every flag set along the way
 *   - The outcome selected (survived + died versions)
 *   - The full epilogue text for each
 *   - The score that selected that outcome
 *   - Whether it fell to a fallback
 *
 * Run: node tests/gather-path-data.mjs > tests/path-report.json
 * Or:  node tests/gather-path-data.mjs hutu > tests/hutu-paths.json
 */

import hutuData  from '../js/content/missions/rwanda/hutu-moderate.js';
import tutsiData from '../js/content/missions/rwanda/tutsi-survivor.js';
import unData    from '../js/content/missions/rwanda/un-peacekeeper.js';

// ─── SCORING (mirrors ConsequenceSystem exactly) ───────────────────────────

function scoreConditions(conditions, flags) {
  let score = 0;
  for (const [flag, expected] of Object.entries(conditions)) {
    const actual = flags[flag] !== undefined ? flags[flag] : false;
    if (actual === expected) score++;
  }
  return score;
}

function selectOutcome(outcomes, flags, survived) {
  // Specific outcomes only (conditions with 1+ keys), matching survival
  const pool = outcomes.filter(o =>
    o.conditions &&
    Object.keys(o.conditions).length > 0 &&
    o.survived === survived
  );

  let bestScore   = -1;
  let bestOutcome = null;
  let allScores   = [];

  for (const o of pool) {
    const score = scoreConditions(o.conditions, flags);
    allScores.push({ id: o.id, score });
    if (score > bestScore) {
      bestScore   = score;
      bestOutcome = o;
    }
  }

  // Sort scores descending for reporting
  allScores.sort((a, b) => b.score - a.score);

  if (bestOutcome) {
    return {
      outcome:     bestOutcome,
      score:       bestScore,
      usedFallback: false,
      allScores:   allScores.slice(0, 5) // top 5 candidates
    };
  }

  // Fall to fallback
  const fallback = outcomes.find(o =>
    (!o.conditions || Object.keys(o.conditions).length === 0) &&
    o.survived === survived
  ) || outcomes.find(o =>
    !o.conditions || Object.keys(o.conditions).length === 0
  );

  return {
    outcome:     fallback || null,
    score:       0,
    usedFallback: true,
    allScores
  };
}

// ─── PATH WALKER ───────────────────────────────────────────────────────────

function walkAllPaths(scenes, outcomes) {
  const sceneMap = {};
  for (const s of scenes) sceneMap[s.id] = s;

  const completedPaths = [];

  function walk(sceneId, flags, choiceLog, sceneLog) {
    // Terminal condition
    if (sceneId === 'outcome' || !sceneMap[sceneId]) {
      completedPaths.push({ flags: { ...flags }, choiceLog: [...choiceLog], sceneLog: [...sceneLog] });
      return;
    }

    const scene = sceneMap[sceneId];

    if (!scene.choices || scene.choices.length === 0) {
      completedPaths.push({ flags: { ...flags }, choiceLog: [...choiceLog], sceneLog: [...sceneLog] });
      return;
    }

    for (const choice of scene.choices) {
      const newFlags = { ...flags };

      // Apply consequences — boolean flags only (skip numeric path trackers)
      for (const [k, v] of Object.entries(choice.consequences || {})) {
        if (typeof v === 'boolean') newFlags[k] = v;
      }

      const newChoiceLog = [...choiceLog, {
        sceneId:   scene.id,
        choiceId:  choice.id,
        choiceText: choice.text,
        flagsSet:  Object.fromEntries(
          Object.entries(choice.consequences || {}).filter(([, v]) => typeof v === 'boolean')
        )
      }];

      const newSceneLog = [...sceneLog, scene.id];
      walk(choice.nextScene || 'outcome', newFlags, newChoiceLog, newSceneLog);
    }
  }

  walk(scenes[0].id, {}, [], []);
  return completedPaths;
}

// ─── REPORT BUILDER ────────────────────────────────────────────────────────

function buildReport(paths, outcomes, roleName, roleId) {
  const report = {
    role:       roleName,
    roleId,
    totalUniquePaths: paths.length,
    paths: []
  };

  for (let i = 0; i < paths.length; i++) {
    const { flags, choiceLog, sceneLog } = paths[i];

    // Build human-readable path description
    const pathDescription = choiceLog.map(c => c.choiceText).join(' → ');

    // Flags that were set to true
    const trueFlags = Object.keys(flags).filter(k => flags[k] === true);

    // Get outcome for both survival states
    const survivedResult = selectOutcome(outcomes, flags, true);
    const diedResult     = selectOutcome(outcomes, flags, false);

    report.paths.push({
      pathNumber:      i + 1,
      pathDescription,
      scenesVisited:   sceneLog,
      choiceSequence:  choiceLog.map(c => `${c.sceneId} → [${c.choiceText}]`),
      flagsSet:        trueFlags,
      allFlags:        flags,

      // What happens if they survive
      ifSurvived: {
        outcomeId:    survivedResult.outcome?.id ?? 'NULL',
        usedFallback: survivedResult.usedFallback,
        score:        survivedResult.score,
        topCandidates: survivedResult.allScores,
        epilogue:     survivedResult.outcome?.epilogue ?? null,
        epilogueFirst100: survivedResult.outcome
          ? survivedResult.outcome.epilogue.slice(0, 200).replace(/\n/g, ' ').trim()
          : 'NO EPILOGUE FOUND'
      },

      // What happens if they die
      ifDied: {
        outcomeId:    diedResult.outcome?.id ?? 'NULL',
        usedFallback: diedResult.usedFallback,
        score:        diedResult.score,
        topCandidates: diedResult.allScores,
        deathContext: diedResult.outcome?.deathContext ?? null,
        epilogue:     diedResult.outcome?.epilogue ?? null,
        epilogueFirst100: diedResult.outcome
          ? diedResult.outcome.epilogue.slice(0, 200).replace(/\n/g, ' ').trim()
          : 'NO EPILOGUE FOUND'
      }
    });
  }

  return report;
}

// ─── SUMMARY STATS ─────────────────────────────────────────────────────────

function summarize(report) {
  const paths = report.paths;
  const total = paths.length;

  const survivedFallbacks  = paths.filter(p => p.ifSurvived.usedFallback).length;
  const diedFallbacks      = paths.filter(p => p.ifDied.usedFallback).length;
  const survivedNulls      = paths.filter(p => p.ifSurvived.outcomeId === 'NULL').length;
  const diedNulls          = paths.filter(p => p.ifDied.outcomeId === 'NULL').length;

  // Outcomes that serve multiple paths (potential over-generalization)
  const survivedOutcomeCounts = {};
  const diedOutcomeCounts     = {};
  for (const p of paths) {
    survivedOutcomeCounts[p.ifSurvived.outcomeId] = (survivedOutcomeCounts[p.ifSurvived.outcomeId] || 0) + 1;
    diedOutcomeCounts[p.ifDied.outcomeId]         = (diedOutcomeCounts[p.ifDied.outcomeId] || 0) + 1;
  }

  // Paths where score is 0 or 1 (low confidence matches)
  const lowScoreSurvived = paths.filter(p => !p.ifSurvived.usedFallback && p.ifSurvived.score <= 1);
  const lowScoreDied     = paths.filter(p => !p.ifDied.usedFallback && p.ifDied.score <= 1);

  return {
    totalPaths:          total,
    survived: {
      fallbacks:         survivedFallbacks,
      nulls:             survivedNulls,
      lowScoreMatches:   lowScoreSurvived.length,
      outcomeCounts:     survivedOutcomeCounts
    },
    died: {
      fallbacks:         diedFallbacks,
      nulls:             diedNulls,
      lowScoreMatches:   lowScoreDied.length,
      outcomeCounts:     diedOutcomeCounts
    },
    problemPaths: {
      survivedFallbackPaths: paths
        .filter(p => p.ifSurvived.usedFallback)
        .map(p => ({ pathNumber: p.pathNumber, description: p.pathDescription, flags: p.flagsSet })),
      diedFallbackPaths: paths
        .filter(p => p.ifDied.usedFallback)
        .map(p => ({ pathNumber: p.pathNumber, description: p.pathDescription, flags: p.flagsSet })),
      lowConfidenceSurvivedPaths: lowScoreSurvived
        .map(p => ({ pathNumber: p.pathNumber, description: p.pathDescription, outcomeId: p.ifSurvived.outcomeId, score: p.ifSurvived.score, flags: p.flagsSet })),
      lowConfidenceDiedPaths: lowScoreDied
        .map(p => ({ pathNumber: p.pathNumber, description: p.pathDescription, outcomeId: p.ifDied.outcomeId, score: p.ifDied.score, flags: p.flagsSet }))
    }
  };
}

// ─── MAIN ──────────────────────────────────────────────────────────────────

const roleArg = process.argv[2]?.toLowerCase();

const roles = [
  { name: 'Hutu Moderate',  data: hutuData,  id: 'hutu-moderate' },
  { name: 'Tutsi Survivor', data: tutsiData, id: 'tutsi-survivor' },
  { name: 'UN Peacekeeper', data: unData,    id: 'un-peacekeeper' },
].filter(r => {
  if (!roleArg) return true;
  return r.id.includes(roleArg) || r.name.toLowerCase().includes(roleArg);
});

const fullReport = {
  generatedAt: new Date().toISOString(),
  roles: []
};

for (const role of roles) {
  const { scenes, outcomes } = role.data;
  const paths  = walkAllPaths(scenes, outcomes);
  const report = buildReport(paths, outcomes, role.name, role.id);
  report.summary = summarize(report);
  fullReport.roles.push(report);
}

// Output clean JSON — pipe to a file for analysis
console.log(JSON.stringify(fullReport, null, 2));
