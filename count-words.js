import fs from 'fs';

const content = fs.readFileSync('js/content/missions/urban-design/ud-resident.js', 'utf8');

// Extract all narratives
const narrativeMatches = content.match(/narrative: `([^`]+)`/gs);

if (narrativeMatches) {
  narrativeMatches.forEach((match, index) => {
    const narrative = match.replace(/narrative: `|`$/g, '').trim();
    const wordCount = narrative.split(/\s+/).length;
    const status = (wordCount >= 120 && wordCount <= 150) ? '✓' : '✗';
    console.log(`Scene ${index + 1}: ${wordCount} words ${status}`);
  });
}

// Extract all epilogues
const epilogueMatches = content.match(/epilogue: `([^`]+)`/gs);

if (epilogueMatches) {
  console.log('\nOutcomes:');
  epilogueMatches.forEach((match, index) => {
    const epilogue = match.replace(/epilogue: `|`$/g, '').trim();
    const wordCount = epilogue.split(/\s+/).length;
    const status = (wordCount >= 200 && wordCount <= 300) ? '✓' : '✗';
    console.log(`Outcome ${index + 1}: ${wordCount} words ${status}`);
  });
}
