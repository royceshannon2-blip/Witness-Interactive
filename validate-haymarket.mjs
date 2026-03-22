/**
 * validate-haymarket.mjs — Run: node validate-haymarket.mjs
 * Validates all 17 correctness properties for the Haymarket mission.
 */

import lucyParsons from './js/content/missions/haymarket/lucy-parsons.js';
import karlBrenner from './js/content/missions/haymarket/karl-brenner.js';
import jamesDoyle from './js/content/missions/haymarket/james-doyle.js';
import haymarketMission from './js/content/missions/haymarket/mission.js';
import { STIMULUS_DOCUMENTS, getDocument } from './js/content/missions/haymarket/stimulus-documents.js';
import knowledgeQuestions from './js/content/missions/haymarket/knowledge-questions.js';

const roles = [lucyParsons, karlBrenner, jamesDoyle];
const allScenes = roles.flatMap(r => r.scenes);
let pass = true;

function fail(msg) { console.error(`  FAIL: ${msg}`); pass = false; }
function ok(msg)   { console.log(`  PASS: ${msg}`); }

// P1: Mission round-trip
console.log('\n[P1] Mission round-trip');
if (haymarketMission.id !== 'haymarket-affair') fail(`mission.id = "${haymarketMission.id}"`);
else ok('mission.id = "haymarket-affair"');
if (!Array.isArray(haymarketMission.roles) || haymarketMission.roles.length !== 3) fail(`roles.length = ${haymarketMission.roles?.length}`);
else ok('3 roles');
if (!haymarketMission.postRippleQuestion) fail('postRippleQuestion missing');
else ok('postRippleQuestion present');
if (!Array.isArray(haymarketMission.historicalRipple) || haymarketMission.historicalRipple.length !== 6) fail(`ripple.length = ${haymarketMission.historicalRipple?.length}`);
else ok('6 ripple events');
if (!haymarketMission.rippleSubtitle) fail('rippleSubtitle missing');
else ok(`rippleSubtitle = "${haymarketMission.rippleSubtitle}"`);

// P1b: initFlags on Lucy
console.log('\n[P1b] Lucy Parsons initFlags');
if (!lucyParsons.initFlags || lucyParsons.initFlags.hm_lp_movement_trust !== 0)
  fail(`initFlags.hm_lp_movement_trust = ${lucyParsons.initFlags?.hm_lp_movement_trust}`);
else ok('initFlags.hm_lp_movement_trust = 0');

// P2: Relative asset paths
console.log('\n[P2] Relative asset paths');
let p2ok = true;
for (const s of allScenes) {
  for (const field of ['ambientTrack', 'narratorAudio']) {
    if (s[field] && s[field].startsWith('/')) { fail(`${s.id}.${field} is absolute`); p2ok = false; }
  }
}
if (p2ok) ok('All asset paths relative');

// P3: hm_ flag prefix
console.log('\n[P3] hm_ flag prefix');
let p3ok = true;
for (const s of allScenes) {
  for (const c of s.choices) {
    for (const key of Object.keys(c.consequences || {})) {
      if (!key.startsWith('hm_')) { fail(`${s.id}/${c.id}: flag "${key}" missing hm_`); p3ok = false; }
    }
  }
}
if (p3ok) ok('All consequence flags have hm_ prefix');

// P4: stimuliUnlock entries
console.log('\n[P4] stimuliUnlock entries');
const stimuliChecks = [
  ['hm-lp-scene-01', lucyParsons, 'hm-doc-1a'],
  ['hm-lp-scene-02', lucyParsons, 'hm-doc-2'],
  ['hm-lp-scene-05', lucyParsons, 'hm-doc-4'],
  ['hm-lp-scene-06', lucyParsons, 'hm-doc-5'],
  ['hm-kb-scene-01', karlBrenner, 'hm-doc-1a'],
  ['hm-kb-scene-04', karlBrenner, 'hm-doc-3'],
  ['hm-jd-scene-02', jamesDoyle,  'hm-doc-2'],
  ['hm-jd-scene-04', jamesDoyle,  'hm-doc-3'],
];
let p4ok = true;
for (const [sceneId, role, docId] of stimuliChecks) {
  const scene = role.scenes.find(s => s.id === sceneId);
  if (!scene) { fail(`Scene ${sceneId} not found`); p4ok = false; continue; }
  if (!Array.isArray(scene.stimuliUnlock) || !scene.stimuliUnlock.includes(docId)) {
    fail(`${sceneId} missing ${docId} in stimuliUnlock`); p4ok = false;
  }
}
if (p4ok) ok('All expected stimuliUnlock entries present');

// P5: stimuliUnlock is always an array
console.log('\n[P5] stimuliUnlock is array on every scene');
let p5ok = true;
for (const s of allScenes) {
  if (!Array.isArray(s.stimuliUnlock)) { fail(`${s.id}.stimuliUnlock is ${typeof s.stimuliUnlock}`); p5ok = false; }
}
if (p5ok) ok('All scenes have stimuliUnlock as array');

