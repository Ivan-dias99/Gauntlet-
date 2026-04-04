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
  
  // Safe shadow strip: Just handle known hardcoded problematic lines
  let newCode = code;
  
  // 1. HeroLanding
  newCode = newCode.replace(/boxShadow:\s*["']0 12px 36px rgba\(0,0,0,0\.18\)["']/g, 'boxShadow: "none"');
  newCode = newCode.replace(/boxShadow:\s*["']0 4px 18px rgba\(0,0,0,0\.14\)["']/g, 'boxShadow: "none"');
  newCode = newCode.replace(/boxShadow:\s*`0 0 8px \$\{c\.accent\}`/g, 'boxShadow: "none"');
  newCode = newCode.replace(/boxShadow:\s*["']0 8px 28px rgba\(0,0,0,0\.12\)["']/g, 'boxShadow: "none"');
  newCode = newCode.replace(/boxShadow:\s*["']0 2px 12px rgba\(0,0,0,0\.1\)["']/g, 'boxShadow: "none"');
  newCode = newCode.replace(/boxShadow:\s*["']0 1px 3px rgba\(0,0,0,0\.\d+\)["']/g, 'boxShadow: "none"');

  // 2. ProfileLedger
  newCode = newCode.replace(/boxShadow: "0 16px 48px color-mix[^"]*"/g, 'boxShadow: "none"');
  newCode = newCode.replace(/boxShadow: "inset 0 1px 1px rgba\(255,255,255,0\.08\), 0 2px 4px rgba\(0,0,0,0\.08\)"/g, 'boxShadow: "none"');

  // 3. ModelSelector & GlobalCommandPalette & FloatingNoteSystem
  newCode = newCode.replace(/boxShadow:\s*["']0 8px 32px rgba([^"']*)["']/g, 'boxShadow: "none"');
  newCode = newCode.replace(/boxShadow:\s*["']0 8px 40px rgba([^"']*)["']/g, 'boxShadow: "none"');
  newCode = newCode.replace(/boxShadow:\s*["']0 4px 24px rgba(?:[^"']*)["']/g, 'boxShadow: "none"');
  
  // 4. Any remaining ternary shadow that can break if we regex poorly
  newCode = newCode.replace(/boxShadow:\s*canSend \? "[^"]*" : "none"/g, 'boxShadow: "none"');
  newCode = newCode.replace(/boxShadow:\s*hovered[^"]*"0 0 16px[^"]*" : "none"/g, 'boxShadow: "none"');

  if (code !== newCode) {
    fs.writeFileSync(file, newCode);
    changes++;
    console.log("Fixed shadows in", file);
  }
});
console.log("Total shadow files modified:", changes);
