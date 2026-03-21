import lucyParsons from './js/content/missions/haymarket/lucy-parsons.js';
import karlBrenner from './js/content/missions/haymarket/karl-brenner.js';
import jamesDoyle from './js/content/missions/haymarket/james-doyle.js';
import haymarketMission from './js/content/missions/haymarket/mission.js';

const roles = [lucyParsons, karlBrenner, jamesDoyle];
const allScenes = roles.flatMap(r => r.scenes);
let pass = true;

// P1: initFlags on Lucy
if (!lucyParsons.initFlags || lucyParsons.initFlags.hm_lp_movement_trust !== 0) {
  console.error('FAIL P1: Lucy initFlags missing or wrong value'); pass = false;
} else console.log('PASS P1: Lucy initFlags.hm_lp_movement_trust = 0');

// P2: No absolute asset paths
for (const s of allScenes) {
  for (const field of ['ambientTrack','narratorAudio']) {
    if (s[field] && s[field].startsWith('/')) {
      console.error(`FAIL P2: ${s.id}.${field} is absolute`); pass = false;
    }
  }
}
console.log('PASS P2: All asset paths relative');

// P3: hm_ flag prefix
for (const s of allScenes) {
  for (const c of s.choices) {
    for (const key of Object.keys(c.consequences || {})) {
      if (!key.startsWith('hm_')) { console.error(`FAIL P3: ${s.id} flag "${key}" missing hm_`); pass = false; }
    }
  }
}
console.log('PASS P3: All consequence flags have hm_ prefix');

// P6: predictionQuestion structure
for (const s of allScenes) {
  if (s.predictionQuestion) {
    if (!s.predictionQuestion.reveal) { console.error(`FAIL P6: ${s.id} missing reveal`); pass = false; }
    if (s.predictionQuestion.correctId) { console.error(`FAIL P6: ${s.id} has correctId`); pass = false; }
  }
}
console.log('PASS P6: predictionQuestions have reveal, no correctId');

// P7: spiceT non-empty
for (const s of allScenes) {
  if (!s.spiceT || s.spiceT.length === 0) { console.error(`FAIL P7: ${s.id} empty spiceT`); pass = false; }
}
console.log('PASS P7: All scenes have spiceT');

// P8: All 6 SPICE-T themes
const allSpiceT = new Set(allScenes.flatMap(s => s.spiceT));
for (const t of ['Social','Political','Interaction with Environment','Cultural','Economic','Technological']) {
  if (!allSpiceT.has(t)) { console.error(`FAIL P8: "${t}" not covered`); pass = false; }
}
console.log('PASS P8: All 6 SPICE-T themes covered');

// P9: AP tagging
for (const s of allScenes) {
  if (!s.apThemes?.length) { console.error(`FAIL P9: ${s.id} missing apThemes`); pass = false; }
  if (!s.apKeyConcept) { console.error(`FAIL P9: ${s.id} missing apKeyConcept`); pass = false; }
  if (!s.apUnit) { console.error(`FAIL P9: ${s.id} missing apUnit`); pass = false; }
}
console.log('PASS P9: All scenes AP-tagged');

// P11: catch-all last
for (const r of roles) {
  const last = r.outcomes[r.outcomes.length - 1];
  if (Object.keys(last.conditions).length !== 0) { console.error(`FAIL P11: ${r.id} last outcome not catch-all`); pass = false; }
}
console.log('PASS P11: Catch-all outcomes last');

// P12: no death checkpoints
for (const s of allScenes) {
  if (s.deathCheckpoint === true) { console.error(`FAIL P12: ${s.id} deathCheckpoint true`); pass = false; }
}
console.log('PASS P12: No death checkpoints');

// P16: survived true
for (const r of roles) {
  for (const o of r.outcomes) {
    if (!o.survived) { console.error(`FAIL P16: ${r.id} ${o.id} survived false`); pass = false; }
  }
}
console.log('PASS P16: All outcomes survived: true');