// P5b: No stimuliUnlock references non-existent docs
console.log('\n[P5b] All stimuliUnlock doc IDs exist');
const knownDocIds = new Set(STIMULUS_DOCUMENTS.map(d => d.id));
let p5bok = true;
for (const s of allScenes) {
  for (const docId of (s.stimuliUnlock || [])) {
    if (!knownDocIds.has(docId)) { fail(`${s.id} references unknown doc "${docId}"`); p5bok = false; }
  }
}
if (p5bok) ok('All stimuliUnlock doc IDs exist in stimulus-documents.js');

// P6: predictionQuestion has reveal, no correctId
console.log('\n[P6] predictionQuestion structure');
let p6ok = true, predCount = 0;
for (const s of allScenes) {
  if (s.predictionQuestion) {
    predCount++;
    if (!s.predictionQuestion.reveal) { fail(`${s.id} predictionQuestion missing reveal`); p6ok = false; }
    if (s.predictionQuestion.correctId !== undefined) { fail(`${s.id} predictionQuestion has correctId`); p6ok = false; }
  }
}
if (predCount === 0) fail('No predictionQuestion found in any scene');
else if (p6ok) ok(`${predCount} predictionQuestion(s) — all have reveal, no correctId`);

// P7: spiceT non-empty per scene
console.log('\n[P7] spiceT non-empty per scene');
let p7ok = true;
for (const s of allScenes) {
  if (!s.spiceT || s.spiceT.length === 0) { fail(`${s.id} empty spiceT`); p7ok = false; }
}
if (p7ok) ok('All scenes have non-empty spiceT');

// P8: All 6 SPICE-T themes covered
console.log('\n[P8] All 6 SPICE-T themes covered');
const allSpiceT = new Set(allScenes.flatMap(s => s.spiceT || []));
const requiredSpiceT = ['Social', 'Political', 'Interaction with Environment', 'Cultural', 'Economic', 'Technological'];
let p8ok = true;
for (const t of requiredSpiceT) {
  if (!allSpiceT.has(t)) { fail(`SPICE-T "${t}" not covered`); p8ok = false; }
}
if (p8ok) ok(`All 6 SPICE-T themes covered: ${[...allSpiceT].join(', ')}`);

// P9: AP tagging complete
console.log('\n[P9] AP tagging (apThemes, apKeyConcept, apUnit)');
let p9ok = true;
for (const s of allScenes) {
  if (!s.apThemes || s.apThemes.length === 0) { fail(`${s.id} missing apThemes`); p9ok = false; }
  if (!s.apKeyConcept) { fail(`${s.id} missing apKeyConcept`); p9ok = false; }
  if (!s.apUnit) { fail(`${s.id} missing apUnit`); p9ok = false; }
}
if (p9ok) ok('All 18 scenes have apThemes, apKeyConcept, apUnit');

// P9b: All 6 AP reasoning processes appear at least twice
console.log('\n[P9b] AP reasoning process coverage (>=2 each)');
const apCounts = {};
for (const s of allScenes) for (const t of (s.apThemes || [])) apCounts[t] = (apCounts[t] || 0) + 1;
const requiredAP = ['causation', 'contextualization', 'continuity', 'perspective', 'argumentation', 'complexity'];
let p9bok = true;
for (const t of requiredAP) {
  const n = apCounts[t] || 0;
  if (n < 2) { fail(`"${t}" appears ${n} time(s), need >=2`); p9bok = false; }
}
if (p9bok) ok(`All 6 AP reasoning processes appear >=2 times: ${JSON.stringify(apCounts)}`);

// P9c: Scene-01 for all roles uses contextualization
console.log('\n[P9c] Scene-01 uses contextualization');
for (const r of roles) {
  const s01 = r.scenes.find(s => s.id.endsWith('-scene-01'));
  if (!s01) { fail(`${r.id} has no scene-01`); continue; }
  if (!s01.apThemes?.includes('contextualization')) fail(`${s01.id} missing "contextualization"`);
  else ok(`${s01.id} has contextualization`);
}

// P10: All 7 stimulus documents complete
console.log('\n[P10] Stimulus documents (7 required)');
const docIds = ['hm-doc-0', 'hm-doc-1a', 'hm-doc-1b', 'hm-doc-2', 'hm-doc-3', 'hm-doc-4', 'hm-doc-5'];
let p10ok = true;
if (STIMULUS_DOCUMENTS.length !== 7) { fail(`Expected 7 docs, found ${STIMULUS_DOCUMENTS.length}`); p10ok = false; }
for (const docId of docIds) {
  const doc = getDocument(docId);
  if (!doc) { fail(`${docId} not found`); p10ok = false; continue; }
  if (!doc.title)    { fail(`${docId} missing title`); p10ok = false; }
  if (!doc.source)   { fail(`${docId} missing source`); p10ok = false; }
  if (!doc.spiceT?.length) { fail(`${docId} missing spiceT`); p10ok = false; }
  if (!doc.apUnit)   { fail(`${docId} missing apUnit`); p10ok = false; }
  if (!doc.text)     { fail(`${docId} missing text`); p10ok = false; }
  if (!doc.pauseQuestion) { fail(`${docId} missing pauseQuestion`); p10ok = false; }
  else {
    if (!doc.pauseQuestion.correctId) { fail(`${docId}.pauseQuestion missing correctId`); p10ok = false; }
    if (!doc.pauseQuestion.explanation) { fail(`${docId}.pauseQuestion missing explanation`); p10ok = false; }
  }
}
if (p10ok) ok('All 7 stimulus documents have required fields');

