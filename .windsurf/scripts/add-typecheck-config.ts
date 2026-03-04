/**
 * Script สำหรับเพิ่ม typecheck config ใน nuxt.config.ts
 * เพิ่ม typescript: { typecheck: { typecheck: true, strict: true } }
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

interface ConfigCheck {
  path: string;
  hasTypescriptSection: boolean;
  hasTypecheck: boolean;
  needsUpdate: boolean;
}

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

function checkConfig(path: string): ConfigCheck {
  const content = readFileSync(path, 'utf-8');
  const hasTypescriptSection = /typescript\s*:/.test(content);
  const hasTypecheck = /typecheck\s*:/.test(content);

  return {
    path,
    hasTypescriptSection,
    hasTypecheck,
    needsUpdate: !hasTypecheck
  };
}

function updateConfig(path: string): void {
  let content = readFileSync(path, 'utf-8');

  const typecheckConfig = `typecheck: {
      typecheck: true,
      strict: true
    }`;

  if (/typescript\s*:\s*\{/.test(content)) {
    // มี typescript section อยู่แล้ว - เพิ่ม typecheck เข้าไป
    content = content.replace(
      /(typescript\s*:\s*\{)/,
      `$1\n    ${typecheckConfig},`
    );
  } else {
    // ไม่มี typescript section - เพิ่มเข้าไปก่อน defineNuxtConfig หรือต่อท้าย
    const nuxtConfigMatch = content.match(/export\s+default\s+defineNuxtConfig\s*\(\s*\{/);
    if (nuxtConfigMatch) {
      content = content.replace(
        /(export\s+default\s+defineNuxtConfig\s*\(\s*\{)/,
        `$1\n  typescript: {\n    ${typecheckConfig}\n  },`
      );
    } else {
      // fallback: เพิ่มต่อท้าย object
      content = content.replace(
        /(\{[\s\S]*?)(\}\s*\)?\s*)$/,
        `$1  typescript: {\n    ${typecheckConfig}\n  },\n$2`
      );
    }
  }

  writeFileSync(path, content, 'utf-8');
  console.log(`✅ Updated: ${path}`);
}

// Main
console.log('🔍 Scanning for nuxt.config.ts files...\n');

const configs = findNuxtConfigs();
console.log(`Found ${configs.length} nuxt.config.ts files\n`);

let updated = 0;
let skipped = 0;

for (const config of configs) {
  const check = checkConfig(config);

  if (check.needsUpdate) {
    updateConfig(config);
    updated++;
  } else {
    console.log(`⏭️  Skipped (already has typecheck): ${config}`);
    skipped++;
  }
}

console.log(`\n📊 Summary:`);
console.log(`   Updated: ${updated}`);
console.log(`   Skipped: ${skipped}`);
console.log(`   Total: ${configs.length}`);
