const fs = require('fs');
const path = require('path');

function getOverviewFiles(dir, files = []) {
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
  return files;
}

const brainDir = 'C:\\Users\\М313\\.gemini\\antigravity\\brain';
const overviewFiles = getOverviewFiles(brainDir);

console.log(`Searching through ${overviewFiles.length} overview.txt files...`);

for (const file of overviewFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  let matched = false;
  
  lines.forEach((line, index) => {
    // Search for keywords
    if (line.toLowerCase().includes('somsa') || line.toLowerCase().includes('someoneinteresting808') || (line.toLowerCase().includes('password') && line.toLowerCase().includes('admin'))) {
      if (!matched) {
        console.log(`\n=== Match in: ${file} ===`);
        matched = true;
      }
      console.log(`Line ${index + 1}: ${line.trim().substring(0, 150)}`);
    }
  });
}
