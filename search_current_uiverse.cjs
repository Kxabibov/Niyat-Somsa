const fs = require('fs');
const path = require('path');

const logPath = 'C:\\\\Users\\\\М313\\\\.gemini\\\\antigravity\\\\brain\\\\7b8c031f-041e-4c95-8f20-d6f96b4deaa7\\\\.system_generated\\\\logs\\\\overview.txt';
if (fs.existsSync(logPath)) {
  const content = fs.readFileSync(logPath, 'utf8');
  let idx = 0;
  while (true) {
    idx = content.indexOf('Uiverse.io', idx);
    if (idx === -1) break;
    const start = Math.max(0, idx - 100);
    const end = Math.min(content.length, idx + 8000);
    console.log('=== MATCH ===');
    console.log(content.substring(start, end));
    console.log('=============\n\n');
    idx += 10;
  }
} else {
  console.log('Current conversation overview.txt does not exist!');
}
