/**
 * Script สำหรับแก้ไข typecheck config ใน nuxt.config.ts
 * แก้จาก typecheck: { typecheck: true, strict: true } เป็น typecheck: { strict: true }
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

function findNuxtConfigs(): string[] {
  const results: string[] = [];
  const scanDir = (dir: string, depth = 0): void => {
    if (depth > 5) return;

    for (const entry of new Bun.Glob('**/nuxt.config.ts').scanSync(dir)) {
      results.push(join(dir, entry));
    }
  };

  scanDir('.');
  return results.filter(p => !p.includes('node_modules'));
}

function fixConfig(path: string): boolean {
  let content = readFileSync(path, 'utf-8');

  // ตรวจสอบว่ามี typecheck ซ้อนกันหรือไม่
  if (!/typecheck\s*:\s*\{\s*typecheck\s*:/.test(content)) {
    return false;
  }

  // แก้ไข typecheck: { typecheck: true, strict: true } เป็น typecheck: { strict: true }
  content = content.replace(
    /typecheck\s*:\s*\{\s*typecheck\s*:\s*true,\s*strict\s*:\s*true\s*\}/g,
    'typecheck: {\n      strict: true\n    }'
  );

  writeFileSync(path, content, 'utf-8');
  console.log(`✅ Fixed: ${path}`);
  return true;
}

// Main
console.log('🔍 Scanning for nuxt.config.ts files...\n');

const configs = findNuxtConfigs();
console.log(`Found ${configs.length} nuxt.config.ts files\n`);

let fixed = 0;
let skipped = 0;

for (const config of configs) {
  if (fixConfig(config)) {
    fixed++;
  } else {
    console.log(`⏭️  Skipped: ${config}`);
    skipped++;
  }
}

console.log(`\n📊 Summary:`);
console.log(`   Fixed: ${fixed}`);
console.log(`   Skipped: ${skipped}`);
console.log(`   Total: ${configs.length}`);