// P11: Catch-all outcome last
console.log('\n[P11] Catch-all outcome last');
let p11ok = true;
for (const r of roles) {
  const last = r.outcomes[r.outcomes.length - 1];
  if (!last?.conditions || Object.keys(last.conditions).length !== 0) {
    fail(`${r.id} last outcome is not catch-all`); p11ok = false;
  }
}
if (p11ok) ok('All roles have catch-all outcome last');

// P12: No death checkpoints
console.log('\n[P12] No death checkpoints');
let p12ok = true;
for (const s of allScenes) {
  if (s.deathCheckpoint === true) { fail(`${s.id} has deathCheckpoint: true`); p12ok = false; }
}
if (p12ok) ok('No death checkpoints');

// P13: All 4 question types per role
console.log('\n[P13] Knowledge question types (before/during/cross-role/synthesis)');
const qtypes = ['before', 'during', 'cross-role', 'synthesis'];
let p13ok = true;
for (const r of roles) {
  for (const t of qtypes) {
    const found = knowledgeQuestions.some(q =>
      q.questionType === t && (q.roleSpecific === r.id || t === 'cross-role' || t === 'synthesis')
    );
    if (!found) { fail(`${r.id} has no "${t}" question`); p13ok = false; }
  }
}
if (p13ok) ok('All 4 question types present for all roles');

// P14: movement_trust max possible <= 5
console.log('\n[P14] hm_lp_movement_trust max possible <= 5');
let maxTrust = 0;
for (const s of lucyParsons.scenes) {
  const maxDelta = Math.max(0, ...s.choices.map(c => c.consequences?.hm_lp_movement_trust || 0));
  maxTrust += maxDelta;
}
if (maxTrust > 5) fail(`Max possible hm_lp_movement_trust = ${maxTrust} (exceeds 5)`);
else ok(`Max possible hm_lp_movement_trust = ${maxTrust}`);

// P15: Range-check conditions present on Lucy outcomes
console.log('\n[P15] Range-check conditions on Lucy outcomes');
const hasRange = lucyParsons.outcomes.some(o =>
  Object.values(o.conditions || {}).some(v => typeof v === 'object' && v !== null && ('gte' in v || 'lte' in v))
);
if (!hasRange) fail('No range-check conditions found in Lucy outcomes');
else ok('Range-check conditions present');

// P16: All outcomes survived: true
console.log('\n[P16] All outcomes survived: true');
let p16ok = true;
for (const r of roles) {
  for (const o of r.outcomes) {
    if (o.survived !== true) { fail(`${r.id} outcome "${o.id}" survived !== true`); p16ok = false; }
  }
}
if (p16ok) ok('All outcomes survived: true');

// P17: Terminal scenes use nextScene: "outcome"
console.log('\n[P17] Terminal scenes use nextScene: "outcome"');
let p17ok = true;
for (const r of roles) {
  const last = r.scenes[r.scenes.length - 1];
  for (const c of last.choices) {
    if (c.nextScene !== 'outcome') {
      fail(`${r.id} terminal ${last.id} choice ${c.id}: nextScene = "${c.nextScene}"`); p17ok = false;
    }
  }
}
if (p17ok) ok('All terminal choices use nextScene: "outcome"');

// Extra: LP scene-03 mechanics
console.log('\n[Extra] LP scene-03 mechanics');
const lp03 = lucyParsons.scenes.find(s => s.id === 'hm-lp-scene-03');
if (!lp03) { fail('hm-lp-scene-03 not found'); }
else {
  if (!lp03.predictionQuestion) fail('hm-lp-scene-03 missing predictionQuestion');
  else ok('hm-lp-scene-03 has predictionQuestion');
  if (!lp03.timedChoice || lp03.timedChoice.duration !== 10000)
    fail(`hm-lp-scene-03 timedChoice.duration = ${lp03.timedChoice?.duration}, expected 10000`);
  else ok('hm-lp-scene-03 timedChoice.duration = 10000');
}

// Extra: Wilhelm in LP scene-02
console.log('\n[Extra] Wilhelm in LP scene-02');
const lp02 = lucyParsons.scenes.find(s => s.id === 'hm-lp-scene-02');
if (!lp02?.narrative.includes('Wilhelm')) fail('Wilhelm not in hm-lp-scene-02');
else ok('Wilhelm present in hm-lp-scene-02');

// Final result
console.log(pass ? '\n[RESULT] ALL CHECKS PASSED\n' : '\n[RESULT] SOME CHECKS FAILED\n');
if (!pass) process.exit(1);
