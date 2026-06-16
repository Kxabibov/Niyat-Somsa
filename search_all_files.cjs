const fs = require('fs');
const path = require('path');

function searchDir(dir) {
  try {
    const list = fs.readdirSync(dir);
    for (const item of list) {
      const fullPath = path.join(dir, item);
      let stat;
      try {
        stat = fs.statSync(fullPath);
      } catch (e) {
        continue;
      }
      if (stat.isDirectory()) {
        searchDir(fullPath);
      } else if (stat.isFile()) {
        // Only read text files or JSON/md
        const ext = path.extname(item).toLowerCase();
        if (['.txt', '.json', '.md', '.js', '.cjs', '.html', '.css', '.tsx', '.ts'].includes(ext)) {
          try {
            const content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('Gautammsharma') || content.includes('button') && content.includes('Uiverse.io')) {
              console.log(`=== Found in: ${fullPath} ===`);
              // Find occurrences
              let idx = 0;
              while (true) {
                idx = content.indexOf('Uiverse.io', idx);
                if (idx === -1) break;
                const start = Math.max(0, idx - 200);
                const end = Math.min(content.length, idx + 4000);
                console.log(content.substring(start, end));
                console.log('----------------');
                idx += 10;
              }
            }
          } catch (e) {}
        }
      }
    }
  } catch (e) {}
}

const brainDir = 'C:\\Users\\М313\\.gemini\\antigravity\\brain';
searchDir(brainDir);
console.log('Search complete!');
