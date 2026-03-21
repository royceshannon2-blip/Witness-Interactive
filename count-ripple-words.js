import fs from 'fs';

const content = fs.readFileSync('js/content/missions/urban-design/ripple-intros.js', 'utf8');

// Extract the three path intros
const equityMatch = content.match(/equity: `([^`]+)`/s);
const complicityMatch = content.match(/complicity: `([^`]+)`/s);
const adaptationMatch = content.match(/adaptation: `([^`]+)`/s);

if (equityMatch) {
  const wordCount = equityMatch[1].trim().split(/\s+/).length;
  const status = (wordCount >= 80 && wordCount <= 120) ? '✓' : '✗';
  console.log(`Equity path: ${wordCount} words ${status}`);
}

if (complicityMatch) {
  const wordCount = complicityMatch[1].trim().split(/\s+/).length;
  const status = (wordCount >= 80 && wordCount <= 120) ? '✓' : '✗';
  console.log(`Complicity path: ${wordCount} words ${status}`);
}

if (adaptationMatch) {
  const wordCount = adaptationMatch[1].trim().split(/\s+/).length;
  const status = (wordCount >= 80 && wordCount <= 120) ? '✓' : '✗';
  console.log(`Adaptation path: ${wordCount} words ${status}`);
}