// Terminal nextScene
for (const r of roles) {
  const last = r.scenes[r.scenes.length - 1];
  for (const c of last.choices) {
    if (c.nextScene === null) { console.error(`FAIL terminal: ${r.id} ${last.id} ${c.id} nextScene null`); pass = false; }
  }
}
console.log('PASS terminal: Final scenes use nextScene: "outcome"');

// LP scene-03 both predictionQuestion + timedChoice(10s)
const lp03 = lucyParsons.scenes.find(s => s.id === 'hm-lp-scene-03');
if (!lp03.predictionQuestion) { console.error('FAIL: LP-03 missing predictionQuestion'); pass = false; }
if (!lp03.timedChoice || lp03.timedChoice.duration !== 10000) { console.error('FAIL: LP-03 wrong timedChoice'); pass = false; }
console.log('PASS: LP-03 predictionQuestion + timedChoice(10s)');

// Wilhelm in LP-02
const lp02 = lucyParsons.scenes.find(s => s.id === 'hm-lp-scene-02');
if (!lp02.narrative.includes('Wilhelm')) { console.error('FAIL: Wilhelm not in LP-02'); pass = false; }
console.log('PASS: Wilhelm in LP-02');

// JD prediction moved to scene-04
const jd03 = jamesDoyle.scenes.find(s => s.id === 'hm-jd-scene-03');
const jd04 = jamesDoyle.scenes.find(s => s.id === 'hm-jd-scene-04');
if (jd03.predictionQuestion) { console.error('FAIL: JD-03 still has predictionQuestion'); pass = false; }
if (!jd04.predictionQuestion) { console.error('FAIL: JD-04 missing predictionQuestion'); pass = false; }
console.log('PASS: JD predictionQuestion in scene-04');

// stimuliUnlock spot checks
const checks = [
  [karlBrenner.scenes.find(s=>s.id==='hm-kb-scene-01'), 'hm-doc-1b', true],
  [karlBrenner.scenes.find(s=>s.id==='hm-kb-scene-02'), 'hm-doc-2', true],
  [karlBrenner.scenes.find(s=>s.id==='hm-kb-scene-05'), 'hm-doc-4', true],
  [jamesDoyle.scenes.find(s=>s.id==='hm-jd-scene-02'), 'hm-doc-0', false],
  [jamesDoyle.scenes.find(s=>s.id==='hm-jd-scene-02'), 'hm-doc-2', true],
  [jamesDoyle.scenes.find(s=>s.id==='hm-jd-scene-05'), 'hm-doc-4', true],
  [jamesDoyle.scenes.find(s=>s.id==='hm-jd-scene-05'), 'hm-doc-5', true],
  [jamesDoyle.scenes.find(s=>s.id==='hm-jd-scene-06'), 'hm-doc-6', true],
];
for (const [scene, doc, shouldHave] of checks) {
  const has = scene.stimuliUnlock.includes(doc);
  if (has !== shouldHave) { console.error(`FAIL stimuli: ${scene.id} ${shouldHave?'missing':'should not have'} ${doc}`); pass = false; }
}
console.log('PASS: stimuliUnlock arrays correct');

// KB scene-06 apUnit
const kb06 = karlBrenner.scenes.find(s=>s.id==='hm-kb-scene-06');
if (kb06.apUnit !== 'Unit 6.5') { console.error(`FAIL: KB-06 apUnit ${kb06.apUnit}`); pass = false; }
console.log('PASS: KB-06 apUnit = Unit 6.5');

// Mission
if (haymarketMission.id !== 'haymarket-affair') { console.error('FAIL: mission id'); pass = false; }
if (haymarketMission.roles.length !== 3) { console.error('FAIL: role count'); pass = false; }
if (!haymarketMission.postRippleQuestion) { console.error('FAIL: postRippleQuestion missing'); pass = false; }
if (haymarketMission.historicalRipple?.length !== 6) { console.error('FAIL: ripple count'); pass = false; }
console.log('PASS: Mission metadata complete');

console.log(pass ? '\n✓ ALL CHECKS PASSED' : '\n✗ SOME CHECKS FAILED');
