import fs from 'fs';
import path from 'path';

function walk(dir, cb) {
  let list = fs.readdirSync(dir);
  list.forEach(file => {
    let full = path.join(dir, file);
    let stat = fs.statSync(full);
    if (stat && stat.isDirectory()) walk(full, cb);
    else cb(full);
  });
}

const targetDir = "C:/Users/Claudia/Desktop/project final resume/Aiinterfaceshelldesign/src/app/components";
let changes = 0;

walk(targetDir, file => {
  if (!file.endsWith('.tsx') && !file.endsWith('.ts')) return;
  let code = fs.readFileSync(file, 'utf8');
  // Replaces values like "3px", "4px", "7px", "border-radius: '5px'", etc.
  let newCode = code.replace(/borderRadius:\s*["']([3-9]|[1-9][0-9]+)px["']/g, 'borderRadius: "2px"');
  // Also fix "4px 4px 0 0" etc, but maybe safer to just do the single values first.
  if (code !== newCode) {
    fs.writeFileSync(file, newCode);
    changes++;
    console.log("Fixed radius in", file);
  }
});
console.log("Total files modified:", changes);
