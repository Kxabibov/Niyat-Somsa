const fs = require('fs');
const path = require('path');

function searchSteps(dir) {
  try {
    const list = fs.readdirSync(dir);
    for (const item of list) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        searchSteps(fullPath);
      } else if (item.endsWith('.json') || item.endsWith('.md')) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          if (content.includes('Gautammsharma') || content.includes('Mashhur') || content.includes('tanlovlar')) {
            console.log(`=== Found in file: ${fullPath} ===`);
            console.log(content.substring(0, 3000));
            console.log('=================================\n');
          }
        } catch (e) {}
      }
    }
  } catch (e) {}
}

const brainDir = 'C:\\Users\\М313\\.gemini\\antigravity\\brain\\7b8c031f-041e-4c95-8f20-d6f96b4deaa7';
searchSteps(brainDir);
console.log('Search finished!');
