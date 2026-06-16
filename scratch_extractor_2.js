const fs = require('fs');
const logPath = 'C:\\\\Users\\\\М313\\\\.gemini\\\\antigravity\\\\brain\\\\7b8c031f-041e-4c95-8f20-d6f96b4deaa7\\\\.system_generated\\\\logs\\\\overview.txt';
const lines = fs.readFileSync(logPath, 'utf8').split('\n');
for (const line of lines) {
  if (line.includes('"step_index":811') || line.startsWith('274:')) {
    // Some lines might have line numbers prefixed by view_file, but this is the raw overview.txt
    try {
      const cleanLine = line.replace(/^\d+:\s*/, '');
      const obj = JSON.parse(cleanLine);
      fs.writeFileSync('scratch_req_811.txt', obj.content, 'utf8');
      console.log('Successfully wrote scratch_req_811.txt');
    } catch (e) {
      console.log('Failed to parse:', e.message);
    }
  }
}
