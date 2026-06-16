const fs = require('fs');
const path = require('path');

const logPath = 'C:\\\\Users\\\\М313\\\\.gemini\\\\antigravity\\\\brain\\\\7b8c031f-041e-4c95-8f20-d6f96b4deaa7\\\\.system_generated\\\\logs\\\\overview.txt';
if (fs.existsSync(logPath)) {
  const content = fs.readFileSync(logPath, 'utf8');
  const lines = content.split('\n');
  for (const line of lines) {
    if (line.includes('replace_file_content') || line.includes('write_to_file')) {
      console.log(line.trim().substring(0, 500));
    }
  }
} else {
  console.log('No overview.txt found!');
}
