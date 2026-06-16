const fs = require('fs');
const logPath = 'C:\\\\Users\\\\М313\\\\.gemini\\\\antigravity\\\\brain\\\\7b8c031f-041e-4c95-8f20-d6f96b4deaa7\\\\.system_generated\\\\logs\\\\overview.txt';
const lines = fs.readFileSync(logPath, 'utf8').split('\n');
let found = false;
for (const line of lines) {
  if (line.includes('"step_index":811') || line.includes('"step_index":274') || line.startsWith('274:')) {
    try {
      const cleanLine = line.replace(/^\d+:\s*/, '');
      const obj = JSON.parse(cleanLine);
      fs.writeFileSync('scratch_req_811.txt', obj.content, 'utf8');
      console.log('Successfully wrote scratch_req_811.txt');
      found = true;
    } catch (e) {
      console.log('Failed to parse:', e.message);
    }
  }
}
if (!found) {
  // Let's search by index 811
  for (const line of lines) {
    if (line.includes('811')) {
      console.log('Found line containing 811:', line.substring(0, 100));
    }
  }
}
