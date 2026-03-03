#!/usr/bin/env bun
import { readdirSync, readFileSync, writeFileSync, statSync } from 'fs';
import { join, extname } from 'path';

const MODULE_APP_PATH = 'D:/wpackages/bun-packages/packages/chart/module/app';

/**
 * Recursively get all TypeScript and JavaScript files in a directory
 */
function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  const files = readdirSync(dirPath);

  files.forEach(file => {
    const fullPath = join(dirPath, file);
    if (statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else if (['.ts', '.js', '.vue'].includes(extname(file))) {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

/**
 * Update imports in a file to use Nuxt @ alias
 */
function updateImportsInFile(filePath: string): void {
  let content = readFileSync(filePath, 'utf8');
  let modified = false;

  // Replace runtime imports with @ alias
  const replacements = [
    {
      from: /from 'runtime\/types\/chart-basic'/g,
      to: "from '@/module/app/types/chart-basic'"
    },
    {
      from: /from 'runtime\/utils\/chart-utils'/g,
      to: "from '@/module/app/utils/chart-utils'"
    },
    // Add more replacements if needed for other runtime imports
  ];

  replacements.forEach(({ from, to }) => {
    if (from.test(content)) {
      content = content.replace(from, to);
      modified = true;
    }
  });

  if (modified) {
    writeFileSync(filePath, content, 'utf8');
    console.log(`Updated imports in: ${filePath}`);
  }
}

/**
 * Main function to update all imports in module/app directory
 */
function main(): void {
  console.log('Starting to update imports in module/app to use Nuxt @ alias...');

  const files = getAllFiles(MODULE_APP_PATH);

  files.forEach(filePath => {
    updateImportsInFile(filePath);
  });

  console.log('Finished updating imports.');
}

// Run the script
main();
