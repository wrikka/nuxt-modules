import { readdirSync, readFileSync, writeFileSync, statSync, existsSync } from 'fs';
import { join, dirname } from 'path';

function fixImports(dir: string) {
  const files = readdirSync(dir, { recursive: true });
  for (const file of files) {
    if (typeof file === 'string' && file.endsWith('.ts')) {
      const filePath = join(dir, file);
      let content = readFileSync(filePath, 'utf8');
      // First, fix double .js
      content = content.replace(/\.js\.js/g, '.js');
      content = content.replace(/export \* from ['"](\.\/[^'"]*?)\.js\.js['"]/g, `export * from '$1.js'`);
      content = content.replace(/from ['"](\.\/[^'"]*?)\.js['"]/g, `from '$1'`);
      content = content.replace(/import\(['"](\.\/[^'"]*?)\.js['"]\)/g, `import('$1')`);
      // Change relative types/chart-basic to absolute
      content = content.replace(/from ['"].*types\/chart-basic['"]/g, `from 'runtime/types/chart-basic'`);
      content = content.replace(/from ['"].*utils\/chart-utils['"]/g, `from 'runtime/utils/chart-utils'`);
      writeFileSync(filePath, content);
    }
  }
}

fixImports('./src');
