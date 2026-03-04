import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

function fixDoubleJs(dir: string) {
  const files = readdirSync(dir, { recursive: true });
  for (const file of files) {
    if (typeof file === 'string' && file.endsWith('.ts')) {
      const filePath = join(dir, file);
      let content = readFileSync(filePath, 'utf8');
      const original = content;
      content = content.replace(/\.js\.js/g, '.js');
      if (content !== original) {
        writeFileSync(filePath, content);
        console.log(`Fixed ${filePath}`);
      }
    }
  }
}

fixDoubleJs('./src');
