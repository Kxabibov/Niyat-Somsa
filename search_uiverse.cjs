const fs = require('fs');
const path = require('path');

function getOverviewFiles(dir, files = []) {
  try {
    const list = fs.readdirSync(dir);
    for (const item of list) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        getOverviewFiles(fullPath, files);
      } else if (item === 'overview.txt') {
        files.push(fullPath);
      }
    }
  } catch (e) {}
  return files;
}

const brainDir = 'C:\\Users\\М313\\.gemini\\antigravity\\brain';
const overviewFiles = getOverviewFiles(brainDir);

for (const file of overviewFiles) {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('Uiverse.io')) {
    console.log(`=== Found in: ${file} ===`);
    // Find all occurrences of Uiverse.io
    let idx = 0;
    while (true) {
      idx = content.indexOf('Uiverse.io', idx);
      if (idx === -1) break;
      const start = Math.max(0, idx - 1000);
      const end = Math.min(content.length, idx + 4000);
      console.log('--- Segment ---');
      console.log(content.substring(start, end));
      console.log('----------------');
      idx += 10;
    }
  }
}
